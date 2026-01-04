import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import { ApiResponse } from "../utils/api-response.js";

const registerUser = async (req, res) => {
  const { email, username, password, fullname } = req.body;

  if (!username || !email || !password | !fullname) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const checkEmail = email;

    const existingUser = await User.findOne({ email: checkEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists....",
      });
    }

    const user = await User.create({
      fullname: fullname,
      username: username,
      email: email,
      password: password,
    });

    const randomBytesBuffer = crypto.randomBytes(32);
    const token = randomBytesBuffer.toString("hex");

    user.emailVerificationToken = token;

    await user.save();

    const verificationEmailContent = emailVerificationMailgenContent({
      username: user.username,
      verificationUrl: `http://localhost:8000/api/v1/users/verify/${user.emailVerificationToken}`,
    });

    await sendEmail({
      email: user.email,
      subject: "VERIFY YOUR EMAIL!",
      mailgenContent: verificationEmailContent,
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
          isEmailVerified: user.isEmailVerified,
          token,
        },
        "Registration Success",
      ),
    );
  } catch (error) {
    res.status(400).json({
      message: "Error occured while registration",
    });
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const findBy = email ? { email } : { username };
    const user = await User.findOne(findBy);

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

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

    res.status(200).json(
      new ApiResponse(
        200,
        {
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
          isEmailVerified: user.isEmailVerified,
          token,
        },
        "Login Success",
      ),
    );
  } catch (error) {
    res.status(500).json({ message: "Login didn't happen" });
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({ user });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

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
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "User logged out successfully" });
});

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
    verificationUrl: `${EMAIL_VERIFICATION_BASE_URL}${token}`,
  });

  await sendEmail({
    email: user.email,
    subject: "VERIFY YOUR EMAIL!",
    mailgenContent: verificationEmailContent,
  });

  res.status(200).json({ message: "Verification email resent" });
});

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
  user.passwordResetExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.PASSWORD_RESET_BASE_URL}${resetToken}`;
  const emailContent = `Reset your password using the following link: ${resetUrl}`;

  await sendEmail({
    email: user.email,
    subject: "Reset Password",
    mailgenContent: emailContent,
  });

  res.status(200).json({ message: "Password reset email sent" });
});

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
