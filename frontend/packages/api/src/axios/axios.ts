/** @format */

import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:5051/v1",
  withCredentials: true,
});
