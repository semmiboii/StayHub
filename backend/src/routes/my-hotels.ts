import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
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

      const imageUrls = await uploadImages(imageFiles);

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

router.get("/:id", verifyToken, async(req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId 
        })
        res.json(hotel);
    } catch(error) {
        res.status(500).json({ message: "ERROR_FETCHING_HOTELS" })
    }
})

router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async(req: Request, res: Response) => {
   try{
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({_id: req.params.hotelId, userId: req.userId}, updatedHotel, { new: true })
        
        if(!hotel) {
            return res.status(404).json({ message: "HOTEL_NOT_FOUND" })
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]

        await hotel.save();

        res.status(201).json(hotel);
   }catch(error){
        res.status(500).json({ message: "SOMETHING_WENT_WRONG" })
   }
})

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const base64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + base64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
