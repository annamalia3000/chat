import { addUserToList } from './addUserToList';

let currentUserId = null;

export function updateUsersList(users) {
    const usersList = document.querySelector('.users-list');

    const usersOnline = new Map();
    usersList.querySelectorAll('.user').forEach(user => {
        const userId = user.dataset.id;
        usersOnline.set(userId, user);
    });

    users.forEach(user => {
        if (!usersOnline.has(user.id)) {
            addUserToList(user);
        } else {
            usersOnline.delete(user.id);
        }
    });

    usersOnline.forEach(user => {
        user.remove();
    });

    // const usersNode = document.createElement('li');

    // usersNode.textContent = users;
    // usersList.appendChild(usersNode);

}