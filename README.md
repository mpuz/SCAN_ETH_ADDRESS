# TEST

Install NodeJS, Redis and Geth. 
- Geth:
1. Add repo - 
```
sudo add-apt-repository -y ppa:ethereum/ethereum
```
2. Install stable version - 
```
sudo apt-get update
sudo apt-get install ethereum
```
3. Run in lite mode - 
```
geth --syncmode=light --ws --ws.port=8546  --http --http.port=8545 --http.api="eth,net,web3"
```
Geth often looses peer when in lite моде -  so, use full node in production or call thшrd party APIs (f.i. infura.io)

4. Redis
install rdis
run - ```redis-server```

redis console - ```redis-cli```
geth console - ```geth attach```

4.there is a file  ./src/search.js , should be run with params - 
```
node ./src/search.js <eth-address-to-search> <block-number-to-search-at>
```


 ./src/forward.js - utility for reading blocks into cache forward.

./src/backward.js - TODO utility for reading blocks into cache backward


