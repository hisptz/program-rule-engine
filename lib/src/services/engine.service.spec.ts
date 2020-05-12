import { execute } from './engine.service';

describe('Execute Rules', () => {
  it('should have no errors', () => {
    let results = execute({}, {}, [], [], {});
    expect(results.dataValues.length).toEqual(0);
  });
});
