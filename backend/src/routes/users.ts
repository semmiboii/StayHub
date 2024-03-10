import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// ENDPOINT - /api/users/register

router.post(
  "/register",
  [
    check("firstName", "FIRST_NAME_IS_REQUIRED").isString(),
    check("lastName", "LAST_NAME_IS_REQUIRED").isString(),
    check("email", "EMAIL_IS_REQUIRED").isString(),
    check("password", "PASSWORD_MUST_BE_6_OR_MORE_CHARACHTERS").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    //CHECKING FOR ERRORS THROWN BY express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });

      //CHECKING IF A USER ALREADY EXISTS
      if (user) {
        return res.status(400).json({ message: "USER_ALREADY_EXISTS" });
      }

      //CREATING NEW USER IF USER DOESN'T EXIST
      user = new User(req.body);
      await user.save();

      //CREATING AUTH TOKEN
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

      return res.status(200).send({ message: "USER_REGISTERED_OK" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "SOMETHING_WENT_WRONG" });
    }
  }
);

export default router;
