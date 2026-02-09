const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// بيانات تجريبية احترافية
const data = {
    hotels: [
        { id: 1, name: "Burj Al Arab Jumeirah", city: "Dubai", country: "UAE", stars: 7, description: "Iconic hotel." },
        { id: 2, name: "The Ritz-Carlton, Paris", city: "Paris", country: "France", stars: 5, description: "Legendary luxury." },
        { id: 3, name: "Marina Bay Sands", city: "Singapore", country: "Singapore", stars: 5, description: "Infinity pool." },
        { id: 4, name: "The Plaza Hotel", city: "New York", country: "USA", stars: 5, description: "Historic luxury." }
    ],
    restaurants: [
        { id: 1, name: "Noma", city: "Copenhagen", country: "Denmark", cuisine: "New Nordic", michelin_stars: 3 },
        { id: 2, name: "Osteria Francescana", city: "Modena", country: "Italy", cuisine: "Italian (Modern)", michelin_stars: 3 }
    ]
};

// GET /api/hotels: جلب كل الفنادق أو التصفية حسب المدينة
app.get('/api/hotels', (req, res) => {
    // نستخدم req.query لقراءة المعلمات من الرابط (مثال: ?city=Dubai)
    const cityFilter = req.query.city; 
    
    if (cityFilter) {
        const filteredHotels = data.hotels.filter(h => h.city.toLowerCase() === cityFilter.toLowerCase());
        return res.json(filteredHotels);
    }
    
    res.json(data.hotels);
});

// GET /api/restaurants: جلب كل المطاعم أو التصفية حسب المطبخ
app.get('/api/restaurants', (req, res) => {
    // نستخدم req.query لقراءة المعلمات من الرابط (مثال: ?cuisine=Italian)
    const cuisineFilter = req.query.cuisine; 

    if (cuisineFilter) {
        const filteredRestaurants = data.restaurants.filter(r => r.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase()));
        return res.json(filteredRestaurants);
    }
    
    res.json(data.restaurants);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
