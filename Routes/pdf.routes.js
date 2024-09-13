import{uploadpdf,getpdf, deletepdf, updatepdf}from '../controllers/pdf.controller.js'
import { upload } from "../middlewares/multer.middelware.js";
import { Router } from "express";
const router=Router()


router.route('/upload/:id').post(
    upload.single("pdf"),uploadpdf

 )

 router.route('/get-pdf/:id').get(getpdf)
 router.route('/delete/:id/:pdfid').delete(deletepdf)
 router.route('/update/:id/:pdfid').put(upload.single("pdf"),updatepdf)

 //http://localhost:5000/uploads/1725904470768-wallpaperflare.com_wallpaper.jpg

 export default router