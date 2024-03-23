import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// endpoint - api/my-hotels

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("NAME_IS_REQUIRED"),
    body("city").notEmpty().withMessage("CITY_IS_REQUIRED"),
    body("country").notEmpty().withMessage("COUNTRY_IS_REQUIRED"),
    body("description").notEmpty().withMessage("DESCRIPTION_IS_REQUIRED"),
    body("type").notEmpty().withMessage("HOTEL_TYPE_IS_REQUIRED"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("PRICE_PER_NIGHT_IS_REQUIRED_AND_MUST_BE_A_NUMBER"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("FACILITIES_IS_REQUIRED"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const uploadPromises = imageFiles.map(async (image) => {
        const base64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + base64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (e) {
      console.log("ERROR_CREATING_HOTEL:", e);
      res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
    }
  }
);

//endpoint - /

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch {
    res.status(500).json({ message: "ERROR_FETCHING_HOTELS " });
  }
});

export default router;
