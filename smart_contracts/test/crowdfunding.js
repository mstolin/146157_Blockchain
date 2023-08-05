const Crowdfunding = artifacts.require('Crowdfunding');

const FARMER_ADDR = '0x4B2B359aa58431E975Bd93C223190228f0705bFF';
const BUTCHER_ADDR = '0x319562f93692a4cb1DA6D37c041dA04D1d5a2Cd0';
const DELIVERY_ADDR = '0x14a560B6aAc843227A426B49555cbb70D47eb9F5';
const RANDOM_SECRET = 'RANDOM_SECRET';

function generateBoxes(numberOfBoxes, boxesTotal) {
  let boxes = [];
  for (let index = 0; index < numberOfBoxes; index++) {
    const box = {
      'id': index,
      'available': boxesTotal[index],
      'total': boxesTotal[index],
      'box': {
        'title': `Box #${numberOfBoxes}`,
        'description': `Box #${numberOfBoxes} is a very good one`,
        'price': 2
      }
    };
    boxes[index] = box;
  }
  return boxes;
}

function generateCampaigns(numberOfCampaigns, numberOfBoxes, boxesTotal, owner) {
  let campaigns = [];
  for (let index = 0; index < numberOfCampaigns; index++) {
    const campaign = {
      'owner' : {
        'owner': owner,
        'ownerPublicKey': RANDOM_SECRET,
      },
      'meta': {
        'title': `Campaign #${index + 1}`,
        'description': `Campaign #${index + 1} is a very nice one`,
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
          'share': 40
        },
        'butcher': {
          'owner': BUTCHER_ADDR,
          'share': 30
        },
        'delivery': {
          'owner': DELIVERY_ADDR,
          'share': 30
        }
      },
      'boxes': generateBoxes(numberOfBoxes, boxesTotal),
    };
    campaigns[index] = campaign;
  }
  return campaigns;
}

contract('Crowdfunding', (accounts) => {
  async function createCampaign(contract, campaign, from) {
    await contract
      .createCampaign(
        campaign.meta.title,
        campaign.meta.description,
        campaign.meta.duration,
        campaign.owner,
        campaign.stakeholders,
        campaign.animal,
        campaign.boxes,
        { 'from': from }
      );
    let campaignId = await contract.getNumberOfCampaigns.call();
    return Number(campaignId) - 1;
  }

  it('should correctly create campaigns and boxes', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const boxesTotal = [4, 8];
    const campaign = generateCampaigns(1, 2, boxesTotal, owner)[0];
    const campaignId = await createCampaign(contract, campaign, owner);

    const campaignRes = await contract.getCampaign.call(campaignId);
    assert.equal(campaignRes.id, campaignId);
    assert.equal(campaignRes.campaign.owner.owner, owner);
    assert.equal(campaignRes.campaign.owner.ownerPublicKey, RANDOM_SECRET);
    assert.equal(campaignRes.campaign.meta.title, campaign.meta.title);
    assert.equal(campaignRes.campaign.meta.description, campaign.meta.description);
    assert.equal(campaignRes.campaign.meta.collectedAmount, 0);
    //assert.equal(campaignRes.campaign.meta.totalBoxes, 12);
    assert.equal(campaignRes.campaign.meta.boxesSold, 0)
    assert.isAbove(Number(campaignRes.campaign.meta.deadline), (new Date()).getTime() / 1000);
    assert.isFalse(campaignRes.campaign.meta.isStopped);
    assert.equal(campaignRes.campaign.stakeholders.farmer.owner, FARMER_ADDR);
    assert.equal(campaignRes.campaign.stakeholders.farmer.share, 40);
    assert.equal(campaignRes.campaign.stakeholders.butcher.owner, BUTCHER_ADDR);
    assert.equal(campaignRes.campaign.stakeholders.butcher.share, 30);
    assert.equal(campaignRes.campaign.stakeholders.delivery.owner, DELIVERY_ADDR);
    assert.equal(campaignRes.campaign.stakeholders.delivery.share, 30);
    assert.equal(campaignRes.campaign.animal.earTag, campaign.animal.earTag);
    assert.equal(campaignRes.campaign.animal.name, campaign.animal.name);
    assert.equal(campaignRes.campaign.animal.farm, campaign.animal.farm);
    assert.equal(campaignRes.campaign.animal.age, campaign.animal.age);

    const boxesRes = await contract.getBoxes.call(campaignId);
    assert.equal(boxesRes.length, campaign.boxes.length);
    for (let index = 0; index < campaign.boxes.length; index++) {
      const box = campaign.boxes[index];
      const boxRef = boxesRes[index];
      assert.equal(boxRef.id, index);
      assert.equal(boxRef.available, boxesTotal[index]);
      assert.equal(boxRef.total, boxesTotal[index]);
      assert.equal(boxRef.box.title, box.box.title);
      assert.equal(boxRef.box.description, box.box.description);
      assert.equal(boxRef.box.price, box.box.price);
    }
  });

  /*it('should buy all from a campaign', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const campaign = generateCampaigns(1, 2, [1, 2], owner)[0];
    const campaignId = await createCampaign(contract, campaign, owner);
    const someAddr = 'via Roma 1, Tento';

    // Buy one box
    await contract.buyBox(campaignId, 0, someAddr, { 'from': owner, 'value': 2 });

    let campaignRes = await contract.getCampaign.call(campaignId);
    assert.equal(campaignRes.campaign.boxesSold, 1);
    assert.equal(campaignRes.campaign.collectedAmount, 2);
    assert.isFalse(campaignRes.campaign.isStopped);

    let boxesRes = await contract.getBoxes.call(campaignId);
    assert.equal(boxesRes[0].available, 0);
    assert.equal(boxesRes[1].available, 2);

    let soldBoxes = await contract.getSoldBoxes.call(campaignId);
    assert.equal(soldBoxes.length, 1);
    assert.equal(soldBoxes[0].id, 0);
    assert.equal(soldBoxes[0].owner, owner);

    // Buy last boxes
    await contract.buyBox(campaignId, 1, someAddr, { 'from': owner, 'value': 2 });
    await contract.buyBox(campaignId, 1, someAddr, { 'from': owner, 'value': 2 });

    campaignRes = await contract.getCampaign.call(campaignId);
    assert.equal(campaignRes.campaign.boxesSold, 3);
    assert.equal(campaignRes.campaign.collectedAmount, web3.utils.toWei('6', 'wei'));
    assert.isTrue(campaignRes.campaign.isStopped);

    boxesRes = await contract.getBoxes.call(campaignId);
    assert.equal(boxesRes[1].available, 0);

    soldBoxes = await contract.getSoldBoxes.call(campaignId);
    assert.equal(soldBoxes.length, 3);
    for (let index = 0; index < soldBoxes.length; index++) {
      const soldBoxRef = soldBoxes[index];
      assert.equal(soldBoxRef.id, index);
      assert.equal(soldBoxRef.owner, owner);
      assert.equal(soldBoxRef.physAddress, someAddr);
    }
  });

  it('should stop a campaign', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const campaign = generateCampaigns(1, 1, [1], owner)[0];
    const campaignId = await createCampaign(contract, campaign, owner);

    let campaignRes = await contract.getCampaign.call(campaignId);
    assert.isFalse(campaignRes.campaign.isStopped);

    await contract.stopCampaign(campaignId, { 'from': owner });

    campaignRes = await contract.getCampaign.call(campaignId);
    assert.isTrue(campaignRes.campaign.isStopped);
  });*/

});
