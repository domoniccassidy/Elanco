import axios from "axios"

const userApi = "http://localhost:5000/users"

export const signIn = (userData) => axios.post(`${userApi}/signin`,userData)

export const signUp = (userData) => axios.post(`${userApi}/signup`,userData)

export const updateUser = (userData) => axios.put(`${userApi}/update`,userData)