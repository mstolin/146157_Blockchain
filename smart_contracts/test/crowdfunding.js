const Crowdfunding = artifacts.require('Crowdfunding');

function generateBoxes(numberOfBoxes, boxesTotal) {
  let boxes = [];
  for (let index = 0; index < numberOfBoxes; index++) {
    const box = {
      'available': `${boxesTotal[index]}`,
      'total': `${boxesTotal[index]}`,
      'box': {
        'title': `Box #${numberOfBoxes}`,
        'description': `Box #${numberOfBoxes} is a very good one`,
        'price': `${web3.utils.toWei('2', 'wei')}`
      }
    };
    boxes[index] = box;
  }
  return boxes;
}

function generateCampaigns(numberOfCampaigns, numberOfBoxes, boxesTotal) {
  let campaigns = [];
  for (let index = 0; index < numberOfCampaigns; index++) {
    const campaign = {
      'title': `Campaign #${index + 1}`,
      'description': `Campaign #${index + 1} is a very nice one`,
      'duration': '3628800',
      'boxes': generateBoxes(numberOfBoxes, boxesTotal)
    };
    campaigns[index] = campaign;
  }
  return campaigns;
}

contract('Crowdfunding', (accounts) => {
  async function createCampaign(contract, campaign, from) {
    await contract
      .createCampaign(
        from,
        campaign.title,
        campaign.description,
        campaign.duration,
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
    const campaign = generateCampaigns(1, 2, boxesTotal)[0];
    const campaignId = await createCampaign(contract, campaign, owner);

    const campaignRes = await contract.getCampaign.call(campaignId);
    assert.equal(campaignRes.id, campaignId);
    assert.equal(campaignRes.campaign.owner, owner);
    assert.equal(campaignRes.campaign.title, campaign.title);
    assert.equal(campaignRes.campaign.description, campaign.description);
    assert.equal(campaignRes.campaign.collectedAmount, '0');
    assert.equal(campaignRes.campaign.boxesLeft, '12')
    assert.isAbove(Number(campaignRes.campaign.deadline), (new Date()).getTime() / 1000);
    assert.isFalse(campaignRes.campaign.isStopped);

    const boxesRes = await contract.getBoxes.call(campaignId);
    assert.equal(boxesRes.length, campaign.boxes.length);
    for (let index = 0; index < campaign.boxes.length; index++) {
      const box = campaign.boxes[index];
      const boxRef = boxesRes[index];
      assert.equal(boxRef.available, `${boxesTotal[index]}`);
      assert.equal(boxRef.total, `${boxesTotal[index]}`);
      assert.equal(boxRef.box.title, box.box.title);
      assert.equal(boxRef.box.description, box.box.description);
      assert.equal(boxRef.box.price, box.box.price);
    }
  });

  it('should buy all from a campaign', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const campaign = generateCampaigns(1, 2, [1, 2])[0];
    const campaignId = await createCampaign(contract, campaign, owner);

    // Buy one box
    await contract.buyBox(campaignId, 0, { 'from': owner, 'value': web3.utils.toWei('2', 'wei') });

    let campaignRes = await contract.getCampaign.call(campaignId);
    assert.equal(campaignRes.campaign.boxesLeft, 2);
    assert.equal(campaignRes.campaign.collectedAmount, web3.utils.toWei('2', 'wei'));
    assert.isFalse(campaignRes.campaign.isStopped);

    let boxesRes = await contract.getBoxes.call(campaignId);
    assert.equal(boxesRes[0].available, 0);
    assert.equal(boxesRes[1].available, 2);

    // Buy last boxes
    await contract.buyBox(campaignId, 1, { 'from': owner, 'value': web3.utils.toWei('2', 'wei') });
    await contract.buyBox(campaignId, 1, { 'from': owner, 'value': web3.utils.toWei('2', 'wei') });

    campaignRes = await contract.getCampaign.call(campaignId);
    assert.equal(campaignRes.campaign.boxesLeft, 0);
    assert.equal(campaignRes.campaign.collectedAmount, web3.utils.toWei('6', 'wei'));
    assert.isTrue(campaignRes.campaign.isStopped);

    boxesRes = await contract.getBoxes.call(campaignId);
    assert.equal(boxesRes[1].available, 0);
  });

  it('should stop a campaign', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const campaign = generateCampaigns(1, 1, [1])[0];
    const campaignId = await createCampaign(contract, campaign, owner);

    let campaignRes = await contract.getCampaign.call(campaignId);
    assert.isFalse(campaignRes.campaign.isStopped);

    await contract.stopCampaign(campaignId, { 'from': owner });

    campaignRes = await contract.getCampaign.call(campaignId);
    assert.isTrue(campaignRes.campaign.isStopped);
  });

});
