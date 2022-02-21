import express from "express";
import { signup, logIn } from "../controllers/UserController.js";
const router = express.Router();

router.post(
  "/signin",
  (req, res, next) => {
    console.log(
      `Request from: ${req.originalUrl}, Request type: ${req.method}`
    );
    next();
  },
  logIn
);
router.post(
  "/signup",
  (req, res, next) => {
    console.log(
      `Request from: ${req.originalUrl}, Request type: ${req.method}`
    );
    next();
  },
  signup
);

export default router