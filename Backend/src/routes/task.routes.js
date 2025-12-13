import { Router } from "express";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import {
  validateProjectPermission,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
  getTasks,
  createSubTask,
  deleteSubTask,
  updateSubTask,
} from "../controllers/task.controllers.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/projects/task")
  .post(createTask)
  .get(validateProjectPermission(AvailableUserRoles), getTasks);

router
  .route("/projects/:projectId/task/:taskId")
  .get(validateProjectPermission(AvailableUserRoles), getTaskById)
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateTask)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteTask);

router
  .route("/projects/:projectId/task/:taskId/subTask")
  .post(validateProjectPermission([UserRolesEnum.ADMIN]), createSubTask);

router
  .route("/projects/:projectId/task/:taskId/subTask/:subTaskId")
  .post(validateProjectPermission([UserRolesEnum.ADMIN]), updateSubTask)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteSubTask);

export default router;
