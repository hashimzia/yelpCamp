const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelpCamp');
    console.log("Database Connected!");
}

async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: '3cOpXFjKQoHpJLmd_lG-2La8hcbEeCsMIuvu1ZkugZU',
                collections: 1114848,
            },
        })
        return resp.data.urls.full
    } catch (err) {
        console.error(err)
    }
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i < 3; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const image = await seedImg();
        const camp = new Campground({
            price: 65,
            img: image,
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit.Assumenda quasi expedita aut? Velit eaque doloribus sapiente consequatur repellat exercitationem maxime rerum nostrum? Dolorem voluptatibus dicta ratione nesciunt, fuga sit ipsa.'

        });
        await camp.save();
    }
}
seedDB();
