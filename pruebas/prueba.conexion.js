const mongoose = require('mongoose');
const Trip = require('../models/trip.model');

(async () => {
    try {
        await mongoose.connect('mongodb+srv://admin2022:a9pNE4sGQFNKJgsO@cluster01.y9wjnao.mongodb.net/dbUnc?retryWrites=true&w=majority');
        console.log('conexión exitosa');
    } catch (error) {
        console.log('error');
    }

    const newTrip = await Trip.create({
        name: 'prueba de viaje',
        description: 'Prueba de desc',
        destination: 'Berlin',
        category: 'amigos',
        start_date: '2022-05-02'
    });

    console.log(newTrip);
})();