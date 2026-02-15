const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// دالة مركزية لجلب البيانات الحقيقية من Yelp
async function getTravelData(city, category) {
    const apiKey = process.env.YELP_API_KEY; // يجب إضافته في إعدادات Render
    const url = `https://api.yelp.com{city}&term=${category}&limit=15`;

    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        return response.data.businesses;
    } catch (error) {
        return { error: "Failed to fetch data from Yelp", details: error.message };
    }
}

// 1. مسار جلب الفنادق الحقيقية (بناءً على المدينة)
app.get('/api/hotels', async (req, res) => {
    const city = req.query.city || 'Dubai';
    const data = await getTravelData(city, 'hotels');
    res.json(data);
});

// 2. مسار جلب المطاعم الحقيقية (بناءً على المدينة)
app.get('/api/restaurants', async (req, res) => {
    const city = req.query.city || 'Dubai';
    const data = await getTravelData(city, 'restaurants');
    res.json(data);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
