import { Router } from "express";
import { forgetpassword, loginuser, registeruser } from "../controllers/user.controller.js";
 
const router=Router()

 router.route("/register").post(registeruser)
 router.route('/login').post(loginuser)
 router.route('/forgetpassword').post(forgetpassword)
 

export default router