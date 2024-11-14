import WebSocket from "isomorphic-ws";
import {asPlex, encodingFrom} from "rxprotoplex";
import {WebSocketStream} from "./WebSocketStream.js";

/**
 * Creates a Plex connection from either a WebSocket URL or an existing WebSocket instance,
 * enabling multiplexed communication over the WebSocket stream.
 *
 * @param {string|WebSocket} urlOrWebSocket - A WebSocket URL (string) to connect to or an already-created WebSocket instance.
 * @param {Object} [options={}] - Optional configuration for WebSocket and Plex setup.
 * @param {Object} [options.wsOptions] - Options specific to the WebSocket instance, used only if a URL is provided.
 * @param {Uint8Array} [options.id=b4a.from([])] - The unique identifier for the Plex instance.
 * @param {Uint8Array} [options.handshake=b4a.from([])] - The handshake value for initial connection setup.
 * @param {Object} [options.handshakeEncoding=c.raw] - Encoding format for the handshake value.
 * @param {function} [options.onhandshake=(handshake) => true] - Callback invoked upon handshake; return `true` to accept or `false` to reject the connection.
 * @param {Object} [options.encoding=c.raw] - Encoding format for values exchanged over the stream.
 * @param {boolean} [options.unique=false] - Specifies if the underlying protomux channels should allow multiple opens for the same protocol and ID pair.
 * @param {Object} [options.streamOptions] - Additional default options for the underlying Duplex streams.
 * @returns {Object} - A Plex instance wrapped around the WebSocket stream, allowing for multiplexed communication.
 *
 * @example
 * // Create a Plex connection over a WebSocket with a URL
 * const plex1 = fromWebSocket("wss://example.com/socket", { unique: true });
 *
 * // Create a Plex connection with an existing WebSocket instance
 * const ws = new WebSocket("wss://example.com/socket");
 * const plex2 = fromWebSocket(ws, { unique: true });
 */
const fromWebSocket = (urlOrWebSocket, options = {}) => {
    const {
        wsOptions,
        ...plexOptions
    } = options;

    const ws = typeof urlOrWebSocket === 'string'
        ? new WebSocket(urlOrWebSocket, wsOptions)
        : urlOrWebSocket;

    if (plexOptions.encoding) plexOptions.encoding = encodingFrom(plexOptions.encoding);
    if (plexOptions.handshakeEncoding) plexOptions.handshakeEncoding = encodingFrom(plexOptions.handshakeEncoding);

    return asPlex(new WebSocketStream(true, ws), plexOptions);
}
export {fromWebSocket};