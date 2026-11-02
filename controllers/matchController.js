import { v4 as uuidv4 } from "uuid";
import { sql } from "../dbConnect.js";
import * as z from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dmrigyou3",
  api_key: "655435561719387",
  api_secret: "f3eLHkyyasMnbjCembwbGpYPk10",
  secure_distribution: "cloudinary.com",
  upload_prefix: "https://api-eu.cloudinary.com",
});

const userSchema = z.object({
  firstname: z.string({ message: "Firstname is required" }).nonempty(),
  surname: z.string({ message: "Surname is required" }).nonempty(),
  dob: z.string({ message: "DOB is required" }).nonempty(),
  gender: z.string({ message: "Gender is required" }).min(1).nonempty(),
  zodaicsign: z.string({ message: "Zodaic Sign is required" }).nonempty(),
  star: z.string({ message: "Star is required" }).nonempty(),
  gothram: z.string({ message: "Gothram is required" }).nonempty(),
  caste: z.string({ message: "Caste is required" }).nonempty(),
  subcaste: z.string({ message: "Subcaste is required" }).nonempty(),
  occupation: z.string({ message: "Occupation is required" }).nonempty(),
  company: z.string({ message: "Company is required" }).nonempty(),
  salary: z.string({ message: "Salary is required" }).nonempty(),
});

const updateUserSchema = z
  .object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    surname: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    zodaicsign: z.string().optional(),
    star: z.string().optional(),
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
    iscurrentaspermanent: z.boolean().optional(),
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

export const createMatch = async (req, res) => {
  try {
    if (userSchema.safeParse(req.body).success) {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();

      let formatDate =
        String(year) +
        String(month).padStart(2, "0") +
        String(date).padStart(2, "0");

      const usersServerResponse = await sql`SELECT * FROM matches
      WHERE created_at >= ${Number(formatDate)}`;

      const profileid = `RM${year}${month}${date}${usersServerResponse.count + 1}`;

      const {
        userid,
        firstname,
        lastname,
        surname,
        dob,
        gender,
        zodaicsign,
        star,
        religion,
        gothram,
        padam,
        caste,
        subcaste,
        occupation,
        company,
        salary,
        currency,
        mothername,
        worklocation,
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
        iscurrentaspermanent,
        permanentaddress,
        isactive,
        color,
        height,
      } = req.body;

      if (!isValidDob(dob)) {
        return res.status(400).json({
          error: "dob must be a valid date in YYYY-MM-DD format",
        });
      }

      const serverReponse = await sql`INSERT INTO matches(
      user_id,
      profile_id,
      firstname, 
      lastname, 
      surname,
      gender, 
      dob,
      color,
      height,
      zodaicsign,
      star,
      padam,
      religion, 
      gothram,
      caste, 
      subcaste,
      occupation, 
      company, 
      salary, 
      currency,
      worklocation,
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
      isactive,
      currentaddress,
      permanentaddress,
      iscurrentaspermanent) VALUES(
       ${userid}, 
       ${profileid}, 
       ${firstname}, 
       ${lastname}, 
       ${surname},
       ${gender},
       ${dob},
       ${color},
       ${height},
       ${zodaicsign},
       ${star},
       ${padam},
       ${religion},
       ${gothram},
       ${caste},
       ${subcaste},
       ${occupation},
       ${company},
       ${salary},
       ${currency},
       ${worklocation},
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
       ${isactive},
       ${currentaddress}, 
       ${iscurrentaspermanent ? permanentaddress : currentaddress},
       ${iscurrentaspermanent}) RETURNING (profile_id)`;

      if (serverReponse.count > 0) {
        return res.status(201).json({
          success: true,
          message: "User Created Successfully",
          profileid: serverReponse[0].profile_id,
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

export const getMatches = async (req, res) => {
  try {
    const { gender } = req.query;
    const _gen = gender === "male" ? "female" : "male";

    const serverResponse = await sql`SELECT
          m.*,
          EXISTS (
              SELECT 1
              FROM favorites f
              WHERE f.profile_userid = m.user_id
          ) AS "isLiked"
      FROM matches m
      WHERE gender = ${_gen}`;
    if (serverResponse.count > 0) {
      return res.status(200).json({
        success: true,
        data: serverResponse,
      });
    } else {
      return res.status(200).json({
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

export const getMatch = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid id",
      });
    }
    const serverResponse = await sql`SELECT * FROM matches where id = ${id}`;
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

export const updateMatch = async (req, res) => {
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
      UPDATE matches
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

export const Profile = async (req, res) => {
  try {
    const { id } = req.params;
    const usersResponse =
      await sql`SELECT * from matches WHERE user_id = ${id}`;
    if (usersResponse.count > 0) {
      return res.status(200).json({
        success: true,
        message: "Profile Fetched Successfully",
        data: usersResponse,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No Profile Data",
        data: usersResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const Favorite = async (req, res) => {
  try {
    const { profile_userid, isLiked, user_id, profile_id } = req.body;
    const favoriteResponse = await sql`INSERT INTO favorites(
    user_id,
    profile_userid,
    isLiked,
    profile_id) VALUES(${user_id}, ${profile_userid}, ${isLiked}, ${profile_id}) RETURNING *`;
    if (favoriteResponse.count > 0) {
      return res.status(200).json({
        success: true,
        message: "Favorite",
        data: favoriteResponse,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Something Went wrong",
        data: favoriteResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const Unfavorite = async (req, res) => {
  try {
    const { profile_userid, isLiked, user_id, profile_id } = req.body;
    const favoriteResponse = await sql`UPDAT TABLE favorites(
    SET isLike = ${isLiked}) 
    WHERE profile_useid = ${profile_userid} AND user_id = ${user_id}`;
    if (favoriteResponse.count > 0) {
      return res.status(200).json({
        success: true,
        message: "Favorite",
        data: favoriteResponse,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Something Went wrong",
        data: favoriteResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
const uploadIntoCloudinary = async (file) => {
  return cloudinary.uploader.upload(file, {
    folder: "matches/profiles",
    resource_type: "image",
  });
};
export const UploadPhotos = async (req, res) => {
  try {
    const { user_id } = req.body;
    // if (!req.files?.length > 0) {
    //   return res.status(200).json({
    //     message: "Please select the images",
    //   });
    // }

    const result = await Promise.all(
      req.files?.map((file) => uploadIntoCloudinary(file.path)),
    );
    const photos = result?.map((r) => {
      return {
        asset_id: r.asset_id,
        url: r.url,
      };
    });
    const _res = await sql`INSERT INTO photos(
      user_id, photos) VALUES(${user_id}, ${photos}) RETURNING *`;
    res.status(200).json({
      success: true,
      message: "Photos Uploaded Successfully",
      data: _res,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
