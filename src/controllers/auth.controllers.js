import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import crypto from "crypto";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

// const registerUser = asyncHandler(async (req, res) => {
const registerUser = async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation

  if (!username || !role || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const checkEmail = email;

    const existingUser = await User.findOne({ email: checkEmail });
    console.log("eu", existingUser);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists....",
      });
    }

    const user = await User.create({
      username,
      role,
      email,
      password,
    });
    console.log("USER - ", user);

    // console.log("token 1st Phase CRYPTO - ", token);
    const randomBytesBuffer = crypto.randomBytes(32);
    console.log("Step 1 - Random Bytes Buffer:", randomBytesBuffer);

    const nonHexToken = randomBytesBuffer.toString();
    console.log("Step 2 - non Hex String Token:", nonHexToken);

    const token = randomBytesBuffer.toString("hex");
    console.log("Step 3 - Hex Token:", token);

    user.emailVerificationToken = token;
    console.log("eVT - ", user);

    await user.save();

    // Emails

    const verificationEmailContent = emailVerificationMailgenContent({
      username: user.username,
      verificationUrl: `http://localhost:8000/api/v1/users/verify/${user.emailVerificationToken}`,
    });

    await sendEmail({
      email: user.email,
      subject: "VERIFY YOUR EMAIL!",
      mailgenContent: verificationEmailContent,
    });

    res.status(200).json({
      message: "Registered",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error occured while registration",
    });
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //

    const token = jwt.sign(
      { id: user._id, role: user.role },

      process.env.JWT_SECRET,
      {
        expiresIn: JWT_TIME,
      },
    );
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {}
  //validation
});

const logoutUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const verifyEmail = asyncHandler(async (req, res) => {
  console.log(req.params);

  const { token } = req.params;
  console.log("NEXT STEP");

  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.status(200).json({
    message: "TOKEN - " + token + "\n end",
  });

  //validation
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});
const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

export {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgottenPassword,
  verifyEmail,
};
