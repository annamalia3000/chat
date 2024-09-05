export function addMessageToChat(message, author) {
    const chat = document.querySelector('.chat');

    const messageNode = document.createElement('div');
    if (author === 'You') {
        messageNode.classList.add('my-message'); 
        messageNode.style.textAlign = 'right';
    } else {
        messageNode.classList.add('other-message'); 
        messageNode.style.textAlign = 'left'; 
    }

    messageNode.textContent = message;
    chat.appendChild(messageNode);
}