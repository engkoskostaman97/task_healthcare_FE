import axios from "axios";

export const API = axios.create(
  // {
  //   baseURL: "https://virtuous-energy-production.up.railway.app/api/v1",
  // }
  {
    baseURL: "http://localhost:8087/api",
  }
  //   {
  //   baseURL: process.env.REACT_APP_BASEURL,
  // }
);
