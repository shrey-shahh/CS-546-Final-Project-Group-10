const express = require('express')
//handlebars module loading
const handlebars = require('express-handlebars');
//setup our app to use the handlebars engine
const app = express()
app.set('view engine', 'handlebars');
//setup handlebars configurations
app.engine('handlebars', handlebars({
layoutsDir: __dirname + '/views/layouts',
}));
var hbs = handlebars.create({});
const routes = require('./routes')
const fileUpload = require('express-fileupload');
port = 3000
//var engines = require('consolidate')
const session = require("express-session")
/*
app.set('views', __dirname + '/views')
app.engine('html', engines.mustache)
app.set('view engine', 'html')
*/
app.use(express.static('public'))
app.use(fileUpload());
app.use(session({
    name:'AuthCookie',
    secret:'ParthGoti20005769',
    resave:false,
    saveUninitialized:true
}))
var Authentication = function (req, res, next) {
    if(req.url == "/company-dashboard")
    {
        if(!req.session.email && !req.session.roletype == 'company')
        {
            res.status(403).render("unauthorized.html")
        }
        else{
            next()
        }
        
    }
    else if(req.url == "/jobseeker-dashboard")
    {
        if(!req.session.email && !req.session.roletype == 'jobseeker')
        {
            res.status(403).render("unauthorized.html")
        }
        else{
            next()
        }
        
    }
    else{
        next()
    }
}
var Logging = function (req, res, next) {
    isAuthenticated = req.session.email ? "Authenticated" : "Non-Authenticated"
    console.log("["+new Date().toUTCString()+"]: "+req.method+" "+req.originalUrl+" ("+isAuthenticated+" User)")
    next()
}
app.use(Authentication)
app.use(Logging);
routes(app)
app.listen(port, () => {
    console.log("server is running...")
    console.log("routes are listening on https://localhost:"+port)
})