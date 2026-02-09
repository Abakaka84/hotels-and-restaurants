const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

/* ===== Route أساسي ===== */
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    endpoints: {
      hotels: '/api/hotels',
      restaurants: '/api/restaurants'
    }
  });
});

/* ===== بيانات تجريبية ===== */
const data = {
  hotels: [
    { id: 1, name: "Burj Al Arab Jumeirah", city: "Dubai", country: "UAE", stars: 7 },
    { id: 2, name: "The Ritz-Carlton, Paris", city: "Paris", country: "France", stars: 5 },
    { id: 3, name: "Marina Bay Sands", city: "Singapore", country: "Singapore", stars: 5 },
    { id: 4, name: "The Plaza Hotel", city: "New York", country: "USA", stars: 5 }
  ],
  restaurants: [
    { id: 1, name: "Noma", city: "Copenhagen", cuisine: "New Nordic", michelin_stars: 3 },
    { id: 2, name: "Osteria Francescana", city: "Modena", cuisine: "Italian (Modern)", michelin_stars: 3 }
  ]
};

/* ===== فنادق ===== */
app.get('/api/hotels', (req, res) => {
  const city = req.query.city;

  if (city) {
    const filtered = data.hotels.filter(
      h => h.city.toLowerCase() === city.toLowerCase()
    );
    return res.json(filtered);
  }

  res.json(data.hotels);
});

/* ===== مطاعم ===== */
app.get('/api/restaurants', (req, res) => {
  const cuisine = req.query.cuisine;

  if (cuisine) {
    const filtered = data.restaurants.filter(
      r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
    );
    return res.json(filtered);
  }

  res.json(data.restaurants);
});

/* ===== تشغيل السيرفر ===== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
