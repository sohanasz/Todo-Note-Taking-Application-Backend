import { Router } from "express";
import {
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
} from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
} from "../validators/index.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, registerUser);

router.post("/login", userLoginValidator(), validate, loginUser);

router.get("/login/user", verifyJWT, getCurrentUser);

router.post("/logout", verifyJWT, logoutUser);

router.put(
  "/password/change",
  verifyJWT,
  userChangeCurrentPasswordValidator(),
  changeCurrentPassword,
);

router.post("/password/reset", forgotPasswordRequest);

router.post("/password/reset/:token", resetForgottenPassword);

router.get("/password/refreshAccessToken", refreshAccessToken);

router.post("/password/resendVerificationEmail", resendEmailVerification);

router.get("/verify/:token", verifyEmail);

export default router;
