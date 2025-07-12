import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { uploadProfilePicture } from "../middlewares/upload_middlewares.js";
import { 
  getUserProfile, 
  getSkinHistory, 
  getAllCosmetologists, 
  getUserById, 
  updateUserProfile,
  uploadProfilePicture as uploadProfilePictureController
} from "../controllers/user_controller.js";

export const userRouter = Router();

// Get all cosmetologists (for users to browse)
userRouter.get("/", protect(), getAllCosmetologists);

// Get current user's profile (must come before /:id to avoid conflicts)
userRouter.get("/me/profile", protect(), getUserProfile);

// Update current user's profile (must come before /:id to avoid conflicts)
userRouter.patch("/me/profile", protect(), updateUserProfile);

// Upload profile picture (must come before /:id to avoid conflicts)
userRouter.post("/me/profile-picture", protect(), uploadProfilePicture.single('image'), uploadProfilePictureController);

// Get user's skin history (must come before /:id to avoid conflicts)
userRouter.get("/me/history", protect(), getSkinHistory);

// Backward compatibility routes
userRouter.get("/profile", protect(), getUserProfile);
userRouter.patch("/profile", protect(), updateUserProfile);

// Get specific user by ID (must come last to avoid conflicts with /me routes)
userRouter.get("/:id", protect(), getUserById);



