const Crowdfunding = artifacts.require('Crowdfunding');
const SupplyChains = artifacts.require('SupplyChains');

const RANDOM_SECRET = 'RANDOM_SECRET';


contract('SupplyChains', (accounts) => {
  const FARMER_ADDR = accounts[7];
  const BUTCHER_ADDR = accounts[8];
  const DELIVERY_ADDR = accounts[9];

  // Same tests of crowdfunding.js
  function generateBoxes(boxesTotal) {
    let boxes = [];
    for (let index = 0; index < boxesTotal.length; index++) {
      const box = {
        'id': index,
        'available': boxesTotal[index],
        'total': boxesTotal[index],
        'title': `Box #${index}`,
        'description': `Box #${index} is a very good one`,
        'price': 2
      };
      boxes[index] = box;
    }
    return boxes;
  }

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
  async function generateCampaignAndByAll(contract, campaignId) {
    const owner = accounts[0];
  
    const boxesTotal = [1, 2];
    const campaign = generateCampaign(campaignId, boxesTotal, owner);
    await createCampaign(contract, campaign, owner);

    const someAddr = 'via Roma 1, Tento';

    // Buy one box
    await contract.buyBox(campaignId, 0, someAddr, { 'from': owner, 'value': 2 });

    allBoxes = await contract.getBoxes.call(campaignId);
    assert.equal(allBoxes[0].available, 0);
    assert.equal(allBoxes[1].available, 2);

    let soldBoxes = await contract.getSoldBoxes.call(campaignId);
    assert.equal(soldBoxes.length, 1);
    assert.equal(soldBoxes[0].id, 0);
    assert.equal(soldBoxes[0].boxId, 0);
    assert.equal(soldBoxes[0].owner, owner);
    assert.equal(soldBoxes[0].physAddress, someAddr);
    assert.isAtMost(Number(soldBoxes[0].boughtAt), (new Date()).getTime() / 1000);

    let campaigns = await contract.getCampaigns.call();
    let campaignResp = campaigns[campaignId];
    assert.equal(campaignResp.meta.boxesSold, 1);
    assert.equal(campaignResp.meta.collectedAmount, 2);
    assert.isFalse(campaignResp.meta.isStopped);

    // Buy last boxes
    await contract.buyBox(campaignId, 1, someAddr, { 'from': owner, 'value': 2 });
    campaigns = await contract.getCampaigns.call();
    campaignResp = campaigns[campaignId];
    assert.equal(campaignResp.meta.boxesSold, 2);
    assert.equal(campaignResp.meta.collectedAmount, 4);
    assert.isFalse(campaignResp.meta.isStopped);

    await contract.buyBox(campaignId, 1, someAddr, { 'from': owner, 'value': 2 });

    campaigns = await contract.getCampaigns.call();
    campaignResp = campaigns[campaignId];
    assert.equal(campaignResp.meta.boxesSold, 3);
    assert.equal(campaignResp.meta.collectedAmount, 6);
    assert.isTrue(campaignResp.meta.isStopped);

    allBoxes = await contract.getBoxes.call(campaignId);
    assert.equal(allBoxes[0].available, 0);
    assert.equal(allBoxes[1].available, 0);

    soldBoxes = await contract.getSoldBoxes.call(campaignId);
    assert.equal(soldBoxes.length, 3);
    for (let index = 0; index < soldBoxes.length; index++) {
      assert.equal(soldBoxes[index].id, index);
      assert.equal(soldBoxes[index].boxId, index == 0 ? 0 : 1);
      assert.equal(soldBoxes[index].owner, owner);
      assert.equal(soldBoxes[index].physAddress, someAddr);
      assert.isAtMost(Number(soldBoxes[index].boughtAt), (new Date()).getTime() / 1000);
    }
  }

  it('should buy all from a campaign and start a new supply chain', async () => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = await crowdfunding_contract.getNumberOfCampaigns.call();

    await generateCampaignAndByAll(crowdfunding_contract, campaignId);

    // retrieve the supplychain and check if it is correct
    const supplychain = await supplychain_contract.getSupplyChainById.call(campaignId);
    assert.equal(supplychain.campaignRef, campaignId);
    assert.equal(supplychain.isAnimalDelivered, false);
    assert.equal(supplychain.isAnimalProcessed, false);
    assert.equal(supplychain.areBoxesPrepared, false);
    assert.equal(supplychain.areBoxesDistributed, false);
    assert.equal(supplychain.areBoxesDelivered, false);
    assert.equal(supplychain.totalBoxes, 3);
    assert.equal(supplychain.preparedBoxes, 0);
    assert.equal(supplychain.deliveredBoxes, 0);
    assert.equal(supplychain.receivedBoxes, 0);
    assert.equal(supplychain.stakeholders.farmer.owner, FARMER_ADDR);
    assert.equal(supplychain.stakeholders.butcher.owner, BUTCHER_ADDR);
    assert.equal(supplychain.stakeholders.delivery.owner, DELIVERY_ADDR);
  });

  it('should mark the animal as delivered', async() => {
    const crowdfunding_contract = await Crowdfunding.deployed();
    const supplychain_contract = await SupplyChains.deployed();

    const campaignId = await crowdfunding_contract.getNumberOfCampaigns.call();

    await generateCampaignAndByAll(crowdfunding_contract, campaignId);

    let supplychain = await supplychain_contract.getSupplyChainById.call(campaignId);
    assert.equal(supplychain.isAnimalDelivered, false);
    
    accounts[1] = FARMER_ADDR;
    // is required to set FARMER_ADDR using an account provided by ganache test net
    await supplychain_contract.markAnimalAsDelivered(campaignId, { 'from': FARMER_ADDR });
    
    supplychain = await supplychain_contract.getSupplyChainById.call(campaignId);
    assert.equal(supplychain.isAnimalDelivered, true);
  });
});