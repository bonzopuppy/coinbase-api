# Node.js & JavaScript SDK for Coinbase REST APIs & WebSockets

<p align="center">
  <a href="https://www.npmjs.com/package/coinbase-api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/tiagosiebler/coinbase-api/blob/master/docs/images/logoDarkMode2.svg?raw=true#gh-dark-mode-only">
      <img alt="SDK Logo" src="https://github.com/tiagosiebler/coinbase-api/blob/master/docs/images/logoBrightMode2.svg?raw=true#gh-light-mode-only">
    </picture>
  </a>
</p>

[![npm version](https://img.shields.io/npm/v/coinbase-api)][1]
[![npm size](https://img.shields.io/bundlephobia/min/coinbase-api/latest)][1]
[![npm downloads](https://img.shields.io/npm/dt/coinbase-api)][1]
[![Build & Test](https://github.com/tiagosiebler/coinbase-api/actions/workflows/e2etest.yml/badge.svg?branch=master)](https://github.com/tiagosiebler/coinbase-api/actions/workflows/e2etest.yml)
[![last commit](https://img.shields.io/github/last-commit/tiagosiebler/coinbase-api)][1]
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/nodetraders)

[1]: https://www.npmjs.com/package/coinbase-api

Updated & performant JavaScript & Node.js SDK for the Coinbase REST APIs and WebSockets:

- Supports both retail and institutional REST clients and Websockets:
  - [Coinbase Advanced Trade](https://docs.cdp.coinbase.com/advanced-trade/docs/welcome)
  - [Coinbase App](https://docs.cdp.coinbase.com/coinbase-app/docs/welcome)
  - [Coinbase Exchange](https://docs.cdp.coinbase.com/exchange/docs/welcome)
  - [Coinbase International Exchange](https://docs.cdp.coinbase.com/intx/docs/welcome)
  - [Coinbase Prime](https://docs.cdp.coinbase.com/prime/docs/welcome)
  - [Coinbase Commerce](https://docs.cdp.coinbase.com/commerce-onchain/docs/welcome)
- Complete integration with all REST APIs and WebSockets.
- TypeScript support (with type declarations for most API requests & responses)
- Robust WebSocket integration with configurable connection heartbeats & automatic reconnect then resubscribe workflows.
- Browser-friendly HMAC signature mechanism.
- Automatically supports both ESM and CJS projects.
- Proxy support via axios integration.
- Active community support & collaboration in telegram: [Node.js Algo Traders](https://t.me/nodetraders).

## Installation

`npm install --save coinbase-api`

## Issues & Discussion

- Issues? Check the [issues tab](https://github.com/tiagosiebler/coinbase-api/issues).
- Discuss & collaborate with other node devs? Join our [Node.js Algo Traders](https://t.me/nodetraders) engineering community on telegram.

<!-- template_related_projects -->

## Related projects

Check out my related JavaScript/TypeScript/Node.js projects:

- Try my REST API & WebSocket SDKs:
  - [Bybit-api Node.js SDK](https://www.npmjs.com/package/bybit-api)
  - [Okx-api Node.js SDK](https://www.npmjs.com/package/okx-api)
  - [Binance Node.js SDK](https://www.npmjs.com/package/binance)
  - [Gateio-api Node.js SDK](https://www.npmjs.com/package/gateio-api)
  - [Bitget-api Node.js SDK](https://www.npmjs.com/package/bitget-api)
  - [Kucoin-api Node.js SDK](https://www.npmjs.com/package/kucoin-api)
  - [Coinbase-api Node.js SDK](https://www.npmjs.com/package/coinbase-api)
  - [Bitmart-api Node.js SDK](https://www.npmjs.com/package/bitmart-api)
- Try my misc utilities:
  - [OrderBooks Node.js](https://www.npmjs.com/package/orderbooks)
  - [Crypto Exchange Account State Cache](https://www.npmjs.com/package/accountstate)
- Check out my examples:
  - [awesome-crypto-examples Node.js](https://github.com/tiagosiebler/awesome-crypto-examples)
  <!-- template_related_projects_end -->

## Documentation

Most methods accept JS objects. These can be populated using parameters specified by Coinbase's API documentation.

- [Coinbase API Documentation](https://docs.cdp.coinbase.com/product-apis/docs/welcome)
- [REST Endpoint Function List](./docs/endpointFunctionList.md)
<!-- - [TSDoc Documentation (autogenerated using typedoc)](https://tsdocs.dev/docs/coinbase-api) -->

## Structure

This project uses typescript. Resources are stored in 2 key structures:

- [src](./src) - the whole connector written in typescript
- [examples](./examples) - some implementation examples & demonstrations. Contributions are welcome!

---

# Usage

Create API credentials

- [Coinbase API Key Management](https://www.coinbase.com/settings/api)

### REST API

To use any of Coinbase's REST APIs in JavaScript/TypeScript/Node.js, import (or require) the client you want to use. We currently support the following clients:

- [CBAdvancedTradeClient](./src/CBAdvancedTradeClient.ts)
- [CBAppClient](./src/CBAppClient.ts)
- [CBExchangeClient](./src/CBExchangeClient.ts)
- [CBInternationalClient](./src/CBInternationalClient.ts)
- [CBPrimeClient](./src/CBPrimeClient.ts)
- [CBCommerceClient](./src/CBCommerceClient.ts)

#### CBAdvancedTradeClient

```javascript
import { CBAdvancedTradeClient } from 'coinbase-api';

// insert your API key details here from Coinbase API Key Management
const advancedTradeCdpAPIKey = {
  // dummy example keys to understand the structure
  name: 'organizations/13232211d-d7e2-d7e2-d7e2-d7e2d7e2d7e2/apiKeys/d7e2d7e2-d7e2-d7e2-d7e2-d7e2d7e2d7e2',
  privateKey:
    '-----BEGIN EC PRIVATE KEY-----\nADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj/ADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj+oAoGCCqGSM49\nAwEHoUQDQgAEhtAep/ADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj+bzduY3iYXEmj/KtCk\nADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj\n-----END EC PRIVATE KEY-----\n',
};

const client = new CBAdvancedTradeClient({
  // Either pass the full JSON object that can be downloaded when creating your API keys
  // cdpApiKey: advancedTradeCdpAPIKey,

  // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
  apiKey: advancedTradeCdpAPIKey.name,
  apiSecret: advancedTradeCdpAPIKey.privateKey,
});

// Example usage of the CBAdvancedTradeClient
try {
  const accounts = await client.getAccounts();
  console.log('Get accounts result: ', accounts);
} catch (e) {
  console.error('Exception: ', JSON.stringify(e));
}
```

#### CBAppClient

```javascript
const { CBAppClient } = require('coinbase-api');

// insert your API key details here from Coinbase API Key Management
const CBAppKeys = {
  // dummy example keys to understand the structure
  name: 'organizations/13232211d-d7e2-d7e2-d7e2-d7e2d7e2d7e2/apiKeys/d7e2d7e2-d7e2-d7e2-d7e2-d7e2d7e2d7e2',
  privateKey:
    '-----BEGIN EC PRIVATE KEY-----\nADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj/ADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj+oAoGCCqGSM49\nAwEHoUQDQgAEhtAep/ADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj+bzduY3iYXEmj/KtCk\nADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj\n-----END EC PRIVATE KEY-----\n',
};

const client = new CBAppClient({
  // Either pass the full JSON object that can be downloaded when creating your API keys
  // cdpApiKey: CBAppCdpAPIKey,

  // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
  apiKey: CBAppKeys.name,
  apiSecret: CBAppKeys.privateKey,
});

try {
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
```

#### CBInternationalClient

```javascript
const { CBInternationalClient } = require('coinbase-api');

// insert your API key details here from Coinbase API Key Management
const client = new CBInternationalClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
  apiPassphrase: 'insert_api_passphrase_here',
  // Set "useSandbox" to use the CoinBase International API sandbox environment
  // useSandbox: true,
});

try {
  // Get asset details
  const assetDetails = await client.getAssetDetails({ asset: 'BTC' });
  console.log('Asset Details: ', assetDetails);
} catch (e) {
  console.error('Exception: ', JSON.stringify(e, null, 2));
}
```

#### CBExchangeClient

```javascript
const { CBExchangeClient } = require('coinbase-api');

// insert your API key details here from Coinbase API Key Management
const client = new CBExchangeClient({
  apiKey: 'insert_api_key_here',
  apiSecret: 'insert_api_secret_here',
  apiPassphrase: 'insert_api_passphrase_here',
  // Set "useSandbox" to use the CoinBase International API sandbox environment
  // useSandbox: true,
});

try {
  // Get a single currency by id
  const currency = await client.getCurrency('BTC');
  console.log('Currency: ', currency);
} catch (e) {
  console.error('Exception: ', JSON.stringify(e, null, 2));
}
```

See all clients [here](./src/) for more information on all the functions or the [examples](./examples/) for lots of usage examples. You can also check the endpoint function list [here](./docs/endpointFunctionList.md) to find all available functions!

## WebSockets

All available WebSockets can be used via a shared `WebsocketClient`. The WebSocket client will automatically open/track/manage connections as needed. Each unique connection (one per server URL) is tracked using a WsKey (each WsKey is a string - see [WS_KEY_MAP](src/lib/websocket/websocket-util.ts) for a list of supported values).

Any subscribe/unsubscribe events will need to include a WsKey, so the WebSocket client understands which connection the event should be routed to. See examples below or in the [examples](./examples/) folder on GitHub.

Data events are emitted from the WebsocketClient via the `update` event, see example below:

#### Public Websocket

```javascript
const { WebsocketClient } = require('coinbase-api');

// public ws client, doesnt need any api keys to run
const client = new WebsocketClient();
```

#### Private Websocket

```javascript
const { WebsocketClient } = require('coinbase-api');

// key name & private key, as returned by coinbase when creating your API keys.
// Note: the below example is a dummy key and won't actually work
const advancedTradeCdpAPIKey = {
  name: 'organizations/13232211d-d7e2-d7e2-d7e2-d7e2d7e2d7e2/apiKeys/d7e2d7e2-d7e2-d7e2-d7e2-d7e2d7e2d7e2',
  privateKey:
    '-----BEGIN EC PRIVATE KEY-----\nADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj/ADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj+oAoGCCqGSM49\nAwEHoUQDQgAEhtAep/ADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj+bzduY3iYXEmj/KtCk\nADFGHmkgnjdfg16k165kuu1kdtyudtyjdtyjytj\n-----END EC PRIVATE KEY-----\n',
};

const client = new WebsocketClient({
  // Either pass the full JSON object that can be downloaded when creating your API keys
  // cdpApiKey: advancedTradeCdpAPIKey,

  // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
  apiKey: advancedTradeCdpAPIKey.name,
  apiSecret: advancedTradeCdpAPIKey.privateKey,
});
```

#### Listening and subscribing to Websocket events

```javascript
// add event listeners for websocket clients

client.on('open', (data) => {
  console.log('open: ', data?.wsKey);
});

// Data received
client.on('update', (data) => {
  console.info(new Date(), 'data received: ', JSON.stringify(data));
});

// Something happened, attempting to reconenct
client.on('reconnect', (data) => {
  console.log('reconnect: ', data);
});

// Reconnect successful
client.on('reconnected', (data) => {
  console.log('reconnected: ', data);
});

// Connection closed. If unexpected, expect reconnect -> reconnected.
client.on('close', (data) => {
  console.error('close: ', data);
});

// Reply to a request, e.g. "subscribe"/"unsubscribe"/"authenticate"
client.on('response', (data) => {
  console.info('response: ', JSON.stringify(data, null, 2));
  // throw new Error('res?');
});

client.on('exception', (data) => {
  console.error('exception: ', data);
});

/**
 * Use the client subscribe(topic, market) pattern to subscribe to any websocket topic.
 *
 * You can subscribe to topics one at a time or many one one request.
 *
 * Topics can be sent as simple strings, if no parameters are required:
 */

// market data
client.subscribe('heartbeats', 'advTradeMarketData');

// user data
client.subscribe('futures_balance_summary', 'advTradeUserData');
client.subscribe('user', 'advTradeUserData');

/**
 * Or send a more structured object with parameters, e.g. if parameters are required
 */
const tickerSubscribeRequst = {
  topic: 'ticker',
  /**
   * Anything in the payload will be merged into the subscribe "request",
   * allowing you to send misc parameters supported by the exchange (such as `product_ids: string[]`)
   */
  payload: {
    product_ids: ['ETH-USD', 'BTC-USD'],
  },
};
client.subscribe(tickerSubscribeRequst, 'advTradeMarketData');

// Other adv trade public websocket topics:

client.subscribe(
  [
    {
      topic: 'candles',
      payload: {
        product_ids: ['ETH-USD'],
      },
    },
    {
      topic: 'market_trades',
      payload: {
        product_ids: ['ETH-USD', 'BTC-USD'],
      },
    },
    {
      topic: 'ticker',
      payload: {
        product_ids: ['ETH-USD', 'BTC-USD'],
      },
    },
    {
      topic: 'ticker_batch',
      payload: {
        product_ids: ['ETH-USD', 'BTC-USD'],
      },
    },
    {
      topic: 'level2',
      payload: {
        product_ids: ['ETH-USD', 'BTC-USD'],
      },
    },
  ],
  'advTradeMarketData',
);
```

See [WebsocketClient](./src/WebsocketClient.ts) for further information and make sure to check the [examples](./examples/) folder for much more usage examples, especially [publicWs.ts](./examples/AdvancedTrade/WebSockets/publicWs.ts) and [privateWs.ts](./examples/AdvancedTrade/WebSockets/privateWs.ts), which explains a lot of small details.

---

## Customise Logging

Pass a custom logger which supports the log methods `trace`, `info` and `error`, or override methods from the default logger as desired.

```javascript
const { WebsocketClient, DefaultLogger } = require('kucoin-api');

// E.g. customise logging for only the trace level:
const logger = {
  // Inherit existing logger methods, using an object spread
  ...DefaultLogger,
  // Define a custom trace function to override only that function
  trace: (...params) => {
    if (
      [
        'Sending ping',
        // 'Sending upstream ws message: ',
        'Received pong',
      ].includes(params[0])
    ) {
      return;
    }
    console.log('trace', JSON.stringify(params, null, 2));
  },
};

const ws = new WebsocketClient(
  {
    apiKey: 'apiKeyHere',
    apiSecret: 'apiSecretHere',
    apiPassphrase: 'apiPassPhraseHere',
  },
  logger,
);
```

---

<!-- template_contributions -->

Have my projects helped you? Share the love, there are many ways you can show your thanks:

- Star & share my projects.
- Are my projects useful? Sponsor me on Github and support my effort to maintain & improve them: https://github.com/sponsors/tiagosiebler
- Have an interesting project? Get in touch & invite me to it.
- Or buy me all the coffee:
  - ETH(ERC20): `0xA3Bda8BecaB4DCdA539Dc16F9C54a592553Be06C` <!-- metamask -->

<!---
old ones:
  - BTC: `1C6GWZL1XW3jrjpPTS863XtZiXL1aTK7Jk`
  - BTC(SegWit): `bc1ql64wr9z3khp2gy7dqlmqw7cp6h0lcusz0zjtls`
  - ETH(ERC20): `0xe0bbbc805e0e83341fadc210d6202f4022e50992`
  - USDT(TRC20): `TA18VUywcNEM9ahh3TTWF3sFpt9rkLnnQa
-->
<!-- template_contributions_end -->

### Contributions & Pull Requests

Contributions are encouraged, I will review any incoming pull requests. See the issues tab for todo items.

<!-- template_star_history -->

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tiagosiebler/bybit-api,tiagosiebler/okx-api,tiagosiebler/binance,tiagosiebler/bitget-api,tiagosiebler/bitmart-api,tiagosiebler/gateio-api,tiagosiebler/kucoin-api,tiagosiebler/orderbooks,tiagosiebler/accountstate,tiagosiebler/awesome-crypto-examples&type=Date)](https://star-history.com/#tiagosiebler/bybit-api&tiagosiebler/okx-api&tiagosiebler/binance&tiagosiebler/bitget-api&tiagosiebler/bitmart-api&tiagosiebler/gateio-api&tiagosiebler/kucoin-api&tiagosiebler/orderbooks&tiagosiebler/accountstate&tiagosiebler/awesome-crypto-examples&Date)

<!-- template_star_history_end -->
