const { CBInternationalClient } = require('coinbase-api');

  // ENDPOINT: /api/v1/transfers/withdraw/counterparty
  // METHOD: POST
  // PUBLIC: NO
  // Link to function: https://github.com/tiagosiebler/coinbase-api/blob/master/src/CBInternationalClient.ts#L532

const client = new CBInternationalClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

client.withdrawToCounterpartyId(params)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
