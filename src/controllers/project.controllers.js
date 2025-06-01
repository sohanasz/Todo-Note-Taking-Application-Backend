import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";
import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { UserRolesEnum } from "../utils/constants.js";

const createProject = asyncHandler(async (req, res) => {
  const user = req.user; // From verifyJWT middleware

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Project name and description are required");
  }

  const project = await Project.create({
    name,
    description,
    createdBy: user._id,
  });

  const projectMember = await ProjectMember.create({
    user: user._id,
    project: project._id,
    role: UserRolesEnum.ADMIN,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        project,
        projectMember,
      },
      "Project successfully created",
    ),
  );
});

const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projectMemberships = await ProjectMember.find({
    user: userId,
  }).populate("project");

  const projects = projectMemberships.map((proMem) => proMem.project);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const membership = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!membership) {
    throw new ApiError(403, "Access denied to this project");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project details fetched"));
});

// UPDATE project (only by admin)
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;
  const { name, description } = req.body;

  const membership = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!membership || membership.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "Only project admins can update the project");
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true },
  );
  return res.status(200).json(new ApiResponse(200, project, "Project updated"));
});

// DELETE project (only by admin)
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const membership = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!membership || membership.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "Only project admins can delete the project");
  }

  await Project.findByIdAndDelete(projectId);
  await ProjectMember.deleteMany({ project: projectId });
  await ProjectNote.deleteMany({ project: projectId });

  return res.status(200).json(new ApiResponse(200, null, "Project deleted"));
});

// GET project members
const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const membership = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!membership) {
    throw new ApiError(403, "Access denied to this project");
  }

  const members = await ProjectMember.find({ project: projectId }).populate(
    "user",
    "name email",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, members, "Project members fetched"));
});

// ADD membership to project (only by admin)
const addMemberToProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { projectId } = req.params;
  const { userIdToAdd, role } = req.body;

  const requester = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });

  if (!requester || requester.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "Only admins can add members");
  }

  const existing = await ProjectMember.findOne({
    user: userIdToAdd,
    project: projectId,
  });
  if (existing) {
    throw new ApiError(400, "User is already a membership of the project");
  }

  const newMember = await ProjectMember.create({
    user: userIdToAdd,
    project: projectId,
    role: role || UserRolesEnum.MEMBER,
  });

  return res.status(201).json(new ApiResponse(201, newMember, "Member added"));
});

// DELETE membership from project (only by admin)
const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const userId = req.user._id;

  const requester = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!requester || requester.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "Only admins can remove members");
  }

  await ProjectMember.findOneAndDelete({ user: memberId, project: projectId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed from project"));
});

// UPDATE membership role (only by admin)
const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;
  const userId = req.user._id;

  const requester = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!requester || requester.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "Only admins can update roles");
  }

  const updatedMember = await ProjectMember.findOneAndUpdate(
    { user: memberId, project: projectId },
    { role },
    { new: true },
  );

  if (!updatedMember) {
    throw new ApiError(
      401,
      "Member not found, please add one before assigning role to non existing member",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedMember, "Member role updated"));
});

export {
  addMemberToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
};
