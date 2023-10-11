import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Đăng ký ngữ cảnh
export const AuthContext = createContext();

// Nội dung ngữ cảnh
export const AuthContextProvider = ({ children }) => {
  
  
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });
    
    setCurrentUser(res.data)
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
