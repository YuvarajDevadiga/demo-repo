const express = require("express");
const app = express();
const httpServer = app.listen(8080);
const { WebSocketServer, WebSocket } = require("ws");

const wss = new WebSocketServer({ server: httpServer });

// Variable to keep track of connection count
let connectionCount = 0;

wss.on("connection", function connection(ws) {
  // Increment and send the connection count
  connectionCount++;
  ws.send("connected: " + connectionCount);

  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

app.get("/broadcast", (req, res) => {
  const message = req.query.message || "Hello, WebSocket clients!";
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  res.send("Message broadcasted to all WebSocket clients.");
});
