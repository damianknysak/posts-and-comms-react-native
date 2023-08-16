import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [isAuthLoading, setIsAuthLoading] = useState();
  const HOST_URI = "http://192.168.0.124:8000";
  const API_URI = `${HOST_URI}/api/v1`;

  const getResponse = async (
    requestData,
    route,
    method,
    authorization = ""
  ) => {
    const response = await fetch(`${API_URI}/${route}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authorization && `Bearer ${authorization}`,
      },
      body: requestData && JSON.stringify(requestData),
    });

    return response;
  };

  const onLoginClick = async (email, password, rememberUser) => {
    try {
      const requestData = {
        email: email,
        password: password,
      };

      const response = await getResponse(requestData, "login", "POST");
      const responseJson = await response.json();

      if (response.status == 201) {
        setToken(responseJson.token);
        setUser(responseJson.user);
        if (rememberUser) {
          await AsyncStorage.setItem("user", JSON.stringify(responseJson.user));
          await AsyncStorage.setItem("token", responseJson.token);
        }
        return "success";
      }

      if (!response.status.ok) {
        console.log(responseJson.message);
        return responseJson.message;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRegisterClick = async (
    name,
    email,
    password,
    confirmationPassword
  ) => {
    try {
      const requestData = {
        name: name,
        email: email,
        password: password,
        password_confirmation: confirmationPassword,
      };

      const response = await getResponse(requestData, "register", "POST");
      const responseJson = await response.json();

      if (response.status == 201) {
        setToken(responseJson.token);
        setUser(responseJson.user);
        return "success";
      }
      console.log(response.status);
      if (!response.status.ok) {
        return responseJson.message;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onLogoutClick = async () => {
    try {
      const response = await getResponse({}, "logout", "POST", token);
      console.log(token);

      const responseJson = await response.json();
      if (response.status == 200) {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
        setToken(responseJson.token);
        setUser(responseJson.user);
      }
      console.log(responseJson.message);
    } catch (e) {
      console.log(e);
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await getResponse(
        null,
        "/validate-tokens",
        "GET",
        token
      );
      if (response.status == 200) return true;
      return false;
    } catch (e) {
      console.error(e);
    }
  };

  const autoLogin = async () => {
    setIsAuthLoading(true);
    const storedUser = await AsyncStorage.getItem("user");
    const storedToken = await AsyncStorage.getItem("token");

    console.log(`storedToken: ${storedToken}`);
    console.log(`storedUser ${storedUser}`);
    setTimeout(() => {
      if (storedUser && storedToken) {
        setIsAuthLoading(false);

        if (validateToken(storedToken)) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      }
      setIsAuthLoading(false);
    }, 1000);
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        API_URI,
        HOST_URI,
        onLoginClick,
        onRegisterClick,
        onLogoutClick,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
