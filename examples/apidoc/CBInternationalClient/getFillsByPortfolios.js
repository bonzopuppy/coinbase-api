const { CBInternationalClient } = require('coinbase-api');

  // ENDPOINT: /api/v1/portfolios/fills
  // METHOD: GET
  // PUBLIC: NO
  // Link to function: https://github.com/tiagosiebler/coinbase-api/blob/master/src/CBInternationalClient.ts#L349

const client = new CBInternationalClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

client.getFillsByPortfolios(params)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
