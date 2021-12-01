const collections = require('../config/mongoCollections')
const jobs = collections.jobs
let { ObjectId } = require('mongodb');

let exportMethods = {
    async createJob(email, title, jobtype, fieldtype, location, description, experience, salaryrange, vacancy, status)
    {
        let newJob = {
            email, title, jobtype, fieldtype, location, description, experience, salaryrange, vacancy, status
        }
        const jobCollection = await jobs()
        const insert = await jobCollection.insertOne(newJob)
        if(insert.insertedCount === 0)
        {
            throw 'Sorry, could not add job !'
        }
        return {jobInserted:true}
    },
    async updateJob(id, title, jobtype, fieldtype, location, description, experience, salaryrange, vacancy, status)
    {
        let newJob = { 
            title, jobtype, fieldtype, location, description, experience, salaryrange, vacancy, status
        }
        const jobCollection = await jobs()
        const update = await jobCollection.updateOne({_id: new ObjectId(id)},{$set:newJob})
        if(update.modifiedCount === 0)
        {
            throw 'could not update job'
        }
        return { jobUpdated:true }
    },
    async getAll(){
        const jobCollection = await jobs();
        const jobList = await jobCollection.find({}).toArray();
        for(let itr of jobList)
        {
            itr._id = itr._id.toString()
        }
        return jobList;
    },
    async getByCompany(email){
        const jobCollection = await jobs();
        const jobList = await jobCollection.find({email}).toArray();
        for(let itr of jobList)
        {
            itr._id = itr._id.toString()
        }
        return jobList;
    },
    async get(id){
        const jobCollection = await jobs();
        const job = await jobCollection.findOne({_id:new ObjectId(id)});
        job._id = job._id.toString()
        return job;
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