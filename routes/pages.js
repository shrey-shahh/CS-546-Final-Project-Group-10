//require
const express = require('express');
const router = express.Router();
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
        res.render('home.html');
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
        res.render('company-sign-up.html');
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
        res.render('jobseeker-sign-up.html');
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
        res.render('log-in.html');
    }
});
router.get('/company-dashboard', (req, res) => {
    if(req.session.email && req.session.roletype == 'company')
    {
        res.render('company-dashboard.html',{id:req.session.userid, email:req.session.email});
    }
    else{
        res.render('unauthorized.html');
    }
});
router.get('/jobseeker-dashboard', (req, res) => {
    if(req.session.email && req.session.roletype == 'jobseeker')
    {
        res.render('jobseeker-dashboard.html',{id:req.session.userid, email:req.session.email});
    }
    else{
        res.render('unauthorized.html');
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
        res.status(400).render('company-sign-up.html',{error, fullname:user.fullname, contactno:user.contactno, address:user.address, education:user.education, email:user.email, password:user.password});
        return false;
        }
        res.status(400).render('jobseeker-sign-up.html',{error, fullname:user.fullname, contactno:user.contactno, address:user.address, education:user.education, email:user.email, password:user.password});
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
        res.status(400).render('log-in.html',{error, email:user.email, password:user.password});
        return;
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router