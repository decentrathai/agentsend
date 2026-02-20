/**
 * AgentSend Backend Server
 * Express API + WebSocket for real-time messaging
 */

import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import config from "./config.js";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/api/ws" });

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "AgentSend Backend",
    timestamp: Date.now(),
    tongo: config.tongoContractAddress ? "configured" : "missing",
  });
});

// Routes (will be added)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  
  ws.on("message", (data) => {
    console.log("Received:", data.toString());
    // TODO: Handle WebSocket messages
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: "connected",
    timestamp: Date.now(),
  }));
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// Start server
server.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🚀 AgentSend Backend                                 ║
║  ⚡ Port: ${config.port}                                      ║
║  🔗 API: http://localhost:${config.port}/api               ║
║  🌐 WebSocket: ws://localhost:${config.port}/api/ws        ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export { wss };
