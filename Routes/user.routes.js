import { Router } from "express";
import { loginuser, registeruser } from "../controllers/user.controller.js";
import{uploadpdf}from '../controllers/pdf.controller.js'
import { upload } from "../middlewares/multer.middelware.js";
const router=Router()

 router.route("/register").post(registeruser)
 router.route('/login').post(loginuser)
 

export default router