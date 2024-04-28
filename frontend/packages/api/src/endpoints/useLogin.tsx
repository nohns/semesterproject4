/** @format */

import { useMutation } from "@tanstack/react-query";

import { client } from "../axios/axios";

export interface PostLoginRequest {
  username: string; //admin
  password: string; //MySecretPassword123
}

export interface PostLoginResponse {}

const postLogin = async (data: PostLoginRequest) => {
  return await client.post<PostLoginResponse>("/login", data);
};

//Custom Hook
export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: PostLoginRequest) => postLogin(data),
  });
};
