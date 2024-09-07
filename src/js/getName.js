let currentUserName = null;

export function setCurrentUserName(name) {
    currentUserName = name;
}

export function getCurrentUserName() {
    return currentUserName;
}