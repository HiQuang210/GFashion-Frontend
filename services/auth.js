import axiosClient from "../lib/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signUp = async (formData) => {
  const res = await axiosClient.post("user/sign-up", formData);
  console.log(res.data);

  return res.data;
};

export const logIn = async (formData) => {
  const res = await axiosClient.post("user/sign-in", formData);
  console.log(res.data);
  return res.data;
};

export const updateUser = async ({ id, data, file }) => {
  const token = await AsyncStorage.getItem("accessToken");

  if (!token) throw new Error("No token");

  if (file) {
    // Bạn có thể muốn thêm các field text vào FormData ở đây, ví dụ:
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        file.append(key, String(data[key]));
      }
    }

    // Gọi axios với FormData, để axios tự set Content-Type
    const respone = await axiosClient.put(`user/update-user/${id}`, file, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return respone.data;
  }

  const respone = await axiosClient.put(`user/update-user/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return respone.data;
};

export const detailUser = async (id) => {
  const token = await AsyncStorage.getItem("accessToken");

  if (!token) throw new Error("No token");
  const res = await axiosClient.get(`user/get-detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("auth");
  console.log(res);

  return res.data;
};

export const changePass = async ({ id, oldPassword, newPassword }) => {
  const token = await AsyncStorage.getItem("accessToken");

  if (!token) throw new Error("No token");

  console.log("reset");
  console.log(id);

  const res = await axiosClient.put(
    `user/change-password/${id}`,
    {
      oldPassword,
      newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
