import {useEffect, useState} from 'react';
import base64 from 'react-native-base64';

export const useToken = (clientID: string, secret: string) => {
  const [token, setToken] = useState<string>('');
  useEffect(() => {
    if (!token) {
      const getToken = async () => {
        try {
          const data = await fetch('https://oauth.battle.net/token', {
            method: 'post',
            body: `${encodeURIComponent('grant_type')}=${encodeURIComponent(
              'client_credentials'
            )}`,
            headers: {
              Authorization: `Basic ${base64.encode(`${clientID}:${secret}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          const res = await data.json();
          setToken(res.access_token);
        } catch (e) {
          console.log(e);
        }
      };
      getToken();
    }
  }, [token]);
  return token;
};
