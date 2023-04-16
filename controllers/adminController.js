const Doctor = require("../models/doctorModel");
const User = require("../models/userModels");

exports.getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      success: true,
      message: "All Users Fetched Successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching Users",
      error,
    });
  }
};
exports.getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      success: true,
      message: "All Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error,
    });
  }
};

exports.changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });
    const user = await User.findById(doctor.userId);
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });
    // user.notification=notification
    user.isDoctor = true;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updates",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account status",
      error,
    });
  }
};
