/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/addUserToList.js
function addUserToList(user) {
  const usersList = document.querySelector('.users-list');
  const newUserItem = document.createElement('li');
  newUserItem.classList.add('user');
  newUserItem.textContent = user.name;
  newUserItem.dataset.id = user.id;
  usersList.appendChild(newUserItem);
}
;// CONCATENATED MODULE: ./src/js/hideErrorMessage.js
function hideErrorMessage() {
  const errorMessage = document.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.style.display = 'none';
    document.removeEventListener('click', hideErrorMessage);
  }
}
;// CONCATENATED MODULE: ./src/js/updateUsersList.js

function updateUsersList(users) {
  const usersList = document.querySelector('.users-list');
  const existingUsers = new Map();
  usersList.querySelectorAll('.user').forEach(user => {
    const userId = user.dataset.id;
    existingUsers.set(userId, user);
  });
  users.forEach(user => {
    if (!existingUsers.has(user.id)) {
      addUserToList(user);
    } else {
      existingUsers.delete(user.id);
    }
  });
  existingUsers.forEach(user => {
    user.remove();
  });
}
;// CONCATENATED MODULE: ./src/js/formatDate.js
function formatDate(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}
;// CONCATENATED MODULE: ./src/js/getName.js
let currentUserName = null;
function setCurrentUserName(name) {
  currentUserName = name;
}
function getCurrentUserName() {
  return currentUserName;
}
;// CONCATENATED MODULE: ./src/js/addMessageToChat.js


function addMessageToChat(message, author) {
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
  const currentUserName = getCurrentUserName();
  if (author === currentUserName) {
    messageAuthor.textContent = 'You';
    messageNode.classList.add('my-message');
  }
  messageNode.appendChild(messageInfo);
  messageNode.appendChild(messageText);
  chat.appendChild(messageNode);
}
;// CONCATENATED MODULE: ./src/js/ws.js


function initializeWebSocketConnection(userName) {
  const ws = new WebSocket('ws://localhost:3000/ws');
  const chatMessage = document.querySelector('.chat-message');
  chatMessage.addEventListener('keydown', event => {
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
  ws.addEventListener('open', e => {
    console.log('WebSocket соединение открыто:', e);
    if (userName) {
      ws.send(JSON.stringify({
        type: 'new-user',
        name: userName
      }));
    }
  });
  ws.addEventListener('message', e => {
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
  ws.addEventListener('close', e => {
    console.log('WebSocket соединение закрыто:', e);
  });
  ws.addEventListener('error', e => {
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
;// CONCATENATED MODULE: ./src/js/chekNickname.js




const baseURL = 'http://localhost:3000';
async function checkNickname() {
  let currentUserName = null;
  const nicknameInput = document.querySelector('.field-input-name');
  const nickname = nicknameInput.value.trim();
  const errorMessage = document.querySelector('.error-message');
  if (!nickname) {
    errorMessage.textContent = 'Пожалуйста, введите псевдоним';
    errorMessage.style.display = 'block';
    setTimeout(() => {
      document.addEventListener('click', hideErrorMessage);
    }, 0);
    return null;
  }
  document.removeEventListener('click', hideErrorMessage);
  try {
    const response = await fetch(`${baseURL}/new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nickname
      })
    });
    if (response.ok) {
      const result = await response.json();
      if (result.status === 'ok') {
        console.log('Никнейм зарегистрирован:', result.user.name);
        document.querySelector('.popup__choose-name').style.display = 'none';
        document.querySelector('.chat-widget').style.display = 'block';
        const usersList = document.querySelector('.users-list');
        usersList.innerHTML = '';
        addUserToList(result.user);
        currentUserName = result.user.name;
        setCurrentUserName(currentUserName);
        initializeWebSocketConnection(currentUserName);
        const usersElements = usersList.querySelectorAll('.user');
        usersElements.forEach(user => {
          if (user.dataset.id === result.user.id) {
            user.textContent = 'You';
            user.classList.add('my-nickname');
          }
        });
        nicknameInput.value = '';
        return currentUserName;
      } else {
        throw new Error(result.message);
      }
    } else if (response.status === 409) {
      errorMessage.textContent = 'Этот псевдоним уже занят!';
      errorMessage.style.display = 'block';
      setTimeout(() => {
        document.addEventListener('click', hideErrorMessage);
      }, 0);
      nicknameInput.value = '';
    }
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  }
  return null;
}
;// CONCATENATED MODULE: ./src/js/handleNicknameCheck.js

function handleNicknameCheck(event) {
  if (event.type === 'click' || event.type === 'keydown' && event.key === 'Enter') {
    event.preventDefault();
    checkNickname();
  }
}
;
;// CONCATENATED MODULE: ./src/js/app.js

const nicknameInput = document.querySelector('.field-input-name');
const continueButton = document.querySelector('.popup_btn-continue');
continueButton.addEventListener('click', handleNicknameCheck);
nicknameInput.addEventListener('keydown', handleNicknameCheck);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map