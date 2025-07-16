import express, { Router } from "express";
import { home, login, signup, user, googleAuth} from "../controller/auth.controller.js";
import {loginSchema, signupSchema} from "../validations/auth.validations.js";
import validate from "../middleware/validation.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

 router.get("/new", (req,res)=> {
    res
    .status(200)
    .send("new route!!! using router!! ");
});

router.route("/home").get(home);
router.route("/signup").post(validate(signupSchema), signup);
router.route("/login").post(validate(loginSchema),login);
router.route("/user").get(authMiddleware, user);
router.route("/google").post(googleAuth);

export default router;