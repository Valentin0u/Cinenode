const jwt = require('jsonwebtoken');
const secret = '*********************************************************';

exports.login = (req, res) => {
    res.render('login', { title: 'Espace membre'});
};

const fakeUser = { email: 'testuser@dev.fr', password: "aze"};

exports.postLogin = (req, res) => {
    console.log('login post', req.body);
    if(!req.body) {
        res.sendStatus(500);
    } else {
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jwt.sign({iss: 'http://cinenode.fr', user: "Valentin", scope:"admin"}, secret);
            console.log('myToken', myToken);
            res.json(myToken);
        } else {
            res.sendStatus(401);
        }
    }
};

exports.getMemberOnly = (req, res) => {
    console.log('req.user', req.user);
    if(req.user.role === 'moderator') {
        res.send(req.user);
    };
};
