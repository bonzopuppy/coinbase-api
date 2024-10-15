const { CBExchangeClient } = require('coinbase-api');

  // ENDPOINT: /transfers/{transfer_id}/travel-rules
  // METHOD: POST
  // PUBLIC: NO
  // Link to function: https://github.com/tiagosiebler/coinbase-api/blob/master/src/CBExchangeClient.ts#L308

const client = new CBExchangeClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

client.submitTravelInformation(params)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
