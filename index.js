const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ===========================
   GLOBAL STATIC DATA
=========================== */

const cities = [
  "Paris","London","Dubai","New York","Tokyo",
  "Berlin","Rome","Istanbul","Bangkok","Cairo",
  "Johannesburg","São Paulo","Sydney","Toronto","Madrid"
];

const countries = {
  Paris:"France", London:"UK", Dubai:"UAE", "New York":"USA",
  Tokyo:"Japan", Berlin:"Germany", Rome:"Italy", Istanbul:"Turkey",
  Bangkok:"Thailand", Cairo:"Egypt", Johannesburg:"South Africa",
  "São Paulo":"Brazil", Sydney:"Australia", Toronto:"Canada", Madrid:"Spain"
};

const cuisines = [
  "Italian","French","Japanese","Chinese",
  "American","Indian","Arabic","Mexican",
  "Mediterranean","Korean","Thai"
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHotels(count) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    const city = randomItem(cities);
    list.push({
      id: i,
      name: `Global Hotel ${i}`,
      city,
      country: countries[city],
      rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
      price_level: "$".repeat(Math.floor(Math.random() * 4) + 1)
    });
  }
  return list;
}

function generateRestaurants(count) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    const city = randomItem(cities);
    list.push({
      id: i,
      name: `Global Restaurant ${i}`,
      city,
      country: countries[city],
      cuisine: randomItem(cuisines),
      rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
      price_level: "$".repeat(Math.floor(Math.random() * 4) + 1)
    });
  }
  return list;
}

const hotels = generateHotels(1000);
const restaurants = generateRestaurants(1000);

/* ===========================
   YELP FUNCTION
=========================== */

async function fetchYelp(city) {
  try {
    if (!process.env.YELP_API_KEY || !city) return [];

    const response = await axios.get(
      "https://api.yelp.com/v3/businesses/search",
      {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_KEY}`
        },
        params: {
          term: "restaurants",
          location: city,
          limit: 20
        }
      }
    );

    return response.data.businesses.map(b => ({
      id: b.id,
      name: b.name,
      city: city,
      country: b.location.country || "",
      cuisine: b.categories[0]?.title || "Unknown",
      rating: b.rating,
      price_level: b.price || "$$"
    }));
  } catch (err) {
    console.log("Yelp failed safely");
    return [];
  }
}

/* ===========================
   FILTER + PAGINATION
=========================== */

function applyFilters(data, query) {
  let result = [...data];

  if (query.city)
    result = result.filter(i =>
      i.city.toLowerCase() === query.city.toLowerCase()
    );

  if (query.min_rating)
    result = result.filter(i =>
      i.rating >= parseFloat(query.min_rating)
    );

  if (query.sort_by === "rating")
    result.sort((a,b)=> b.rating - a.rating);

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const start = (page - 1) * limit;

  return {
    total: result.length,
    page,
    limit,
    data: result.slice(start, start + limit)
  };
}

/* ===========================
   ROUTES
=========================== */

app.get("/", (req,res)=>{
  res.json({
    status:"running",
    hotels: hotels.length,
    restaurants: restaurants.length,
    version:"5.0.0"
  });
});

app.get("/api/hotels", (req,res)=>{
  const result = applyFilters(hotels, req.query);
  res.json(result);
});

app.get("/api/restaurants", async (req,res)=>{
  const city = req.query.city;

  let generated = restaurants;

  if (city) {
    generated = restaurants.filter(r =>
      r.city.toLowerCase() === city.toLowerCase()
    );
  }

  const yelpData = await fetchYelp(city);

  const combined = [...yelpData, ...generated];

  const result = applyFilters(combined, req.query);

  res.json(result);
});

/* ===========================
   SERVER
=========================== */

app.listen(PORT, ()=>{
  console.log("Server running on port " + PORT);
});
