const { CBInternationalClient } = require('coinbase-api');

  // ENDPOINT: /api/v1/transfers/{transfer_uuid}
  // METHOD: GET
  // PUBLIC: NO
  // Link to function: https://github.com/tiagosiebler/coinbase-api/blob/master/src/CBInternationalClient.ts#L477

const client = new CBInternationalClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
});

client.getTransfer(params)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
