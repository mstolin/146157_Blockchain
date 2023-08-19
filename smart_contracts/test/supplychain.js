const Crowdfunding = artifacts.require('Crowdfunding');
const SupplyChains = artifacts.require('SupplyChains');

const RANDOM_SECRET = 'RANDOM_SECRET';

const box_price = web3.utils.toWei('0.3', 'ether');

contract('SupplyChains', (accounts) => {
  const FARMER_ADDR = accounts[3];
  const BUTCHER_ADDR = accounts[4];
  const DELIVERY_ADDR = accounts[5];

  const BUYER_ADDR = accounts[2];

  // function imported from the crowdfunding test
  function generateBoxes(boxesTotal) {
    let boxes = [];
    for (let index = 0; index < boxesTotal.length; index++) {
      const box = {
        'id': index,
        'available': boxesTotal[index],
        'total': boxesTotal[index],
        'title': `Box #${index}`,
        'description': `Box #${index} is a very good one`,
        'price': box_price,
      };
      boxes[index] = box;
    }
    return boxes;
  }

  // function imported from the crowdfunding test
  function generateCampaign(id, boxesTotal, owner) {
    return {
      'id': id,
      'owner' : {
        'owner': owner,
        'ownerPublicKey': RANDOM_SECRET,
      },
      'info': {
        'title': `Campaign #${id + 1}`,
        'description': `Campaign #${id + 1} is a very nice one`,
        'duration': 3628800,
      },
      'animal': {
        'earTag': 'DE12345',
        'name': 'Erna',
        'farm': 'Nice Farm',
        'age': 2
      },
      'stakeholders': {
        'farmer': {
          'owner': FARMER_ADDR,
          'share': 40,
          'info': 'some info'
        },
        'butcher': {
          'owner': BUTCHER_ADDR,
          'share': 30,
          'info': 'some info'
        },
        'delivery': {
          'owner': DELIVERY_ADDR,
          'share': 30,
          'info': 'some info'
        }
      },
      'boxes': generateBoxes(boxesTotal),
    };
  }

  // function imported from the crowdfunding test
  async function createCampaign(contract, campaign, from) {
    await contract
      .createCampaign(
        campaign.info.title,
        campaign.info.description,
        campaign.info.duration,
        campaign.owner,
        campaign.stakeholders,
        campaign.animal,
        campaign.boxes,
        { 'from': from }
      );
  }

  // function that create a campaign and buy all boxes
  async function generateCampaignAndBuyAll(contract, campaignId) {
    const owner = accounts[0];
  
    const boxesTotal = [1, 2];
    const campaign = generateCampaign(campaignId, boxesTotal, owner);
    await createCampaign(contract, campaign, owner);

    const someAddr = 'via Roma 1, Tento';

    // Buy one box
    await contract.buyBox(campaignId, 0, someAddr, { 'from': BUYER_ADDR, 'value': box_price });

    allBoxes = await contract.getBoxes.call(campaignId);
    assert.equal(allBoxes[0].available, 0);
    assert.equal(allBoxes[1].available, 2);

    let soldBoxes = await contract.getSoldBoxes.call(campaignId);
    assert.equal(soldBoxes.length, 1);
    assert.equal(soldBoxes[0].id, 0);
    assert.equal(soldBoxes[0].boxId, 0);
    assert.equal(soldBoxes[0].owner, BUYER_ADDR);
    assert.equal(soldBoxes[0].physAddress, someAddr);
    assert.isAtMost(Number(soldBoxes[0].boughtAt), (new Date()).getTime() / 1000);

    let campaigns = await contract.getCampaigns.call();
    let campaignResp = campaigns[campaignId];
    assert.equal(campaignResp.meta.boxesSold, 1);
    assert.equal(campaignResp.meta.collectedAmount, box_price);
    assert.isFalse(campaignResp.meta.isStopped);

    // Buy last boxes
    await contract.buyBox(campaignId, 1, someAddr, { 'from': BUYER_ADDR, 'value': box_price });
    campaigns = await contract.getCampaigns.call();
    campaignResp = campaigns[campaignId];
    assert.equal(campaignResp.meta.boxesSold, 2);
    assert.equal(campaignResp.meta.collectedAmount, box_price * 2);
    assert.isFalse(campaignResp.meta.isStopped);

    await contract.buyBox(campaignId, 1, someAddr, { 'from': BUYER_ADDR, 'value': box_price });

    campaigns = await contract.getCampaigns.call();
    campaignResp = campaigns[campaignId];
    assert.equal(campaignResp.meta.boxesSold, 3);
    assert.equal(campaignResp.meta.collectedAmount, box_price * 3);
    assert.isTrue(campaignResp.meta.isStopped);

    allBoxes = await contract.getBoxes.call(campaignId);
    assert.equal(allBoxes[0].available, 0);
    assert.equal(allBoxes[1].available, 0);

    soldBoxes = await contract.getSoldBoxes.call(campaignId);
    assert.equal(soldBoxes.length, 3);
    for (let index = 0; index < soldBoxes.length; index++) {
      assert.equal(soldBoxes[index].id, index);
      assert.equal(soldBoxes[index].boxId, index == 0 ? 0 : 1);
      assert.equal(soldBoxes[index].owner, BUYER_ADDR);
      assert.equal(soldBoxes[index].physAddress, someAddr);
      assert.isAtMost(Number(soldBoxes[index].boughtAt), (new Date()).getTime() / 1000);
    }
  }

  it('should buy all from a campaign and start a new supply chain', async () => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    // set the supplychain address in the crowdfunding contract and viceversa
    await crowdfunding_contract.setSupplyChainsAddress(supplychain_contract.address);
    await supplychain_contract.setCrowdfundingAddress(crowdfunding_contract.address);

    const campaignId = await crowdfunding_contract.getNumberOfCampaigns.call();

    await generateCampaignAndBuyAll(crowdfunding_contract, campaignId);

    // retrieve the supplychain and check if it is correct
    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.equal(supplychain.campaignRef, campaignId);
    assert.isFalse(supplychain.isAnimalDelivered.farmer);
    assert.isFalse(supplychain.isAnimalDelivered.butcher);
    assert.isFalse(supplychain.isAnimalProcessed.butcher);
    assert.isFalse(supplychain.areBoxesProcessed.butcher);
    assert.isFalse(supplychain.areBoxesDistributed.butcher);
    assert.isFalse(supplychain.areBoxesDistributed.delivery);
    assert.isFalse(supplychain.areBoxesDelivered.delivery);
    assert.equal(supplychain.totalBoxes, 3);
    assert.equal(supplychain.deliveredBoxes, 0);
    assert.equal(supplychain.stakeholders.farmer.owner, FARMER_ADDR);
    assert.equal(supplychain.stakeholders.butcher.owner, BUTCHER_ADDR);
    assert.equal(supplychain.stakeholders.delivery.owner, DELIVERY_ADDR);
    assert.isTrue(supplychain.isStarted);
  });

  it('should mark the animal as delivered', async() => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = 0;

    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.isFalse(supplychain.isAnimalDelivered.butcher);
    assert.isFalse(supplychain.isAnimalDelivered.farmer);

    // mark the animal as delivered by the farmer
    await supplychain_contract.markAnimalAsDelivered(campaignId, { 'from': FARMER_ADDR });
    
    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.isAnimalDelivered.farmer);
    assert.isFalse(supplychain.isAnimalDelivered.butcher);

    // mark the animal as delivered by the butcher
    await supplychain_contract.markAnimalAsDelivered(campaignId, { 'from': BUTCHER_ADDR });

    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.isAnimalDelivered.farmer);
    assert.isTrue(supplychain.isAnimalDelivered.butcher);
  });

  it('should mark the animal as processed', async() => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = 0;

    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.isFalse(supplychain.isAnimalProcessed.butcher);

    // mark the animal as processed by the butcher
    await supplychain_contract.markAnimalAsProcessed(campaignId, { 'from': BUTCHER_ADDR });
    
    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.isAnimalProcessed.butcher);
  });

  it('should mark the boxes as processed', async() => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = 0;

    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.isFalse(supplychain.areBoxesProcessed.butcher);

    // mark the boxes as processed by the butcher
    await supplychain_contract.markBoxesAsProcessed(campaignId, { 'from': BUTCHER_ADDR });
    
    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.areBoxesProcessed.butcher);
  });

  it('should mark the boxes as distributed', async() => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = 0;

    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.isFalse(supplychain.areBoxesDistributed.butcher);
    assert.isFalse(supplychain.areBoxesDistributed.delivery);

    // mark the boxes as distributed by the butcher
    await supplychain_contract.markBoxesAsDistributed(campaignId, { 'from': BUTCHER_ADDR });

    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.areBoxesDistributed.butcher);
    assert.isFalse(supplychain.areBoxesDelivered.delivery);

    // mark the boxes as distributed by the delivery
    await supplychain_contract.markBoxesAsDistributed(campaignId, { 'from': DELIVERY_ADDR });

    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.areBoxesDistributed.butcher);
    assert.isTrue(supplychain.areBoxesDistributed.delivery);
  });

  it('should mark some boxes as delivered', async() => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = 0;

    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.equal(supplychain.areBoxesDelivered.delivery, false);

    // check that there are no boxes delivered
    let isCompleted = await supplychain_contract.isCompleted.call(campaignId);
    assert.isFalse(isCompleted);

    boxesStatus = await supplychain_contract.getBoxesStatus.call(campaignId);
    assert.isFalse(boxesStatus[0].isDelivered);
    assert.isFalse(boxesStatus[1].isDelivered);
    assert.isFalse(boxesStatus[2].isDelivered);
    assert.equal(supplychain.deliveredBoxes, 0);

    // mark the box with id 0 as delivered
    await supplychain_contract.markBoxAsDelivered(campaignId, 0, { 'from': DELIVERY_ADDR });

    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isFalse(supplychain.areBoxesDelivered.delivery);

    boxesStatus = await supplychain_contract.getBoxesStatus.call(campaignId);
    assert.isTrue(boxesStatus[0].isDelivered);
    assert.isFalse(boxesStatus[1].isDelivered);
    assert.isFalse(boxesStatus[2].isDelivered);
    assert.equal(supplychain.deliveredBoxes, 1);

    // mark the box with id 1 as delivered
    await supplychain_contract.markBoxAsDelivered(campaignId, 1, { 'from': DELIVERY_ADDR });

    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isFalse(supplychain.areBoxesDelivered.delivery);

    boxesStatus = await supplychain_contract.getBoxesStatus.call(campaignId);
    assert.isTrue(boxesStatus[0].isDelivered);
    assert.isTrue(boxesStatus[1].isDelivered);
    assert.isFalse(boxesStatus[2].isDelivered);
    assert.equal(supplychain.deliveredBoxes, 2);

    isCompleted = await supplychain_contract.isCompleted.call(campaignId);
    assert.isFalse(isCompleted);
  });

  
  it('should complete the supplychain and payout', async() => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = 0;

    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];

    let isCompleted = await supplychain_contract.isCompleted.call(campaignId);
    assert.isFalse(isCompleted);
    assert.equal(supplychain.deliveredBoxes, 2);

    // retrive the balance before the payout
    let oldFarmerBalance = await web3.eth.getBalance(FARMER_ADDR);
    let oldButcherBalance = await web3.eth.getBalance(BUTCHER_ADDR);
    let oldDeliveryBalance = await web3.eth.getBalance(DELIVERY_ADDR);

    // mark the box with id 2 as delivered
    await supplychain_contract.markBoxAsDelivered(campaignId, 2, { 'from': DELIVERY_ADDR });

    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.areBoxesDelivered.delivery);

    // check that all boxes are marked as delivered
    boxesStatus = await supplychain_contract.getBoxesStatus.call(campaignId);
    assert.isTrue(boxesStatus[0].isDelivered);
    assert.isTrue(boxesStatus[1].isDelivered);
    assert.isTrue(boxesStatus[2].isDelivered);
    assert.equal(supplychain.deliveredBoxes, 3);

    // check that the supplychain is completed
    isCompleted = await supplychain_contract.isCompleted.call(campaignId);
    assert.isTrue(isCompleted);

    // retrive the balance after the payout
    let newFarmerBalance = await web3.eth.getBalance(FARMER_ADDR);
    let newButcherBalance = await web3.eth.getBalance(BUTCHER_ADDR);
    let newDeliveryBalance = await web3.eth.getBalance(DELIVERY_ADDR);

    // check that the balance is greater
    assert.isTrue(newFarmerBalance > oldFarmerBalance, "Farmer balance should be greater!");
    assert.isTrue(newButcherBalance > oldButcherBalance, "Butcher balance should be greater!");
    assert.isTrue(newDeliveryBalance > oldDeliveryBalance, "Delivery balance should be greater!");
  });

  it('should buy all from a second campaign and start a new supply chain', async () => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = await crowdfunding_contract.getNumberOfCampaigns.call();

    await generateCampaignAndBuyAll(crowdfunding_contract, campaignId);

    // retrieve the supplychain and check if it is correct
    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.equal(supplychain.campaignRef, campaignId);
    assert.isFalse(supplychain.isAnimalDelivered.farmer);
    assert.isFalse(supplychain.isAnimalDelivered.butcher);
    assert.isFalse(supplychain.isAnimalProcessed.butcher);
    assert.isFalse(supplychain.areBoxesProcessed.butcher);
    assert.isFalse(supplychain.areBoxesDistributed.butcher);
    assert.isFalse(supplychain.areBoxesDistributed.delivery);
    assert.isFalse(supplychain.areBoxesDelivered.delivery);
    assert.equal(supplychain.totalBoxes, 3);
    assert.equal(supplychain.deliveredBoxes, 0);
    assert.equal(supplychain.stakeholders.farmer.owner, FARMER_ADDR);
    assert.equal(supplychain.stakeholders.butcher.owner, BUTCHER_ADDR);
    assert.equal(supplychain.stakeholders.delivery.owner, DELIVERY_ADDR);
    assert.isTrue(supplychain.isStarted);
  });

  it('should go through the supplychain until the stakeholders are paid', async () => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = 1;

    // retrieve the supplychain and check if it is correct
    let supplychains = await supplychain_contract.getSupplyChains.call();
    let supplychain = supplychains[campaignId];
    assert.equal(supplychain.campaignRef, campaignId);

    // go through the supplychain process
    await supplychain_contract.markAnimalAsDelivered(campaignId, { 'from': FARMER_ADDR });
    await supplychain_contract.markAnimalAsDelivered(campaignId, { 'from': BUTCHER_ADDR });
    await supplychain_contract.markAnimalAsProcessed(campaignId, { 'from': BUTCHER_ADDR });
    await supplychain_contract.markBoxesAsProcessed(campaignId, { 'from': BUTCHER_ADDR });
    await supplychain_contract.markBoxesAsDistributed(campaignId, { 'from': BUTCHER_ADDR });
    await supplychain_contract.markBoxesAsDistributed(campaignId, { 'from': DELIVERY_ADDR });
    await supplychain_contract.markBoxAsDelivered(campaignId, 0, { 'from': DELIVERY_ADDR });
    await supplychain_contract.markBoxAsDelivered(campaignId, 1, { 'from': DELIVERY_ADDR });

    // retrieve the balance before the payout
    let oldFarmerBalance = await web3.eth.getBalance(FARMER_ADDR);
    let oldButcherBalance = await web3.eth.getBalance(BUTCHER_ADDR);
    let oldDeliveryBalance = await web3.eth.getBalance(DELIVERY_ADDR);

    // mark the last box as delivered
    await supplychain_contract.markBoxAsDelivered(campaignId, 2, { 'from': DELIVERY_ADDR });

    // check that all boxes are marked as delivered
    supplychains = await supplychain_contract.getSupplyChains.call();
    supplychain = supplychains[campaignId];
    assert.isTrue(supplychain.areBoxesDelivered.delivery);

    boxesStatus = await supplychain_contract.getBoxesStatus.call(campaignId);
    assert.isTrue(boxesStatus[0].isDelivered);
    assert.isTrue(boxesStatus[1].isDelivered);
    assert.isTrue(boxesStatus[2].isDelivered);
    assert.equal(supplychain.deliveredBoxes, 3);

    // check that the supplychain is completed
    isCompleted = await supplychain_contract.isCompleted.call(campaignId);
    assert.isTrue(isCompleted);

    // retrive the balance after the payout
    let newFarmerBalance = await web3.eth.getBalance(FARMER_ADDR);
    let newButcherBalance = await web3.eth.getBalance(BUTCHER_ADDR);
    let newDeliveryBalance = await web3.eth.getBalance(DELIVERY_ADDR);

    // check that the balance is greater
    assert.isTrue(newFarmerBalance > oldFarmerBalance, "Farmer balance should be greater!");
    assert.isTrue(newButcherBalance > oldButcherBalance, "Butcher balance should be greater!");
    assert.isTrue(newDeliveryBalance > oldDeliveryBalance, "Delivery balance should be greater!");
  });

});