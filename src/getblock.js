var Web3 = require('web3');
require('dotenv').config()

//INFURA WAS USED DURING TESTING - NOT TO USE IN PRODUCTION, USE FULL NODE INSTEAD
const INFURA = process.env.INFURA //API TOKEN
const INFURA_WS = `wss://mainnet.infura.io/ws/v3/${INFURA}`
const web3 = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS))

//LIGHT NODE - NO PEERS
//var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546')); // local GETH light client


const getBlock = async (blockNum, client) => {
    var addrs = []
    let blockData = await web3.eth.getBlock(blockNum)
    console.log('Caching block - ', blockNum)

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
    return Promise.all(promises)
        .then(() => {
            //REMOVE DUPLICATES AND SORT FOR FASTER SEARCH
            let sortedAddresses = Array.from(new Set(addrs)).sort()
            console.log('Cached', sortedAddresses.length, 'addresses');
            //PUSH TO REDIS - {BLOCKNUMBER : [ARRAY OF ADDRESSES]}
            client.RPUSH(blockNum.toString(), sortedAddresses, function (err, reply) {
                if (!err) { console.log(reply); }
                else { console.log(err) }
            });
            return sortedAddresses
        })
        .catch((e) => {
            console.log(e)
        });

}

module.exports = { getBlock }