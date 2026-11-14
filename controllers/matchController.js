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

const matchSchema = z.object({
  firstname: z.string({ message: "Firstname is required" }).nonempty(),
  surname: z.string({ message: "Surname is required" }).nonempty(),
  height: z.string({ message: "Height is required" }).nonempty(),
  dob: z.string({ message: "DOB is required" }).nonempty(),
  gender: z.string({ message: "Gender is required" }).nonempty(),
  zodaicsign: z.string({ message: "Zodaic Sign is required" }).nonempty(),
  star: z.string({ message: "Star is required" }).nonempty(),
  religion: z.string({ message: "Religion is required" }).nonempty(),
  gothram: z.string({ message: "Gothram is required" }).nonempty(),
  caste: z.string({ message: "Caste is required" }).nonempty(),
  subcaste: z.string({ message: "Subcaste is required" }).nonempty(),
  occupation: z.string({ message: "Occupation is required" }).nonempty(),
  company: z.string({ message: "Company is required" }).nonempty(),
  salary: z.string({ message: "Salary is required" }).nonempty(),
  currency: z.string({ message: "Currency is required" }).min(1).nonempty(),
  mothername: z.string({ message: "Mother Name is required" }).nonempty(),
  worklocation: z.string({ message: "Work Location is required" }).nonempty(),
  mothername: z.string({ message: "Mother Name is required" }).nonempty(),
  fathername: z.string({ message: "Father Name is required" }).nonempty(),
});

export const createMatch = async (req, res) => {
  console.log(matchSchema.safeParse(req.body).success);
  try {
    if (matchSchema.safeParse(req.body).success) {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();

      let formatDate =
        String(year) +
        String(month).padStart(2, "0") +
        String(date).padStart(2, "0");

      const usersServerResponse = await sql`SELECT * FROM matches
      WHERE created_at >= ${Number(formatDate)}`;

      const profileid = `RM${year}${month}${date}${usersServerResponse.count}`;

      const {
        userid,
        firstname,
        lastname = null,
        surname,
        dob,
        gender,
        zodaicsign,
        star,
        religion,
        gothram,
        padam = null,
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
        sisters = null,
        numofsisters = null,
        marriedsisters = null,
        brothers = null,
        numofbrothers = null,
        marriedbrothers = null,
        currentaddress = null,
        iscurrentaspermanent = false,
        permanentaddress = null,
        color = null,
        height,
      } = req.body;

      const serverReponse = await sql`INSERT INTO matches(
      userid,
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
       ${currentaddress}, 
       ${iscurrentaspermanent ? currentaddress : permanentaddress},
       ${iscurrentaspermanent}) RETURNING (profile_id)`;

      if (serverReponse.count > 0) {
        return res.status(201).json({
          message: "User Created Successfully",
          profileid: serverReponse[0].profile_id,
        });
      } else {
        return res.status(409).json({
          message: "User Id shouldnot be duplicate",
        });
      }
    } else {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }
  } catch (error) {
    console.log(error, "Error creating match");
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMatches = async (req, res) => {
  const { gender, id } = req.query;
  try {
    const _gen = gender === "male" ? "female" : "male";

    const serverResponse = await sql`
    SELECT m.*, f.isliked, p.photos FROM matches m
    LEFT JOIN favorites f ON f.profile_userid = m.userid AND f.userid = ${id}
    LEFT JOIN photos p ON p.userid = m.userid
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
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        message: "Please provide valid id",
      });
    }
    const profileResponse = await sql`
SELECT m.*, p.photos, c.iscontactviewed from matches m
    LEFT JOIN photos p ON p.userid = m.userid
    LEFT JOIN contactsviewed c ON c.profile_userid = m.userid
WHERE m.userid = ${id}`;
    if (profileResponse.count > 0) {
      return res.status(200).json({
        data: profileResponse[0],
      });
    } else {
      return res.status(200).json({
        data: null,
      });
    }
  } catch (error) {
    console.log(error, "Error fetching profile");
    return res.status(500).json({ message: "Internal Server Error" });
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

    const updatableFields = new Set([
      "firstname",
      "lastname",
      "surname",
      "dob",
      "gender",
      "zodaicsign",
      "star",
      "religion",
      "gothram",
      "padam",
      "caste",
      "subcaste",
      "occupation",
      "company",
      "salary",
      "currency",
      "mothername",
      "worklocation",
      "motheroccupation",
      "fathername",
      "fatheroccupation",
      "sisters",
      "numofsisters",
      "marriedsisters",
      "brothers",
      "numofbrothers",
      "marriedbrothers",
      "currentaddress",
      "iscurrentaspermanent",
      "permanentaddress",
      "color",
      "height",
    ]);

    let updates = {};
    for (let [key, value] of Object.entries(req.body)) {
      if (updatableFields.has(key)) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const serverResponse = await sql`
      UPDATE matches
      SET ${sql(updates)}
      WHERE userid = ${id}
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

export const Favorite = async (req, res) => {
  try {
    const { profile_userid, isLiked, userid, profile_id } = req.body;
    const favoriteResponse = await sql`INSERT INTO favorites(
    userid,
    profile_userid,
    isLiked,
    profile_id) VALUES(${userid}, ${profile_userid}, ${isLiked}, ${profile_id}) RETURNING *`;
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
  const { userid, profile_userid } = req.params;
  try {
    const favoriteResponse = await sql`DELETE FROM favorites
    WHERE userid = ${userid} AND profile_userid = ${profile_userid}`;
    if (favoriteResponse.count > 0) {
      return res.status(200).json({
        data: favoriteResponse,
      });
    } else {
      return res.status(404).json({
        data: favoriteResponse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  const { userid } = req.params;
  try {
    const matches = await sql`select m.*, f.isLiked, p.photos from favorites f
left join matches m on m.userid = f.profile_userid
left join photos p on p.userid = m.userid
where f.userid = ${userid}`;

    if (matches.count > 0) {
      return res.status(200).json({
        data: matches,
      });
    } else {
      return res.status(200).json({
        data: matches,
      });
    }
  } catch (error) {
    console.log(error, "Get Favorites Error");
    return res.status(500).json({
      message: "Internal Server Error",
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
  console.log(req.body);
  try {
    const { userid, photos } = req.body;
    if (!photos.length > 0) {
      return res.status(400).json({
        message: "Please select the images",
      });
    }

    const result = await Promise.all(
      photos?.map((file) => uploadIntoCloudinary(file.url)),
    );
    const _photos = result?.map((r) => {
      return {
        url: r.secure_url,
      };
    });
    const _res = await sql`INSERT INTO photos(
      userid, photos) VALUES(${userid}, ${_photos}) RETURNING *`;
    res.status(200).json({
      message: "Photos Uploaded Successfully",
      data: _res,
    });
  } catch (error) {
    console.log(error, "Photos uploading error");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const ProfileStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    const response = await sql`UPDATE matches
    SET isactive = ${status}
    WHERE userid = ${id}`;

    return res.status(200).json({
      message: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const ContactView = async (req, res) => {
  const { userid, profile_userid } = req.body;
  try {
    const response = await sql`INSERT INTO contactsviewed(
    userid,
    profile_userid)
    VALUES(${userid}, ${profile_userid}) RETURNING iscontactviewed`;

    if (response.count > 0) {
      return res.status(200).json({
        status: response[0].iscontactviewed,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
