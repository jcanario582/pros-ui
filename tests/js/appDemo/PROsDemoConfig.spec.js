import * as PROsUI from '../../../src/pros-ui';
import {
  getPROSProductData,
  getPROSDemoConfig,
  renderPDPPROs,
} from '../../../src/js/appDemo/PROsDemoConfig';

describe('PROsDemoConfig', () => {
  beforeEach(() => {
    spyOn(PROsUI, 'default').and.returnValue({
      fetchRecommendations: () => Promise.resolve(),
      initializeProductCarousel: () => ({
        render: () => {},
      }),
      render: () => {},
    });
  });

  describe('getPROSProductData', () => {
    it('should', () => {
      getPROSProductData();
    });
  });

  describe('getPROSDemoConfig function', () => {
    it('should', () => {
      const prosConfigMap = getPROSDemoConfig();

      Object.entries(prosConfigMap).forEach((entry) => {
        entry[1].constructor();
      });
    });
  });

  describe('renderPDPPROs', () => {
    it('should', () => {
      renderPDPPROs();
    });
  });
});
