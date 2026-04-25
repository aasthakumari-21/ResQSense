const mongoose = require('mongoose');

// Helper to normalize the exact ID field format so frontend maps cleanly
const transformId = (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
};

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    urgency: String,
    location: {
        lat: Number,
        lng: Number
    },
    timestamp: { type: Date, default: Date.now }
}, { toJSON: { transform: transformId } });

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    skills: [String],
    status: { type: String, default: 'available' }
}, { toJSON: { transform: transformId } });

const resourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    assignedTo: { type: String, default: null },
    available: { type: Boolean, default: true }
}, { toJSON: { transform: transformId } });

const zoneSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    status: String, // critical, medium, safe
    reason: String,
    victims_prob: Number // probability score
}, { toJSON: { transform: transformId } });

const alertSchema = new mongoose.Schema({
    message: String,
    type: String, // danger, warning, info
    timestamp: { type: Date, default: Date.now }
}, { toJSON: { transform: transformId } });

module.exports = {
    Incident: mongoose.model('Incident', incidentSchema),
    Volunteer: mongoose.model('Volunteer', volunteerSchema),
    Resource: mongoose.model('Resource', resourceSchema),
    Zone: mongoose.model('Zone', zoneSchema),
    Alert: mongoose.model('Alert', alertSchema)
};
