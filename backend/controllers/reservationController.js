const nodemailer = require('nodemailer');
const Reservation = require('../models/Reservation');
require('dotenv').config(); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});


const sendEmail = (email, status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: email,                     
    subject: 'Reservation Status Update',
    html: `
      <h2>Reservation Status Update</h2>
      <h3>Your reservation has been <strong>${status}</strong>.</h3>
      
      <p>We appreciate your interest in our services.</p>
      <p>If you have any questions or need further help, feel free to reach out to us.</p>
      <p>Thank you for choosing us, and we look forward to serving you soon!</p>
      
      <p>Best regards,<br/>RMS.</p>
    `, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


exports.createReservation = (req, res) => {
  const { email, phone, guests, date, time } = req.body;

  const reservation = new Reservation({
    email,
    phone,
    guests,
    date,
    time,
  });

  reservation.save()
    .then(() => {
      res.status(200).send({ message: 'Reservation confirmed' });
    })
    .catch((error) => {
      res.status(500).send({ error: 'Reservation failed' });
    });
};
exports.approveReservation = (req, res) => {
  const { id } = req.params;

  Reservation.findByIdAndUpdate(id, { status: 'Approved' }, { new: true })
    .then((updatedReservation) => {
      if (!updatedReservation) {
        return res.status(404).send({ error: 'Reservation not found' });
      }

      
      sendEmail(updatedReservation.email, 'approved');
      res.status(200).send({ message: 'Reservation approved', updatedReservation });
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to approve reservation' });
    });
};


exports.rejectReservation = (req, res) => {
  const { id } = req.params;

  Reservation.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true })
    .then((updatedReservation) => {
      if (!updatedReservation) {
        return res.status(404).send({ error: 'Reservation not found' });
      }

      
      sendEmail(updatedReservation.email, 'rejected');
      res.status(200).send({ message: 'Reservation rejected', updatedReservation });
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to reject reservation' });
    });
};

exports.getReservations = (req, res) => {
  Reservation.find()
    .then((reservations) => {
      res.status(200).json(reservations);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to fetch reservations' });
    });
};


exports.getReservationById = (req, res) => {
  const { id } = req.params;

  Reservation.findById(id)
    .then((reservation) => {
      if (!reservation) {
        return res.status(404).send({ error: 'Reservation not found' });
      }
      res.status(200).json(reservation);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to fetch reservation' });
    });
};


exports.deleteReservation = (req, res) => {
  const { id } = req.params;

  Reservation.findByIdAndDelete(id)
    .then((deletedReservation) => {
      if (!deletedReservation) {
        return res.status(404).send({ error: 'Reservation not found' });
      }
      res.status(200).send({ message: 'Reservation deleted successfully' });
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to delete reservation' });
    });
};
