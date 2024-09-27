import { CBAppClient } from '../../../src/index.js';

/**
 * import { CBAppClient } from 'coinbase-api';
 * const { CBAppClient } = require('coinbase-api');
 */

// Initialize the client
const client = new CBAppClient({
  apiKey: process.env.API_KEY_NAME || 'insert_api_key_here',
  apiSecret: process.env.API_PRIVATE_KEY || 'insert_api_secret_here',
});

async function main() {
  try {
    // Deposit funds to your fiat account
    const depositResult = await client.depositFunds({
      account_id: 'your_fiat_account_id',
      amount: '100.00',
      currency: 'USD',
      payment_method: 'your_payment_method_id',
    });
    console.log('Deposit Result: ', depositResult);

    // Withdraw funds from fiat account
    const withdrawResult = await client.withdrawFunds({
      account_id: 'your_fiat_account_id',
      amount: '50.00',
      currency: 'USD',
      payment_method: 'your_payment_method_id',
    });
    console.log('Withdraw Result: ', withdrawResult);

    // Send money to another user
    const sendMoneyResult = await client.sendMoney({
      account_id: 'your_crypto_account_id',
      type: 'send',
      to: 'recipient_address_or_email',
      amount: '0.01',
      currency: 'BTC',
    });
    console.log('Send Money Result: ', sendMoneyResult);

    // Transfer money between your own accounts
    const transferMoneyResult = await client.transferMoney({
      account_id: 'your_source_account_id',
      type: 'transfer',
      to: 'your_destination_account_id',
      amount: '0.01',
      currency: 'BTC',
    });
    console.log('Transfer Money Result: ', transferMoneyResult);
  } catch (e) {
    console.error('Error: ', e);
  }
}

main();
