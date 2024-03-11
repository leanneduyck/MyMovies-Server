// imports http, url, fs modules
const http = require("http"),
  fs = require("fs"),
  url = require("url");

// creates new server, url
const server = http.createServer((request, response) => {
  let addr = request.url,
    q = new URL(addr, "http://localhost:8080"),
    filePath = "";

  // if url contains "documentation", returns documentation.html;
  // otherwise, returns index.html
  if (q.pathname.includes("documentation")) {
    filePath = __dirname + "/documentation.html";
  } else {
    filePath = "index.html";
  }

  // returns correct file to user
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(data);
    response.end("Hello Node!\n");
  });

  // logs request url + timestamp into log.txt
  fs.appendFile(
    "log.txt",
    "URL:" + addr + "\nTimestamp: " + new Date() + "\n\n",
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added to log.");
      }
    }
  );
});

// listens for requests from Port 8080
server.listen(8080);

console.log("This server is running on Port 8080.");
