const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ------------------ GLOBAL DATA ------------------

const cities = [
  "Paris", "London", "Dubai", "New York", "Tokyo",
  "Berlin", "Rome", "Istanbul", "Bangkok", "Cairo",
  "Johannesburg", "São Paulo", "Sydney", "Toronto", "Madrid"
];

const countries = {
  Paris: "France",
  London: "UK",
  Dubai: "UAE",
  "New York": "USA",
  Tokyo: "Japan",
  Berlin: "Germany",
  Rome: "Italy",
  Istanbul: "Turkey",
  Bangkok: "Thailand",
  Cairo: "Egypt",
  Johannesburg: "South Africa",
  "São Paulo": "Brazil",
  Sydney: "Australia",
  Toronto: "Canada",
  Madrid: "Spain"
};

const cuisines = [
  "Italian", "French", "Japanese", "Chinese",
  "American", "Indian", "Arabic", "Mexican",
  "Mediterranean", "Korean", "Thai"
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHotels(count) {
  const hotels = [];
  for (let i = 1; i <= count; i++) {
    const city = randomItem(cities);
    hotels.push({
      id: i,
      name: `Global Hotel ${i}`,
      city,
      country: countries[city],
      rating: +(Math.random() * (5 - 3.5) + 3.5).toFixed(1),
      price_level: "$".repeat(Math.floor(Math.random() * 4) + 2)
    });
  }
  return hotels;
}

function generateRestaurants(count) {
  const restaurants = [];
  for (let i = 1; i <= count; i++) {
    const city = randomItem(cities);
    restaurants.push({
      id: i,
      name: `Global Restaurant ${i}`,
      city,
      country: countries[city],
      cuisine: randomItem(cuisines),
      rating: +(Math.random() * (5 - 3.5) + 3.5).toFixed(1),
      price_level: "$".repeat(Math.floor(Math.random() * 4) + 1)
    });
  }
  return restaurants;
}

// 🔥 هنا العدد الحقيقي
const hotels = generateHotels(1000);
const restaurants = generateRestaurants(1000);

// ------------------ FILTER FUNCTION ------------------

function applyFilters(data, query) {
  let result = [...data];

  if (query.city)
    result = result.filter(item => item.city.toLowerCase() === query.city.toLowerCase());

  if (query.country)
    result = result.filter(item => item.country.toLowerCase() === query.country.toLowerCase());

  if (query.cuisine)
    result = result.filter(item => item.cuisine && item.cuisine.toLowerCase() === query.cuisine.toLowerCase());

  if (query.min_rating)
    result = result.filter(item => item.rating >= parseFloat(query.min_rating));

  if (query.price_level)
    result = result.filter(item => item.price_level === query.price_level);

  if (query.sort_by === "rating")
    result.sort((a, b) => b.rating - a.rating);

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    total: result.length,
    page,
    limit,
    data: result.slice(start, end)
  };
}

// ------------------ ENDPOINTS ------------------

app.get("/api/restaurants", (req, res) => {
  const result = applyFilters(restaurants, req.query);
  res.json({ success: true, ...result });
});

app.get("/api/hotels", (req, res) => {
  const result = applyFilters(hotels, req.query);
  res.json({ success: true, ...result });
});

app.get("/", (req, res) => {
  res.json({
    status: "running",
    version: "3.0.0",
    total_hotels: hotels.length,
    total_restaurants: restaurants.length,
    message: "Global Hotels & Restaurants API is live 🌍🚀"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
