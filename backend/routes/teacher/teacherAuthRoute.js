import express from "express";
import { login, logout, register } from "../../Controller/teacher/auth.controller.js";
// console,log(register);






const router=express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout );


export default router;