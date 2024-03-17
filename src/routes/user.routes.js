import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";

const router = Router();

router.get("/", getUsers); // Agrega esta línea para manejar solicitudes GET a /api/users
router.post("/", [verifyToken, isAdmin, checkExistingUser], createUser);

export default router;
