const Crowdfunding = artifacts.require('Crowdfunding');

contract('Crowdfunding', (accounts) => {
  const boxes = [
    {
      'available': '1',
      'total': '1',
      'box': {
        'title': 'A Box',
        'description': 'Super Box',
        'percentage': '100',
        'price': `${web3.utils.toWei('2', 'wei')}`
      }
    }
  ];
  const campaigns = [
    {
      'title': 'First Test Campaign',
      'description': 'Very nice',
      'duration': '3628800',
      'boxes': boxes
    },
    {
      'title': 'Second Test Campaign',
      'description': 'Very nice',
      'duration': '3628800',
      'boxes': boxes
    },
  ];

  async function createCampaign(contract, from) {
    await contract
      .createCampaign(
        from,
        campaigns[0].title,
        campaigns[0].description,
        campaigns[0].duration,
        campaigns[0].boxes,
        { 'from': from }
      );
    let campaignId = await contract.getNumberOfCampaigns.call();
    return Number(campaignId) - 1;
  }

  it('should correctly create campaigns and boxes', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const campaignId = await createCampaign(contract, owner);

    const campaignRes = await contract.getCampaign.call(campaignId);
    assert.equal(campaignRes.id, 0);
    assert.equal(campaignRes.campaign.owner, owner);
    assert.equal(campaignRes.campaign.title, campaigns[0].title);
    assert.equal(campaignRes.campaign.description, campaigns[0].description);
    assert.equal(campaignRes.campaign.collectedAmount, '0');
    assert.isAbove(Number(campaignRes.campaign.deadline), (new Date()).getTime() / 1000);
    assert.isFalse(campaignRes.campaign.isStopped);

    const boxesRes = await contract.getBoxes.call(campaignId);
    assert.equal(boxesRes.length, boxes.length);
    assert.equal(boxesRes[0].available, boxes[0].available);
    assert.equal(boxesRes[0].box.title, boxes[0].box.title);
    assert.equal(boxesRes[0].box.description, boxes[0].box.description);
    assert.equal(boxesRes[0].box.price, boxes[0].box.price);
  });

  it('should buy a box', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const campaignId = await createCampaign(contract, owner);

    await contract.buyBox(campaignId, 0, { 'from': owner, 'value': web3.utils.toWei('2', 'wei') });

    const boxesRes = await contract.getBoxes.call(campaignId);
    const ref = boxesRes[0];
    assert.equal(ref.available, 0);

    const campaignRes = await contract.getCampaign.call(campaignId);
    const campaign = campaignRes.campaign;
    assert.equal(campaign.collectedAmount, web3.utils.toWei('2', 'wei'));
    assert.isTrue(campaign.isStopped);
  });

  it('should stop a campaign', async () => {
    const contract = await Crowdfunding.deployed();
    const owner = accounts[0];

    const campaignId = await createCampaign(contract, owner);

    let campaignRes = await contract.getCampaign.call(campaignId);
    assert.isFalse(campaignRes.campaign.isStopped);

    await contract.stopCampaign(campaignId, { 'from': owner });

    campaignRes = await contract.getCampaign.call(campaignId);
    assert.isTrue(campaignRes.campaign.isStopped);
  });

});
