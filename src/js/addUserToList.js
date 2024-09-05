export function addUserToList(user) {
    const usersList = document.querySelector('.users-list');
    const newUserItem = document.createElement('li');
    newUserItem.classList.add('user');
    newUserItem.textContent = user.name;
    newUserItem.dataset.id = user.id; 
    usersList.appendChild(newUserItem);
}