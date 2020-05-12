import { executeProgramRules } from './engine.service';

describe('Execute Rules', () => {
  it('should have no errors', () => {
    let results = executeProgramRules({}, {}, [], [], {});
    expect(results.dataValues.length).toEqual(0);
  });
});
