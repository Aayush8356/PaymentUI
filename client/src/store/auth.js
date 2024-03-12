import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState({});
  const URL = 'http://localhost:5000';

  const storeTokenInLS = serverToken => {
    setToken(serverToken);
    localStorage.setItem('token', serverToken);
  };
  let isLoggedIn = !!token;
  const [login, setLogin] = useState(isLoggedIn);

  const LogoutUser = () => {
    setToken('');
    localStorage.removeItem('token');
  };
  const userAuthentication = async () => {
    try {
      const response = await fetch(`${URL}/user/current`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('response', data);
        setUser(data);
      } else if (response.status === 401) {
        console.log('token expired');
        setLogin(false);
        setToken('');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error(error, 'Authentication failed');
    }
  };
  useEffect(() => {
    userAuthentication();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        storeTokenInLS,
        user,
        login,
        LogoutUser,
        userAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error('useAuth used outside of the Provider');
  }
  return authContextValue;
};
