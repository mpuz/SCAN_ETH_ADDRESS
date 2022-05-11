const { getBlock } = require('./getblock')

const redis = require('redis');
const client = redis.createClient();
client.on('connect', function () {
    console.log('Redis Connected');

    //search("0x4147964d23fAA70aD6e790fBbc61afdfeDa4dD94", 14755348)

}).on('error', function (error) {
    console.log(error);
});
client.connect();


const search = async (addr, blockNum) => {
    console.log('Searching in', blockNum.toString())
    let cache = await client.lRange(blockNum.toString(), 0, -1)
    if (cache.length) {
        let found = cache.includes(addr)
        if (found) {
            console.log("Found in", blockNum)
            return blockNum
        } else {
            console.log('Not in', blockNum.toString())
        }
        client.quit()
    } else {
        console.log('Not in cache')
        let result = await getBlock(blockNum, client)
        let found = result.includes(addr)
        if (found) {
            console.log("Found in", blockNum)
            return blockNum
        } else {
            console.log('Not in', blockNum.toString())
        }
        client.quit()

    }
}





