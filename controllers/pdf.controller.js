import { apierror } from '../utils/apierror.js';
import { asynchandler } from '../utils/asynchandler.js';
import { apiresponse } from '../utils/responsehandler.js';
import { Pdf } from '../models/pdf.model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../middlewares/cloudinary.middleware.js'; // Fixed middleware path
import fs from 'fs';
import { User } from '../models/user.model.js';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadpdf = asynchandler(async (req, res) => {
  if (!req.file) {
    throw new apierror(400, "No file provided");
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      access_mode: "public",
      format: "pdf"
    });

    const data = await Pdf.create({
      file_url: result.secure_url,
      cloudinary_id: result.public_id
    });

    res.json({
      status: "File created",
      file: data
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    throw new apierror(400, "Error while uploading file");
  }
});

const getpdf = asynchandler(async (req, res) => {
  try {
    const data = await Pdf.find({});
    res.json(data);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    throw new apierror(500, "Error fetching PDFs");
  }
});

const deletepdf = asynchandler(async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      throw new apierror(404, "PDF not found");
    }

    await cloudinary.uploader.destroy(pdf.cloudinary_id);
    await Pdf.deleteOne({ _id: req.params.id });

    res.json({ message: "File deleted" });

  } catch (error) {
    console.error("Error deleting file:", error);
    throw new apierror(500, "Error while deleting file");
  }
});

const updatepdf = asynchandler(async (req, res) => {
  if (!req.file) {
    throw new apierror(400, "No file provided");
  }

  try {
    let pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      throw new apierror(404, "PDF not found");
    }

    await cloudinary.uploader.destroy(pdf.cloudinary_id);

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      access_mode: "public",
      format: "pdf"
    });

    const data = {
      file_url: result.secure_url,
      cloudinary_id: result.public_id
    };

    pdf = await Pdf.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(pdf);

  } catch (error) {
    console.error("Error updating file:", error);
    throw new apierror(500, "Error while updating file");
  }
});

export { uploadpdf, getpdf, deletepdf, updatepdf };
