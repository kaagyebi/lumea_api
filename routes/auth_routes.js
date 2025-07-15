import { Router } from "express";
import {register, login, logout} from "../controllers/auth_controllers.js";
import { uploadProfilePicture } from "../middlewares/upload_middlewares.js";

export const authRouter = Router();

authRouter.post("/register", uploadProfilePicture.single('picture'), register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

