import WebSocket from 'isomorphic-ws';
import { WsExchangeRequestOperation, WsInternationalRequestOperation } from '../../types/websockets/requests.js';
/**
 * Each websocket URL (domain + endpoint) is represented as a "WS Key". Authentication is handled automatically if required.
 */
export declare const WS_KEY_MAP: {
    /**
     * Market Data is the traditional feed that provides updates for both orders and trades.
     * Most channels are now available without authentication.
     *
     * https://docs.cdp.coinbase.com/advanced-trade/docs/ws-overview
     */
    readonly advTradeMarketData: "advTradeMarketData";
    /**
     * User Order Data provides updates for the orders of the user.
     *
     * https://docs.cdp.coinbase.com/advanced-trade/docs/ws-overview
     */
    readonly advTradeUserData: "advTradeUserData";
    /**
     * Coinbase Market Data (part of Coinbase Exchange API) is the traditional feed which is available without authentication.
     *
     * https://docs.cdp.coinbase.com/exchange/docs/websocket-overview
     */
    readonly exchangeMarketData: "exchangeMarketData";
    /**
     * Coinbase Direct Market Data has direct access to Coinbase Exchange servers and requires Authentication.
     *
     * https://docs.cdp.coinbase.com/exchange/docs/websocket-overview
     */
    readonly exchangeDirectMarketData: "exchangeDirectMarketData";
    /**
     * The INTX WebSocket feed is publicly available and provides real-time market data updates for orders and trades.
     * The SDK must authenticate when subscribing to the WebSocket Feed the very first time.
     *
     * https://docs.cdp.coinbase.com/intx/docs/websocket-overview
     */
    readonly internationalMarketData: "internationalMarketData";
    /**
     * The Prime WebSocket feed provides real-time market data updates for orders and trades. To begin
     * receiving feed messages, you must send a signed subscribe message to the server indicating
     * which channels and products to receive. The SDK will handle this automatically.
     *
     * https://docs.cdp.coinbase.com/prime/docs/websocket-feed
     */
    readonly primeMarketData: "primeMarketData";
};
/** This is used to differentiate between each of the available websocket streams */
export type WsKey = (typeof WS_KEY_MAP)[keyof typeof WS_KEY_MAP];
/**
 * Normalised internal format for a request (subscribe/unsubscribe/etc) on a topic, with optional parameters.
 *
 * - Topic: the topic this event is for
 * - Payload: the parameters to include, optional. E.g. auth requires key + sign. Some topics allow configurable parameters.
 */
export interface WsTopicRequest<TWSTopic extends string = string, TWSPayload = any> {
    topic: TWSTopic;
    /**
     * Any parameters to include with the request. These are automatically merged into the request.
     */
    payload?: TWSPayload;
}
/**
 * Conveniently allow users to request a topic either as string topics or objects (containing string topic + params)
 */
export type WsTopicRequestOrStringTopic<TWSTopic extends string, TWSPayload = any> = WsTopicRequest<TWSTopic, TWSPayload> | string;
export interface MessageEventLike {
    target: WebSocket;
    type: 'message';
    data: string;
}
export declare function isMessageEvent(msg: unknown): msg is MessageEventLike;
/**
 * Some exchanges have two livenet environments, some have test environments, some dont. This allows easy flexibility for different exchanges.
 * Examples:
 *  - One livenet and one testnet: NetworkMap<'livenet' | 'testnet'>
 *  - One livenet, sometimes two, one testnet: NetworkMap<'livenet' | 'testnet', 'livenet2'>
 *  - Only one livenet, no other networks: NetworkMap<'livenet'>
 */
type NetworkMap<TRequiredKeys extends string, TOptionalKeys extends string | undefined = undefined> = Record<TRequiredKeys, string> & (TOptionalKeys extends string ? Record<TOptionalKeys, string | undefined> : Record<TRequiredKeys, string>);
export declare const WS_URL_MAP: Record<WsKey, NetworkMap<'livenet' | 'testnet'>>;
/**
 * Merge one or more WS Request operations (e.g. subscribe request) for
 * CB Exchange into one, allowing them to be sent as one request
 */
export declare function getMergedCBExchangeWSRequestOperations<TWSTopic extends string = string>(operations: WsExchangeRequestOperation<TWSTopic>[]): WsExchangeRequestOperation<TWSTopic>;
/**
 * Merge one or more WS Request operations (e.g. subscribe request) for
 * CB Exchange into one, allowing them to be sent as one request
 */
export declare function getMergedCBINTXRequestOperations<TWSTopic extends string = string>(operations: WsInternationalRequestOperation<TWSTopic>[]): WsInternationalRequestOperation<TWSTopic>;
/**
 * Return sign used to authenticate CB Exchange WS requests
 */
export declare function getCBExchangeWSSign(apiSecret: string): Promise<{
    timestampInSeconds: string;
    sign: string;
}>;
/**
 * Return sign used to authenticate CB INTX WS requests
 */
export declare function getCBInternationalWSSign(apiKey: string, apiSecret: string, apiPassphrase: string): Promise<{
    timestampInSeconds: string;
    sign: string;
}>;
/**
 * Return sign used to authenticate CB Prime WS requests
 */
export declare function getCBPrimeWSSign(params: {
    channelName: string;
    svcAccountId: string;
    portfolioId: string;
    apiKey: string;
    apiSecret: string;
    product_ids?: string[];
}): Promise<{
    timestampInSeconds: string;
    sign: string;
}>;
export {};
