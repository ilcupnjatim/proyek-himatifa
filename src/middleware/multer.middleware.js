import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { db, tokoFile } from "../../database/index.js";
import path from "path";
import mongoose from "mongoose";

const storageToko = new GridFsStorage({
	db,
	file: async (req, file) => {
		const data = await tokoFile.file.findOne({ _id: `toko-profile-${req.user._id}` });
		if (data) await tokoFile.file.deleteOne({ _id: `toko-profile-${req.user._id}` });

		const datachunk = await tokoFile.chunks.findOne({ files_id: `toko-profile-${req.user._id}` });
		if (datachunk) await tokoFile.chunks.deleteOne({ files_id: `toko-profile-${req.user._id}` });

		return {
			id: `toko-profile-${req.user._id}`,
			metadata: { id: `toko-profile-${req.user._id}` },
			bucketName: `toko`,
			filename: `toko-profile-${req.user._id}${path.extname(file.originalname)}`,
		};
	},
});

const uploadToko = multer({ storage: storageToko });

const storageProduct = new GridFsStorage({
	db,
	file: async (req, file) => {
		const { toko_id } = req.params;
		return {
			metadata: { toko_id },
			bucketName: `product`,
			filename: `${toko_id}-${Date.now()}${path.extname(file.originalname)}`,
		};
	},
});

const uploadProduct = multer({ storage: storageProduct });

export { uploadToko, uploadProduct };
