var Web3 = require('web3');
require('dotenv').config()
const { getBlock } = require('./getblock')

const redis = require('redis');
const client = redis.createClient();
client.on('connect', function () {
    console.log('Redis Connected');
}).on('error', function (error) {
    console.log(error);
});
client.connect();

//INFURA WAS USED DURING TESTING - NOT TO USE IN PRODUCTION, USE FULL NODE INSTEAD
// const INFURA = process.env.INFURA //API TOKEN
// const INFURA_WS = `wss://mainnet.infura.io/ws/v3/${INFURA}`
// const web3 = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS))

//LIGHT NODE - OFTEN NO PEERS
var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546')); // local GETH light client





//SUBSCRIBE ON THE NEW BLOCK EVENT
web3.eth.subscribe('newBlockHeaders', (error, result) => {
    if (!error) {
        return;
    }
    console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log('Connected to websocket', subscriptionId);
    })
    .on("data", async function (blockHeader) {
        console.log('Got new block', blockHeader.number);
        //FETCH ADDRESSES FROM BLOCK
        let result = await getBlock(blockHeader.number, client)
    })
    .on("error", console.error);



