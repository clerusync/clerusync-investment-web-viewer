# Clerusync Investment Web Viewer 

This application provides a web-based, read-only terminal viewer for streaming the output of a script running on a remote server via SSH. It uses Node.js, Express, Socket.IO, and `xterm.js` to create a live, in-browser console feed.

## How It Works

The application consists of a Node.js backend and a HTML/JavaScript frontend.

-   **Backend (`server.js`)**:
    -   Uses Express to serve a static web page.
    -   Establishes a persistent SSH connection to a remote server using the `ssh2` library based on configuration in a `.env` file.
    -   Upon connection, it executes a predefined shell command (`sudo systemctl stop apache2 && sudo systemctl disable apache2 && sudo systemctl start nginx && bash start.sh`) on the remote machine.
    -   It captures the standard output and error streams from the remote command.
    -   Uses Socket.IO to broadcast the captured output in real-time to all connected web clients.
    -   Includes robust connection handling, with automatic reconnection logic for both connection drops and server reboots.

-   **Frontend (`public/index.html`)**:
    -   Uses `xterm.js` to render a full-page terminal emulation in the browser.
    -   Connects to the backend via a Socket.IO client.
    -   Listens for `terminal-output` events and writes the received data directly to the `xterm.js` terminal.
    -   The terminal is configured in read-only mode (`disableStdin: true`), preventing any user input from being sent to the server.

## Features

-   **Real-time Output Streaming**: View live terminal output from a remote server in your browser.
-   **Read-Only Interface**: Securely share process logs without allowing interactive access.
-   **Automatic Reconnection**: Automatically re-establishes the SSH connection if it drops or after the remote server reboots.
-   **Easy Setup**: Configuration through environment variables.
-   **Web-Based**: Access the viewer from any modern web browser without needing a local SSH client.

## Prerequisites

-   Node.js and npm
-   SSH access to a remote server.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/clerusync/clerusync-investment-web-viewer.git
    cd clerusync-investment-web-viewer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project and add your SSH credentials and server details.

    ```dotenv
    # .env
    
    # SSH Connection Details
    SSH_HOST=your_remote_server_ip
    SSH_PORT=22
    SSH_USER=your_ssh_username
    SSH_PASS=your_ssh_password

    # Authentication Code
    ACCESS_CODE=your_access_code
    
    # Local Server Port
    PORT=3000
    ```

## Running the Application

1.  **Start the server:**
    ```bash
    node server.js
    ```
    The console will log `Server running at http://localhost:3000` and display the status of the SSH connection.

2.  **Open the viewer:**
    Navigate to `http://localhost:3000` in your web browser to see the live output from the remote script.

## Dependencies

### Backend
-   [express](https://www.npmjs.com/package/express): Web server framework.
-   [socket.io](https://www.npmjs.com/package/socket.io): Real-time communication library.
-   [ssh2](https://www.npmjs.com/package/ssh2): SSH2 client library for Node.js.
-   [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.

### Frontend
-   [xterm.js](https://xtermjs.org/): A terminal emulator for the browser.
-   [socket.io-client](https://www.npmjs.com/package/socket.io-client): Client-side library for Socket.IO.
