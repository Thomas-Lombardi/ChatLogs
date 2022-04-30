var port = 3000

var express=require('express')
var app = express()
var http=require('http').Server(app);
var io=require('socket.io')(http);
var $ = require('jquery');
/*
const server = express()
  .use((req, res) => res.sendFile(__dirname+'/index.html') )
  .listen(port, () => console.log(`Listening on  ${port}`));
*/
const server = require('http').createServer();
// 
// const io = require('socket.io')(server, {
//     path: '',
//     serveClient: false,
//     // below are engine.IO options
//     pingInterval: 10000,
//     pingTimeout: 5000,
//     cookie: false
//   });

var clients = io.sockets.clients()
var cookie = require('cookie');






//server.listen(3000);
var chalk=require('chalk');
var online=0;
var clientsInJavaScript = [];
var clientsInJava = [];
var clientsInCSS =[];

process.stdin.on('data',function(){
    var str=String(process.stdin.read());
    if(str.search("!quit")){
        io.emit('chat message','Console: stopping server.');
        process.exit();
    }
});

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');

});
app.get('/javascript',function(req,res){
    res.sendFile(__dirname+'/javascript.html');

});
app.get('/java',function(req,res){
    res.sendFile(__dirname+'/java.html');

});
app.get('/css',function(req,res){
    res.sendFile(__dirname+'/css.html');

});


io.on('connection',function(socket){
    socket.on('join', function(data){
        socket.join(data.room);
        //console.log(socket);
        if (data.room == "javascript") {
          var cookies = cookie.parse(socket.handshake.headers.cookie);
          var found = false;
          for (var i = 0; i < clientsInJavaScript.length; i++) {
            if (clientsInJavaScript[i] == cookies.username.split("-")[1] && found == false){found = true;}
          }
          if(found != true){clientsInJavaScript.push(cookies.username.split("-")[1]);}
          console.log(chalk.green('joined  |',chalk.cyan(clientsInJavaScript.length),'online in ',data.room));
        }else if (data.room == "java") {
          var cookies = cookie.parse(socket.handshake.headers.cookie);
          var found = false;
          for (var i = 0; i < clientsInJava.length; i++) {
            if (clientsInJava[i] == cookies.username.split("-")[1] && found == false){found = true;}
          }

          if(found != true){clientsInJava.push(cookies.username.split("-")[1]);}
          console.log(chalk.green('joined  |',chalk.cyan(clientsInJava.length),'online in ',data.room));
        }else if (data.room == "css") {
          var cookies = cookie.parse(socket.handshake.headers.cookie);
          var found = false;
          for (var i = 0; i < clientsInCSS.length; i++) {
            if (clientsInCSS[i] == cookies.username.split("-")[1] && found ==false){found = true;}
          }
          if(found != true){clientsInCSS.push(cookies.username.split("-")[1]);}
          console.log(chalk.green('joined  |',chalk.cyan(clientsInCSS.length),'online in ',data.room));
        }
        socket.broadcast.to(data.room).emit('chat message', data.name + ' joined the ' + data.room  + ' room.');
    });

    socket.on('chat message',function(data){
        io.in(data.room).emit('chat message',data.msg);
    });
    socket.on('javascriptroomonline', function(){
      io.emit('javascriptroomonline',clientsInJavaScript.length + " Online");
    });
    socket.on('javaroomonline',function(){
      io.emit('javaroomonline', clientsInJava.length + " Online");
    });
    socket.on('cssroomonline', function(){
      io.emit('cssroomonline', clientsInCSS.length + " Online");
    });

    socket.on('broadcastDisconnect',function(data){
      socket.broadcast.to(data.room).emit('chat message', data.name + ' has left the room.');
      if (data.room == "javascript") {
        var i = clientsInJavaScript.indexOf(socket);
        clientsInJavaScript.splice(i,1);
        console.log(chalk.red('left    |',chalk.cyan(clientsInJavaScript.length),'online in ' + data.room));
      }else if (data.room == "java") {
        var i = clientsInJava.indexOf(socket);
        clientsInJava.splice(i,1);
        console.log(chalk.red('left    |',chalk.cyan(clientsInJava.length),'online in ' + data.room));
      }else if (data.room == "css") {
        var i = clientsInCSS.indexOf(socket);
        clientsInCSS.splice(i,1);
        console.log(chalk.red('left    |',chalk.cyan(clientsInCSS.length),'online in ' + data.room));
      }
    });

    socket.on('disconnect',function(data){
        socket.disconnect(data.room);
    });
});

http.listen(port,function(){
    console.log(chalk.yellow('SIOChat listening on',chalk.cyan(port)));
});
