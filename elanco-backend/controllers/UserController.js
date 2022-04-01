import mongoose from "mongoose";
import UserProfile from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const logIn = async (req, res) => {
  let { email, password } = req.body;
  console.log(password);
  try {
    const existingUser = await UserProfile.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    
  
      const isPasswordCorrect =  bcrypt.compareSync(
        password,
        existingUser.password,
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
  console.log(req.body);
  try {
    const existingUser = await UserProfile.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "This email is already taken!" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "The password must be at least 8 characters long" });
    } else if (password !== confirmPassword) {
      return res.status(400).json({ message: "The passwords do not match" });
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
    res.status(500).json({ message: error });
  }
};
export const updateUser = async (req, res) => {
  const {
    _id,
    email,
    password,

    address,
    forename,
    surname,
    zip,
    phone,
    city,
    state,
    pets,
  } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const user = await UserProfile.findByIdAndUpdate(_id, {
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
