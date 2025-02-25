/**
 * Used to switch how authentication/requests work under the hood
 */
export const REST_CLIENT_TYPE_ENUM = {
    /** Coinbase Advanced Trade API */
    advancedTrade: 'advancedTrade',
    /** Coinbase App API */
    coinbaseApp: 'coinbaseApp',
    /** Coinbase Exchange API */
    exchange: 'exchange',
    /** Coinbase Prime API */
    prime: 'prime',
    /** Coinbase International API */
    international: 'international',
    /** Coinbase Commerce API */
    commerce: 'commerce',
};
const exchangeBaseURLMap = {
    [REST_CLIENT_TYPE_ENUM.advancedTrade]: 'https://api.coinbase.com',
    [REST_CLIENT_TYPE_ENUM.coinbaseApp]: 'https://api.coinbase.com',
    [REST_CLIENT_TYPE_ENUM.exchange]: 'https://api.exchange.coinbase.com',
    [REST_CLIENT_TYPE_ENUM.prime]: 'https://api.prime.coinbase.com',
    [REST_CLIENT_TYPE_ENUM.international]: 'https://api.international.coinbase.com',
    [REST_CLIENT_TYPE_ENUM.commerce]: 'https://api.commerce.coinbase.com',
};
const exchangeSandboxURLMap = {
    [REST_CLIENT_TYPE_ENUM.exchange]: 'https://api-public.sandbox.exchange.coinbase.com',
    [REST_CLIENT_TYPE_ENUM.international]: 'https://api-n5e1.coinbase.com',
    [REST_CLIENT_TYPE_ENUM.advancedTrade]: 'NoSandboxAvailable',
    [REST_CLIENT_TYPE_ENUM.coinbaseApp]: 'NoSandboxAvailable',
    [REST_CLIENT_TYPE_ENUM.prime]: 'NoSandboxAvailable',
    [REST_CLIENT_TYPE_ENUM.commerce]: 'NoSandboxAvailable',
};
export function serializeParams(params, strict_validation, encodeValues, prefixWith) {
    if (!params) {
        return '';
    }
    const queryString = Object.keys(params)
        .sort()
        .map((key) => {
        const value = params[key];
        if (strict_validation === true && typeof value === 'undefined') {
            throw new Error('Failed to sign API request due to undefined parameter');
        }
        const encodedValue = encodeValues ? encodeURIComponent(value) : value;
        return `${key}=${encodedValue}`;
    })
        .join('&');
    // Only prefix if there's a value
    return queryString ? prefixWith + queryString : queryString;
}
export const APIIDPrefix = 'cbnode';
export function logInvalidOrderId(orderIdProperty, expectedOrderIdPrefix, params) {
    console.error(`'${orderIdProperty}' must be prefixed with ${expectedOrderIdPrefix}. Use the 'client.generateNewOrderId()' REST client utility method to generate a fresh order ID on demand. Original request: ${JSON.stringify(params)}`);
}
export function getRestBaseUrl(restClientOptions, restClientType) {
    const exchangeBaseUrls = {
        livenet: exchangeBaseURLMap[restClientType],
        testnet: exchangeSandboxURLMap[restClientType],
    };
    if (restClientOptions.baseUrl) {
        return restClientOptions.baseUrl;
    }
    if (restClientOptions.useSandbox === true) {
        return exchangeBaseUrls.testnet;
    }
    return exchangeBaseUrls.livenet;
}
/**
 * Extract and separate request parameters in query string from the rest of the endpoint, to prevent sign issues.
 *
 * @param url endpoint containing params in query string; "/v2/accounts/123123213?someParam=xyz"
 * @returns
 */
export function getParamsFromURL(url) {
    const [endpoint, paramsStr] = url.split('?');
    if (!paramsStr) {
        return {
            endpoint: url,
            params: {},
        };
    }
    const result = {
        endpoint: endpoint,
        params: {},
    };
    (paramsStr || '').split('&').forEach((param) => {
        const [key, value] = param.split('=');
        result.params[key] = value;
    });
    return result;
}
//# sourceMappingURL=requestUtils.js.map