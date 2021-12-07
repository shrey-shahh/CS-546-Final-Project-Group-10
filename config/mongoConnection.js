const client = require('mongodb').MongoClient
const settings = require('./settings')
const config = settings.mongoConfig

let _connection = undefined
let _db = undefined

module.exports = {
    connectToDb : async () => {
        if(!_connection)
        {
            _connection = await client.connect(config.serverUrl)
            _db = await _connection.db(config.database)
        }
        return _db
    },
    closeConnection : () => {
        _connection.close()
    }
}