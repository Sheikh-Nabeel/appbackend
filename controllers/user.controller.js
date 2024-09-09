import {apierror}from '../utils/apierror.js'
import {asynchandler}from '../utils/asynchandler.js'
import {apiresponse}from '../utils/responsehandler.js'
import { User } from '../models/user.model.js'



const registeruser=asynchandler(async (req,res)=>{

    const {username,email,password}=req.body;
    if ([email,username,password].some((fields)=>fields?.trim()==="")) {
        throw new apierror(400,"all fields are required")
    }

    const existedemail= await User.findOne({
        $or:[{email}]
    });
    if (existedemail) {
        throw new apierror(409,"Email adress already exists")
    }

    let user = await User.create({
        username,
        email,
        password,
    })
    const createduser=await User.findById(user._id).select("-password")

    if (!createduser) {
        throw new apierror(500,"Something went wrong while registering user")
    }
    
    return res.json(
        new apiresponse(200,createduser,"ok")
    )

})


const loginuser=asynchandler(async(req,res)=>{
    const {email,password}=req.body;
    if ([email,password].some((fields)=>fields?.trim()==="")) {
        throw new apierror(400,"all fields are required") 
    }
    const existeduser= await User.findOne({email,password}).select("-password");
if (existeduser) {
    
    return res.json(
        new apiresponse(200,existeduser,"ok")
    )
} else{
    return res.status(404).json(
        new apierror(404,"user not found")
    )
}

})
export {registeruser,loginuser}