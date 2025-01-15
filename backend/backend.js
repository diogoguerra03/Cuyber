const http = require("http");
const fs = require("fs");

// Hardcoded valid credentials for demonstration
const VALID_CREDENTIALS = {
  username: "admin",
  password: "1234",
};

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/auth") {
    let body = "";

    // Collect the data from the request
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      const username = data.username || "unknown";
      const password = data.password || "unknown";
      const ip = req.connection.remoteAddress;

      // Verify credentials
      if (
        username === VALID_CREDENTIALS.username &&
        password === VALID_CREDENTIALS.password
      ) {
        const logEntry =
          "[SUCCESS] Login attempt successfull! " +
          `Username: ${username}, Password: ${password}, IP: ${ip}\n`;
        fs.appendFileSync("login_attempts.log", logEntry);
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(
          JSON.stringify({ success: true, message: "Login successful!" })
        );
      } else {
        const logEntry =
          "[FAILURE] Login attempt failed! " +
          `Username: ${username}, Password: ${password}, IP: ${ip}\n`;
        fs.appendFileSync("login_attempts.log", logEntry);
        res.writeHead(401, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(
          JSON.stringify({ success: false, message: "Invalid credentials." })
        );
      }
    });
  } else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    res.end("Not Found");
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
