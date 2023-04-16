const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//LOGIN -> POST REQUEST
router.post("/login", loginController);

//REGISTER -> POST REQUEST
router.post("/register", registerController);

//AUTH->POST REQUEST
router.post("/getUserdata", authMiddleware, authController);

//APPLY DOCTOR->POST REQUEST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//Notification Doctor || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

//DELETE Notification Doctor || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

router.get("/getAlldoctors", authMiddleware, getAllDoctorsController);

router.post("/book-appointment", authMiddleware, bookAppointmentController);

router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
