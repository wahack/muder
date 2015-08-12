var assert = require('assert');
var muder = require('../');

var origin = {
  brokerId: 123,
  brokerName: 'liao',
  brokerDetail: {
    from: 'china',
    sex: 'male',
    name: {
      first: 'liao',
      last: 'ethan'
    },
    componey:{
      name: 'honhe',
      address:{
        code: '518052',
        locate: 'shenzhen'
      }
    },
    tags: [
      'developer','front-end','onepiece-fan'
    ],
    WorkMates: [
      {
        Name: 'xiaoyue',
        Age: 25
      },
      {
        Name: 'xiaoshan',
        Age: 22
      },
      {
        Name: 'xiaolong',
        Age: 28
      }
    ]
  }
};

var mapper = {
  id: 'brokerId',
  name: 'brokerName',
  detail: {
    first: 'brokerDetail.name.last',
    sex: 'brokerDetail.sex',
    name: 'brokerName',
    location: {
      code: 'brokerDetail.componey.address.code',
      city: 'brokerDetail.componey.address.locate'
    }
  },
  tags: [
    'brokerDetail.tags'
  ],
  workmates:[
    {
      name: 'brokerDetail.WorkMates[].Name',
      age: 'brokerDetail.WorkMates[].Age'
    }
  ]

};

var result = {
  id: 123,
  name: 'liao',
  detail: {
    first: 'ethan',
    sex: 'male',
    name: 'liao',
    location: {
      code: '518052',
      city: 'shenzhen'
    }
  },
  tags: ['developer','front-end','onepiece-fan'],
  workmates: [
    {
      name: 'xiaoyue',
      age: 25
    },
    {
      name: 'xiaoshan',
      age: 22
    },
    {
      name: 'xiaolong',
      age: 28
    }
  ]
};

describe('muder', function () {
  it('test result', function () {
    var r = muder(origin, mapper);
    assert.deepEqual(r, result);
  });
});
