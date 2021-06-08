var express = require('express');
var app = express();
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3030',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));


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

// router.post('/register-admin', async function(req, res) {
//     console.log("non hashed pass: ", req.body.password);
//     console.log("username: ", req.body.username);
//     // Insert: username, email, bcrypt hash
    
//     bcrypt.hash(req.body.password, 10, function(err, hash) {
//         console.log("Hash: ", hash);
//         adminDb.insert([
//             'reception',
//             hash,
//         ],

//         function(err) {
//             if(err) return res.status(500).send("Problem occured during registering Admin");
//             adminDb.selectByUsername(req.body.username, (err, user) => {
//                 if(err) return res.status(500).send("Problem to get user");
//                 console.log("User ", user);
//                 let token = jwt.sign({id:  user.id}, config.secret, { expiresIn: 86400});
//                 res.status(200).send({auth: true, token: token, user: user});
//             })
//         });
//     });
// });

router.post('/login', (req, res) => {
    adminDb.selectByUsername(req.body.username, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, user: user });
    });
})

router.get('/getInfo', (req, res) => {
    adminDb.selectByUsername(req.query.username, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        if(user.password == req.query.token) {
            res.status(200).send({ user: user });
        } else {
            res.status(404).send('Authentication failed');
        }
        
    });
})


app.use(router);

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

// Create Server
var server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s%s", host, port);
});