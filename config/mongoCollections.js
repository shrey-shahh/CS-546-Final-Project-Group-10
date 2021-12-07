const dbConnect = require('./mongoConnection')
const getCollection = (collection) =>{
    let _col = undefined

    return async () => {
        if(!_col)
        {
            const db = await dbConnect.connectToDb()
            _col= await db.collection(collection)
        }
        return _col
    }
}

module.exports = {
    users : getCollection('users'),
    jobs : getCollection('jobs'),
    applications : getCollection('applications'),
    feedbacks : getCollection('feedbacks'),
}