var express = require('express');
var app = express();
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cors = require('cors');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors());
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

app.use(allowCrossDomain)


const DB = require('./app/admin-db/db.js');
const adminDb = new DB("sqlite.db");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

adminDb.selectAll((err, rows) => {
    if(err) return console.log("Problem to get user");
    console.log('Rows: ', rows);
})

// adminDb.deleteById(1, (err)=> {
//     if(err) return console.log("Problem to delete record on ", 2);
//     console.log('Successfully deleted!');
// })

router.post('/api/login', (req, res) => {
    console.log('We got post request. Data: %s', req.body.username);
    adminDb.selectByUsername(req.body.username, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
        });
        // console.log('User: ', user);
        // res.status(200).send({ auth: true, token: token, user: user });
        res.status(200).send({ auth: true, token: token, user: user });
    });
})

router.post('/api/logout', (req, res) => {
    console.log('Token: %s', req.body.token);
    res.status(200).send({ res: 'success' })
})

router.get('/api/getInfo', (req, res) => {
    console.log('Info req: %s', req.body.username);
    adminDb.selectByUsername(req.body.username, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        if(user.password == req.body.token) {
            res.status(200).send({ user: user });
        } else {
            res.status(404).send('Authentication failed');
        }
        
    });
})


app.use('/', router);

const db = require('./app/config/db.config.js');

// force
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync with { force: true }');
});

require('./app/route/customer.route.js')(app);

// demo route
app.get("/", (req, res) => {
    res.json({message: "First connection is ok!"});
});

let port = process.env.PORT || 3000;
// Create Server
var server = app.listen(port, function() {
    var port = server.address().port
    console.log("App listening at http://localhost:%s", port);
});