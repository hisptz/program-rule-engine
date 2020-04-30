import { excuteRuleEnginer } from './engine.service';

describe('Execute Rules', () => {
    it('should sum two numbers', () => {
      let results = excuteRuleEnginer({},{},[],[],{})
      expect(results.dataValues.length).toEqual(0);
    });
  });