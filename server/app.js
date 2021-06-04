var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3030',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

const db = require('./app/config/db.config.js');

// force
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync with { force: true }');
});

require('./app/route/customer.route.js')(app);

// Create Server
var server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port);
});