import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const login = (username, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}