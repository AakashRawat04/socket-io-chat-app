// node server which will handel socket io connections
const io = require('socket.io')(8000, {
     cors: {
          origin: ['http://localhost:5500']
     }
})


// this will get updated every time when new persone joins
const users = { };


// when someone connects to the server it responds 
io.on('connection', socket =>{


     // when new user joins it will log the name of the user and its id
     socket.on('new-user-joined', name =>{
          console.log("new user joined-->>", name);
          console.log(socket.id)
          users[socket.id] = name;

          // also it emmits userjoined 
          socket.broadcast.emit('user-joined', name);
     });


     // when send gets emmited it will respond to it
     socket.on('send', message =>{
          // responding with receive msg so that others can see too
          socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
     });

     
     // on disconnect this will get emmited(pre defined event!)
     socket.on('disconnect', message =>{

          // it emmits the left event with the user name(id)
          socket.broadcast.emit('left', users[socket.id])

          // delets the user from the list / array
          delete users[socket.id];
     });
})