import * as bcrypt from "bcrypt";

import { sql } from "../dbConnect.js";
import { generateJWTToken } from "../utils.js";

export const Signup = async (req, res) => {
  try {
    const { fullname, phone, password, email, gender, role } = req.body;
    if (!fullname || !phone || !password || !email || !gender || !role) {
      return res.status(400).json({
        message: "Please enter all required fields",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const users = await sql`SELECT * FROM users`;

    const isUserExist = users.find((u) => {
      if (u.phone === phone || u.email === email) {
        return true;
      }
    });

    if (!isUserExist) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const signinResponse =
        await sql`INSERT INTO users(phone, fullname, email, password_hash, gender, role)
      VALUES(${phone}, ${fullname}, ${email}, ${hashedPassword}, ${gender}, ${role}) RETURNING id, fullname, phone, email, gender, role, isactive`;

      generateJWTToken(signinResponse[0].id, res);

      return res.status(201).json({
        ...signinResponse[0],
      });
    } else {
      return res.status(400).json({
        message: "User is already exists",
      });
    }
  } catch (error) {
    console.log(error, "Error signing up");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Signin = async (req, res) => {
  const { phone, password } = req.body;
  try {
    if (!phone && !password) {
      return res.status(400).json({
        message: "Phone and Password are required",
      });
    }
    if (!phone || !password) {
      return res.status(400).json({
        message: phone
          ? password
            ? ""
            : "Password is required"
          : "Phone is required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    const user = await sql`SELECT * FROM users
        WHERE phone = ${phone}`;
    if (user.count === 0) {
      return res.status(400).json({
        message: "Invalid Phone",
      });
    }
    const isValidPassword = await bcrypt.compare(
      password,
      user[0].password_hash,
    );
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    generateJWTToken(user[0].id, res);

    const loginUser =
      await sql`SELECT id, fullname, phone, email, gender, role, isactive FROM users
        WHERE phone = ${phone}`;
    return res.status(200).json({
      ...loginUser[0],
    });
  } catch (error) {
    console.log(error, "Error signing in");
    return res.status(500).json({ message: "Internal Server Error" });
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
    console.log(error, "Error fetching users");
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const Signout = async (req, res) => {
  try {
    res.cookie("jwtToken", "", { maxAge: 0 });
    return res.status(200).json({
      message: "Sign Out Successfully",
    });
  } catch (error) {
    console.log(error, "Error signing out");
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const CheckAuth = async (req, res) => {
  try {
    return res.status(200).json({
      ...req.user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
