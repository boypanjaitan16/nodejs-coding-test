'use strict'

var apiRouter = require('./routes/api');

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get('/', (req, res) => {
    res.locals.name = 'faisal'
    res.render('index')
  })

  app.use('/api', apiRouter)
}
