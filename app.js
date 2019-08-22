/**
 * Entry point for running the application.
 * Must export an object with a start() method.
 *
 * Since this is a feature, the entry point is only used for running it in isolation.
 * When consumed by a page, the entry point will be defined by the consumer.
 */
import _ from 'underscore';
import $ from 'jquery';
import {
  getPROSDemoConfig,
  renderPDPPROs,
} from './src/js/appDemo/PROsDemoConfig';
import './src/scss/main-harness.scss';
import './src/scss/demo.scss';
import prosUIDemoTemplate from './src/templates/partials/demo/prosDemoList.hbs';

const app = {
  start() {
    window.addEventListener('load', () => {
      // ----- START EXAMPLE OF MULTIPLE CONTEXTS LOADED ON PAGE LOAD (PDP) -----
      renderPDPPROs();
      // ----- END EXAMPLE OF MULTIPLE CONTEXTS LOADED ON PAGE LOAD (PDP) -----


      // ----- START EXAMPLES FOR OTHER CONTEXTS LOADED ON BUTTON CLICK -----
      // Rich Relevance api on the client-side cannot handle multiple page type requests at once
      // Set demos for other page types behind a button click
      const prosDemoMap = getPROSDemoConfig();
      const demoContainers = _.chain(prosDemoMap)
        .map(({ name, context }) => ({
          context,
          name,
          zoneTitle: name.toUpperCase(),
          zoneSelector: name.split(' ').join('-'),
        }))
        .sortBy('name')
        .value();
      const templateData = { demoContainers };

      // Render PROS Demo Containers With Buttons
      $('#pros-trigger-button-container').html(prosUIDemoTemplate(templateData));

      $('#pros-trigger-button-container').on('click', '.pros-request-button', (e) => {
        e.preventDefault();

        const { context } = e.currentTarget.dataset;
        const prosZone = prosDemoMap[context].constructor();

        prosZone.render();
      });
      // ----- END EXAMPLES FOR OTHER CONTEXTS LOADED ON BUTTON CLICK -----
    });
  },
};

export default app;
