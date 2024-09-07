import { updateUsersList } from './updateUsersList';
import { addMessageToChat } from './addMessageToChat';

export function initializeWebSocketConnection(userName) {
    const ws = new WebSocket('ws://localhost:3000/ws');
    const chatMessage = document.querySelector('.chat-message');

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
                author: userName
            }));

            chatMessage.value = '';
        }
    });

    ws.addEventListener('open', (e) => {
        console.log('WebSocket соединение открыто:', e);
        if (userName) {
            ws.send(JSON.stringify({
                type: 'new-user',
                name: userName
            }));
        }
    });

    ws.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);

        if (data.type === 'update-users') {
            updateUsersList(data.users); 
        }

        if (data.type === 'message-history') {
            data.messages.forEach(message => {
                addMessageToChat(message.text, message.author);
            });
        }

        if (data.type === 'new-message') {
            addMessageToChat(data.message.text, data.message.author);
        }
    });

    ws.addEventListener('close', (e) => {
        console.log('WebSocket соединение закрыто:', e);
    });

    ws.addEventListener('error', (e) => {
        console.log('Ошибка WebSocket:', e);
    });

    window.addEventListener('beforeunload', () => {
        if (userName) {
            ws.send(JSON.stringify({
                type: 'exit',
                name: userName
            }));
        }
    });
}
