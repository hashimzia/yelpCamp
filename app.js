const express = require('express');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


const path = require('path');
const { urlencoded } = require('express');
const e = require('express');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelpCamp');
    console.log("Database Connected!");
}

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('home');
})

app.use('/campgrounds', campgrounds);

app.use('/campgrounds/:id/reviews', reviews);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, Something went wrong!";
    res.status(statusCode).render('error', { err });
})

app.listen(3000, function () {
    console.log("Listening on 3000")
})