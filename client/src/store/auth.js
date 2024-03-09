import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const URL = "https://contactmanagerbackend-y53j.onrender.com";

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };
  let isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
  };
  const userAuthentication = async () => {
    try {
      const response = await fetch(`${URL}/user/current`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("response", data);
        setUser(data);
      }
    } catch (error) {
      console.error(error, "Authentication failed");
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
        LogoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
