export const generateOTP = async (req, res) => {
  try {
    const otp = Math.floor(Math.random(1000) * 10000)
      .toString()
      .padEnd(4, "0");
    res.cookie("otp", otp, {
      httpOnly: false,
    });
    return res.status(200).json({
      success: true,
      otp: Number(otp),
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  const enteredOtp = req.params.otp;
  const otp = req.headers.cookie.split("=")[1];
  try {
    if (otp !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP is not Matched!",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "OTP Verified Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
