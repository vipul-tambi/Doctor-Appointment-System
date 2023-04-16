const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
exports.registerController = async (req, res) => {
  try {
    const isUserExist = await User.findOne({ email: req.body.email });
    if (isUserExist) {
      return res
        .status(200)
        .send({ success: false, message: "User Already Exists" });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();

    return res
      .status(201)
      .send({ success: true, message: "Register Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: `Error while Register : ${error.message}`,
    });
  }
};
exports.loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Inavlid Email or Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .send({ success: true, message: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `Error while login ${error.message}` });
  }
};

exports.authController = async (req, res) => {
  const user = await User.findById(req.body.userId);
  user.password = null;
  try {
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

exports.applyDoctorController = async (req, res) => {
  try {
    console.log(req.body);

    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await User.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied for Doctor`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });

    await User.findByIdAndUpdate(adminUser._id, { notification });

    res.status(200).send({
      success: true,
      message: "You have Successfully Applied For Doctor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Applying the Doctor",
    });
  }
};

exports.getAllNotificationController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notifications are marked as read",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Notification",
      error,
    });
  }
};

exports.deleteAllNotificationController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    user.seennotification = [];
    user.notification = [];
    const updateUser = await user.save();
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "all notifications are deleted successfully",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting the notifications",
      error,
    });
  }
};

exports.getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });

    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succcess: false,
      message: "Error while fetching the doctors",
      error,
    });
  }
};

exports.bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-yy").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const doc = await Doctor.findById(req.body.doctorId);
    doc.address;
    doc.doctorApplicableCertificate = undefined;
    doc.description = undefined;
    doc.phone = undefined;

    req.body.doctorInfo = doc;
    const use = await User.findById(req.body.userId);
    use.notification = undefined;
    use.seennotification = undefined;
    use.password = undefined;
    req.body.userInfo = use;
    const newappointent = new Appointment(req.body);
    await newappointent.save();
    const user = await User.findById(req.body.doctorInfo.userId);
    user.notification.push({
      type: "New Appointment Request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      error,
      message: "Error while Booking Appointmen ",
    });
  }
};

exports.bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(10, "minutes")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm")
      .add(10, "minutes")
      .toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments unavailable at this Time",
        success: true,
      });
    } else {
      return res.status(200).send({
        message: "Appointments Available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

exports.userAppointmentsController = async (req, res) => {
  try {
    const data = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Your Appointtments Successfully fetched",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching Appointments",
    });
  }
};
