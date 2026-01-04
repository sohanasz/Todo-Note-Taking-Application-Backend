import { body } from "express-validator";
import {
  AvailableTaskStatuses,
  AvailableUserRoles,
} from "../utils/constants.js";
import { ApiError } from "../utils/api-error.js";

const userRegisterValidator = () => {
  return [
    body("fullname").trim().notEmpty().withMessage("Full name is required"),
    body("username")
      .isString()
      .withMessage("Username must be a string")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can contain only letters, numbers, and underscores",
      ),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/[A-Za-z]/)
      .withMessage("Password must contain at least one letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().trim().isEmail().withMessage("Email is invalid"),

    body("username")
      .optional()
      .isString()
      .withMessage("Username must be a string")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can contain only letters, numbers, and underscores",
      ),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/[A-Za-z]/)
      .withMessage("Password must contain at least one letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),

    body().custom((body) => {
      if (!body.email && !body.username) {
        throw new ApiError(422, "Email or username is required");
      }
      return true;
    }),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgottenPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};
const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRoles)
      .withMessage("Role is invalid"),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional(),
    body("assignedTo").notEmpty().withMessage("Assigned to is required"),
    body("status")
      .optional()
      .notEmpty()
      .withMessage("Status is required")
      .isIn(AvailableTaskStatuses),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title").optional(),
    body("description").optional(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Status is invalid"),
    body("assignedTo").optional(),
  ];
};

const notesValidator = () => {
  return [body("content").notEmpty().withMessage("Content is required")];
};

export {
  addMemberToProjectValidator,
  createProjectValidator,
  createTaskValidator,
  notesValidator,
  updateTaskValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgottenPasswordValidator,
};
