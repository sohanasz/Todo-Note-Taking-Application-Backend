import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

// const registerUser = asyncHandler(async (req, res) => {
const registerUser = async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation

  if (!username || !email || !password) {
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
      role: role || "member",
      email,
      password,
    });
    console.log("USER - ", user);

    // console.log("token 1st Phase CRYPTO - ", token);
    const randomBytesBuffer = crypto.randomBytes(32);
    // console.log("Step 1 - Random Bytes Buffer:", randomBytesBuffer);

    const nonHexToken = randomBytesBuffer.toString();
    // console.log("Step 2 - non Hex String Token:", nonHexToken);

    const token = randomBytesBuffer.toString("hex");
    // console.log("Step 3 - Hex Token:", token);

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
        expiresIn: process.env.JWT_TIME,
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
  } catch (error) {
    console.log("Login Error", error);
  }
  //validation
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({ user });
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

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "User logged out successfully" });
});

// Resend Email Verification
const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  await user.save();

  const verificationEmailContent = emailVerificationMailgenContent({
    username: user.username,
    verificationUrl: `http://localhost:8000/api/v1/users/verify/${token}`,
  });

  await sendEmail({
    email: user.email,
    subject: "VERIFY YOUR EMAIL!",
    mailgenContent: verificationEmailContent,
  });

  res.status(200).json({ message: "Verification email resent" });
});

// Forgot Password Request
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `http://localhost:8000/api/v1/users/reset-password/${resetToken}`;
  const emailContent = `Reset your password using the following link: ${resetUrl}`;

  await sendEmail({
    email: user.email,
    subject: "Reset Password",
    mailgenContent: emailContent,
  });

  res.status(200).json({ message: "Password reset email sent" });
});

// Reset Forgotten Password
const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset" });
});

// Change Current Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    throw new ApiError(400, "Incorrect current password");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TIME,
      },
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token: newToken });
  } catch (err) {
    throw new ApiError(401, "Invalid token");
  }
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
