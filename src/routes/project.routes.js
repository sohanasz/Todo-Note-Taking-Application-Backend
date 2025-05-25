import { Router } from "express";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import {
  validateProjectPermission,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
  addMemberToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
} from "../controllers/project.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/projects").post(createProject).get(getProjects);

router
  .route("/projects/:projectId")
  .get(validateProjectPermission(AvailableUserRoles), getProjectById)
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateProject)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteProject);

router
  .route("/projects/:projectId/members")
  .get(validateProjectPermission(AvailableUserRoles), getProjectMembers)
  .post(validateProjectPermission([UserRolesEnum.ADMIN]), addMemberToProject);

router
  .route("/projects/:projectId/members/:memberId")
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember)
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole);

export default router;
