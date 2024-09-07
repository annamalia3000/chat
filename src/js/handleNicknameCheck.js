import { checkNickname } from './chekNickname';

export function handleNicknameCheck(event){
    if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')) {
        event.preventDefault();
        checkNickname();
    }
};