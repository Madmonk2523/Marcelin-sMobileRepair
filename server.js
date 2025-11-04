const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static(__dirname));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20 // limit each IP to 20 requests per windowMs
});
app.use('/api/', limiter);

// Email transporter setup
const createEmailTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or your email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Use app password for Gmail
        }
    });
};

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Book appointment endpoint
app.post('/api/book-appointment', async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            vehicle,
            service,
            description,
            location,
            'preferred-date': preferredDate,
            'preferred-time': preferredTime,
            urgency
        } = req.body;

        // Basic validation
        if (!name || !phone || !vehicle || !service || !location || !preferredDate || !preferredTime) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }

        // Create appointment data
        const appointmentData = {
            id: 'APT' + Date.now(),
            name,
            phone,
            email: email || 'No email provided',
            vehicle,
            service,
            description: description || 'No description provided',
            location,
            preferredDate,
            preferredTime,
            urgency: urgency || 'routine',
            createdAt: new Date().toISOString()
        };

        // Send email notification
        await sendAppointmentNotification(appointmentData);

        // Log appointment (in production, save to database)
        console.log('New appointment booked:', appointmentData);

        res.json({
            success: true,
            message: 'Appointment booked successfully!',
            appointmentId: appointmentData.id
        });

    } catch (error) {
        console.error('Appointment booking error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to book appointment. Please try again.' 
        });
    }
});

// Email notification function
async function sendAppointmentNotification(appointmentData) {
    const transporter = createEmailTransporter();
    
    const {
        id,
        name,
        phone,
        email,
        vehicle,
        service,
        description,
        location,
        preferredDate,
        preferredTime,
        urgency
    } = appointmentData;

    // Format the service name
    const serviceName = service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Format the date
    const formattedDate = new Date(preferredDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format the time
    const [hours, minutes] = preferredTime.split(':');
    const timeObj = new Date();
    timeObj.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = timeObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0f4c75 0%, #ff4500 100%); color: white; padding: 20px; text-align: center;">
                <h1>🔧 New Appointment Booking</h1>
                <h2>Marcelin Mobile Repair</h2>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa;">
                <h3 style="color: #ff4500;">Appointment Details</h3>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #0f4c75;">Appointment ID:</strong> ${id}
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #0f4c75;">Date & Time:</strong><br>
                    ${formattedDate} at ${formattedTime}
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #0f4c75;">Service Requested:</strong><br>
                    ${serviceName}
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #0f4c75;">Customer Information:</strong><br>
                    <strong>Name:</strong> ${name}<br>
                    <strong>Phone:</strong> <a href="tel:${phone}">${phone}</a><br>
                    <strong>Email:</strong> ${email}<br>
                    <strong>Vehicle:</strong> ${vehicle}
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #0f4c75;">Service Location:</strong><br>
                    ${location}
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #0f4c75;">Problem Description:</strong><br>
                    ${description}
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #0f4c75;">Urgency Level:</strong><br>
                    <span style="background: ${urgency === 'emergency' ? '#dc3545' : urgency === 'urgent' ? '#fd7e14' : urgency === 'soon' ? '#ffc107' : '#28a745'}; 
                                 color: white; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
                        ${urgency}
                    </span>
                </div>
            </div>
            
            <div style="background: #0f4c75; color: white; padding: 15px; text-align: center;">
                <p>📞 Contact customer at <strong>${phone}</strong> to confirm appointment</p>
                <p style="font-size: 12px; opacity: 0.8;">
                    This appointment was booked on ${new Date().toLocaleString('en-US')}
                </p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.NOTIFICATION_EMAIL, // Your business email
        subject: `🔧 New Appointment: ${serviceName} - ${formattedDate}`,
        html: emailHTML,
        text: `
New Appointment Booking - Marcelin Mobile Repair

Appointment ID: ${id}
Date: ${formattedDate} at ${formattedTime}
Service: ${serviceName}

Customer: ${name}
Phone: ${phone}
Email: ${email}
Vehicle: ${vehicle}
Location: ${location}
Urgency: ${urgency.toUpperCase()}

Description: ${description}

Contact customer at ${phone} to confirm appointment.
        `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Appointment notification sent for booking ${id}`);
}

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Marcelin Mobile Repair server running on port ${PORT}`);
    console.log(`📧 Make sure to set up your email credentials in .env file`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
});

module.exports = app;