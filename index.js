const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// بيانات تجريبية احترافية
const data = {
    hotels: [
        { id: 1, name: "Burj Al Arab", city: "Dubai", country: "UAE", stars: 7, price_range: "$$$$", description: "Iconic sail-shaped hotel on its own island." },
        { id: 2, name: "The Ritz-Carlton", city: "Paris", country: "France", stars: 5, price_range: "$$$", description: "Legendary luxury hotel in the heart of Paris." },
        { id: 3, name: "Marina Bay Sands", city: "Singapore", country: "Singapore", stars: 5, price_range: "$$$", description: "Famous for its infinity pool and unique architecture." },
        { id: 4, name: "The Plaza Hotel", city: "New York", country: "USA", stars: 5, price_range: "$$$$", description: "Historic luxury hotel overlooking Central Park." }
    ],
    restaurants: [
        { id: 1, name: "Noma", city: "Copenhagen", country: "Denmark", cuisine: "Nordic", rating: 4.9, michelin_stars: 3 },
        { id: 2, name: "Osteria Francescana", city: "Modena", country: "Italy", cuisine: "Italian", rating: 4.8, michelin_stars: 3 },
        { id: 3, name: "Nobu", city: "New York", country: "USA", cuisine: "Japanese-Peruvian", rating: 4.6, michelin_stars: 1 },
        { id: 4, name: "Gaggan Anand", city: "Bangkok", country: "Thailand", cuisine: "Progressive Indian", rating: 4.9, michelin_stars: 2 }
    ]
};

// الصفحة الرئيسية (Root Endpoint)
app.get('/', (req, res) => {
    res.send('Welcome to Global Hotels & Restaurants API. Use /api/hotels or /api/restaurants');
});

// الحصول على كافة الفنادق أو التصفية حسب المدينة
app.get('/api/hotels', (req, res) => {
    const city = req.query.city;
    if (city) {
        const filteredHotels = data.hotels.filter(h => h.city.toLowerCase() === city.toLowerCase());
        return res.json(filteredHotels);
    }
    res.json(data.hotels);
});

// الحصول على كافة المطاعم أو التصفية حسب المطبخ (Cuisine)
app.get('/api/restaurants', (req, res) => {
    const cuisine = req.query.cuisine;
    if (cuisine) {
        const filteredRestaurants = data.restaurants.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
        return res.json(filteredRestaurants);
    }
    res.json(data.restaurants);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

