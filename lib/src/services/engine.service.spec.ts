import { excuteRuleEnginer } from './engine.service';

describe('Execute Rules', () => {
    it('should have no errors', () => {
      let results = excuteRuleEnginer({},{},[],[],{})
      expect(results.dataValues.length).toEqual(0);
    });
  });