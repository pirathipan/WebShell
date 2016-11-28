var express = require('express');
var app = express();
const exec = require('child_process').exec;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var jwt = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var bodyParser = require('body-parser');


app.use(express.static(__dirname + '/public'))

io.sockets.on('connection', function (socket) {

    socket.emit('message', 'vous etes connecte');

    socket.on('command', function (data) {
        console.log("Ligne de commande : " + data);
        exec(data , (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                socket.emit('output', `${error}` );
                return
            }
            socket.emit('output', `${stdout}`);
        });
    });
});




io.sockets.on('connection', socketioJwt.authorize({
    secret: 'secret-user',
    timeout: 15000
})).on('authenticated', function(socket) {
    console.log('hello! ' + socket.decoded_token.username);
});

app.post('/login', function (req, res,next) {
    var profile = {
        name: 'pira',
        password: 'pira'
    };
    var token = jwt.sign(profile, 'secret-user', { expiresIn : 1440 });
    console.log(token);
    res.json({token: token});
});



server.listen(8080);


