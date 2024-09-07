import { currentUserName } from '/Users/Annamalia/Desktop/chat-frontend/src/js/chekNickname.js';
import { formatDate } from './formatDate';

export function addMessageToChat(message, author) {
    const chat = document.querySelector('.chat');

    const messageNode = document.createElement('div');

    const messageInfo = document.createElement('div');
    messageInfo.classList.add('message-info');

    const messageAuthor = document.createElement('div');
    messageAuthor.textContent = author;
    messageAuthor.classList.add('message-author'); 

    const messageData = document.createElement('div');
    messageData.textContent = formatDate(new Date()); 
    messageData.classList.add('message-data');

    messageInfo.appendChild(messageAuthor);
    messageInfo.appendChild(messageData);

    const messageText = document.createElement('div');
    messageText.textContent = message;
    messageText.classList.add('message-text'); 

    if (author === currentUserName) {
        messageAuthor.textContent = 'You';
        messageNode.classList.add('my-message'); 
    } 

    messageNode.appendChild(messageInfo);
    messageNode.appendChild(messageText);

    chat.appendChild(messageNode);
}
