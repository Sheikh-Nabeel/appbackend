import mongoose,{Schema} from "mongoose";

const userschema=new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    cnic:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pdfs:[
        {
            file_url: { // URL to the uploaded PDF on Cloudinary or another cloud service
                type: String,
                required: true
            },
            cloudinary_id: { // ID of the file on Cloudinary
                type: String,
                required: true
            }
        }
    ]
    
},{timestamps:true})

export const User=mongoose.model("User",userschema)