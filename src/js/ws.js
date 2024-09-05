import { updateUsersList } from './updateUsersList';
import { addMessageToChat } from './addMessageToChat';

const ws = new WebSocket('ws://localhost:3000/ws');
const chatMessage = document.querySelector('.chat-message');

let currentUser = null; // Хранит текущего пользователя

chatMessage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const message = chatMessage.value;
        if (!message) {
            return;
        }

        ws.send(JSON.stringify({
            type: 'send',
            message,
            author: currentUser 
        }));

        chatMessage.value = '';
    }
});

ws.addEventListener('open', (e) => {
    console.log('WebSocket соединение открыто:', e);
    if (currentUser) {
        ws.send(JSON.stringify({
            type: 'new-user',  
            name: currentUser
        }));
    }
});

ws.addEventListener('close', (e) => {
    console.log('WebSocket соединение закрыто:', e);
});

ws.addEventListener('message', (e) => {
    console.log(e);

    const data = JSON.parse(e.data);

    if (data.type === 'update-users') {
        updateUsersList(data.users);

        currentUser = data.users.find(user => user.name === currentUser);
        if (currentUser) {
            currentUser = user.name;
        }
    }

    if (data.type === 'new-message') {
        addMessageToChat(data.message.text, data.message.author);
    }
});

ws.addEventListener('error', (e) => {
    console.log('Ошибка WebSocket:', e);
});
