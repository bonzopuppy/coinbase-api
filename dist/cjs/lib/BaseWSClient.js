"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebsocketClient = void 0;
const events_1 = __importDefault(require("events"));
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const WebsocketClient_js_1 = require("../WebsocketClient.js");
const logger_js_1 = require("./websocket/logger.js");
const websocket_util_js_1 = require("./websocket/websocket-util.js");
const WsStore_js_1 = require("./websocket/WsStore.js");
const WsStore_types_js_1 = require("./websocket/WsStore.types.js");
/**
 * Users can conveniently pass topics as strings or objects (object has topic name + optional params).
 *
 * This method normalises topics into objects (object has topic name + optional params).
 */
function getNormalisedTopicRequests(wsTopicRequests) {
    const normalisedTopicRequests = [];
    for (const wsTopicRequest of wsTopicRequests) {
        // passed as string, convert to object
        if (typeof wsTopicRequest === 'string') {
            const topicRequest = {
                topic: wsTopicRequest,
                payload: undefined,
            };
            normalisedTopicRequests.push(topicRequest);
            continue;
        }
        // already a normalised object, thanks to user
        normalisedTopicRequests.push(wsTopicRequest);
    }
    return normalisedTopicRequests;
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class BaseWebsocketClient extends events_1.default {
    wsStore;
    logger;
    options;
    wsApiRequestId = 0;
    constructor(options, logger) {
        super();
        this.logger = logger || logger_js_1.DefaultLogger;
        this.wsStore = new WsStore_js_1.WsStore(this.logger);
        this.options = {
            pongTimeout: 1000,
            pingInterval: 10000,
            reconnectTimeout: 500,
            useSandbox: false,
            recvWindow: 0,
            // Requires a confirmation "response" from the ws connection before assuming it is ready
            requireConnectionReadyConfirmation: false,
            // Automatically auth after opening a connection?
            authPrivateConnectionsOnConnect: false,
            // Automatically include auth/sign with every WS request
            authPrivateRequests: true,
            // Automatically re-auth WS API, if we were auth'd before and get reconnected
            reauthWSAPIOnReconnect: false,
            ...options,
        };
    }
    isPrivateWsKey(wsKey) {
        return this.getPrivateWSKeys().includes(wsKey);
    }
    /** Returns auto-incrementing request ID, used to track promise references for async requests */
    getNewRequestId() {
        return `${++this.wsApiRequestId}`;
    }
    /**
     * Subscribe to one or more topics on a WS connection (identified by WS Key).
     *
     * - Topics are automatically cached
     * - Connections are automatically opened, if not yet connected
     * - Authentication is automatically handled
     * - Topics are automatically resubscribed to, if something happens to the connection, unless you call unsubsribeTopicsForWsKey(topics, key).
     *
     * @param wsTopicRequests array of topics to subscribe to
     * @param wsKey ws key referring to the ws connection these topics should be subscribed on
     */
    subscribeTopicsForWsKey(wsTopicRequests, wsKey) {
        const normalisedTopicRequests = getNormalisedTopicRequests(wsTopicRequests);
        // Store topics, so future automation (post-auth, post-reconnect) has everything needed to resubscribe automatically
        for (const topic of normalisedTopicRequests) {
            this.wsStore.addTopic(wsKey, topic);
        }
        const isConnected = this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        const isConnectionInProgress = this.wsStore.isConnectionAttemptInProgress(wsKey);
        // start connection process if it hasn't yet begun. Topics are automatically subscribed to on-connect
        if (!isConnected && !isConnectionInProgress) {
            return this.connect(wsKey);
        }
        // Subscribe should happen automatically once connected, nothing to do here after topics are added to wsStore.
        if (!isConnected) {
            /**
             * Are we in the process of connection? Nothing to send yet.
             */
            this.logger.trace(`WS not connected - requests queued for retry once connected.`, {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
                wsTopicRequests,
            });
            return;
        }
        // We're connected. Check if auth is needed and if already authenticated
        const isPrivateConnection = this.isPrivateWsKey(wsKey);
        const isAuthenticated = this.wsStore.get(wsKey)?.isAuthenticated;
        if (isPrivateConnection && !isAuthenticated) {
            /**
             * If not authenticated yet and auth is required, don't request topics yet.
             *
             * Auth should already automatically be in progress, so no action needed from here. Topics will automatically subscribe post-auth success.
             */
            this.logger.trace(`WS connected but not authenticated yet - awaiting auth before subscribing`);
            return false;
        }
        // Finally, request subscription to topics if the connection is healthy and ready
        this.requestSubscribeTopics(wsKey, normalisedTopicRequests);
    }
    unsubscribeTopicsForWsKey(wsTopicRequests, wsKey) {
        const normalisedTopicRequests = getNormalisedTopicRequests(wsTopicRequests);
        // Store topics, so future automation (post-auth, post-reconnect) has everything needed to resubscribe automatically
        for (const topic of normalisedTopicRequests) {
            this.wsStore.addTopic(wsKey, topic);
        }
        const isConnected = this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        // If not connected, don't need to do anything.
        // Removing the topic from the store is enough to stop it from being resubscribed to on reconnect.
        if (!isConnected) {
            return;
        }
        // We're connected. Check if auth is needed and if already authenticated
        const isPrivateConnection = this.isPrivateWsKey(wsKey);
        const isAuthenticated = this.wsStore.get(wsKey)?.isAuthenticated;
        if (isPrivateConnection && !isAuthenticated) {
            /**
             * If not authenticated yet and auth is required, don't need to do anything.
             * We don't subscribe to topics until auth is complete anyway.
             */
            return;
        }
        // Finally, request subscription to topics if the connection is healthy and ready
        this.requestUnsubscribeTopics(wsKey, normalisedTopicRequests);
    }
    /**
     * Splits topic requests into two groups, public & private topic requests
     */
    sortTopicRequestsIntoPublicPrivate(wsTopicRequests, wsKey) {
        const publicTopicRequests = [];
        const privateTopicRequests = [];
        for (const topic of wsTopicRequests) {
            if (this.isPrivateTopicRequest(topic, wsKey)) {
                privateTopicRequests.push(topic);
            }
            else {
                publicTopicRequests.push(topic);
            }
        }
        return {
            publicReqs: publicTopicRequests,
            privateReqs: privateTopicRequests,
        };
    }
    /** Get the WsStore that tracks websockets & topics */
    getWsStore() {
        return this.wsStore;
    }
    close(wsKey, force) {
        this.logger.info('Closing connection', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CLOSING);
        this.clearTimers(wsKey);
        const ws = this.getWs(wsKey);
        ws?.close();
        if (force) {
            ws?.terminate();
        }
    }
    closeAll(force) {
        this.wsStore.getKeys().forEach((key) => {
            this.close(key, force);
        });
    }
    isConnected(wsKey) {
        return this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
    }
    /**
     * Request connection to a specific websocket, instead of waiting for automatic connection.
     */
    async connect(wsKey) {
        try {
            if (this.wsStore.isWsOpen(wsKey)) {
                this.logger.error('Refused to connect to ws with existing active connection', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
                return { wsKey };
            }
            if (this.wsStore.isConnectionAttemptInProgress(wsKey)) {
                this.logger.error('Refused to connect to ws, connection attempt already active', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
                return;
            }
            if (!this.wsStore.getConnectionState(wsKey) ||
                this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.INITIAL)) {
                this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTING);
            }
            if (!this.wsStore.getConnectionInProgressPromise(wsKey)) {
                this.wsStore.createConnectionInProgressPromise(wsKey, false);
            }
            try {
                const url = await this.getWsUrl(wsKey);
                const ws = this.connectToWsUrl(url, wsKey);
                this.wsStore.setWs(wsKey, ws);
            }
            catch (e) {
                this.logger.error(`Exception fetching WS URL`, e);
                throw e;
            }
            return this.wsStore.getConnectionInProgressPromise(wsKey)?.promise;
        }
        catch (err) {
            this.parseWsError('Connection failed', err, wsKey);
            this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
        }
    }
    connectToWsUrl(url, wsKey) {
        this.logger.trace(`Opening WS connection to URL: ${url}`, {
            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
            wsKey,
        });
        const ws = new isomorphic_ws_1.default(url, undefined);
        ws.onopen = (event) => this.onWsOpen(event, wsKey);
        ws.onmessage = (event) => this.onWsMessage(event, wsKey, ws);
        ws.onerror = (event) => this.parseWsError('websocket error', event, wsKey);
        ws.onclose = (event) => this.onWsClose(event, wsKey);
        if (typeof ws.on === 'function') {
            ws.on('ping', (event) => this.onWsPing(event, wsKey, ws, 'event'));
            ws.on('pong', (event) => this.onWsPong(event, wsKey, 'event'));
        }
        return ws;
    }
    parseWsError(context, error, wsKey) {
        if (this.wsStore.isConnectionAttemptInProgress(wsKey)) {
            this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.ERROR_RECONNECTING);
        }
        if (!error.message) {
            this.logger.error(`${context} due to unexpected error: `, error);
            this.emit('response', { ...error, wsKey });
            this.emit('exception', { ...error, wsKey });
            return;
        }
        switch (error.message) {
            case 'Unexpected server response: 401':
                this.logger.error(`${context} due to 401 authorization failure.`, {
                    ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                    wsKey,
                });
                break;
            default:
                if (error?.code === 'ENOTFOUND') {
                    this.logger.error(`${context} due to lookup exception: "${error?.msg || error?.message || error}"`, {
                        ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                        wsKey,
                        error,
                        connectionState: this.wsStore.getConnectionState(wsKey),
                    });
                    break;
                }
                this.logger.error(`${context} due to unexpected response error: "${error?.msg || error?.message || error}"`, { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey, error });
                break;
        }
        this.emit('exception', { ...error, wsKey });
    }
    /** Get a signature, build the auth request and send it */
    async sendAuthRequest(wsKey) {
        try {
            this.logger.info(`Sending auth request...`, {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            const request = await this.getWsAuthRequestEvent(wsKey);
            return this.tryWsSend(wsKey, JSON.stringify(request));
        }
        catch (e) {
            this.logger.trace(e, { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        }
    }
    reconnectWithDelay(wsKey, connectionDelayMs) {
        this.clearTimers(wsKey);
        this.wsStore.get(wsKey, true).activeReconnectTimer = setTimeout(() => {
            this.logger.info('Reconnecting to websocket', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            this.connect(wsKey);
        }, connectionDelayMs);
    }
    ping(wsKey) {
        if (this.wsStore.get(wsKey, true).activePongTimer) {
            return;
        }
        this.clearPongTimer(wsKey);
        this.logger.trace('Sending ping', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        const ws = this.wsStore.get(wsKey, true).ws;
        if (!ws) {
            this.logger.error(`Unable to send ping for wsKey "${wsKey}" - no connection found`);
            return;
        }
        this.sendPingEvent(wsKey, ws);
        this.wsStore.get(wsKey, true).activePongTimer = setTimeout(() => {
            this.logger.info('Pong timeout - closing socket to reconnect', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            this.clearPongTimer(wsKey);
            this.getWs(wsKey)?.terminate();
        }, this.options.pongTimeout);
    }
    clearTimers(wsKey) {
        this.clearPingTimer(wsKey);
        this.clearPongTimer(wsKey);
        const wsState = this.wsStore.get(wsKey);
        if (wsState?.activeReconnectTimer) {
            clearTimeout(wsState.activeReconnectTimer);
        }
    }
    // Send a ping at intervals
    clearPingTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState?.activePingTimer) {
            clearInterval(wsState.activePingTimer);
            wsState.activePingTimer = undefined;
        }
    }
    // Expect a pong within a time limit
    clearPongTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState?.activePongTimer) {
            clearTimeout(wsState.activePongTimer);
            wsState.activePongTimer = undefined;
            // this.logger.trace(`Cleared pong timeout for "${wsKey}"`);
        }
        else {
            // this.logger.trace(`No active pong timer for "${wsKey}"`);
        }
    }
    /**
     * Simply builds and sends subscribe events for a list of topics for a ws key
     *
     * @private Use the `subscribe(topics)` or `subscribeTopicsForWsKey(topics, wsKey)` method to subscribe to topics. Send WS message to subscribe to topics.
     */
    async requestSubscribeTopics(wsKey, topics) {
        if (!topics.length) {
            return;
        }
        // Automatically splits requests into smaller batches, if needed
        const subscribeWsMessages = await this.getWsOperationEventsForTopics(topics, wsKey, 'subscribe');
        this.logger.trace(`Subscribing to ${topics.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches. Events: "${JSON.stringify(topics)}"`);
        for (const wsMessage of subscribeWsMessages) {
            this.logger.trace(`Sending batch via message: "${wsMessage}"`);
            this.tryWsSend(wsKey, wsMessage);
        }
        this.logger.trace(`Finished subscribing to ${topics.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
    }
    /**
     * Simply builds and sends unsubscribe events for a list of topics for a ws key
     *
     * @private Use the `unsubscribe(topics)` method to unsubscribe from topics. Send WS message to unsubscribe from topics.
     */
    async requestUnsubscribeTopics(wsKey, wsTopicRequests) {
        if (!wsTopicRequests.length) {
            return;
        }
        const subscribeWsMessages = await this.getWsOperationEventsForTopics(wsTopicRequests, wsKey, 'unsubscribe');
        this.logger.trace(`Unsubscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches. Events: "${JSON.stringify(wsTopicRequests)}"`);
        for (const wsMessage of subscribeWsMessages) {
            this.logger.trace(`Sending batch via message: "${wsMessage}"`);
            this.tryWsSend(wsKey, wsMessage);
        }
        this.logger.trace(`Finished unsubscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
    }
    /**
     * Try sending a string event on a WS connection (identified by the WS Key)
     */
    tryWsSend(wsKey, wsMessage) {
        try {
            this.logger.trace(`Sending upstream ws message: `, {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsMessage,
                wsKey,
            });
            if (!wsKey) {
                throw new Error('Cannot send message due to no known websocket for this wsKey');
            }
            const ws = this.getWs(wsKey);
            if (!ws) {
                throw new Error(`${wsKey} socket not connected yet, call "connectAll()" first then try again when the "open" event arrives`);
            }
            ws.send(wsMessage);
        }
        catch (e) {
            this.logger.error(`Failed to send WS message`, {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsMessage,
                wsKey,
                exception: e,
            });
        }
    }
    async onWsOpen(event, wsKey) {
        const didReconnectSuccessfully = this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.RECONNECTING) ||
            this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.ERROR_RECONNECTING);
        if (this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTING)) {
            this.logger.info('Websocket connected', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            this.emit('open', { wsKey, event });
        }
        else {
            this.logger.info('Websocket reconnected', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
                didReconnectSuccessfully,
            });
            this.emit('reconnected', {
                wsKey,
                event,
                didReconnectSuccessfully,
            });
        }
        this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        this.logger.trace(`Enabled ping timer`, { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        this.wsStore.get(wsKey, true).activePingTimer = setInterval(() => this.ping(wsKey), this.options.pingInterval);
        if (!this.options.requireConnectionReadyConfirmation) {
            await this.onWsReadyForEvents(wsKey);
        }
    }
    onWsPing(_event, wsKey, ws, source) {
        this.logger.trace('Received ping, sending pong frame', {
            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
            wsKey,
            source,
        });
        ws.pong();
    }
    onWsPong(_event, wsKey, source) {
        this.logger.trace('Received pong, clearing pong timer', {
            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
            wsKey,
            source,
        });
        this.clearPongTimer(wsKey);
    }
    /**
     * Called automatically once a connection is ready.
     * - Some exchanges are ready immediately after the connections open.
     * - Some exchanges send an event to confirm the connection is ready for us.
     *
     * This method is called to act when the connection is ready. Use `requireConnectionReadyConfirmation` to control how this is called.
     */
    async onWsReadyForEvents(wsKey) {
        try {
            // Resolve & cleanup deferred "connection attempt in progress" promise
            const connectionInProgressPromise = this.wsStore.getConnectionInProgressPromise(wsKey);
            if (connectionInProgressPromise?.resolve) {
                connectionInProgressPromise.resolve({
                    wsKey,
                });
            }
        }
        catch (e) {
            this.logger.error(`Exception trying to resolve "connectionInProgress" promise`);
        }
        // Remove before resolving, in case there's more requests queued
        this.wsStore.removeConnectingInProgressPromise(wsKey);
        // Some websockets require an auth packet to be sent after opening the connection
        if (this.isPrivateWsKey(wsKey) &&
            this.options.authPrivateConnectionsOnConnect) {
            await this.sendAuthRequest(wsKey);
        }
        // Reconnect to topics known before it connected
        const { privateReqs, publicReqs } = this.sortTopicRequestsIntoPublicPrivate([...this.wsStore.getTopics(wsKey)], wsKey);
        // Request sub to public topics, if any
        this.requestSubscribeTopics(wsKey, publicReqs);
        // Request sub to private topics, if auth on connect isn't needed
        if (!this.options.authPrivateConnectionsOnConnect) {
            this.requestSubscribeTopics(wsKey, privateReqs);
        }
    }
    /**
     * Handle subscription to private topics _after_ authentication successfully completes asynchronously.
     *
     * Only used for exchanges that require auth before sending private topic subscription requests
     */
    onWsAuthenticated(wsKey, event) {
        const wsState = this.wsStore.get(wsKey, true);
        wsState.isAuthenticated = true;
        if (this.options.authPrivateConnectionsOnConnect) {
            const topics = [...this.wsStore.getTopics(wsKey)];
            const privateTopics = topics.filter((topic) => this.isPrivateTopicRequest(topic, wsKey));
            if (privateTopics.length) {
                this.subscribeTopicsForWsKey(privateTopics, wsKey);
            }
        }
        if (event?.isWSAPI && event?.WSAPIAuthChannel) {
            wsState.didAuthWSAPI = true;
            wsState.WSAPIAuthChannel = event.WSAPIAuthChannel;
        }
    }
    onWsMessage(event, wsKey, ws) {
        try {
            // any message can clear the pong timer - wouldn't get a message if the ws wasn't working
            this.clearPongTimer(wsKey);
            if (this.isWsPong(event)) {
                return this.onWsPong(event, wsKey, 'onWsMessage');
            }
            if (this.isWsPing(event)) {
                this.logger.trace('Received ping', {
                    ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                    wsKey,
                    event,
                });
                this.sendPongEvent(wsKey, ws);
                return;
            }
            if ((0, websocket_util_js_1.isMessageEvent)(event)) {
                const data = event.data;
                const dataType = event.type;
                const emittableEvents = this.resolveEmittableEvents(wsKey, event);
                if (!emittableEvents.length) {
                    // console.log(`raw event: `, { data, dataType, emittableEvents });
                    this.logger.error('Unhandled/unrecognised ws event message - returned no emittable data', {
                        ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                        message: data || 'no message',
                        dataType,
                        event,
                        wsKey,
                    });
                    return this.emit('update', { ...event, wsKey });
                }
                for (const emittable of emittableEvents) {
                    if (this.isWsPong(emittable)) {
                        this.logger.trace('Received pong', {
                            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                            wsKey,
                            data,
                        });
                        continue;
                    }
                    if (emittable.eventType === 'connectionReady') {
                        this.logger.trace(`Successfully connected - connection ready for events`, {
                            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                            wsKey,
                        });
                        const wsState = this.wsStore.get(wsKey);
                        if (this.isPrivateWsKey(wsKey) &&
                            wsState &&
                            !this.options.authPrivateConnectionsOnConnect) {
                            wsState.isAuthenticated = true;
                        }
                        this.emit('response', { ...emittable.event, wsKey });
                        this.onWsReadyForEvents(wsKey);
                        continue;
                    }
                    if (emittable.eventType === 'authenticated') {
                        this.logger.trace(`Successfully authenticated`, {
                            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                            wsKey,
                        });
                        this.emit(emittable.eventType, { ...emittable.event, wsKey });
                        this.onWsAuthenticated(wsKey, emittable.event);
                        continue;
                    }
                    this.emit(emittable.eventType, { ...emittable.event, wsKey });
                }
                return;
            }
            this.logger.error('Unhandled/unrecognised ws event message - unexpected message format', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                message: event || 'no message',
                event,
                wsKey,
            });
        }
        catch (e) {
            this.logger.error('Failed to parse ws event message', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                error: e,
                event,
                wsKey,
            });
        }
    }
    onWsClose(event, wsKey) {
        this.logger.info('Websocket connection closed', {
            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
            wsKey,
        });
        if (this.wsStore.getConnectionState(wsKey) !== WsStore_types_js_1.WsConnectionStateEnum.CLOSING) {
            // clean up any pending promises for this connection
            this.getWsStore().rejectAllDeferredPromises(wsKey, 'connection lost, reconnecting');
            this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.INITIAL);
            this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
            this.emit('reconnect', { wsKey, event });
        }
        else {
            // clean up any pending promises for this connection
            this.getWsStore().rejectAllDeferredPromises(wsKey, 'disconnected');
            this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.INITIAL);
            this.emit('close', { wsKey, event });
        }
    }
    getWs(wsKey) {
        return this.wsStore.getWs(wsKey);
    }
    setWsState(wsKey, state) {
        this.wsStore.setConnectionState(wsKey, state);
    }
    /**
     * Promise-driven method to assert that a ws has successfully connected (will await until connection is open)
     */
    async assertIsConnected(wsKey) {
        const isConnected = this.getWsStore().isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        if (!isConnected) {
            const inProgressPromise = this.getWsStore().getConnectionInProgressPromise(wsKey);
            // Already in progress? Await shared promise and retry
            if (inProgressPromise) {
                this.logger.trace(`sendWSAPIRequest(): Awaiting EXISTING connection promise...`);
                await inProgressPromise.promise;
                this.logger.trace(`sendWSAPIRequest(): EXISTING connection promise resolved!`);
                return;
            }
            // Start connection, it should automatically store/return a promise.
            this.logger.trace(`sendWSAPIRequest(): Not connected yet...queue await connection...`);
            await this.connect(wsKey);
            this.logger.trace(`sendWSAPIRequest(): New connection promise resolved! `);
        }
    }
}
exports.BaseWebsocketClient = BaseWebsocketClient;
//# sourceMappingURL=BaseWSClient.js.map