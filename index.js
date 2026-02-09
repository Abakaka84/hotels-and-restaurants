const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// هذا السطر مهم جداً لتمكين قراءة الـ JSON المرسل في جسم الطلب
app.use(express.json()); 

let data = {
    hotels: [
        { id: 1, name: "Burj Al Arab", city: "Dubai", country: "UAE", stars: 7, price_range: "$$$$", description: "Iconic sail-shaped hotel on its own island." },
        // ... بقية بيانات الفنادق والمطاعم
    ],
    restaurants: [
        // ... بيانات المطاعم
    ]
};

// ... بقية الـ Endpoints الأخرى (GET /api/hotels, GET /api/restaurants) ...

// **نقطة نهاية جديدة لإضافة فندق (POST Endpoint)**
app.post('/api/hotels/add', (req, res) => {
    // البيانات الجديدة تأتي من جسم الطلب (Body)
    const newHotel = req.body; 

    // التحقق البسيط من البيانات (يجب أن يكون الاسم موجوداً)
    if (!newHotel || !newHotel.name) {
        return res.status(400).json({ message: "Hotel name is required" });
    }

    // إضافة معرف فريد مؤقت (ID)
    newHotel.id = data.hotels.length + 1;
    // إضافة الفندق الجديد إلى المصفوفة المؤقتة
    data.hotels.push(newHotel);

    // إرسال رد إيجابي للعميل مع الفندق المضاف
    res.status(201).json({ 
        message: "Hotel added successfully", 
        hotel: newHotel 
    });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
