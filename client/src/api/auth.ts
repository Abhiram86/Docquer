/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { FormData } from "../pages/Auth";
// import { auth } from "../../firebase";

const api = axios.create({
  baseURL: "https://docquerserver.vercel.app/auth",
});

export const register = async (data: FormData) => {
  try {
    const response = await api.post("/register", {
      ...data,
      groq_api_key: "",
    });
    if (response.data.token) {
      // localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const login = async (data: {
  email: string;
  username: string | null;
  password: string | null;
  GoogleLogin: boolean;
}) => {
  try {
    const response = await api.post("/login", data);
    if (response.data.token) {
      // localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const update = async (data: {
  id: string;
  username: string;
  email: string;
  groq_api_key: string;
}) => {
  try {
    const response = await api.post("/update", data);
    if (response.data.message === "success") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
    }
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};
