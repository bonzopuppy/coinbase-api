import { AxiosRequestConfig } from 'axios';
import { BaseRestClient } from './lib/BaseRestClient.js';
import { RestClientOptions, RestClientType } from './lib/requestUtils.js';
import { CancelINTXOrdersRequest, GetINTXAggregatedCandlesData, GetINTXDailyTradingVolumes, GetINTXFillsByPortfoliosRequest, GetINTXIndexCandlesRequest, GetINTXIndexCompositionHistory, GetINTXMatchingTransfersRequest, GetINTXOpenOrdersRequest, GetINTXPortfolioFillsRequest, INTXWithdrawToCounterpartyIdRequest, INTXWithdrawToCryptoAddressRequest, SubmitINTXOrderRequest, TransferINTXFundsBetweenPortfoliosRequest, TransferINTXPositionsBetweenPortfoliosRequest, UpdateINTXOpenOrderRequest, UpdateINTXPortfolioParametersRequest } from './types/request/coinbase-international.js';
/**
 * REST client for Coinbase's Institutional International Exchange API:
 * https://docs.cdp.coinbase.com/intx/docs/welcome
 */
export declare class CBInternationalClient extends BaseRestClient {
    constructor(restClientOptions?: RestClientOptions, requestOptions?: AxiosRequestConfig);
    getClientType(): RestClientType;
    /**
     *
     * Assets Endpoints
     *
     */
    /**
     * List assets
     *
     * Returns a list of all supported assets.
     */
    getAssets(): Promise<any>;
    /**
     * Get asset details
     *
     * Retrieves information for a specific asset.
     */
    getAssetDetails(params: {
        asset: string;
    }): Promise<any>;
    /**
     * Get supported networks per asset
     *
     * Returns a list of supported networks and network information for a specific asset.
     */
    getSupportedNetworksPerAsset(params: {
        asset: string;
    }): Promise<any>;
    /**
     *
     * Index Endpoints
     *
     */
    /**
     * Get index composition
     *
     * Retrieves the latest index composition (metadata) with an ordered set of constituents.
     */
    getIndexComposition(params: {
        index: string;
    }): Promise<any>;
    /**
     * Get index composition history
     *
     * Retrieves a history of index composition records in a descending time order.
     * The results are an array of index composition data recorded at different "timestamps".
     */
    getIndexCompositionHistory(params: GetINTXIndexCompositionHistory): Promise<any>;
    /**
     * Get index price
     *
     * Retrieves the latest index price.
     */
    getIndexPrice(params: {
        index: string;
    }): Promise<any>;
    /**
     * Get index candles
     *
     * Retrieves the historical daily index prices in time descending order.
     * The daily values are represented as aggregated entries for the day in typical OHLC format.
     */
    getIndexCandles(params: GetINTXIndexCandlesRequest): Promise<any>;
    /**
     *
     * Instruments Endpoints
     *
     */
    /**
     * List instruments
     *
     * Returns all of the instruments available for trading.
     */
    getInstruments(): Promise<any>;
    /**
     * Get instrument details
     *
     * Retrieves market information for a specific instrument.
     */
    getInstrumentDetails(params: {
        instrument: string;
    }): Promise<any>;
    /**
     * Get quote per instrument
     *
     * Retrieves the current quote for a specific instrument.
     */
    getQuotePerInstrument(params: {
        instrument: string;
    }): Promise<any>;
    /**
     * Get daily trading volumes
     *
     * Retrieves the trading volumes for each instrument separated by day.
     */
    getDailyTradingVolumes(params: GetINTXDailyTradingVolumes): Promise<any>;
    /**
     * Get aggregated candles data per instrument
     *
     * Retrieves a list of aggregated candles data for a given instrument, granularity, and time range.
     */
    getAggregatedCandlesData(params: GetINTXAggregatedCandlesData): Promise<any>;
    /**
     * Get historical funding rates
     *
     * Retrieves the historical funding rates for a specific instrument.
     */
    getHistoricalFundingRates(params: {
        instrument: string;
        result_limit?: number;
        result_offset?: number;
    }): Promise<any>;
    /**
     *
     * Position Offsets Endpoints
     *
     */
    /**
     * List position offsets
     *
     * Returns all active position offsets.
     */
    getPositionOffsets(): Promise<any>;
    /**
     *
     * Orders Endpoints
     *
     */
    /**
     * Create order
     *
     * Creates a new order.
     */
    submitOrder(params: SubmitINTXOrderRequest): Promise<any>;
    /**
     * List open orders
     *
     * Returns a list of active orders resting on the order book matching the requested criteria.
     * Does not return any rejected, cancelled, or fully filled orders as they are not active.
     */
    getOpenOrders(params?: GetINTXOpenOrdersRequest): Promise<any>;
    /**
     * Cancel orders
     *
     * Cancels all orders matching the requested criteria.
     */
    cancelOrders(params: CancelINTXOrdersRequest): Promise<any>;
    /**
     * Modify open order
     *
     * Modifies an open order.
     */
    updateOpenOrder(params: UpdateINTXOpenOrderRequest): Promise<any>;
    /**
     * Get order details
     *
     * Retrieves a single order. The order retrieved can be either active or inactive.
     */
    getOrderDetails(params: {
        id: string;
        portfolio: string;
    }): Promise<any>;
    /**
     * Cancel order
     *
     * Cancels a single open order.
     */
    cancelOrder(params: {
        id: string;
        portfolio: string;
    }): Promise<any>;
    /**
     *
     * Portfolios Endpoints
     *
     */
    /**
     * List all user portfolios
     *
     * Returns all of the user's portfolios.
     */
    getUserPortfolios(): Promise<any>;
    /**
     * Create portfolio
     *
     * Create a new portfolio. Request will fail if no name is provided or if user already has max number of portfolios. Max number of portfolios is 20.
     */
    createPortfolio(params: {
        name: string;
    }): Promise<any>;
    /**
     * Patch portfolio
     *
     * Update parameters for existing portfolio.
     */
    updatePortfolioParameters(params: UpdateINTXPortfolioParametersRequest): Promise<any>;
    /**
     * Get user portfolio
     *
     * Returns the user's specified portfolio.
     */
    getUserPortfolio(params: {
        portfolio: string;
    }): Promise<any>;
    /**
     * Update portfolio
     *
     * Update existing user portfolio.
     */
    updatePortfolio(params: {
        portfolio: string;
        name: string;
    }): Promise<any>;
    /**
     * Get portfolio details
     *
     * Retrieves the summary, positions, and balances of a portfolio.
     */
    getPortfolioDetails(params: {
        portfolio: string;
    }): Promise<any>;
    /**
     * Get portfolio summary
     *
     * Retrieves the high level overview of a portfolio.
     */
    getPortfolioSummary(params: {
        portfolio: string;
    }): Promise<any>;
    /**
     * List portfolio balances
     *
     * Returns all of the balances for a given portfolio.
     */
    getPortfolioBalances(params: {
        portfolio: string;
    }): Promise<any>;
    /**
     * Get balance for portfolio/asset
     *
     * Retrieves the balance for a given portfolio and asset.
     */
    getBalanceForPortfolioAsset(params: {
        portfolio: string;
        asset: string;
    }): Promise<any>;
    /**
     * List active loans for the portfolio
     *
     * Retrieves all loan info for a given portfolio.
     */
    getActiveLoansForPortfolio(params: {
        portfolio: string;
    }): Promise<any>;
    /**
     * Get loan info for portfolio/asset
     *
     * Retrieves the loan info for a given portfolio and asset.
     */
    getLoanInfoForPortfolioAsset(params: {
        portfolio: string;
        asset: string;
    }): Promise<any>;
    /**
     * Acquire/repay loan
     *
     * Acquire or repay loan for a given portfolio and asset.
     */
    acquireOrRepayLoan(params: {
        portfolio: string;
        asset: string;
        amount: number;
        action: 'ACQUIRE' | 'REPAY';
    }): Promise<any>;
    /**
     * Preview loan update
     *
     * Preview acquire or repay loan for a given portfolio and asset.
     */
    previewLoanUpdate(params: {
        portfolio: string;
        asset: string;
        action: 'ACQUIRE' | 'REPAY';
        amount: string;
    }): Promise<any>;
    /**
     * View max loan availability
     *
     * View the maximum amount of loan that could be acquired now for a given portfolio and asset.
     */
    getMaxLoanAvailability(params: {
        portfolio: string;
        asset: string;
    }): Promise<any>;
    /**
     * List portfolio positions
     *
     * Returns all of the positions for a given portfolio.
     */
    getPortfolioPositions(params: {
        portfolio: string;
    }): Promise<any>;
    /**
     * Get position for portfolio/instrument
     *
     * Retrieves the position for a given portfolio and symbol.
     */
    getPositionForPortfolioInstrument(params: {
        portfolio: string;
        instrument: string;
    }): Promise<any>;
    /**
     * List fills by portfolios
     *
     * Returns fills for specified portfolios or fills for all portfolios if none are provided.
     */
    getFillsByPortfolios(params?: GetINTXFillsByPortfoliosRequest): Promise<any>;
    /**
     * List portfolio fills
     *
     * Returns all of the fills for a given portfolio.
     */
    getPortfolioFills(params: GetINTXPortfolioFillsRequest): Promise<any>;
    /**
     * Enable/Disable portfolio cross collateral
     *
     * Enable or disable the cross collateral feature for the portfolio, which allows the portfolio to use non-USDC assets as collateral for margin trading.
     */
    setCrossCollateral(params: {
        portfolio: string;
        enabled: boolean;
    }): Promise<any>;
    /**
     * Enable/Disable portfolio auto margin mode
     *
     * Enable or disable the auto margin feature, which lets the portfolio automatically
     * post margin amounts required to exceed the high leverage position restrictions.
     */
    setAutoMargin(params: {
        portfolio: string;
        enabled: boolean;
    }): Promise<any>;
    /**
     * Set portfolio margin override
     *
     * Specify the margin override value for a portfolio to either increase notional requirements or opt-in to higher leverage.
     */
    setPortfolioMarginOverride(params: {
        portfolio_id: string;
        margin_override: string;
    }): Promise<any>;
    /**
     * Transfer funds between portfolios
     *
     * Transfer assets from one portfolio to another.
     */
    transferFundsBetweenPortfolios(params: TransferINTXFundsBetweenPortfoliosRequest): Promise<any>;
    /**
     * Transfer positions between portfolios
     *
     * Transfer an existing position from one portfolio to another. The position transfer must fulfill the same portfolio-level margin requirements as submitting a new order on the opposite side for the sender's portfolio and a new order on the same side for the recipient's portfolio.
     * Additionally, organization-level requirements must be satisfied when evaluating the outcome of the position transfer.
     */
    transferPositionsBetweenPortfolios(params: TransferINTXPositionsBetweenPortfoliosRequest): Promise<any>;
    /**
     * List portfolio fee rates
     *
     * Retrieves the Perpetual Future and Spot fee rate tiers for the user.
     */
    getPortfolioFeeRates(): Promise<any>;
    /**
     *
     * Rankings Endpoints
     *
     */
    /**
     * Get your rankings
     *
     * Retrieve your volume rankings for maker, taker, and total volume.
     */
    getRankings(params: {
        instrument_type: string;
        period?: string;
        instruments?: string;
    }): Promise<any>;
    /**
     *
     * Transfers Endpoints
     *
     */
    /**
     * List matching transfers
     *
     * List matching transfers.
     */
    getMatchingTransfers(params?: GetINTXMatchingTransfersRequest): Promise<any>;
    /**
     * Get transfer
     *
     * Get transfer.
     */
    getTransfer(params: {
        transfer_uuid: string;
    }): Promise<any>;
    /**
     * Withdraw to crypto address
     *
     * Withdraw to crypto address.
     */
    withdrawToCryptoAddress(params: INTXWithdrawToCryptoAddressRequest): Promise<any>;
    /**
     * Create crypto address
     *
     * Create crypto address.
     */
    createCryptoAddress(params: {
        portfolio: string;
        asset: string;
        network_arn_id: string;
    }): Promise<any>;
    /**
     * Create counterparty Id
     *
     * Create counterparty Id.
     */
    createCounterpartyId(params: {
        portfolio: string;
    }): Promise<any>;
    /**
     * Validate counterparty Id
     *
     * Validate counterparty Id.
     */
    validateCounterpartyId(params: {
        counterparty_id: string;
    }): Promise<any>;
    /**
     * Withdraw to counterparty Id
     *
     * Withdraw to counterparty Id.
     */
    withdrawToCounterpartyId(params: INTXWithdrawToCounterpartyIdRequest): Promise<any>;
    /**
     *
     * Fee Rates Endpoints
     *
     */
    /**
     * List fee rate tiers
     *
     * Return all the fee rate tiers.
     */
    getFeeRateTiers(): Promise<any>;
}
