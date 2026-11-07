import { sql } from "../dbConnect.js";

export const Profile = async (req, res) => {
  const { id } = req.params;
  try {
    const profileResponse = await sql`SELECT *, P.photos FROM matches as M
        LEFT JOIN photos as P
       ON M.userid = P.userid`;
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
