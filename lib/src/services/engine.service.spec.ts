import * as d2Rule from '../../../dist';

describe('Execute Rules', () => {
  it('should have no errors', () => {
    let results = d2Rule.execute({}, {}, [], [], {});
    expect(results.dataValues.length).toEqual(0);
  });
});
