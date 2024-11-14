# rxprotoplex-websocket

`rxprotoplex-websocket` is a lightweight library that creates a Plex connection over WebSocket, enabling multiplexed communication and signaling for real-time, peer-to-peer, and streaming applications. This package supports creating Plex connections from either a WebSocket URL or an existing WebSocket instance, offering flexibility and ease of integration with other networking setups.

## Installation

Install the package using npm:

```bash
npm install rxprotoplex-websocket
```

## Usage

`rxprotoplex-websocket` provides a flexible `fromWebSocket` function that allows you to create a Plex connection from either a WebSocket URL or an already established WebSocket instance.

### Importing

Import `fromWebSocket` from the package:

```javascript
import { fromWebSocket } from 'rxprotoplex-websocket';
```

### Creating a Plex Connection

You can create a Plex connection from either a WebSocket URL or an existing WebSocket instance. The function will return a Plex-wrapped WebSocket stream, enabling multiplexed communication over the WebSocket.

#### Example 1: Creating a Plex Connection from a URL

```javascript
const plex = fromWebSocket("wss://example.com/socket", {
    wsOptions: { protocols: ["my-protocol"] },
    id: b4a.from([1, 2, 3]),
    handshake: b4a.from([4, 5, 6]),
    encoding: c.json,
    unique: true
});
```

#### Example 2: Creating a Plex Connection from an Existing WebSocket Instance

```javascript
const ws = new WebSocket("wss://example.com/socket");
const plex = fromWebSocket(ws, {
    id: b4a.from([1, 2, 3]),
    handshake: b4a.from([4, 5, 6]),
    encoding: c.json,
    unique: true
});
```

### Options

- **urlOrWebSocket** (`string | WebSocket`): Either a WebSocket URL (string) or an existing WebSocket instance.
- **options**: Configuration options for the WebSocket and Plex setup.

#### WebSocket-Specific Options (`wsOptions`):
- **`protocols`**: Protocols array to specify subprotocols for the WebSocket connection.

#### Plex-Specific Options
- **`id`** (`Uint8Array`): Unique identifier for the Plex instance (default: `b4a.from([])`).
- **`handshake`** (`Uint8Array`): Initial handshake value (default: `b4a.from([])`).
- **`handshakeEncoding`** (`Object`): Encoding format for the handshake value (default: `c.raw`).
- **`onhandshake`** (`function`): Callback to accept or reject a connection based on the handshake (default: `(handshake) => true`).
- **`encoding`** (`Object`): Encoding format for the values in a stream (default: `c.raw`).
- **`unique`** (`boolean`): Whether the underlying protomux channels allow multiple opens for the same protocol/ID pair (default: `false`).
- **`streamOptions`** (`Object`): Additional default options for the underlying Duplex streams.

## License

This package is licensed under the MIT License.