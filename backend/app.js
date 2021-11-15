const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces')
const path = require('path');


mongoose.connect('mongodb+srv://far751:19534219@cluster0.qx7bg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

mongoose.set('debug', true);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.json());

app.use('/api/sauces', saucesRoutes)

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);



module.exports = app;