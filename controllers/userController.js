import { v4 as uuidv4 } from "uuid";
import { sql } from "../dbConnect.js";
import * as z from "zod";

const userSchema = z.object({
  firstname: z.string({ message: "Firstname is required" }).nonempty(),
  surname: z.string({ message: "Surname is required" }).nonempty(),
  dob: z.string({ message: "DOB is required" }).nonempty(),
  gender: z.string({ message: "Gender is required" }).min(1).nonempty(),
  rasi: z.string({ message: "Rasi is required" }).nonempty(),
  nakshatram: z.string({ message: "Nakshatram is required" }).nonempty(),
  gothram: z.string({ message: "Gothram is required" }).nonempty(),
  caste: z.string({ message: "Caste is required" }).nonempty(),
  subcaste: z.string({ message: "Subcaste is required" }).nonempty(),
  occupation: z.string({ message: "Occupation is required" }).nonempty(),
  company: z.string({ message: "Company is required" }).nonempty(),
  salary: z.number({ message: "Salary is required" }).nonnegative(),
});

const updateUserSchema = z
  .object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    surname: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    rasi: z.string().optional(),
    nakshatram: z.string().optional(),
    religion: z.string().optional(),
    gothram: z.string().optional(),
    caste: z.string().optional(),
    subcaste: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    salary: z.number().nonnegative().optional(),
    currency: z.string().optional(),
    mothername: z.string().optional(),
    motheroccupation: z.string().optional(),
    fathername: z.string().optional(),
    fatheroccupation: z.string().optional(),
    sisters: z.string().optional(),
    numofsisters: z.number().optional(),
    marriedsisters: z.number().optional(),
    brothers: z.string().optional(),
    numofbrothers: z.number().optional(),
    marriedbrothers: z.number().optional(),
    currentaddress: z.string().optional(),
    iscurrentaspemanent: z.boolean().optional(),
    permanentaddress: z.string().optional(),
  })
  .strict();

const isValidDob = (dob) => {
  if (typeof dob !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return false;
  }

  const parsedDob = new Date(`${dob}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsedDob.getTime()) &&
    parsedDob.toISOString().slice(0, 10) === dob
  );
};

export const createUser = async (req, res) => {
  try {
    if (userSchema.safeParse(req.body).success) {
      const id = uuidv4();
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();

      let formatDate =
        String(year) +
        String(month).padStart(2, "0") +
        String(date).padStart(2, "0");

      const usersServerResponse = await sql`SELECT * FROM users
      WHERE createdate >= ${Number(formatDate)}`;

      let userid = `RM${year}${month}${date}${usersServerResponse.count + 1}`;

      const createdate = new Date();
      const {
        firstname,
        lastname,
        surname,
        dob,
        gender,
        rasi,
        nakshatram,
        religion,
        gothram,
        caste,
        subcaste,
        occupation,
        company,
        salary,
        currency,
        mothername,
        motheroccupation,
        fathername,
        fatheroccupation,
        sisters,
        numofsisters,
        marriedsisters,
        brothers,
        numofbrothers,
        marriedbrothers,
        currentaddress,
        iscurrentaspemanent,
        permanentaddress,
      } = req.body;

      if (!isValidDob(dob)) {
        return res.status(400).json({
          error: "dob must be a valid date in YYYY-MM-DD format",
        });
      }

      // await sql`CREATE TABLE users(
      // id UUID PRIMARY KEY NOT NULL,
      // userid VARCHAR(100) NOT NULL,
      // firstname VARCHAR(100),
      // lastname VARCHAR(100),
      // surname VARCHAR(100) NOT NULL,
      // dob DATE NOT NULL,
      // rasi VARCHAR(100) NOT NULL,
      // nakshatram VARCHAR(100) NOT NULL,
      // religion VARCHAR(100) NOT NULL,
      // gothram VARCHAR(100) NOT NULL,
      // caste VARCHAR(100) NOT NULL,
      // subcaste VARCHAR(100) NOT NULL,
      // occupation VARCHAR(100) NOT NULL,
      // company VARCHAR(100) NOT NULL,
      // salary INT NOT NULL,
      // currency CHAR(10),
      // mothername VARCHAR(100),
      // motheroccupation VARCHAR(100),
      // fathername VARCHAR(100),
      // fatheroccupation VARCHAR(100),
      // sisters CHAR(5),
      // numofsisters INT,
      // marriedsisters INT,
      // brothers CHAR(5),
      // numofbrothers INT,
      // marriedbrothers INT
      // )`;

      const serverReponse = await sql`INSERT INTO users(
      id, 
      userid, 
      firstname, 
      lastname, 
      surname, 
      dob,
      gender,
      rasi, 
      nakshatram, 
      religion, 
      gothram, 
      caste, 
      subcaste, 
      occupation, 
      company, 
      salary, 
      currency,
      mothername, motheroccupation, fathername, fatheroccupation,
      sisters,
      numofsisters,
      marriedsisters,
      brothers,
      numofbrothers,
      marriedbrothers,
      createdate,
      currentaddress,
      iscurrentaspemanent,
      permanentaddress
      ) VALUES(
       ${id}, 
       ${userid}, 
       ${firstname}, 
       ${lastname}, 
       ${surname},
       ${dob},
       ${gender},
       ${rasi},
       ${nakshatram},
       ${religion},
       ${gothram},
       ${caste},
       ${subcaste},
       ${occupation},
       ${company},
       ${salary},
       ${currency},
       ${mothername},
       ${motheroccupation},
       ${fathername},
       ${fatheroccupation},
       ${sisters},
       ${numofsisters},
       ${marriedsisters},
       ${brothers},
       ${numofbrothers},
       ${marriedbrothers},
       ${createdate}, 
       ${currentaddress}, 
       ${iscurrentaspemanent}, ${iscurrentaspemanent ? currentaddress : permanentaddress}) RETURNING (userid)`;

      if (serverReponse.count > 0) {
        return res.status(201).json({
          success: true,
          message: "User Created Successfully",
          userid: serverReponse[0].userid,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: userSchema.safeParse(req.body).error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search, city } = req.query;
    

    const serverResponse = await sql`SELECT * FROM users
    WHERE firstname ILike ${search}`;
    if (serverResponse.count > 0) {
      return res.status(200).json({
        success: true,
        data: serverResponse,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "No Data Found",
        data: serverResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid id",
      });
    }
    const serverResponse = await sql`SELECT * FROM users where id = ${id}`;
    if (serverResponse.count > 0) {
      return res.status(200).json({
        success: true,
        data: serverResponse[0],
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "No Data Found",
        data: serverResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid id",
      });
    }

    const parsedBody = updateUserSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: parsedBody.error.message,
      });
    }

    const updates = parsedBody.data;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    if (updates.dob !== undefined && !isValidDob(updates.dob)) {
      return res.status(400).json({
        success: false,
        message: "dob must be a valid date in YYYY-MM-DD format",
      });
    }

    const serverResponse = await sql`
      UPDATE users
      SET ${sql(updates)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (serverResponse.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Data Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: serverResponse[0],
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getFilteredUsers = async (req, res) => {
  try {
    const serverResponse = await sql`SELECT * FROM users`;
    if (serverResponse.count > 0) {
      return res.status(200).json({
        success: true,
        data: serverResponse,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "No Data Found",
        data: serverResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
