import React, { useState } from "react";
import { UserInfo } from "../model/userInfo";
import { Employee } from "../types/types";

// CONTEXT
interface AuthContextObj {
  isLoggedIn: boolean;
  userInfo: UserInfo | undefined;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextObj>({
  isLoggedIn: false,
  userInfo: undefined,
  login: (userInfo: UserInfo) => {},
  logout: () => {},
});

// CONTEXT PROVIDER

// Check if the user still logged in
const getLoggedInUserInfo = () => {
  console.log("in getLoggedInUserInfo");

  const storedExpirationTime = localStorage.getItem("expirationTime");
  const loggedUserName = localStorage.getItem("userName") || "";
  const loggedUserRole = localStorage.getItem("userRole") || "";
  let loggedIn = false;

  if (storedExpirationTime) {
    loggedIn = true;
    // 60000 is a minutes in milliseconds --> so if less the 1min we want the user to login again
    if (+storedExpirationTime - new Date().getTime() < 60000) {
      loggedIn = false;
      localStorage.clear();
    }
  }

  return {
    logged: loggedIn,
    loggedUserInfo: new UserInfo(loggedUserName, loggedUserRole),
  };
};

export const AuthContextProvider: React.FC = (props) => {
  const { logged, loggedUserInfo } = getLoggedInUserInfo();

  const [isLoggedIn, setIsLoggedIn] = useState(logged);
  const [userInfo, setUserInfo] = useState<UserInfo>(loggedUserInfo);

  const loginHandler = (userInfo: UserInfo) => {
    // Store the expirationTime in, to the local storage
    localStorage.setItem(
      "expirationTime",
      (new Date().getTime() + 3600000).toString()
    );

    // Store the user info in the storage
    localStorage.setItem("userName", userInfo.name);
    localStorage.setItem("userRole", userInfo.role);

    setIsLoggedIn(true);
    setUserInfo(userInfo);
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    setUserInfo(new UserInfo());

    localStorage.clear();
  };

  const contextValue: AuthContextObj = {
    isLoggedIn: isLoggedIn,
    userInfo: userInfo,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
