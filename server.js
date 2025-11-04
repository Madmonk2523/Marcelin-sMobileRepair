const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stripe configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// In-memory storage for demo (use MongoDB/PostgreSQL in production)
let bookings = [];
let quotes = [];

// Validation middleware
const validateBooking = [
    body('name').trim().isLength({ min: 2 }).escape(),
    body('phone').isMobilePhone(),
    body('email').isEmail().normalizeEmail(),
    body('vehicle').trim().isLength({ min: 3 }).escape(),
    body('service').isIn(['oil-change', 'battery', 'brakes', 'engine', 'cooling', 'emergency', 'other']),
    body('location').trim().isLength({ min: 5 }).escape(),
    body('preferredDate').isISO8601().toDate(),
    body('preferredTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
];

const validateQuote = [
    body('name').trim().isLength({ min: 2 }).escape(),
    body('phone').isMobilePhone(),
    body('vehicle').trim().isLength({ min: 3 }).escape(),
    body('service').isIn(['oil-change', 'battery', 'brakes', 'engine', 'cooling', 'emergency', 'other']),
    body('location').trim().isLength({ min: 5 }).escape(),
];

// Service pricing
const servicePricing = {
    'oil-change': { min: 75, max: 120, deposit: 25 },
    'battery': { min: 150, max: 250, deposit: 50 },
    'brakes': { min: 200, max: 500, deposit: 75 },
    'engine': { min: 100, max: 150, deposit: 50 },
    'cooling': { min: 120, max: 300, deposit: 50 },
    'emergency': { min: 150, max: 400, deposit: 100 },
    'other': { min: 100, max: 300, deposit: 50 }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get service pricing
app.get('/api/pricing', (req, res) => {
    res.json(servicePricing);
});

// Create payment intent for deposit
app.post('/api/create-payment-intent', validateBooking, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { service, name, email } = req.body;
        const pricing = servicePricing[service];
        
        if (!pricing) {
            return res.status(400).json({ error: 'Invalid service type' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: pricing.deposit * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                service: service,
                customerName: name,
                customerEmail: email,
                type: 'deposit'
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: pricing.deposit
        });

    } catch (error) {
        console.error('Payment intent creation failed:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

// Create booking with payment
app.post('/api/bookings', validateBooking, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const bookingData = {
            id: 'MM' + Date.now(),
            ...req.body,
            status: 'confirmed',
            createdAt: new Date(),
            depositPaid: true,
            depositAmount: servicePricing[req.body.service].deposit
        };

        // Store booking (use database in production)
        bookings.push(bookingData);

        // Send confirmation email (implement with nodemailer)
        await sendBookingConfirmation(bookingData);

        res.status(201).json({
            success: true,
            booking: bookingData,
            message: 'Booking confirmed successfully'
        });

    } catch (error) {
        console.error('Booking creation failed:', error);
        res.status(500).json({ error: 'Booking creation failed' });
    }
});

// Submit quote request
app.post('/api/quotes', validateQuote, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const quoteData = {
            id: 'QT' + Date.now(),
            ...req.body,
            status: 'pending',
            createdAt: new Date()
        };

        // Store quote request
        quotes.push(quoteData);

        // Send quote request notification
        await sendQuoteRequest(quoteData);

        res.status(201).json({
            success: true,
            quote: quoteData,
            message: 'Quote request submitted successfully'
        });

    } catch (error) {
        console.error('Quote submission failed:', error);
        res.status(500).json({ error: 'Quote submission failed' });
    }
});

// Get available time slots
app.get('/api/availability/:date', (req, res) => {
    const { date } = req.params;
    
    // Get existing bookings for the date
    const existingBookings = bookings.filter(booking => 
        booking.preferredDate === date && booking.status === 'confirmed'
    );
    
    const bookedTimes = existingBookings.map(booking => booking.preferredTime);
    
    // Available time slots
    const allSlots = [
        '08:00', '09:00', '10:00', '11:00', 
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.json({
        date: date,
        availableSlots: availableSlots,
        bookedSlots: bookedTimes.length
    });
});

// Admin endpoints (add authentication in production)
app.get('/api/admin/bookings', (req, res) => {
    res.json({ bookings: bookings });
});

app.get('/api/admin/quotes', (req, res) => {
    res.json({ quotes: quotes });
});

// Email functions (implement with nodemailer)
async function sendBookingConfirmation(bookingData) {
    // TODO: Implement email sending with nodemailer
    console.log('Booking confirmation email would be sent to:', bookingData.email);
    console.log('Booking details:', bookingData);
}

async function sendQuoteRequest(quoteData) {
    // TODO: Implement quote request notification
    console.log('Quote request notification would be sent for:', quoteData);
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Marcelin Mobile Repair API server running on port ${PORT}`);
    console.log(`📧 Webhook endpoint: http://localhost:${PORT}/api/webhook`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;