import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";
import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";

const createNote = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, content } = req.body;

    const project = await Project.findById(
      new mongoose.Types.ObjectId(`${projectId}`),
    );

    if (!project) {
      throw new ApiError(401, "No project found");
    }

    const note = await ProjectNote.create({
      project: new mongoose.Types.ObjectId(`${projectId}`),
      title: title,
      content: content,
      createdBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, note, "Notes Created!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, "Error creating notes"));
  }
});

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const typedProjectId = new mongoose.Types.ObjectId(projectId);
  const project = await Project.findById(typedProjectId);

  if (!project) {
    throw new ApiError(401, "No project found");
  }

  const notes = await ProjectNote.find({
    project: typedProjectId,
  }).populate({
    path: "createdBy",
    select: "_id username",
  });

  return res.status(200).json(new ApiResponse(200, notes, "Fetched all notes"));
});

const getNoteById = async (req, res) => {
  let { projectId, noteId } = req.params;
  projectId = new mongoose.Types.ObjectId(projectId);

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(401, "No project found");
  }

  const note = await ProjectNote.findById(new mongoose.Types.ObjectId(noteId));

  if (!note) {
    throw new ApiError(401, "Note not found");
  }

  if (note.project.toHexString() !== projectId.toHexString()) {
    throw new ApiError(403, "Invalid access of note");
  }

  return res.status(200).json(new ApiResponse(200, note, "Fetched a note"));
};

const updateNote = async (req, res) => {
  try {
    const { projectId, noteId } = req.params;
    const { title, content } = req.body;

    const existingNote = await ProjectNote.findById(
      new mongoose.Types.ObjectId(noteId),
    );

    if (!existingNote) {
      throw new ApiError(401, "Note not found");
    }

    const updatedNote = await ProjectNote.findByIdAndUpdate(
      new mongoose.Types.ObjectId(noteId),
      { title, content },
      { new: true },
    ).populate("createdBy", "username fullname avatar");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedNote, "Updated Note"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, "Notes did not save"));
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await ProjectNote.findByIdAndDelete(noteId);

  if (!note) {
    throw new ApiError(401, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Successfully Deleted"));
};

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
