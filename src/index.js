const app = require('./app')
const { EXPRESS_PORT } = require('../config/config')

app.listen(EXPRESS_PORT, () => { console.log('listening on ', EXPRESS_PORT) })