const { getBlock } = require('./getblock')


const arguments = process.argv.splice(2);
console.log('Searching', arguments)


const redis = require('redis');
const client = redis.createClient();
client.on('connect', function () {
    console.log('Redis Connected');
}).on('error', function (error) {
    console.log(error);
});




const search = async (addr, blockNum) => {
    await client.connect();
    console.log('Searching in', String(blockNum))
    let cache = await client.lRange(String(blockNum), 0, -1)
    if (cache.length) {
        let found = cache.includes(addr)
        client.quit()
        if (found) {
            console.log("Found in", blockNum)
            return blockNum
        } else {
            console.log('Not in', String(blockNum))
        }
    } else {
        console.log('Not in cache')
        let result = await getBlock(blockNum, client)
        let found = result.includes(addr)
        client.quit()
        if (found) {
            console.log("Found in", blockNum)
            return blockNum
        } else {
            console.log('Not in', String(blockNum))
            return null
        }

    }
}



search(arguments[0], arguments[1])


