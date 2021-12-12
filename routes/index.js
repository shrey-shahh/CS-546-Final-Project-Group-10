//requires
const pagesRoutes = require('./pages')
const apiRoutes = require('./api')
const express = require('express')
//methods routes
const methods = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/',pagesRoutes);
    app.use('/api',apiRoutes);   
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
}
//export routes
module.exports = methods