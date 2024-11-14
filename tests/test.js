import {test} from "brittle";
import {WebSocketServer} from "ws";
import {fromWebSocket} from "../lib/fromWebSocket.js";
import {getWebSocketURL} from "./getWebSocketUrl.js";
import {listenAndConnectionAndRead$, connectAndSend, withEncoding} from "rxprotoplex";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createServer(connection) {
    const wss = new WebSocketServer({port: 5000});
    wss.on("connection", socket => {
        connection(fromWebSocket(socket));
    });
    await new Promise(resolve => wss.once("listening", resolve));
    return [wss, getWebSocketURL(wss)];
}

test("basic websocket plex test", async t => {
    let serverPlex;
    let serverData = [];
    const [server, url] = await createServer((conn) => {
        serverPlex = conn;
    });

    const plex = fromWebSocket(url);
    const send = connectAndSend(plex, withEncoding("json"));
    await sleep(10);

    listenAndConnectionAndRead$(serverPlex, withEncoding("json")).subscribe(({data}) => {
        serverData.push(data);
    });

    send("hello");
    send("you");
    send("dog");

    await sleep(50);
    t.alike(serverData, ["hello", "you", "dog"]);

    t.teardown(() => {
        plex.close$.next();
        serverPlex.close$.next();
        server.close();
    });
})


