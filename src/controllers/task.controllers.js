import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import { TaskStatusEnum } from "../utils/constants.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, attachments } = req.body;

  if (!title || !description || !projectId || !assignedTo || !attachments) {
    throw new ApiError(400, "All fields are required!");
  }
  console.log(attachments);

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: new mongoose.Types.ObjectId(assignedTo),
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments: attachments || [],
  });

  return res.status(200).json(new ApiResponse(200, task, "New task Created"));
});

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.user.projectId;

  if (!projectId) {
    throw new ApiError(400, "Invalid project id");
  }

  const tasks = await Task.find({ project: projectId });

  if (!tasks || tasks.length === 0) {
    throw new ApiError(404, "No available tasks for the corresponding project");
  }

  return res.status(200).json(new ApiResponse(200, tasks, "All tasks fetched"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "No available task for the corresponding project");
  }

  return res.status(200).json(new ApiResponse(200, task, "Task fetched"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, attachments, status } = req.body;
  const { projectId, taskId } = req.params;

  const existingTask = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!existingTask) {
    throw new ApiError(404, "No available task for the corresponding project");
  }
  const updatedFields = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(assignedTo !== undefined && { assignedTo }),
    ...(attachments !== undefined && { attachments }),
    ...(status !== undefined && { status }),
  };
  const updatedTask = await Task.findByIdAndUpdate(
    existingTask._id,
    updatedFields,
    { new: true },
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const deletedTask = await Task.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });
  const deletedSubTasks = await SubTask.deleteMany({
    task: new mongoose.Types.ObjectId(taskId),
  });
  if (!deletedTask) {
    throw new ApiError(404, "No task deleted");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTask, deletedSubTasks }, "Task deleted"),
    );
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { projectId, taskId } = req.params;

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "No available task for the corresponding project");
  }

  const newSubTask = await SubTask.create({
    title,
    description,
    task: taskId,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newSubTask, "New subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { projectId, taskId, subTaskId } = req.params;

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "No available task for the corresponding project");
  }

  const updatedSubTask = await SubTask.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(subTaskId),
      task: new mongoose.Types.ObjectId(taskId),
    },
    { title, description },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubTask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId, subTaskId } = req.params;

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, "No available task for the corresponding project");
  }

  const deletedSubTask = await SubTask.findOneAndDelete(
    {
      _id: new mongoose.Types.ObjectId(subTaskId),
      task: new mongoose.Types.ObjectId(taskId),
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, deletedSubTask, "Subtask deleted successfully"));
});

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
