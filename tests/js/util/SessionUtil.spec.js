import _ from 'underscore';
import Cookie from '@component/common/src/util/Cookie';
import ClientSideStorage from '@component/common/src/util/ClientSideStorage';
import {
  getCoreId,
  getRequester,
  getSessionId,
  generateSessionID,
  isValidSessionId,
  setRCSIfEmpty,
} from '../../../src/js/util/SessionUtil';

describe('SessionUtil', () => {
  describe('isValidSessionId function', () => {
    it('should return false if the argument passed is not a string', () => {
      expect(isValidSessionId()).toBe(false);
      expect(isValidSessionId(12)).toBe(false);
      expect(isValidSessionId({})).toBe(false);
    });

    it('should return false if the argument passed is an empty string', () => {
      expect(isValidSessionId('')).toBe(false);
    });

    it('should return false if the argument passed is a string with more than 99 characters', () => {
      expect(isValidSessionId('b'.repeat(100))).toBe(false);
    });

    it('should return true if the argument passed is a string with fewer than a 100 characters', () => {
      expect(isValidSessionId('a'.repeat(99))).toBe(true);
      expect(isValidSessionId('b'.repeat(100))).toBe(false);
    });
  });

  describe('generateSessionID function', () => {
    it('should return a string with fewer than 100 characters', () => {
      expect(typeof generateSessionID() === 'string').toBe(true);
      expect(generateSessionID().length).toBeLessThan(100);
    });

    it('should return a unique string with fewer than 100 characters', () => {
      const seen = {};

      _.times(100, () => {
        const randomId = generateSessionID();

        expect(seen[randomId]).not.toBeDefined();

        seen[randomId] = true;
      });
    });
  });

  describe('getSessionId function', () => {
    let cookieValue;

    beforeEach(() => {
      spyOn(Cookie, 'set');
      spyOn(Cookie, 'get').and.callFake((key) => {
        if (key === 'RTD') {
          return cookieValue;
        }

        return '';
      });
    });

    it('should return the value stored under the RTD cookie if the value is a valid id', () => {
      const validId = 'abcdef';

      cookieValue = validId;

      expect(getSessionId()).toEqual(validId);
    });

    it('should set the RTD cookie if the current one is invalid', () => {
      cookieValue = '';

      const sessionId = getSessionId();
      expect(Cookie.set).toHaveBeenCalledWith('RTD', sessionId);
    });
  });

  describe('getRequester function', () => {
    it('should return \'BCOM-NAVAPP\' if the window width is larger than the small region', () => {
      const originalWidth = window.innerWidth;

      window.innerWidth = 1400;

      expect(getRequester()).toEqual('BCOM-NAVAPP');
      window.innerWidth = originalWidth;
    });

    it('should return \'BCOM-BMEW\' if the window width is in the small region', () => {
      const originalWidth = window.innerWidth;

      window.innerWidth = 1;

      expect(getRequester()).toEqual('BCOM-BMEW');
      window.innerWidth = originalWidth;
    });
  });

  describe('getCoreId function', () => {
    it('should return the value in sessionStorage under the key \'cmCoreId6\'', () => {
      const sessionStorage = {
        cmCoreId6: 'cmCoreId6',
      };

      spyOn(ClientSideStorage, 'getSession').and.callFake(key => sessionStorage[key]);

      expect(getCoreId()).toEqual(sessionStorage.cmCoreId6);
    });
  });

  describe('setRCSIfEmpty function', () => {
    it('should store in sessionStorage the argument passed under the key \'richRelevanceRCS\'', () => {
      const sessionStorage = {};

      spyOn(ClientSideStorage, 'getSession').and.callFake(key => sessionStorage[key]);
      spyOn(ClientSideStorage, 'setSession').and.callFake((key, value) => {
        sessionStorage[key] = value;
      });

      const rcsValue = 'rcs value';

      setRCSIfEmpty(rcsValue);
      expect(sessionStorage.richRelevanceRCS).toEqual(rcsValue);
    });
  });
});
