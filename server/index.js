const Server = require('@core/server');

const server = new Server();
const http = require('http');
const url = require('url');
const request = require('request-promise');
const querystring = require('querystring');
const logger = require('@component/common').getServerLogger();

const { app } = server;

if (!process.env.PRODUCT_XAPI_HOST) {
  throw new Error('PRODUCT_XAPI_HOST not found. TIP: Try `m server --env=./envconfigs/local/bcom/.env` for local dev-environment.');
}

app.get('/xapi/digital/v1/product/:id', (req, res) => {
  const endpoint = process.env.PRODUCT_XAPI_HOST + req.url;
  const urlObj = url.parse(endpoint);

  http.get(urlObj, (remoteResponse) => {
    logger.info(`Product xAPI call to ${endpoint} successful`);

    res.status(remoteResponse.statusCode);
    res.setHeader('Content-Type', remoteResponse.headers['content-type']);
    remoteResponse.pipe(res);
  }).on('error', () => {
    throw new Error(`Error retrieving product data ${endpoint}. Make sure PRODUCT_XAPI_HOST is up to date in package.json`);
  });
});

app.post('/sdp/rto/request/recommendations', (req, res) => {
  const endpoint = process.env.RTO_HOST + req.url;
  const form = querystring.stringify(req.body);

  logger.info(`Proxying RTO call to ${endpoint}`);
  logger.info(`Form data:${form}`);

  request.post({
    url: endpoint,
    form,
    timeout: 5000,
    rejectUnauthorized: false,
    resolveWithFullResponse: true,
  })
    .then((remoteResponse) => {
      logger.info('Proxy RTO call successful');
      res.status(remoteResponse.statusCode);
      res.setHeader('Content-Type', remoteResponse.headers['content-type']);
      res.end(remoteResponse.body);
    })
    .catch((err) => {
      logger.error(`Proxy RTO call failed: (${err.name}) ${err.message}`);
      res.status(500).end('Error');
    })
    .finally(() => {
      if (!res.finished) {
        logger.error('Proxy RTO call timed out');
        res.status(504).end('Timeout');
      }
      logger.info(`RTO call finished with ${res.statusCode}`);
    });
});

server.start();
