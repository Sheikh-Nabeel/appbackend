import { Router } from "express";
import { deleteuser, forgetpassword, loginuser, registeruser, updatename } from "../controllers/user.controller.js";
 
const router=Router()

 router.route("/register").post(registeruser)
 router.route('/login').post(loginuser)
 router.route('/forgetpassword').post(forgetpassword)
 router.route('/delete').post(deleteuser)
 router.route('/updateusername').post(updatename)
 

export default router