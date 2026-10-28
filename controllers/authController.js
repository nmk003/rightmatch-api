import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from "../dbConnect.js";

export const Signup = async (req, res) => {
  try {
    const { fullname, phone, password, email, gender, role } = req.body;
    if (!fullname || !phone || !password || !email || !gender || !role) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    const users = await sql`SELECT * FROM users`;

    const isUserExist = users.find((u) => {
      if (u.fullname === fullname || u.phone === phone) {
        return true;
      }
    });
    if (!isUserExist) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const signupResponse =
        await sql`INSERT INTO users(phone, fullname, email, password_hash, gender, role) 
      VALUES(${phone}, ${fullname}, ${email}, ${hashedPassword}, ${gender}, ${role}) RETURNING id, fullname, phone, email, gender, role `;
      if (signupResponse.count > 0) {
        return res.status(201).json({
          success: true,
          message: "User Created Successfully",
          data: signupResponse[0],
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
    const isValidPassword = await bcrypt.compare(
      password,
      user[0].password_hash,
    );
    if (!isValidPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid Password",
      });
    }
    if (user.count > 0 && isValidPassword) {
      const accessToken = jwt.sign(
        { phone: user[0].phone, password: user[0].password_hash },
        "accesstoken-secret-key",
        {
          expiresIn: "15m",
          algorithm: "HS256",
        },
      );
      const refreshToken = jwt.sign(
        { phone: user[0].phone, password: user[0].password_hash },
        "refreshtoken-secret-key",
        {
          expiresIn: "7d",
          algorithm: "HS256",
        },
      );
      res.cookie("access-token", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        path: "/",
        secure: true,
      });
      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 1000,
        path: "/",
        secure: true,
      });
      const loginUser =
        await sql`SELECT id, fullname, phone, email, gender, role FROM users
        WHERE phone = ${phone}`;
      return res.status(200).json({
        success: true,
        message: "Sign In Successfully",
        data: loginUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const Users = async (req, res) => {
  try {
    const usersResponse = await sql`SELECT * FROM users`;
    if (usersResponse.count > 0) {
      return res.status(200).json({
        success: true,
        message: "Users Fetched Successfully",
        data: usersResponse,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "No Users Data",
        data: usersResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
