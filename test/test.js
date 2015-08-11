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
    }
  }
};

var mapper = {
  id: 'brokerId',
  name: 'brokerName',
  detail: {
    first: 'brokerDetail.name.last',
    sex: 'brokerDetail.sex',
    name: 'brokerName',
    hah: {
      name: 'brokerName'
    }
  }
};

var result = {
  id: 123,
  name: 'liao',
  detail: {
    first: 'ethan',
    sex: 'male',
    name: 'liao',
    hah: {
      name: 'liao'
    }
  }
};

describe('muder', function () {
  it('test result', function () {
    var r = muder(origin, mapper);
    assert.deepEqual(r, result);
  });
});
