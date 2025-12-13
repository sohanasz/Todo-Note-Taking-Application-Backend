import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("DECODED", decodedToken);
    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid User");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const validateProjectPermission = (roles = []) => {
  const execute = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.user._id;
    // console.log("project Id", projectId, "user Id", typeof userId);

    if (!projectId) {
      throw new ApiError(401, "Invalid Project");
    }

    const project = await ProjectMember.findOne({
      // project: projectId,
      // String interpolation used for passing id as argument in order to ensure string type
      project: new mongoose.Types.ObjectId(`${projectId}`),
      user: userId,
    });

    if (!project) {
      throw new ApiError(401, " Project Not Found! ");
    }

    const givenRole = project?.role;

    if (!roles.includes(givenRole)) {
      throw new ApiError(403, "You do not have access to this project!");
    }

    req.user.projectId = projectId;

    next();
  });

  return execute;
};
