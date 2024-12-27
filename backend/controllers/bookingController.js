const Booking = require("../models/Booking");
const { sendEmail, sendEmailstatus } = require("../services/emailService");

exports.createBooking = async (req, res) => {
  try {
    const { email, phone, person, reservationDate, time, message } = req.body;
    const newBooking = new Booking({ email, phone, person, reservationDate, time, message });
    await newBooking.save();
   

    res.status(200).json({ success: true, message: "Booking created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.approveReservation = (req, res) => {
  const { id } = req.params;
  Booking.findByIdAndUpdate(id, { status: 'Approved' }, { new: true })
    .then((updatedReservation) => {
      if (!updatedReservation) {
        return res.status(404).send({ error: 'Reservation not found' });
      }
      sendEmailstatus(updatedReservation.email, 'approved');
      res.status(200).send({ message: 'Reservation approved', updatedReservation });
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to approve reservation' });
    });
};

exports.rejectReservation = (req, res) => {
  const { id } = req.params;
  Booking.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true })
    .then((updatedReservation) => {
      if (!updatedReservation) {
        return res.status(404).send({ error: 'Reservation not found' });
      }
      sendEmailstatus(updatedReservation.email, 'rejected');
      res.status(200).send({ message: 'Reservation rejected', updatedReservation });
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to reject reservation' });
    });
};

exports.regcreateBooking = async (req, res) => {
  try {
    const { name, phone, person, reservationDate, time, message, email } = req.body;
    const newBooking = new Booking({ name, phone, person, reservationDate, time, message, email });
    await newBooking.save();
    await sendEmail(email, name, reservationDate, time, person, message);

    res.status(200).json({ success: true, message: "Booking created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, message: "Booking deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
