// connected to the server
const socket = io('http://localhost:8000');


// defining constant variables for appending message in container
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')
const audio = new Audio('ting.mp3')


// append function for adding message in the container
const appand = (message, position)=>{
     const messageElement = document.createElement('div');
     messageElement.innerText = message;
     messageElement.classList.add('message');
     messageElement.classList.add(position);
     messageContainer.appendChild(messageElement);

     // audio will only play if the message is on left side
     if(position == 'left'){
          audio.play();
     }
}


// taking users name by prompt
const name = prompt("Enter your name to join");

// emmiting the new new-user-joined event to the node server running at 8000 port
socket.emit('new-user-joined', name);


// when new-user-joined event returns user joined then itll send a message to other peoples in the chat 
socket.on('user-joined', name =>{
     appand(`${name} joined the chat\nWelcome Him`, 'right')
})


// receiving the message to other when someone sends a message
socket.on('receive', data =>{
     appand(`${data.name}: ${data.message}`, 'left')
})


// when someone lefts the chat itll tell the users
socket.on('left', name =>{
     appand(`${name} left the chat`, 'left')
})


// when someone send a message itll append the message to right for user(sender) and also emmits a send event with message. 
form.addEventListener('submit', (e)=>{
     e.preventDefault();
     const message = messageInput.value;
     if( message == ""){
          return
     }
     appand(`you: ${message}`, 'right');
     socket.emit('send', message);
     messageInput.value = ""
});