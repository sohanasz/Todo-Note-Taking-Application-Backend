import { Router } from "express";
import { UserRolesEnum } from "../utils/constants.js";
import {
  validateProjectPermission,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/note.controllers.js";

const router = Router();
router.use(verifyJWT);
router
  .route("/projects/:projectId/notes")
  .get(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    getNotes,
  )
  .post(validateProjectPermission([UserRolesEnum.ADMIN]), createNote);

router
  .route("/projects/:projectId/notes/:noteId")
  .get(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    getNoteById,
  )
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateNote)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;
