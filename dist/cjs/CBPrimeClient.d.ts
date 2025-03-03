import { AxiosRequestConfig } from 'axios';
import { BaseRestClient } from './lib/BaseRestClient.js';
import { RestClientOptions, RestClientType } from './lib/requestUtils.js';
import { CreatePrimeAddressBookEntryRequest, CreatePrimeConversionRequest, CreatePrimePortfolioAllocationsRequest, CreatePrimePortfolioNetAllocationsRequest, CreatePrimeTransferRequest, CreatePrimeWalletRequest, CreatePrimeWithdrawalRequest, GetPrimeActivitiesRequest, GetPrimeAddressBookRequest, GetPrimeInvoicesRequest, GetPrimeOpenOrdersRequest, GetPrimeOrderFillsRequest, GetPrimeOrderPreviewRequest, GetPrimePortfolioAllocationsRequest, GetPrimePortfolioFillsRequest, GetPrimePortfolioOrdersRequest, GetPrimePortfolioProductsRequest, GetPrimePortfolioTransactionsRequest, GetPrimePortfolioUsersRequest, GetPrimePortfolioWalletsRequest, GetPrimeUsersRequest, GetPrimeWalletDepositInstructionsRequest, GetPrimeWalletTransactionsRequest, GetPrimeWeb3WalletBalancesRequest, SubmitPrimeOrderRequest } from './types/request/coinbase-prime.js';
/**
 * REST client for Coinbase Prime API:
 * https://docs.cdp.coinbase.com/prime/docs/welcome
 */
