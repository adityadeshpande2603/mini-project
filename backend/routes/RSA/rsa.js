import express from "express";
import { verifyToken } from "../../middleware/verifytoken.js";
import { encryptPaper } from "../../Controller/RSA/rsa.js";


// console,log(register);






const router=express.Router();


router.post("/encryptpaper",verifyToken, encryptPaper);





export default router;