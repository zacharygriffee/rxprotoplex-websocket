import {test, solo} from "brittle";
import {WebSocketServer} from "ws";
import {fromWebSocket} from "../lib/fromWebSocket.js";
import {getWebSocketURL} from "./getWebSocketUrl.js";
import {listenAndConnectionAndRead$, connectAndSend, withEncoding, destroy} from "rxprotoplex";
import b4a from "b4a";
import {take} from "rxjs";

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
});

test("Large data", async t => {
    t.plan(1);
    const largeMessage = b4a.from("x".repeat(1024 * 1024)); // 1 MB message
    let serverPlex;
    const [server, url] = await createServer((conn) => {
        serverPlex = conn;
    });
    const received = [];
    const plex = fromWebSocket(url);
    await sleep(10);
    const send = connectAndSend(plex);
    listenAndConnectionAndRead$(serverPlex).pipe(take(1)).subscribe(({data}) => {
        t.alike(data, largeMessage);
    });

    send(largeMessage)
    t.teardown(() => {
        destroy(plex);
        destroy(serverPlex);
        server.close();
    })
});

test("error on websocket propagates", async t => {
    t.plan(1);

    const plex = fromWebSocket("wss://localhost:12345");
    const sub = plex.close$.subscribe({error: e => {
        t.is(e.code, "ECONNREFUSED")
    }});
    t.teardown(() => {
        sub.unsubscribe();
    });
});


