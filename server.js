require('dotenv').config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Client } = require("ssh2");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  pingInterval: 20000,
  pingTimeout: 60000
});

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const SSH_CONFIG = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT ? parseInt(process.env.SSH_PORT) : 22,
  username: process.env.SSH_USER,
  password: process.env.SSH_PASS,

  keepaliveInterval: 15000,
  keepaliveCountMax: 100
};

let sshConnection = null;
let sshStream = null;

// Connecting SSH
function connectSSH() {

  console.log("Connecting to SSH...");

  sshConnection = new Client();

  sshConnection.on("ready", () => {

    console.log("SSH ready");

    // Open real terminal
    sshConnection.shell({
      term: "xterm-color",
      cols: 120,
      rows: 40
    }, (err, stream) => {

      if (err) {
        console.error("Shell error:", err);
        return;
      }

      sshStream = stream;

      // Forward all stdout
      stream.on("data", (data) => {
        io.emit("terminal-output", data.toString());
      });

      // Forward stderr
      stream.stderr?.on("data", (data) => {
        io.emit("terminal-output", data.toString());
      });

      stream.on("close", () => {
        console.log("SSH shell closed");
        sshConnection.end();
      });

      // Run your startup commands
      stream.write(`sudo systemctl stop apache2\n`);
      stream.write(`sudo systemctl disable apache2\n`);
      stream.write(`sudo systemctl start nginx\n`);
      stream.write(`bash start.sh\n`);

    });

    // Extra keepalive
    setInterval(() => {
      if (sshStream) {
        sshStream.write("echo alive\n");
      }
    }, 60000);

  });

  sshConnection.on("error", (err) => {
    console.error("SSH error:", err);
  });

  sshConnection.on("close", () => {
    console.log("SSH closed. Reconnecting in 5 seconds...");
    setTimeout(connectSSH, 5000);
  });

  sshConnection.connect(SSH_CONFIG);
}

connectSSH();

io.on("connection", (socket) => {
  console.log("Viewer connected");

  socket.on("disconnect", () => {
    console.log("Viewer disconnected");
  });
});

app.use(express.json());

// Validation endpoint
app.post("/api/check-access", (req, res) => {
    const { code } = req.body;

    if (code === process.env.ACCESS_CODE) {
        return res.json({ success: true });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid access code"
    });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
