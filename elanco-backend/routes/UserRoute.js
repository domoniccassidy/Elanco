import express from "express";
import { signup, logIn,updateUser} from "../controllers/UserController.js";
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
router.put("/update",(req, res, next) => {
  console.log(
    `Request from: ${req.originalUrl}, Request type: ${req.method}`
  );
  next();
},
updateUser)
export default router