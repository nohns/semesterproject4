/** @format */

import { useMutation } from "@tanstack/react-query";
import { client } from "../axios/axios";

export interface PostLoginRequest {
  username: string;
  password: string;
}

export interface PostLoginResponse {}

const postLogin = async (data: PostLoginRequest) => {
  return await client.post<PostLoginResponse>("/auth/login", data);
};

// Custom Hook
export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: PostLoginRequest) => postLogin(data),
  });
};
