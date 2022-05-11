var Web3 = require('web3');
require('dotenv').config()

const redis = require('redis');
const client = redis.createClient();
client.on('connect', function () {
    console.log('Redis Connected');
}).on('error', function (error) {
    console.log(error);
});
client.connect();

const INFURA_WS = "wss://mainnet.infura.io/ws/v3/b25250f990fe413c87d0c51c6d6de752"
const web3 = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS))
//var web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545'); // local GETH light client



const main = async (blockNum) => {
    var addrs = []
    let blockData = await web3.eth.getBlock(blockNum)
    console.log('Searching at block - ', blockNum)

    const promises = [];
    for (trx of blockData.transactions) {
        promises.push(
            web3.eth.getTransaction(trx).then(trxData => {
                if (trxData?.from != null) {
                    addrs.push(trxData.from)
                }
                if (trxData?.to != null) {
                    addrs.push(trxData.to)
                }
                //console.log(trxData?.from, trxData?.to)
            })
        )
    }
    Promise.all(promises)
        .then(() => {
            let sortedAddresses = addrs.sort()
            console.log('Found ', sortedAddresses.length, 'addresses');

            //PUSH TO REDIS - {BLOCKNUMBER : [ARRAY OF ADDRESSES]}
            client.RPUSH(blockNum.toString(), ...sortedAddresses, function (err, reply) {
                if (!err) { console.log(reply); } // 2
                else { console.log(err) }
            });
        })
        .catch((e) => {
            console.log(e)
        });

}


//SUBSCRIBE ON THE NEW BLOCK EVENT
web3.eth.subscribe('newBlockHeaders', (error, result) => {
    if (!error) {
        //console.log(result);
        return;
    }
    console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log('Connected to websocket', subscriptionId);
    })
    .on("data", function (blockHeader) {
        console.log('Got new block', blockHeader.number);
        //GET ADDRESSES
        main(blockHeader.number)
    })
    .on("error", console.error);


//main()
