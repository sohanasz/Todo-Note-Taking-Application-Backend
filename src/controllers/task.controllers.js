import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import { UserRolesEnum } from "../utils/constants.js";

const createTask = async (req, res) => {
  // create task
};
const getTasks = async (req, res) => {
  // get all tasks
};

// get task by id
const getTaskById = async (req, res) => {
  // get task by id
};

// create task

// update task
const updateTask = async (req, res) => {
  // update task
};

// delete task
const deleteTask = async (req, res) => {
  // delete task
};

// create subtask
const createSubTask = async (req, res) => {
  // create subtask
};

// update subtask
const updateSubTask = async (req, res) => {
  // update subtask
};

// delete subtask
const deleteSubTask = async (req, res) => {
  // delete subtask
};

export {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
