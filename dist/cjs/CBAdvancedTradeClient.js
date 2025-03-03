"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CBAdvancedTradeClient = void 0;
const BaseRestClient_js_1 = require("./lib/BaseRestClient.js");
const requestUtils_js_1 = require("./lib/requestUtils.js");
/**
 * REST client for Coinbase's Advanced Trade API:
 * https://docs.cdp.coinbase.com/advanced-trade/docs/api-overview/
 */
class CBAdvancedTradeClient extends BaseRestClient_js_1.BaseRestClient {
    constructor(restClientOptions = {}, requestOptions = {}) {
        super(restClientOptions, requestOptions);
        return this;
    }
    /**
     *
     * Custom SDK functions
     *
     */
    /**
     * This method is used to get the latency and time sync between the client and the server.
     * This is not official API endpoint and is only used for internal testing purposes.
     * Use this method to check the latency and time sync between the client and the server.
     * Final values might vary slightly, but it should be within few ms difference.
     * If you have any suggestions or improvements to this measurement, please create an issue or pull request on GitHub.
     */
    async fetchLatencySummary() {
        const clientTimeReqStart = Date.now();
        const serverTime = await this.getServerTime();
        const clientTimeReqEnd = Date.now();
        console.log('serverTime', serverTime);
        const serverTimeMs = Number(serverTime.epochMillis);
        const roundTripTime = clientTimeReqEnd - clientTimeReqStart;
        const estimatedOneWayLatency = Math.floor(roundTripTime / 2);
        // Adjust server time by adding estimated one-way latency
        const adjustedServerTime = serverTimeMs + estimatedOneWayLatency;
        // Calculate time difference between adjusted server time and local time
        const timeDifference = adjustedServerTime - clientTimeReqEnd;
        const result = {
            localTime: clientTimeReqEnd,
            serverTime: serverTimeMs,
            roundTripTime,
            estimatedOneWayLatency,
            adjustedServerTime,
            timeDifference,
        };
        console.log('Time synchronization results:');
        console.log(result);
        console.log(`Your approximate latency to exchange server: 
      One way: ${estimatedOneWayLatency}ms.
      Round trip: ${roundTripTime}ms.
      `);
        if (timeDifference > 500) {
            console.warn(`WARNING! Time difference between server and client clock is greater than 500ms. It is currently ${timeDifference}ms.
        Consider adjusting your system clock to avoid unwanted clock sync errors!
        Visit https://github.com/tiagosiebler/awesome-crypto-examples/wiki/Timestamp-for-this-request-is-outside-of-the-recvWindow for more information`);
        }
        else {
            console.log(`Time difference between server and client clock is within acceptable range of 500ms. It is currently ${timeDifference}ms.`);
        }
        return result;
    }
    getClientType() {
        return requestUtils_js_1.REST_CLIENT_TYPE_ENUM.advancedTrade;
    }
    /**
     *
     * Account Endpoints
     *
     */
    /**
     * List Accounts
     *
     * Get a list of authenticated accounts for the current user.
     */
    getAccounts(params) {
        return this.getPrivate(`/api/v3/brokerage/accounts`, params);
    }
    /**
     * Get Account
     *
     * Get a list of information about single account, given an account UUID.
     * Tip: Use List Accounts (getAccounts funcion) to find account UUIDs.
     */
    getAccount(params) {
        return this.getPrivate(`/api/v3/brokerage/accounts/${params.account_id}`);
    }
    /**
     *
     * Products Endpoints
     *
     */
    /**
     * Get Best Bid/Ask
     *
     * Get the best bid/ask for all products. A subset of all products can be returned instead by using the product_ids input.
     */
    getBestBidAsk(params) {
        return this.getPrivate(`/api/v3/brokerage/best_bid_ask`, params);
    }
    /**
     * Get Product Book
     *
     * Get a list of bids/asks for a single product. The amount of detail shown can be customized with the limit parameter.
     */
    getProductBook(params) {
        return this.getPrivate(`/api/v3/brokerage/product_book`, params);
    }
    /**
     * List Products
     *
     * Get a list of the available currency pairs for trading.
     *
     */
    getProducts(params) {
        return this.getPrivate(`/api/v3/brokerage/products`, params);
    }
    /**
     * Get Product
     *
     * Get information on a single product by product ID.
     */
    getProduct(params) {
        const { product_id, ...queryParams } = params;
        return this.getPrivate(`/api/v3/brokerage/products/${product_id}`, queryParams);
    }
    /**
     * Get Product Candles
     *
     * Get rates for a single product by product ID, grouped in buckets.
     */
    getProductCandles(params) {
        const { product_id, ...queryParams } = params;
        return this.getPrivate(`/api/v3/brokerage/products/${product_id}/candles`, queryParams);
    }
    /**
     * Get Market Trades
     *
     * Get snapshot information by product ID about the last trades (ticks) and best bid/ask.
     */
    getMarketTrades(params) {
        const { product_id, ...queryParams } = params;
        return this.getPrivate(`/api/v3/brokerage/products/${product_id}/ticker`, queryParams);
    }
    /**
     *
     * Orders Endpoints
     *
     */
    /**
     * Create Order
     *
     * Create an order with a specified product_id (asset-pair), side (buy/sell), etc.
     *
     */
    submitOrder(params) {
        this.validateOrderId(params, 'client_order_id');
        return this.postPrivate(`/api/v3/brokerage/orders`, {
            body: params,
        });
    }
    /**
     * Cancel Orders
     *
     * Initiate cancel requests for one or more orders.
     * The maximum number of order_ids that can be cancelled per request is 100.
     * This number may be subject to change in emergency, but if a request exceeds the max,
     * then an InvalidArgument error code will be returned with an error message denoting the limit.
     */
    cancelOrders(params) {
        return this.postPrivate(`/api/v3/brokerage/orders/batch_cancel`, {
            body: params,
        });
    }
    /**
     * Edit Order
     *
     * Edit an order with a specified new size, or new price.
     *
     * - Your request moves to the back of the queue if you increase the size or increase or decrease the price.
     * - If you decrease the size, you keep your place in line.
     * - A client can only send an Edit Order request after the previous request for the same order has been fully processed.
     */
    updateOrder(params) {
        return this.postPrivate(`/api/v3/brokerage/orders/edit`, {
            body: params,
        });
    }
    /**
     * Edit Order Preview
     *
     * Preview an edit order request with a specified new size, or new price.
     *
     */
    updateOrderPreview(params) {
        return this.postPrivate(`/api/v3/brokerage/orders/edit_preview`, {
            body: params,
        });
    }
    /**
     * List Orders
     *
     * Get a list of orders filtered by optional query parameters.
     *
     * - The maximum number of OPEN orders returned is 1000.
     * - The parameters start_date and end_date don't apply to open orders.
     * - You cannot pair open orders with other order types.
     * - You cannot query for OPEN orders with other order types.
     */
    getOrders(params) {
        return this.getPrivate(`/api/v3/brokerage/orders/historical/batch`, params);
    }
    /**
     * List Fills
     *
     * Get a list of fills filtered by optional query parameters (product_id, order_id, etc).
     *
     */
    getFills(params) {
        return this.getPrivate(`/api/v3/brokerage/orders/historical/fills`, params);
    }
    /**
     * Get Order
     *
     * Get a single order by order ID.
     */
    getOrder(params) {
        const { order_id, ...queryParams } = params;
        return this.getPrivate(`/api/v3/brokerage/orders/historical/${order_id}`, queryParams);
    }
    /**
     * Preview Order
     *
     * Preview an order.
     *
     */
    previewOrder(params) {
        return this.postPrivate(`/api/v3/brokerage/orders/preview`, {
            body: params,
        });
    }
    /**
     * Close Position
     *
     * Places an order to close any open positions for a specified product_id.
     *
     */
    closePosition(params) {
        this.validateOrderId(params, 'client_order_id');
        return this.postPrivate(`/api/v3/brokerage/orders/close_position`, {
            body: params,
        });
    }
    /**
     *
     * Portfolios Endpoints
     *
     */
    /**
     * List Portfolios
     *
     * Get all portfolios of a user.
     */
    getPortfolios(params) {
        return this.getPrivate(`/api/v3/brokerage/portfolios`, params);
    }
    /**
     * Create Portfolio
     *
     * Create a portfolio.
     */
    createPortfolio(params) {
        return this.postPrivate(`/api/v3/brokerage/portfolios`, {
            body: params,
        });
    }
    /**
     * Move Portfolio Funds
     *
     * Move funds between portfolios.
     */
    movePortfolioFunds(params) {
        return this.postPrivate(`/api/v3/brokerage/portfolios/move_funds`, {
            body: params,
        });
    }
    /**
     * Get Portfolio Breakdown
     *
     * Get the breakdown of a portfolio.
     */
    getPortfolioBreakdown(params) {
        const { portfolio_uuid, ...queryParams } = params;
        return this.getPrivate(`/api/v3/brokerage/portfolios/${portfolio_uuid}`, queryParams);
    }
    /**
     * Delete Portfolio
     *
     * Delete a portfolio.
     */
    deletePortfolio(params) {
        const { portfolio_uuid } = params;
        return this.deletePrivate(`/api/v3/brokerage/portfolios/${portfolio_uuid}`);
    }
    /**
     * Edit Portfolio
     *
     * Edit a portfolio.
     *
     */
    updatePortfolio(params) {
        const { portfolio_uuid, ...bodyParams } = params;
        return this.putPrivate(`/api/v3/brokerage/portfolios/${portfolio_uuid}`, {
            body: bodyParams,
        });
    }
    /**
     *
     * Futures Endpoints
     *
     */
    /**
     * Get Futures Balance Summary
     *
     * Get a summary of balances for CFM trading.
     *
     * Futures vs Spot Accounts:
     * - Futures and spot balances are held in different accounts.
     * - Cash is always deposited into your Coinbase Inc. (CBI) spot account.
     * - Cash is automatically transferred to your Coinbase Financial Markets (CFM) futures account to satisfy margin requirements.
     * - You can transfer cash that isn't being used to margin or maintain futures positions into your CBI spot account.
     * - Funds held in a CBI spot account do not receive the preferential treatment given to funds held in a regulated futures account.
     *
     * Intraday vs. Overnight Margin Health:
     * - If you are opted in to receive increased leverage on futures trades during the intraday window (from 8am-4pm ET), this endpoint will return your intraday and overnight margin health.
     */
    getFuturesBalanceSummary() {
        return this.getPrivate(`/api/v3/brokerage/cfm/balance_summary`);
    }
    /**
     * Get Intraday Margin Setting
     *
     * Get the futures intraday margin setting.
     */
    getIntradayMarginSetting() {
        return this.getPrivate(`/api/v3/brokerage/cfm/intraday/margin_setting`);
    }
    /**
     * Set Intraday Margin Setting
     *
     * Set the futures intraday margin setting.
     */
    setIntradayMarginSetting(params) {
        return this.postPrivate(`/api/v3/brokerage/cfm/intraday/margin_setting`, {
            body: params,
        });
    }
    /**
     * Get Current Margin Window
     *
     * Get the futures current margin window.
     */
    getCurrentMarginWindow(params) {
        return this.getPrivate(`/api/v3/brokerage/cfm/intraday/current_margin_window`, params);
    }
    /**
     * List Futures Positions
     *
     * Get a list of positions in CFM products.
     */
    getFuturesPositions() {
        return this.getPrivate(`/api/v3/brokerage/cfm/positions`);
    }
    /**
     * Get Futures Position
     *
     * Get positions for a specific CFM product.
     */
    getFuturesPosition(params) {
        const { product_id } = params;
        return this.getPrivate(`/api/v3/brokerage/cfm/positions/${product_id}`);
    }
    /**
     * Schedule Futures Sweep
     *
     * Schedules a sweep of funds from FCM wallet to USD Spot wallet.
     *
     * Futures Sweep Processing:
     * - Sweep requests submitted before 5PM ET each day are processed the following business day.
     * - Sweep requests submitted after 5PM ET each day are processed in 2 business days.
     * - You can have at most one pending sweep request at a time.
     *
     * Market movements related to your open positions may impact the final amount that is transferred into your spot account.
     * The final funds transferred, up to your specified amount, depend on the available excess in your futures account.
     */
    scheduleFuturesSweep(params) {
        return this.postPrivate(`/api/v3/brokerage/cfm/sweeps/schedule`, {
            body: params,
        });
    }
    /**
     * List Futures Sweeps
     *
     * Get pending and processing sweeps of funds from FCM wallet to USD Spot wallet.
     *
     * Pending vs. Processing Sweeps:
     * - A pending sweep is a sweep that has not started processing and can be cancelled.
     * - A processing sweep is a sweep that is currently being processed and cannot be cancelled.
     * - Once a sweep is complete, it no longer appears in the list of sweeps.
     */
    getFuturesSweeps() {
        return this.getPrivate(`/api/v3/brokerage/cfm/sweeps`);
    }
    /**
     * Cancel Pending Futures Sweep
     *
     * Cancel the pending sweep of funds from FCM wallet to USD Spot wallet.
     */
    cancelPendingFuturesSweep() {
        return this.deletePrivate(`/api/v3/brokerage/cfm/sweeps`);
    }
    /**
     *
     * Perpetuals Endpoints
     *
     */
    /**
     * Allocate Portfolio
     *
     * Allocate portfolio funds to a sub-portfolio on Intx Portfolio.
     *
     */
    allocatePortfolio(params) {
        return this.postPrivate(`/api/v3/brokerage/intx/allocate`, {
            body: params,
        });
    }
    /**
     * Get Perpetuals Portfolio Summary
     *
     * Get a summary of your Perpetuals portfolio.
     */
    getPerpetualsPortfolioSummary(params) {
        const { portfolio_uuid } = params;
        return this.getPrivate(`/api/v3/brokerage/intx/portfolio/${portfolio_uuid}`);
    }
    /**
     * List Perpetuals Positions
     *
     * Get a list of open positions in your Perpetuals portfolio.
     */
    getPerpetualsPositions(params) {
        const { portfolio_uuid } = params;
        return this.getPrivate(`/api/v3/brokerage/intx/positions/${portfolio_uuid}`);
    }
    /**
     * Get Perpetuals Position
     *
     * Get a specific open position on Intx.
     *
     */
    getPerpetualsPosition(params) {
        const { portfolio_uuid, symbol } = params;
        return this.getPrivate(`/api/v3/brokerage/intx/positions/${portfolio_uuid}/${symbol}`);
    }
    /**
     * Get Portfolios Balances
     *
     * Get a list of asset balances on Intx for a given Portfolio.
     */
    getPortfoliosBalances(params) {
        const { portfolio_uuid } = params;
        return this.getPrivate(`/api/v3/brokerage/intx/balances/${portfolio_uuid}`);
    }
    /**
     * Opt In or Out of Multi Asset Collateral
     *
     * Enable or Disable Multi Asset Collateral for a given Portfolio.
     */
    updateMultiAssetCollateral(params) {
        return this.postPrivate(`/api/v3/brokerage/intx/multi_asset_collateral`, {
            body: params,
        });
    }
    /**
     *
     * Fees Endpoints
     *
     */
    /**
     * Get Transaction Summary
     *
     * Get a summary of transactions with fee tiers, total volume, and fees.
     */
    getTransactionSummary(params) {
        return this.getPrivate(`/api/v3/brokerage/transaction_summary`, params);
    }
    /**
     *
     * Converts Endpoints
     *
     */
    /**
     * Create Convert Quote
     *
     * Create a convert quote with a specified source account, target account, and amount.
     * Convert is applicable for USDC-USD and EURC-EUR conversion.
     */
    submitConvertQuote(params) {
        return this.postPrivate(`/api/v3/brokerage/convert/quote`, {
            body: params,
        });
    }
    /**
     * Get Convert Trade
     *
     * Gets a list of information about a convert trade with a specified trade id, source account, and target account.
     */
    getConvertTrade(params) {
        const { trade_id, ...queryParams } = params;
        return this.getPrivate(`/api/v3/brokerage/convert/trade/${trade_id}`, queryParams);
    }
    /**
     * Commit Convert Trade
     *
     * Commits a convert trade with a specified trade id, source account, and target account.
     */
    commitConvertTrade(params) {
        const { trade_id, ...bodyParams } = params;
        return this.postPrivate(`/api/v3/brokerage/convert/trade/${trade_id}`, {
            body: bodyParams,
        });
    }
    /**
     *
     * Public Endpoints
     *
     */
    getServerTime() {
        return this.get(`/api/v3/brokerage/time`);
    }
    /**
     * Get Public Product Book
     *
     * Get a list of bids/asks for a single product. The amount of detail shown can be customized with the limit parameter.
     */
    getPublicProductBook(params) {
        return this.get(`/api/v3/brokerage/market/product_book`, params);
    }
    /**
     * List Public Products
     *
     * Get a list of the available currency pairs for trading.
     */
    getPublicProducts(params) {
        return this.get(`/api/v3/brokerage/market/products`, params);
    }
    /**
     * Get Public Product
     *
     * Get information on a single product by product ID.
     */
    getPublicProduct(params) {
        const { product_id } = params;
        return this.get(`/api/v3/brokerage/market/products/${product_id}`);
    }
    /**
     * Get Public Product Candles
     *
     * Get rates for a single product by product ID, grouped in buckets.
     */
    getPublicProductCandles(params) {
        const { product_id, ...queryParams } = params;
        return this.get(`/api/v3/brokerage/market/products/${product_id}/candles`, queryParams);
    }
    /**
     * Get Public Market Trades
     *
     * Get snapshot information by product ID about the last trades (ticks) and best bid/ask.
     */
    getPublicMarketTrades(params) {
        const { product_id, ...queryParams } = params;
        return this.get(`/api/v3/brokerage/market/products/${product_id}/ticker`, queryParams);
    }
    /**
     *
     * Payment Methods Endpoints
     *
     */
    /**
     * List Payment Methods
     *
     * Get a list of payment methods for the current user.
     */
    getPaymentMethods() {
        return this.getPrivate(`/api/v3/brokerage/payment_methods`);
    }
    /**
     * Get Payment Method
     *
     * Get information about a payment method for the current user.
     */
    getPaymentMethod(params) {
        const { payment_method_id } = params;
        return this.getPrivate(`/api/v3/brokerage/payment_methods/${payment_method_id}`);
    }
    /**
     *
     * Data API Endpoints
     *
     */
    /**
     * Get API Key Permissions
     *
     * Get information about your CDP API key permissions.
     */
    getApiKeyPermissions() {
        return this.getPrivate(`/api/v3/brokerage/key_permissions`);
    }
}
exports.CBAdvancedTradeClient = CBAdvancedTradeClient;
//# sourceMappingURL=CBAdvancedTradeClient.js.map