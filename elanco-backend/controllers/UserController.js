import mongoose from "mongoose";
import UserProfile from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const logIn = async (req, res) => {
  let { email, password } = req.body;
  try {
    const existingUser = await UserProfile.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    res.status(200).json({ user: existingUser });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
export const signup = async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    address,
    forename,
    surname,
    zip,
    phone,
    city,
    state,
    pets,
  } = req.body;
  try {
    const existingUser = await UserProfile.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This username is already taken!" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "The passwords do not match!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await UserProfile.create({
      forename,
      surname,
      address,
      zip,
      phone,
      city,
      state,
      password: hashedPassword,
      email,
      pets,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateUser = async (req, res) => {
  const {
    _id,
    email,
    password,
    confirmPassword,
    address,
    forename,
    surname,
    zip,
    phone,
    city,
    state,
    pets,
  } = req.body;
  try {
    const user = await UserProfile.findByIdAndUpdate(_id, {
      forename,
      surname,
      address,
      zip,
      phone,
      city,
      state,
      password,
      email,
      pets,
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
