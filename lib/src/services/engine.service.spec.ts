import { excuteRuleEnginer } from './engine.service';

describe('Execute Rules', () => {
    it('should sum two numbers', () => {
      expect(excuteRuleEnginer({},
        {},
        [],
        [],
        {})).toEqual(3);
    });
  });