const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const stylistRoutes = require('./routes/stylistRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const User = require('./models/User');
const Service = require('./models/Service');
const Stylist = require('./models/Stylist');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stylists', stylistRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
    res.send('SalonFlow Pro API is running...');
});

const seedAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Salon Admin';

    if (!adminEmail || !adminPassword) {
        console.log('ADMIN_EMAIL or ADMIN_PASSWORD is not configured. Skipping admin seed.');
        return;
    }

    const normalizedEmail = adminEmail.toLowerCase();
    const existingAdmin = await User.findOne({ email: normalizedEmail });

    if (existingAdmin) {
        if (existingAdmin.role !== 'admin') {
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log(`Updated existing user to admin: ${normalizedEmail}`);
        } else {
            console.log(`Admin user already exists: ${normalizedEmail}`);
        }
        return;
    }

    await User.create({
        name: adminName,
        email: normalizedEmail,
        password: adminPassword,
        role: 'admin'
    });
    console.log(`Created admin user: ${normalizedEmail}`);
};

const seedDefaultData = async () => {
    const serviceCount = await Service.countDocuments();
    const stylistCount = await Stylist.countDocuments();

    if (!serviceCount) {
        await Service.create([
            {
                name: 'Signature Haircut',
                category: 'Hair',
                price: 1290,
                duration: 45,
                description: 'Face-shape consultation, precision cut, wash and luxury finish.',
            },
            {
                name: 'Gloss Color Ritual',
                category: 'Color',
                price: 3490,
                duration: 110,
                description: 'Dimensional gloss, toner, bond care and luminous blowout.',
            },
            {
                name: 'Keratin Luxe',
                category: 'Treatment',
                price: 4990,
                duration: 150,
                description: 'Frizz control, mirror shine and deep smoothing for up to 12 weeks.',
            },
            {
                name: 'Glass Skin Facial',
                category: 'Skin',
                price: 2490,
                duration: 70,
                description: 'Cleanse, exfoliation, sculpting massage, mask and serum infusion.',
            },
        ]);
        console.log('Seeded default services.');
    }

    if (!stylistCount) {
        await Stylist.create([
            {
                name: 'Aria Mehta',
                role: 'Creative Director',
                specialization: ['Luxury Cuts', 'Editorial Finish'],
                rating: 5,
                reviews: 318,
                experience: 12,
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=400',
            },
            {
                name: 'Noah Varghese',
                role: 'Color Specialist',
                specialization: ['Balayage', 'Gloss Color'],
                rating: 4.9,
                reviews: 286,
                experience: 9,
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=400',
            },
            {
                name: 'Mira Iyer',
                role: 'Bridal Artist',
                specialization: ['Bridal Hair', 'HD Makeup'],
                rating: 5,
                reviews: 241,
                experience: 10,
                avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&q=85&w=400',
            },
            {
                name: 'Zara Khan',
                role: 'Skin Therapist',
                specialization: ['Facials', 'Skin Rituals'],
                rating: 4.8,
                reviews: 176,
                experience: 7,
                avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=85&w=400',
            },
        ]);
        console.log('Seeded default stylists.');
    }
};

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/salonflow';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await seedAdminUser();
        await seedDefaultData();
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

module.exports = app;
