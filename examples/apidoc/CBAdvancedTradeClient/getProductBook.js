const { CBAdvancedTradeClient } = require('coinbase-api');

  // ENDPOINT: /api/v3/brokerage/product_book
  // METHOD: GET
  // PUBLIC: NO
  // Link to function: https://github.com/tiagosiebler/coinbase-api/blob/master/src/CBAdvancedTradeClient.ts#L127

const client = new CBAdvancedTradeClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

client.getProductBook(params)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
