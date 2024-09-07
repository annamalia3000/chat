import { handleNicknameCheck } from './handleNicknameCheck';

const nicknameInput = document.querySelector('.field-input-name');
const continueButton = document.querySelector('.popup_btn-continue');

continueButton.addEventListener('click', handleNicknameCheck);
nicknameInput.addEventListener('keydown', handleNicknameCheck);
