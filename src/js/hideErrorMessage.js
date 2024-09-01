export function hideErrorMessage() {
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
        document.removeEventListener('click', hideErrorMessage);
    }
}