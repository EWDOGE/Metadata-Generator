const { exec } = require("child_process");
const https = require("https");
const fs = require("fs");
const fetch = require("node-fetch");
const queue = require("queue");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/nft.ewd.green/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/nft.ewd.green/fullchain.pem"),
};

var q = queue({ results: [] });
q.concurrency = 1;
q.timeout = 5000;
q.autostart = true;

function fetchSupply() {
  return new Promise((resolve, reject) => {
    fetch('https://explorer.energyweb.org/api?module=token&action=getToken&contractaddress=0xbf0e4613f25bBA08811632613F4161FA415CB253')
      .then(res => res.json())
      .then(res => res.result.totalSupply)
      .then(res => Number.parseInt(res))
      .then(resolve)
      .catch(reject);
  });
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  if (req.method == "GET") {
    res.end("Received GET request...");
    console.log(`Received GET request...`);
  } else if (req.method == "POST") {
    q.push(function () {
      req.on("data", function (data) {
        const body = JSON.parse(data);

        fs.stat('./html/' + body.nftnumba + '.png', function(err, stat) {
          if (stat === undefined){

            if (body.booster === "default") {
                fetchSupply()
                .then(supply => {
                  if (body.nftnumba > supply) {console.log("It's off the chain brah!"); res.end("It's off the chain brah!");}
                  else {
                    exec("node base.js " + body.nftnumba + " " + body.wallet, (error, stdout, stderr) => {
                      console.log(stdout);
                      res.end("You made a puppy!");
                    });
                  }
                })
          }

          else if (body.booster === "25") {
              fetchSupply()
              .then(supply => {
                if (body.nftnumba > supply) {console.log("It's off the chain brah!"); res.end("It's off the chain brah!");}
                else {
                  exec("node 25.js " + body.nftnumba + " " + body.wallet, (error, stdout, stderr) => {
                    console.log(stdout);
                    res.end("You made a puppy!");
                  });
                }
              })
        }

            else if (body.booster === "50") {
                fetchSupply()
                .then(supply => {
                  if (body.nftnumba > supply) {console.log("It's off the chain brah!"); res.end("It's off the chain brah!");}
                  else {
                    exec("node 50.js " + body.nftnumba + " " + body.wallet, (error, stdout, stderr) => {
                      console.log(stdout);
                      res.end("You made a puppy!");
                    });
                  }
                })
          }

          }
          else {
            console.log("That bad boy already exists!"); res.end("That bad boy already exists!");
          }
        });
      });
    });
  }
});

server.listen(42069);
console.log("Minter running!");