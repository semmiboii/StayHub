import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user";

import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";

import verifyToken from "../middleware/auth";

const router = express.Router();

// ENDPOINT - /api/auth/login

router.post(
  "/login",
  [
    check("email", "EMAIL_IS_REQUIRED").isEmail(),
    check("password", "PASSWORD_WITH_6_OR_MORE_CHARACHTERS_IS_REQUIRED"),
  ],
  async (req: Request, res: Response) => {
    // CHECKING ERRORS THROWN BY express-validator

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      // CHECKING IF USER EXISTS
      if (!user) {
        return res.status(400).json({ messsage: "INVALID_CREDENTIALS" });
      }

      // IF EXISTS THEN COMPARING PASSWORD
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "INVALID_CREDENTIALS" });
      }

      // CREATING JWT AUTH_TOKEN
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      // SETTING AUTH_TOKEN MADE BY JWT COOKIE
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user._id });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "SOMETHING_WENT_WRONG " });
    }
  }
);

//ENDPOINT - /api/auth/validate-token

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

export default router;