export declare class CBPrimeClient extends BaseRestClient {
    constructor(restClientOptions?: RestClientOptions, requestOptions?: AxiosRequestConfig);
    getClientType(): RestClientType;
    /**
     *
     * Allocation Endpoints
     *
     */
    /**
     * Create Portfolio Allocations
     *
     * Create allocation for a given portfolio.
     */
    createPortfolioAllocations(params: CreatePrimePortfolioAllocationsRequest): Promise<any>;
    /**
     * Create Portfolio Net Allocations
     *
     * Create net allocation for a given portfolio.
     */
    createPortfolioNetAllocations(params: CreatePrimePortfolioNetAllocationsRequest): Promise<any>;
    /**
     * List Portfolio Allocations
     *
     * Retrieve historical allocations for a given portfolio.
     */
    getPortfolioAllocations(params: GetPrimePortfolioAllocationsRequest): Promise<any>;
    /**
     * Get Allocation By ID
     *
     * Retrieve an allocation by allocation ID.
     */
    getAllocationById(params: {
        portfolio_id: string;
        allocation_id: string;
    }): Promise<any>;
    /**
     * Get Net Allocations By Netting ID
     *
     * Retrieve an allocation by netting ID.
     */
    getNetAllocationsByNettingId(params: {
        portfolio_id: string;
        netting_id: string;
    }): Promise<any>;
    /**
     *
     * Invoice Endpoints
     *
     */
    /**
     * List Invoices
     *
     * Retrieve a list of invoices belonging to an entity.
     */
    getInvoices(params: GetPrimeInvoicesRequest): Promise<any>;
    /**
     *
     * Assets Endpoints
     *
     */
    /**
     * List Assets
     *
     * List all assets available for a given entity.
     */
    getAssets(params: {
        entity_id: string;
    }): Promise<any>;
    /**
     *
     * Payment Methods Endpoints
     *
     */
    /**
     * List Entity Payment Methods
     *
     * Retrieve all payment methods for a given entity.
     */
    getEntityPaymentMethods(params: {
        entity_id: string;
    }): Promise<any>;
    /**
     * Get Entity Payment Method
     *
     * Get payment method details by id for a given entity.
     */
    getEntityPaymentMethod(params: {
        entity_id: string;
        payment_method_id: string;
    }): Promise<any>;
    /**
     *
     * Users Endpoints
     *
     */
    /**
     * List Users
     *
     * List all users associated with a given entity.
     */
    getUsers(params: GetPrimeUsersRequest): Promise<any>;
    /**
     * List Portfolio Users
     *
     * List all users associated with a given portfolio.
     */
    getPortfolioUsers(params: GetPrimePortfolioUsersRequest): Promise<any>;
    /**
     *
     * Portfolios Endpoints
     *
     */
    /**
     * List Portfolios
     *
     * List all portfolios for which the current API key has read access.
     */
    getPortfolios(): Promise<any>;
    /**
     * Get Portfolio by Portfolio ID
     *
     * Retrieve a given portfolio by its portfolio ID.
     */
    getPortfolioById(params: {
        portfolio_id: string;
    }): Promise<any>;
    /**
     * Get Portfolio Credit Information
     *
     * Retrieve a portfolio's post-trade credit information.
     */
    getPortfolioCreditInformation(params: {
        portfolio_id: string;
    }): Promise<any>;
    /**
     *
     * Activities Endpoints
     *
     */
    /**
     * List Activities
     *
     * List all activities associated with a given entity.
     */
    getActivities(params: GetPrimeActivitiesRequest): Promise<any>;
    /**
     * Get Activity by Activity ID
     *
     * Retrieve an activity by its activity ID.
     */
    getActivityById(params: {
        portfolio_id: string;
        activity_id: string;
    }): Promise<any>;
    /**
     *
     * Address Book Endpoints
     *
     */
    /**
     * Get Address Book
     *
     * Gets a list of address book addresses.
     */
    getAddressBook(params: GetPrimeAddressBookRequest): Promise<any>;
    /**
     * Create Address Book Entry
     *
     * Creates an entry for a portfolio's trusted addresses.
     */
    createAddressBookEntry(params: CreatePrimeAddressBookEntryRequest): Promise<any>;
    /**
     *
     * Balances Endpoints
     *
     */
    /**
     * List Portfolio Balances
     *
     * List all balances for a specific portfolio.
     */
    getPortfolioBalances(params: {
        portfolio_id: string;
        symbols?: string[];
        balance_type?: 'TRADING_BALANCES' | 'VAULT_BALANCES' | 'TOTAL_BALANCES';
    }): Promise<any>;
    /**
     * Get Wallet Balance
     *
     * Query balance for a specific wallet.
     */
    getWalletBalance(params: {
        portfolio_id: string;
        wallet_id: string;
    }): Promise<any>;
    /**
     * List Web3 Wallet Balances
     *
     * Query balances for a specific web3 wallet.
     */
    getWeb3WalletBalances(params: GetPrimeWeb3WalletBalancesRequest): Promise<any>;
    /**
     *
     * Commission Endpoints
     *
     */
    /**
     * Get Portfolio Commission
     *
     * Retrieve commission associated with a given portfolio.
     */
    getPortfolioCommission(params: {
        portfolio_id: string;
    }): Promise<any>;
    /**
     *
     * Orders Endpoints
     *
     */
    /**
     * List Portfolio Fills
     *
     * Retrieve fills on a given portfolio.
     *
     * Note: This endpoint requires a start_date and returns a payload with a default
     * limit of 100 if not specified. The maximum allowed limit is 3000.
     */
    getPortfolioFills(params: GetPrimePortfolioFillsRequest): Promise<any>;
    /**
     * List Open Orders
     *
     * List all open orders for a given portfolio.
     */
    getOpenOrders(params: GetPrimeOpenOrdersRequest): Promise<any>;
    /**
     * Create Order
     *
     * Create an order for a given portfolio.
     */
    submitOrder(params: SubmitPrimeOrderRequest): Promise<any>;
    /**
     * Get Order Preview
     *
     * Retrieve an order preview for a given portfolio.
     */
    getOrderPreview(params: GetPrimeOrderPreviewRequest): Promise<any>;
    /**
     * List Portfolio Orders
     *
     * List historical orders for a given portfolio.
     */
    getPortfolioOrders(params: GetPrimePortfolioOrdersRequest): Promise<any>;
    /**
     * Get Order by Order ID
     *
     * Retrieve an order by order ID.
     */
    getOrderById(params: {
        portfolio_id: string;
        order_id: string;
    }): Promise<any>;
    /**
     * Cancel Order
     *
     * Cancel an order. (Filled orders cannot be canceled.)
     */
    cancelOrder(params: {
        portfolio_id: string;
        order_id: string;
    }): Promise<any>;
    /**
     * List Order Fills
     *
     * Retrieve fills on a given order.
     */
    getOrderFills(params: GetPrimeOrderFillsRequest): Promise<any>;
    /**
     *
     * Products Endpoints
     *
     */
    /**
     * List Portfolio Products
     *
     * List tradable products for a given portfolio.
     */
    getPortfolioProducts(params: GetPrimePortfolioProductsRequest): Promise<any>;
    /**
     *
     * Transactions Endpoints
     *
     */
    /**
     * List Portfolio Transactions
     *
     * List transactions for a given portfolio (only transactions that affect balances are accessible).
     */
    getPortfolioTransactions(params: GetPrimePortfolioTransactionsRequest): Promise<any>;
    /**
     * Get Transaction by Transaction ID
     *
     * Retrieve a specific transaction by its transaction ID (only transactions that affect balances are accessible).
     */
    getTransactionById(params: {
        portfolio_id: string;
        transaction_id: string;
    }): Promise<any>;
    /**
     * Create Conversion
     *
     * Perform a conversion between 2 assets.
     */
    createConversion(params: CreatePrimeConversionRequest): Promise<any>;
    /**
     * List Wallet Transactions
     *
     * Retrieve transactions for a given wallet (only transactions that affect balances are accessible).
     */
    getWalletTransactions(params: GetPrimeWalletTransactionsRequest): Promise<any>;
    /**
     * Create Transfer
     *
     * Create a wallet transfer.
     */
    createTransfer(params: CreatePrimeTransferRequest): Promise<any>;
    /**
     * Create Withdrawal
     *
     * Create a withdrawal.
     */
    createWithdrawal(params: CreatePrimeWithdrawalRequest): Promise<any>;
    /**
     *
     * Wallets Endpoints
     *
     */
    /**
     * List Portfolio Wallets
     *
     * List all wallets associated with a given portfolio.
     */
    getPortfolioWallets(params: GetPrimePortfolioWalletsRequest): Promise<any>;
    /**
     * Create Wallet
     *
     * Create a wallet.
     */
    createWallet(params: CreatePrimeWalletRequest): Promise<any>;
    /**
     * Get Wallet by Wallet ID
     *
     * Retrieve a specific wallet by Wallet ID.
     */
    getWalletById(params: {
        portfolio_id: string;
        wallet_id: string;
    }): Promise<any>;
    /**
     * Get Wallet Deposit Instructions
     *
     * Retrieve a specific wallet's deposit instructions.
     */
    getWalletDepositInstructions(params: GetPrimeWalletDepositInstructionsRequest): Promise<any>;
}
