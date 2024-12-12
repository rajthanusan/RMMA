const Reservation = require('../models/Reservation');


exports.createReservation = (req, res) => {
    const { name, phone, guests, date, time } = req.body;

    const reservation = new Reservation({
      name,
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
