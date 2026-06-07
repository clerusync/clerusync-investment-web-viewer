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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
let rebooting = false;
// Connecting SSH
function connectSSH() {

  console.log("Connecting SSH...");

  sshConnection = new Client();

  sshConnection.on("ready", () => {

    console.log("SSH connection ready!");
    rebooting = false;

    sshConnection.exec(
      `sudo systemctl stop apache2 && sudo systemctl disable apache2 && sudo systemctl start nginx && bash start.sh`,
      (err, stream) => {

        if (err) {
          console.error("SSH exec error:", err);
          return;
        }

        sshStream = stream;

        stream.on("data", (data) => {
          io.emit("terminal-output", data.toString());
        });

        stream.stderr.on("data", (data) => {
          io.emit("terminal-output", data.toString());
        });

        stream.on("close", (code, signal) => {

          console.log(`Remote process closed: ${code} ${signal}`);

          if (!rebooting) {
            rebooting = true;

            console.log("Triggering remote reboot...");
            // reboot after server ssh connection is lost
            sshConnection.exec("sudo reboot", () => {
              sshConnection.end();
            });
          }

        });

      }
    );

    // Keep alive
    setInterval(() => {
      if (sshConnection) {
        sshConnection.exec("echo alive", () => {});
      }
    }, 60000);

  });

  sshConnection.on("error", (err) => {
    console.error("SSH connection error:", err);
  });

  sshConnection.on("close", () => {

    console.log("SSH closed.");

    if (rebooting) {
      console.log("Server rebooting. Waiting 30 seconds before reconnect...");
      setTimeout(connectSSH, 30000);
    } else {
      console.log("Reconnecting in 5 seconds...");
      // Reconnect after 5s if needed
      setTimeout(connectSSH, 5000);
    }

  });

  sshConnection.connect(SSH_CONFIG);
}

// Start SSH connection
connectSSH();

// Socket.IO
io.on("connection", (socket) => {

  console.log("Viewer connected");
  // No input allowed (read-only)
  socket.on("disconnect", () => {
    console.log("Viewer disconnected");
  });

});

// validation endpoint
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
