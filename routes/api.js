//require
const express = require('express');
const router = express.Router();
const users = require('../data/users');
const feedbacks = require('../data/feedbacks');
const applications = require('../data/applications');
const jobs = require('../data/jobs');

//--------------------------------------User-------------------------------------------------
//post method, pass from body id, fullname, contactno, address, education
router.post('/update-user',async (req, res) => {
    const user = req.body;
    try{
        if(!user.fullname && !user.contactno && !user.address)
        {
            throw 'all fields are required'
        }
        if(!user.fullname || typeof(user.fullname) !== 'string' || user.fullname.trim().length === 0)
        {
            throw 'Name must be valid string'
        }
        if(!user.contactno || typeof(user.contactno) !== 'string' || user.contactno.trim().length === 0)
        {
            throw 'Contact Number must be valid string'
        }
        let regex = /^\d{3}\-\d{3}\-\d{4}$/
        if(!regex.test(user.contactno))
        {
            throw 'Contact Number does not follow this format: xxx-xxx-xxxx, where x must be digit'
        }
        if(!user.address || typeof(user.address) !== 'string' || user.address.trim().length === 0)
        {
            throw 'Address must be valid string'
        }
        const result = await users.updateUser(user.id,user.fullname,user.contactno, user.address, user.education);
        return res.status(200).json(result);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
router.post('/change-password',async (req,res)=>{
    const user = req.body;
    try{
        const result = await users.changePassword(user.email, user.password);
        return res.status(200).json(result);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
})
//get method, pass id from url
router.get('/get-user/:id',async (req,res) => {
    const id = req.params.id;
    try{
        const user = await users.get(id)
        return res.status(200).json(user);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get method, pass email from url
router.get('/get-user-by-email/:id',async (req,res) => {
    const id = req.params.id;
    try{
        const user = await users.getuserbyemail(id)
        return res.status(200).json(user);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//--------------------------------------Application-------------------------------------------------
//post method, pass from body jobId, jobseekerId, companyId, jobStatus
router.post('/create-application',async (req, res) => {
    const application = req.body;
    try{
        const result = await applications.createApplication(application.jobId, application.jobseekerId, application.companyId, application.jobStatus);
        return res.status(200).json(result);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get method, pass companyId from url
router.get('/get-application-by-company/:id',async (req,res) => {
    const companyId = req.params.id;
    try{
        const applicationList = await applications.getByCompany(companyId)
        return res.status(200).json(applicationList);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get method, pass jobSeekerId from url
router.get('/get-application-by-jobseeker/:id',async (req,res) => {
    const jobseekerId = req.params.id;
    try{
        const applicationList = await applications.getByJobSeeker(jobseekerId)
        return res.status(200).json(applicationList);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get method, pass applicationId from url
router.get('/get-application/:id', async (req,res) => {
    const id = req.params.id;
    try{
        const application = await applications.get(id)
        return res.status(200).json(application);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//--------------------------------------Job-------------------------------------------------
//post method, pass from body title, jobtype, fieldtype, location, description, experience, salaryrange, vacancy, status
router.post('/create-job', async (req, res) => {
    const job = req.body;
    try{
        if(!job.title || typeof(job.title) !== 'string' || job.title.trim().length === 0)
        {
            throw 'Title must be valid string'
        }
        if(!job.jobtype || typeof(job.jobtype) !== 'string' || job.jobtype.trim().length === 0)
        {
            throw 'jobtype must be valid string'
        }
        if(!job.fieldtype || typeof(job.fieldtype) !== 'string' || job.fieldtype.trim().length === 0)
        {
            throw 'fieldtype must be valid string'
        }
        if(!job.location || typeof(job.location) !== 'string' || job.location.trim().length === 0)
        {
            throw 'location must be valid string'
        }
        if(!job.description || typeof(job.description) !== 'string' || job.description.trim().length === 0)
        {
            throw 'Description must be valid string'
        }
        if(!job.experience || typeof(job.experience) !== 'string' || job.experience.trim().length === 0)
        {
            throw 'experience must be valid string'
        }
        if(!job.salaryrange || isNaN(job.salaryrange) || job.salaryrange<0)
        {
            throw 'salaryrange must be valid number'
        }
        if(!job.vacancy || typeof(job.vacancy) !== 'string' || job.vacancy.trim().length === 0)
        {
            throw 'vacancy must be valid string'
        }
        if(!job.status || typeof(job.status) !== 'string' || job.status.trim().length === 0)
        {
            throw 'status must be valid string'
        }
        const result = await jobs.createJob(req.session.email.toLowerCase(), job.title, job.jobtype, job.fieldtype, job.location, job.description, job.experience, job.salaryrange, job.vacancy, job.status);
        return res.status(200).json(result);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//post method, pass from body id, title, jobtype, fieldtype, location, description, experience, salaryrange, vacancy, status
router.post('/update-job', async (req, res) => {
    const job = req.body;
    try{
        if(!job.title || typeof(job.title) !== 'string' || job.title.trim().length === 0)
        {
            throw 'Title must be valid string'
        }
        if(!job.jobtype || typeof(job.jobtype) !== 'string' || job.jobtype.trim().length === 0)
        {
            throw 'jobtype must be valid string'
        }
        if(!job.fieldtype || typeof(job.fieldtype) !== 'string' || job.fieldtype.trim().length === 0)
        {
            throw 'fieldtype must be valid string'
        }
        if(!job.location || typeof(job.location) !== 'string' || job.location.trim().length === 0)
        {
            throw 'location must be valid string'
        }
        if(!job.description || typeof(job.description) !== 'string' || job.description.trim().length === 0)
        {
            throw 'Description must be valid string'
        }
        if(!job.experience || typeof(job.experience) !== 'string' || job.experience.trim().length === 0)
        {
            throw 'experience must be valid string'
        }
        if(!job.salaryrange || isNaN(job.salaryrange) || job.salaryrange<0)
        {
            throw 'salaryrange must be valid number'
        }
        if(!job.vacancy || typeof(job.vacancy) !== 'string' || job.vacancy.trim().length === 0)
        {
            throw 'vacancy must be valid string'
        }
        if(!job.status || typeof(job.status) !== 'string' || job.status.trim().length === 0)
        {
            throw 'status must be valid string'
        }
        const result = await jobs.updateJob(job.id, job.title, job.jobtype, job.fieldtype, job.location, job.description, job.experience, job.salaryrange, job.vacancy, job.status);
        return res.status(200).json(result);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//edit job status
router.post('/edit-job-status', async (req, res) => {
    const job = req.body;
    try{
        const result = await jobs.updateJobStatus(job._id, job.status);
        return res.status(200).json(result);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get method, pass jobId from url
router.get('/get-job/:id', async (req,res) => {
    const id = req.params.id;
    try{
        const job = await jobs.get(id)
        return res.status(200).json(job);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get method, pass email id of company from url
router.get('/get-company-job/:id', async (req,res) => {
    const email = req.params.id;
    try{
        const jobList = await jobs.getByCompany(email)
        return res.status(200).json(jobList);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get method, no need to pass any parameter
router.get('/get-jobs', async (req,res) => {
    try{
        const jobList = await jobs.getAll()
        return res.status(200).json(jobList);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//--------------------------------------Feedback-------------------------------------------------
//post method, pass from body comments, rating, userId, companyId
router.post('/create-feedback', async (req, res) => {
    const feedback = req.body;
    try{
            const result = await feedbacks.createFeedback(feedback.comments, feedback.rating, feedback.userId, feedback.companyId);
            return res.status(200).json(result);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get feedbacks by company email
router.get('/get-feedbacks/:id', async (req,res) => {
    const email = req.params.id;
    try{
        const feedbackList = await feedbacks.get(email)
        return res.status(200).json(feedbackList);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});
//get all feedbacks
router.get('/get-feedbacks', async (req,res) => {
    try{
        const feedbackList = await feedbacks.getAll()
        return res.status(200).json(feedbackList);
    }
    catch(error)
    {
        return res.status(400).json({ error });
    }
});

module.exports = router