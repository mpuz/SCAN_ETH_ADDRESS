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
Geth often looses peer when in lite моде -  so, use full node in production or call therd party APIs (f.i. infura.io)

4. Redis

1. Download sources
```
wget https://download.redis.io/redis-stable.tar.gz
```

2. Unpack and compile
```
tar -xzvf redis-stable.tar.gz
cd redis-stable
make
```

3. Install to bin
```
make install
```

it will move to /usr/local/bin, 
run - ```redis-server```

redis console - ```redis-cli```
geth console - ```geth attach```

4.there is a file  ./src/search.js , should be run with params - 
```
node ./src/search.js <addresstosearch> <blocknumbertosearchat>
```


 ./src/forward.js - utility for reading blocks into cache forward.

./src/backward.js - TODO utility for reading blocks into cache backward


