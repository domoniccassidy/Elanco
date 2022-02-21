import mongoose from "mongoose";
import UserProfile from "../models/userModel.js";
import bcrypt from "bcryptjs"

export const logIn = async (req, res) => {
  let { username, password } = req.body;
  try {
    const existingUser = await UserProfile.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    res.status(200).json({ user: existingUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const signup = async (req, res) => {
  const { email, password, confirmPassword, username } = req.body;
  try {
    const existingUser = await UserProfile.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This username is already taken!" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "The passwords do not match!" });
    }
    

    const hashedPassword = bcrypt.hashSync(password,10)
    const user = await UserProfile.create({
      username,
      password:hashedPassword,
      email,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

