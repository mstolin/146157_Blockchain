const SupplyChain = artifacts.require('SupplyChain')

const FARMER_ADDR = '0x4B2B359aa58431E975Bd93C223190228f0705bFF';
const BUTCHER_ADDR = '0x319562f93692a4cb1DA6D37c041dA04D1d5a2Cd0';
const DELIVERY_ADDR = '0x14a560B6aAc843227A426B49555cbb70D47eb9F5';
const RANDOM_SECRET = 'RANDOM_SECRET';

/*
function generateBoxes(numBoxes, boxId) {
  let boxes = [];
  for (let index = 0; index < numBoxes; index++) {
      const box = {
        'id': index,
        'boxId': boxId,
        'owner': OWNER_ADDR,
        'boughtAt': 1,
        'physAddress': 'some address'
      };
      boxes[index] = box;
  }
  return boxes;
}

function generateSupplyChain(id, numBoxes) {
  return {
    'campaignRef': id,
    'isAnimalDelivered': false,
    'isAnimalProcessed': false,
    'areBoxesPrepared': false,
    'areBoxesDelivered': false,
    'areBoxesDistributed': false,
    'totalBoxes': 0,
    'preparedBoxes': 0,
    'deliveredBoxes': 0,
    'receivedBoxes': 0,
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
  }
}
*/
