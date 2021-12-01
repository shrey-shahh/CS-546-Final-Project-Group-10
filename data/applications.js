const collections = require('../config/mongoCollections')
const applications = collections.applications
let { ObjectId } = require('mongodb');

let exportMethods = {
    async createApplication(jobId, jobseekerId, companyId, jobStatus)
    {
        
        if(!jobId && !jobseekerId && !companyId && !jobStatus)
        {
            throw 'all fields are required'
        }
        //await validateId(jobId)
        //await validateId(jobseekerId)
        //await validateId(companyId)
        if(!jobStatus || typeof(jobStatus) !== 'string' || jobStatus.trim().length === 0)
        {
            throw 'Job Status must be valid string'
        }
        let newApplication = {
            jobId, jobseekerId, companyId, jobStatus
        }   
        const applicationCollection = await applications()
        const insert = await applicationCollection.insertOne(newApplication)
        if(insert.insertedCount === 0)
        {
            throw 'Sorry, could not add application !'
        }
        return {applicationInserted:true}
    },
    async getByCompany(companyId)
    {
        //await validateId(companyId)
        const applicationCollection = await applications();
        const applicationList = await applicationCollection.find({companyId}).toArray();
        return applicationList;
    },
    async getByJobSeeker(jobseekerId)
    {
        //await validateId(jobseekerId)
        const applicationCollection = await applications();
        const applicationList = await applicationCollection.find({jobseekerId}).toArray();
        return applicationList;
    },
    async get(id)
    {
        //await validateId(id)
        const applicationCollection = await applications();
        const application = await applicationCollection.findOne({_id:new ObjectId(id)});
        return application;
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