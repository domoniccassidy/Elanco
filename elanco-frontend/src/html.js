import axios from "axios";

const userApi = "https://elanco-heroku.herokuapp.com/users";

export const signIn = (userData) => axios.post(`${userApi}/signin`, userData);

export const signUp = (userData) => axios.post(`${userApi}/signup`, userData);

export const updateUser = (userData) =>
  axios.put(`${userApi}/update`, userData);
