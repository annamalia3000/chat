import { addUserToList } from './addUserToList';

export function updateUsersList(users) {
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
