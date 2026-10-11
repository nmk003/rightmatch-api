export const generateOTP = async (req, res) => {
  try {
    const otp = Math.floor(Math.random(1000) * 10000)
      .toString()
      .padEnd(4, "0");
    res.cookie("otp", otp, {
      httpOnly: false,
    });
    return res.status(200).json({
      otp: Number(otp),
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.params;
    const cookie = req.cookies;
    if (otp !== cookie.otp) {
      return res.status(400).json({
        message: "OTP is not Matched!",
      });
    } else {
      return res.status(200).json({
        message: "OTP Verified Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
