//require
const express = require('express');
const router = express.Router();
const applications = require('../data/applications');
const jobs = require('../data/jobs');
const users = require('../data/users');
const fs = require('fs');
router.get('/', (req, res) => {
    if(req.session.email)
    {
        if(req.session.roletype == 'company')
            {
                res.redirect('/company-dashboard');
            }
            if(req.session.roletype == 'jobseeker')
            {
                res.redirect('/jobseeker-dashboard');
            }
    }
    else{
        res.render('partials/home', {layout : 'index'});
    }
});

router.get('/company-signup', (req, res) => {
    if(req.session.email)
    {
        if(req.session.roletype == 'company')
            {
                res.redirect('/company-dashboard');
            }
            if(req.session.roletype == 'jobseeker')
            {
                res.redirect('/jobseeker-dashboard');
            }
    }
    else{
        res.render('partials/company-sign-up', {layout : 'index'});
    }
});
router.get('/jobseeker-signup', (req, res) => {
    if(req.session.email)
    {
        if(req.session.roletype == 'company')
            {
                res.redirect('/company-dashboard');
            }
            if(req.session.roletype == 'jobseeker')
            {
                res.redirect('/jobseeker-dashboard');
            }
    }
    else{
        res.render('partials/jobseeker-sign-up', {layout : 'index'});
    }
});
router.get('/login', (req, res) => {
    if(req.session.email)
    {
        if(req.session.roletype == 'company')
            {
                res.redirect('/company-dashboard');
            }
            if(req.session.roletype == 'jobseeker')
            {
                res.redirect('/jobseeker-dashboard');
            }
    }
    else{
        res.render('partials/log-in', {layout : 'index'});
    }
});
router.get('/company-dashboard', (req, res) => {
    if(req.session.email && req.session.roletype == 'company')
    {
        res.render('partials/company-dashboard', {layout : 'index',id:req.session.userid, email:req.session.email});
    }
    else{
        res.render('partials/unauthorized', {layout : 'index'});
    }
});
router.get('/jobseeker-dashboard', (req, res) => {
    if(req.session.email && req.session.roletype == 'jobseeker')
    {
        res.render('partials/jobseeker-dashboard', {layout : 'index', id:req.session.userid, email:req.session.email});
    }
    else{
        res.render('partials/unauthorized', {layout : 'index'});
    }
});


router.post('/signup',async (req, res) => {
    const user = req.body;
    let roletype = [];
    roletype.push(user.roletype);
    resumename = '';
    logoname = '';
    try{
    /*
    if(!req.files)
    {
        throw 'No files are uploaded'
    }
    if(roletype=='jobseeker')
    {
    if(!req.files.resume)
    {
        throw 'Resume is not uploaded'
    }
    */
   if(req.files)
   {
    if(req.files.resume)
    {
    let pathresume = __dirname.split('routes')[0] + "public/resumes/"+ req.files.resume.name;
    fs.writeFile(pathresume, req.files.resume.data, function (err) {
        if (err) throw "resume could not be uploaded";
    });
    resumename = req.files.resume.name;
    }
    /*}
    if(!req.files.logo)
    {
        throw 'Logo is not uploaded'
    }
    */
    if(req.files.logo)
    {
    let pathlogo = __dirname.split('routes')[0] + "public/logos/"+ req.files.logo.name;
    fs.writeFile(pathlogo, req.files.logo.data, function (err) {
        if (err) throw "logo could not be uploaded";
    });
    logoname = req.files.logo.name;
    }
}
    const check = await users.createUser(user.fullname, user.contactno, user.address, user.email, user.education, resumename, logoname, user.password, roletype);
        if(check.userInserted)
        {
            res.redirect('/');
        }
    }
    catch(error)
    {
        if(user.roletype == "company")
        {
        res.status(400).render('partials/company-sign-up',{layout: 'index', error, fullname:user.fullname, contactno:user.contactno, address:user.address, education:user.education, email:user.email, password:user.password});
        return false;
        }
        res.status(400).render('partials/jobseeker-sign-up',{layout: 'index', error, fullname:user.fullname, contactno:user.contactno, address:user.address, education:user.education, email:user.email, password:user.password});
        return false;
    }
    
});
router.post('/login', async (req, res) => {
    const user = req.body;
    try{
        const check = await users.checkUser(user.email, user.password);
        if(check.authenticated)
        {
            req.session.userid = check.id.toString()
            req.session.email = user.email
            req.session.roletype = check.roletype
            if(req.session.roletype == 'company')
            {
                res.redirect('/company-dashboard');
            }
            if(req.session.roletype == 'jobseeker')
            {
                res.redirect('/jobseeker-dashboard');
            }
            return;
        }
    }
    catch(error)
    {
        res.status(400).render('partials/log-in',{layout: 'index', error, email:user.email, password:user.password});
        return;
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});



router.get('/jobs', async (req, res) => {
    
    if(req.session.email)
    {
        const joblist = jobs.getAll();
        res.render('partials/jobs', {layout : 'index', title:'Job Description',joblist:joblist});
   
   
    }
    else{
        res.render('partials/unauthorized', {layout : 'index'});
    }
});


router.get('/get-job/:id', (req, res) => {

    if(req.session.email)
    {
      const job = await jobs.get(req.params.id);
      const company = await users.getuserbyemail(job.email);
      const user = await users.getuserbyemail(req.session.email);
      res.render('partials/job-deciption.html',{layout : 'index', title:'Job Description',job:job, companyid:company._id, seekerid: user._id});
    }
    else{
        res.render('partials/unauthorized', {layout : 'index'});
    }
});

router.post('/apply',async (req, res) => {
    const application = req.body;
    let jobStatus = [];
    jobStatus.push(application.jobStatus);
    try{
        const check = await applications.createApplication(application.jobId, application.jobseekerId, application.companyId, jobStatus);
        if(check.applicationInserted){
            res.render('partials/jobseeker-dashboard', {layout : 'index', id:req.session.userid, email:req.session.email});
        }
    }
    catch(error)
    {
        res.render('partials/unauthorized', {layout : 'index'});
    }
});

module.exports = router