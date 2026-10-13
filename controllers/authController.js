import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../dbConnect.js";

export const Signup = async (req, res) => {
  try {
    const { fullname, phone, password, countrycode } = req.body;
    if (!fullname || !phone || !password || !countrycode) {
      return res.status(400).json({
        success: false,
        message: fullname
          ? phone
            ? password
              ? countrycode
                ? ""
                : "Country Code is required"
              : "Password is required"
            : "Phone is required"
          : "Full name is required",
      });
    }

    const users = await sql`SELECT * FROM users`;

    const isUserExist = users.find((u) => {
      if (u.fullname === fullname || u.phone === phone) {
        return true;
      }
    });
    if (!isUserExist) {
      const id = uuidv4();
      const createdat = new Date();
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log(hashedPassword);
      const signupResponse =
        await sql`INSERT INTO users(id, phone, fullname, password, countrycode, createdat) 
      VALUES(${id}, ${phone}, ${fullname}, ${hashedPassword}, ${countrycode}, ${createdat}) RETURNING *`;
      if (signupResponse.count > 0) {
        return res.status(200).json({
          success: true,
          message: "Signup Successfully",
          userid: signupResponse[0].userid,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "User is already exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const Signin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(404).json({
        success: false,
        message: phone
          ? password
            ? ""
            : "Password is required"
          : "Phone is required",
      });
    }
    const user = await sql`SELECT * FROM users
        WHERE phone = ${phone}`;
    if (user.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid Phone",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid Password",
      });
    }
    if (user.count > 0 && isValidPassword) {
      const accessToken = jwt.sign(
        { phone: user[0].phone, password: user[0].password },
        "accesstoken-secret-key",
        {
          expiresIn: "1m",
          algorithm: "HS256",
        },
      );
      const refreshToken = jwt.sign(
        { phone: user[0].phone, password: user[0].password },
        "refreshtoken-secret-key",
        {
          expiresIn: "7d",
          algorithm: "HS256",
        },
      );
      res.cookie("access-token", accessToken, {
        httpOnly: false,
        maxAge: 15 * 60 * 1000,
        path: "/",
        secure: false,
      });
      res.cookie("refresh-token", refreshToken, {
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 1000,
        path: "/",
        secure: false,
      });
      return res.status(200).json({
        success: true,
        message: "Sign In Successfull",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
