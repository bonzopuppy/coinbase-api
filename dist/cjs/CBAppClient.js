"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CBAppClient = void 0;
const BaseRestClient_js_1 = require("./lib/BaseRestClient.js");
const requestUtils_js_1 = require("./lib/requestUtils.js");
/**
 * REST client for Coinbase's Coinbase App API:
 * https://docs.cdp.coinbase.com/coinbase-app/docs/welcome
 */
class CBAppClient extends BaseRestClient_js_1.BaseRestClient {
    constructor(restClientOptions = {}, requestOptions = {}) {
        super(restClientOptions, {
            ...requestOptions,
            headers: {
                // Some endpoints return a warning if a version header isn't included: https://docs.cdp.coinbase.com/coinbase-app/docs/versioning
                // Currently set to a date from the changelog: https://docs.cdp.coinbase.com/coinbase-app/docs/changelog
                'CB-VERSION': '2025-FEB-3',
                ...requestOptions.headers,
            },
        });
        return this;
    }
    getClientType() {
        return requestUtils_js_1.REST_CLIENT_TYPE_ENUM.coinbaseApp;
    }
    /**
     *
     * Account Endpoints
     *
     */
    /**
     * List Accounts
     *
     * List a current user's accounts to which the authentication method has access to.
     *
     * This endpoint is paginated. In case you are calling it first time, leave paginationURL empty.
     * If you are paginating, provide the paginationURL value from the previous response and you will receive the next page of accounts.
     */
    getAccounts(params) {
        if (params?.paginationURL) {
            const derivedParams = (0, requestUtils_js_1.getParamsFromURL)(params.paginationURL);
            return this.getPrivate(derivedParams.endpoint, derivedParams.params);
        }
        return this.getPrivate('/v2/accounts', params);
    }
    /**
     * Show Account
     *
     * Get a current user's account by account ID or currency string.
     */
    getAccount(params) {
        return this.getPrivate(`/v2/accounts/${params.account_id}`);
    }
    /**
     *
     * Address Endpoints
     *
     */
    /**
     * Create Address
     *
     * Creates a new address for an account. Addresses can be created for wallet account types.
     */
    createAddress(params) {
        return this.postPrivate(`/v2/accounts/${params.account_id}/addresses`, {
            body: params,
        });
    }
    /**
     * List Addresses
     *
     * Lists addresses for an account.
     *
     * This endpoint is paginated. In case you are calling it first time, leave paginationURL empty.
     * If you are paginating, provide the paginationURL value from the previous response and you will receive the next page of addresses.
     */
    getAddresses(params) {
        const { account_id, ...otherParams } = params;
        if (params?.paginationURL) {
            const derivedParams = (0, requestUtils_js_1.getParamsFromURL)(params.paginationURL);
            return this.getPrivate(derivedParams.endpoint, {
                ...otherParams,
                ...derivedParams.params,
            });
        }
        return this.getPrivate(`/v2/accounts/${account_id}/addresses`, otherParams);
    }
    /**
     * Show Address
     *
     * Get an single address for an account.
     * A regular cryptocurrency address can be used in place of address_id but the address must be associated with the correct account.
     *
     * !! An address can only be associated with one account. See Create Address to create new addresses.
     */
    getAddress(params) {
        return this.getPrivate(`/v2/accounts/${params.account_id}/addresses/${params.addressId}`);
    }
    /**
     * List Address Transactions
     *
     * List transactions that have been sent to a specific address.
     * A regular cryptocurrency address can be used in place of address_id but the address must be associated with the correct account.
     *
     * This endpoint is paginated. In case you are calling it first time, leave paginationURL empty.
     * If you are paginating, provide the paginationURL value from the previous response and you will receive the next page of transactions.
     */
    getAddressTransactions(params) {
        const { account_id, addressId, ...otherParams } = params;
        if (params?.paginationURL) {
            const derivedParams = (0, requestUtils_js_1.getParamsFromURL)(params.paginationURL);
            return this.getPrivate(derivedParams.endpoint, {
                ...otherParams,
                ...derivedParams.params,
            });
        }
        return this.getPrivate(`/v2/accounts/${account_id}/addresses/${addressId}/transactions`, otherParams);
    }
    /**
     *
     * Transactions Endpoints
     *
     */
    /**
     * Send Money
     *
     * Send funds to a network address for any Coinbase supported asset, or email address of the recipient.
     * No transaction fees are required for off-blockchain cryptocurrency transactions.
     */
    sendMoney(params) {
        const { account_id, ...restParams } = params;
        return this.postPrivate(`/v2/accounts/${account_id}/transactions`, {
            body: restParams,
        });
    }
    /**
     * Transfer Money
     *
     * Transfer any Coinbase supported digital asset between two of a single user's accounts.
     * Accounts must support the same currency for transfers to be successful.
     */
    transferMoney(params) {
        const { account_id, ...restParams } = params;
        return this.postPrivate(`/v2/accounts/${account_id}/transactions`, {
            body: restParams,
        });
    }
    /**
     * List Transactions
     *
     * Lists the transactions of an account by account ID.
     *
     * This endpoint is paginated. In case you are calling it first time, leave paginationURL empty.
     * If you are paginating, provide the paginationURL value from the previous response and you will receive the next page of transactions.
     */
    getTransactions(params) {
        const { account_id, ...otherParams } = params;
        if (params?.paginationURL) {
            const derivedParams = (0, requestUtils_js_1.getParamsFromURL)(params.paginationURL);
            return this.getPrivate(derivedParams.endpoint, {
                ...otherParams,
                ...derivedParams.params,
            });
        }
        return this.getPrivate(`/v2/accounts/${account_id}/transactions`, otherParams);
    }
    /**
     * Show Transaction
     *
     * Get a single transaction for an account.
     */
    getTransaction(params) {
        return this.getPrivate(`/v2/accounts/${params.account_id}/transactions/${params.transactionId}`);
    }
    /**
     *
     * Deposits Endpoints
     *
     */
    /**
     * Deposit Funds
     *
     * Deposits user-defined amount of funds to a fiat account.
     */
    depositFunds(params) {
        const { account_id, ...restParams } = params;
        return this.postPrivate(`/v2/accounts/${account_id}/deposits`, {
            body: restParams,
        });
    }
    /**
     * Commit Deposit
     *
     * Completes a deposit that is created in commit: false state.
     */
    commitDeposit(params) {
        return this.postPrivate(`/v2/accounts/${params.account_id}/deposits/${params.deposit_id}/commit`);
    }
    /**
     * List Deposits
     *
     * Lists fiat deposits for an account.
     *
     * This endpoint is paginated. In case you are calling it first time, leave paginationURL empty.
     * If you are paginating, provide the paginationURL value from the previous response and you will receive the next page of deposits.
     */
    getDeposits(params) {
        const { account_id, ...otherParams } = params;
        if (params?.paginationURL) {
            const derivedParams = (0, requestUtils_js_1.getParamsFromURL)(params.paginationURL);
            return this.getPrivate(derivedParams.endpoint, {
                ...otherParams,
                ...derivedParams.params,
            });
        }
        return this.getPrivate(`/v2/accounts/${account_id}/deposits`, otherParams);
    }
    /**
     * Show Deposit
     *
     * Get one deposit by deposit Id.
     */
    getDeposit(params) {
        return this.getPrivate(`/v2/accounts/${params.account_id}/deposits/${params.deposit_id}`);
    }
    /**
     *
     * Withdrawals Endpoints
     *
     */
    /**
     * Withdraw Funds
     *
     * Withdraws a user-defined amount of funds from a fiat account.
     */
    withdrawFunds(params) {
        const { account_id, ...restParams } = params;
        return this.postPrivate(`/v2/accounts/${account_id}/withdrawals`, {
            body: restParams,
        });
    }
    /**
     * Commit Withdrawal
     *
     * Completes a withdrawal that is created in commit: false state.
     */
    commitWithdrawal(params) {
        return this.postPrivate(`/v2/accounts/${params.account_id}/withdrawals/${params.withdrawal_id}/commit`);
    }
    /**
     * List Withdrawals
     *
     * Lists withdrawals for an account.
     *
     * This endpoint is paginated. In case you are calling it first time, leave paginationURL empty.
     * If you are paginating, provide the paginationURL value from the previous response and you will receive the next page of withdrawals.
     */
    getWithdrawals(params) {
        const { account_id, ...otherParams } = params;
        if (params?.paginationURL) {
            const derivedParams = (0, requestUtils_js_1.getParamsFromURL)(params.paginationURL);
            return this.getPrivate(derivedParams.endpoint, {
                ...otherParams,
                ...derivedParams.params,
            });
        }
        return this.getPrivate(`/v2/accounts/${account_id}/withdrawals`, otherParams);
    }
    /**
     * Show Withdrawal
     *
     * Get a single withdrawal.
     */
    getWithdrawal(params) {
        return this.getPrivate(`/v2/accounts/${params.account_id}/withdrawals/${params.withdrawal_id}`);
    }
    /**
     *
     * DATA - Currencies Endpoints
     *
     */
    /**
     * Get Fiat Currencies
     *
     * Lists known fiat currencies. Currency codes conform to the ISO 4217 standard where possible.
     * Currencies with no representation in ISO 4217 may use a custom code.
     */
    getFiatCurrencies() {
        return this.get('/v2/currencies');
    }
    /**
     * Get Cryptocurrencies
     *
     * Lists known cryptocurrencies.
     */
    getCryptocurrencies() {
        return this.get('/v2/currencies/crypto');
    }
    /**
     *
     * DATA- Exchange rates Endpoints
     *
     */
    /**
     * Get Exchange Rates
     *
     * Get current exchange rates. Default base currency is USD but it can be defined as any supported currency.
     * Returned rates will define the exchange rate for one unit of the base currency.
     */
    getExchangeRates(params) {
        return this.get(`/v2/exchange-rates`, params);
    }
    /**
     *
     * DATA - Prices Endpoints
     *
     */
    /**
     * Get Buy Price
     *
     * Get the total price to buy one bitcoin or ether.
     * This endpoint doesn't require authentication.
     */
    getBuyPrice(params) {
        return this.get(`/v2/prices/${params.currencyPair}/buy`);
    }
    /**
     * Get Sell Price
     *
     * Get the total price to sell one bitcoin or ether.
     * This endpoint doesn't require authentication.
     */
    getSellPrice(params) {
        return this.get(`/v2/prices/${params.currencyPair}/sell`);
    }
    /**
     * Get Spot Price
     *
     * Get the current market price for bitcoin. This is usually somewhere in between the buy and sell price.
     * This endpoint doesn't require authentication.
     */
    getSpotPrice(params) {
        const { currencyPair, ...query } = params;
        return this.get(`/v2/prices/${currencyPair}/spot`, query);
    }
    /**
     *
     * DATA - Time Endpoints
     *
     */
    /**
     * Get Current Time
     *
     * Get the API server time.
     * This endpoint doesn't require authentication.
     */
    getCurrentTime() {
        return this.get('/v2/time');
    }
}
exports.CBAppClient = CBAppClient;
//# sourceMappingURL=CBAppClient.js.map