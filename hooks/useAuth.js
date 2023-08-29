import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [isAuthLoading, setIsAuthLoading] = useState();
  const navigation = useNavigation();
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

  const refreshUser = async () => {
    try {
      const response = await getResponse(
        null,
        `users/${user.id}`,
        "GET",
        token
      );
      if (response.status == 200) {
        const responseJson = await response.json();
        setUser(responseJson);
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          await AsyncStorage.removeItem("user");
          await AsyncStorage.setItem("user", JSON.stringify(responseJson));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserDateOfBirth = async (date) => {
    try {
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, "0");
      var day = String(date.getDate()).padStart(2, "0");

      // Składanie daty w formacie "YYYY-MM-DD"
      var formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate);
      const response = await getResponse(
        { date_of_birth: formattedDate },
        `users/edit/${user.id}`,
        "POST",
        token
      );
      console.log(response.status);
      if (response.status == 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
    }
  };

  const updateUser = async (image) => {
    try {
      let uploadData = new FormData();
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "multipart/form-data");
      myHeaders.append("Authorization", `Bearer ${token}`);
      if (image) {
        uploadData.append("profile_image", {
          type: "image/jpeg",
          uri: image,
          name: "upload.jpg",
        });
      }

      const response = await fetch(`${API_URI}/users/edit/${user.id}`, {
        method: "POST",
        headers: myHeaders,
        body: uploadData,
      });
      if (response.status.ok) return true;
      return false;
    } catch (e) {
      console.error(e);
    }
  };

  const resetPassword = async (
    currentPassword,
    newPassword,
    passwordConfirmation
  ) => {
    try {
      const requestData = {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      };
      const response = await getResponse(
        requestData,
        `users/update-password/${user.id}`,
        "POST",
        token
      );
      const responseJson = JSON.stringify(response);

      if (response.status == 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
    }
  };

  const setSessionData = async (user, token, rememberUser = false) => {
    setToken(token);
    setUser(user);
    if (rememberUser == true) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);
    }
  };
  const sendVerificationEmail = async (email, password) => {
    try {
      const requestData = {
        email: email,
        password: password,
      };
      const response = await getResponse(
        requestData,
        "send-verification-email",
        "POST"
      );
      if (response.status == 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
    }
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
        //if email is not verified go to VerifyEmailScreen
        if (await EmailVerificationStatus(responseJson.user.id)) {
          setSessionData(responseJson.user, responseJson.token, rememberUser);
        } else {
          sendVerificationEmail(email, password);
          navigation.navigate("VerifyEmail", {
            user: responseJson.user,
            token: responseJson.token,
          });
        }

        return "success";
      }

      if (!response.status.ok) {
        return responseJson.message;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const EmailVerificationStatus = async (id) => {
    try {
      const response = await getResponse(
        null,
        `user/${id}/is-email-verified`,
        "GET"
      );
      if (response.status == 200) return true;
      return false;
    } catch (e) {
      console.error(e);
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
        if (await EmailVerificationStatus(responseJson.user.id)) {
          setSessionData(responseJson.user, responseJson.token);
        } else {
          navigation.navigate("VerifyEmail", {
            user: responseJson.user,
            token: responseJson.token,
          });
        }
        return "success";
      }
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
      const responseJson = await response.json();
      if (response.status == 200) {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
        setToken(responseJson.token);
        setUser(responseJson.user);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const validateToken = async (token) => {
    try {
      const storageToken = await AsyncStorage.getItem("token");
      const response = await getResponse(
        null,
        "validate-token",
        "GET",
        storageToken
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
    setTimeout(async () => {
      if (storedUser && storedToken) {
        setIsAuthLoading(false);
        if ((await validateToken(storedToken)) == true) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("token");
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
        EmailVerificationStatus,
        setSessionData,
        refreshUser,
        updateUser,
        resetPassword,
        updateUserDateOfBirth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
