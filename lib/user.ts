import { getCookie } from 'cookies-next';

export const cokkieProvider = () => {
    const userInfoStr: any = getCookie('CLR');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        return userInfo;
      } catch (error) {
        console.error('Error parsing cookie value:', error);
      }
    }
    return null; 
  };
  