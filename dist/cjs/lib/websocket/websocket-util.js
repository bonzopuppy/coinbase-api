"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS_URL_MAP = exports.WS_KEY_MAP = void 0;
exports.isMessageEvent = isMessageEvent;
exports.getMergedCBExchangeWSRequestOperations = getMergedCBExchangeWSRequestOperations;
exports.getMergedCBINTXRequestOperations = getMergedCBINTXRequestOperations;
exports.getCBExchangeWSSign = getCBExchangeWSSign;
exports.getCBInternationalWSSign = getCBInternationalWSSign;
exports.getCBPrimeWSSign = getCBPrimeWSSign;
const webCryptoAPI_js_1 = require("../webCryptoAPI.js");
/**
 * Each websocket URL (domain + endpoint) is represented as a "WS Key". Authentication is handled automatically if required.
 */
exports.WS_KEY_MAP = {
    /**
     * Market Data is the traditional feed that provides updates for both orders and trades.
     * Most channels are now available without authentication.
     *
     * https://docs.cdp.coinbase.com/advanced-trade/docs/ws-overview
     */
    advTradeMarketData: 'advTradeMarketData',
    /**
     * User Order Data provides updates for the orders of the user.
     *
     * https://docs.cdp.coinbase.com/advanced-trade/docs/ws-overview
     */
    advTradeUserData: 'advTradeUserData',
    /**
     * Coinbase Market Data (part of Coinbase Exchange API) is the traditional feed which is available without authentication.
     *
     * https://docs.cdp.coinbase.com/exchange/docs/websocket-overview
     */
    exchangeMarketData: 'exchangeMarketData',
    /**
     * Coinbase Direct Market Data has direct access to Coinbase Exchange servers and requires Authentication.
     *
     * https://docs.cdp.coinbase.com/exchange/docs/websocket-overview
     */
    exchangeDirectMarketData: 'exchangeDirectMarketData',
    /**
     * The INTX WebSocket feed is publicly available and provides real-time market data updates for orders and trades.
     * The SDK must authenticate when subscribing to the WebSocket Feed the very first time.
     *
     * https://docs.cdp.coinbase.com/intx/docs/websocket-overview
     */
    internationalMarketData: 'internationalMarketData',
    /**
     * The Prime WebSocket feed provides real-time market data updates for orders and trades. To begin
     * receiving feed messages, you must send a signed subscribe message to the server indicating
     * which channels and products to receive. The SDK will handle this automatically.
     *
     * https://docs.cdp.coinbase.com/prime/docs/websocket-feed
     */
    primeMarketData: 'primeMarketData',
};
function isMessageEvent(msg) {
    if (typeof msg !== 'object' || !msg) {
        return false;
    }
    const message = msg;
    return message['type'] === 'message' && typeof message['data'] === 'string';
}
exports.WS_URL_MAP = {
    [exports.WS_KEY_MAP.advTradeMarketData]: {
        livenet: 'wss://advanced-trade-ws.coinbase.com',
        testnet: 'NotAvailable',
    },
    [exports.WS_KEY_MAP.advTradeUserData]: {
        livenet: 'wss://advanced-trade-ws-user.coinbase.com',
        testnet: 'NotAvailable',
    },
    [exports.WS_KEY_MAP.exchangeMarketData]: {
        livenet: 'wss://ws-feed.exchange.coinbase.com',
        testnet: 'wss://ws-feed-public.sandbox.exchange.coinbase.com',
    },
    [exports.WS_KEY_MAP.exchangeDirectMarketData]: {
        livenet: 'wss://ws-direct.exchange.coinbase.com',
        testnet: 'wss://ws-direct.sandbox.exchange.coinbase.com',
    },
    [exports.WS_KEY_MAP.internationalMarketData]: {
        livenet: 'wss://ws-md.international.coinbase.com',
        testnet: 'wss://ws-md.n5e2.coinbase.com',
    },
    [exports.WS_KEY_MAP.primeMarketData]: {
        livenet: 'wss://ws-feed.prime.coinbase.com',
        testnet: 'NotAvailable',
    },
};
/**
 * Merge one or more WS Request operations (e.g. subscribe request) for
 * CB Exchange into one, allowing them to be sent as one request
 */
function getMergedCBExchangeWSRequestOperations(operations) {
    // The CB Exchange WS supports sending multiple topics in one request.
    // Merge all requests into one
    return operations.reduce((acc, evt) => {
        if (!acc) {
            const wsRequestEvent = {
                type: evt.type,
                channels: [...evt.channels],
            };
            return wsRequestEvent;
        }
        const wsRequestEvent = {
            type: evt.type,
            channels: [...acc.channels, ...evt.channels],
        };
        return wsRequestEvent;
    });
}
/**
 * Merge one or more WS Request operations (e.g. subscribe request) for
 * CB Exchange into one, allowing them to be sent as one request
 */
function getMergedCBINTXRequestOperations(operations) {
    // The CB Exchange WS supports sending multiple topics in one request.
    // Merge all requests into one
    return operations.reduce((acc, evt) => {
        if (!acc) {
            const wsRequestEvent = {
                type: evt.type,
                channels: [...evt.channels],
            };
            return wsRequestEvent;
        }
        const wsRequestEvent = {
            type: evt.type,
            channels: [...acc.channels, ...evt.channels],
        };
        return wsRequestEvent;
    });
}
/**
 * Return sign used to authenticate CB Exchange WS requests
 */
async function getCBExchangeWSSign(apiSecret) {
    const timestampInMs = Date.now();
    const timestampInSeconds = (timestampInMs / 1000).toFixed(0);
    const signPath = '/users/self/verify';
    const signRequestMethod = 'GET';
    const signInput = `${timestampInSeconds}${signRequestMethod}${signPath}`;
    const sign = await (0, webCryptoAPI_js_1.signMessage)(signInput, apiSecret, 'base64', 'SHA-256', 'base64:web');
    return { sign, timestampInSeconds };
}
/**
 * Return sign used to authenticate CB INTX WS requests
 */
async function getCBInternationalWSSign(apiKey, apiSecret, apiPassphrase) {
    const timestampInMs = Date.now();
    const timestampInSeconds = (timestampInMs / 1000).toFixed(0);
    const signInput = timestampInSeconds + apiKey + 'CBINTLMD' + apiPassphrase;
    const sign = await (0, webCryptoAPI_js_1.signMessage)(signInput, apiSecret, 'base64', 'SHA-256', 'base64:web');
    return { sign, timestampInSeconds };
}
/**
 * Return sign used to authenticate CB Prime WS requests
 */
async function getCBPrimeWSSign(params) {
    const timestampInMs = Date.now();
    const timestampInSeconds = (timestampInMs / 1000).toFixed(0);
    // channelName + accessKey + svcAccountId + timestamp + portfolioId + products
    const signInput = [
        params.channelName,
        params.apiKey,
        params.svcAccountId,
        timestampInSeconds,
        params.portfolioId,
        params.product_ids ? params.product_ids.join('') : '',
    ].join('');
    const sign = await (0, webCryptoAPI_js_1.signMessage)(signInput, params.apiSecret, 'base64', 'SHA-256', 'base64:web');
    return { sign, timestampInSeconds };
}
//# sourceMappingURL=websocket-util.js.map