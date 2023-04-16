const Appointments = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModels");

exports.getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });

    res.status(200).send({
      success: true,
      message: "Doctor Details Fetched Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

exports.updateProfileController = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );

    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating Profile",
      error,
    });
  }
};

exports.getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await Doctor.findById({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor Fetched Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Single Doctor Info",
    });
  }
};

exports.doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointments.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fteched sucessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching Appointments",
      error,
    });
  }
};

exports.updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await Appointments.findByIdAndUpdate(appointmentsId, {
      status,
    });
    console.log(appointments);
    const user = await User.findById(appointments.userId);
    const notification = user.notification;
    notification.push({
      type: "status-updated",
      message: "your appointment has been updated",
      onClickPath: "/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating status",
      error,
    });
  }
};
