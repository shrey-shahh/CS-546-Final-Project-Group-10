const collections = require('../config/mongoCollections')
const feedbacks = collections.feedbacks
const users = collections.users
//let { ObjectId } = require('mongodb');

let exportMethods = {
    async createFeedback(comments, rating, userId, companyId)
    {
        if(!comments && !rating && !userId && !companyId)
        {
            throw "all fields are required"
        }
        if(!comments || typeof(comments) !== 'string' || comments.trim().length === 0)
        {
            throw 'comments must be valid string'
        }
        if(!rating || isNaN(rating))
        {
            throw 'rating must be valid number between 1-5'
        }
        //await validateId(userId)
        //await validateId(companyId)
        let newFeedback = {
            comments, rating, userId, companyId
        }   
        const feedbackCollection = await feedbacks()
        const insert = await feedbackCollection.insertOne(newFeedback)
        if(insert.insertedCount === 0)
        {
            throw 'Sorry, could not add feedback !'
        }
        return {feedbackInserted:true}
    },
    async get(email)
    {
        //await validateId(companyId)
        const feedbackCollection = await feedbacks();
        const userCollection = await users();
        const user = await userCollection.findOne({email:email});
        const feedbackList = await feedbackCollection.find({companyId:user._id.toString()}).toArray();
        return feedbackList;
    },
    async getAll()
    {
        //await validateId(companyId)
        const feedbackCollection = await feedbacks();
        const feedbackList = await feedbackCollection.find({}).toArray();
        return feedbackList;
    }
}
module.exports = exportMethods;
/*
async function validateId(id){
    if(!id)
    {
        throw 'no id is provided'
    }
    if(typeof id !== 'string' || id.trim().length === 0)
    {
        throw 'id provided is not a valid string'
    }
    if(!ObjectId.isValid(id))
    {
        throw 'id provided is not valid objectId';
    }
}
*/