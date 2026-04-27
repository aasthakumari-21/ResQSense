const mongoose = require('mongoose');

const transformId = (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
};

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    urgency: { type: String, default: 'medium' },
    disasterType: { type: String, default: 'other' }, // flood, fire, landslide, collapse, accident, other
    location: { lat: Number, lng: Number },
    timestamp: { type: Date, default: Date.now }
}, { toJSON: { transform: transformId } });

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    skills: [String],
    status: { type: String, default: 'available' }, // available, on-mission, completed
    assignedZone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', default: null },
    assignedZoneName: { type: String, default: null },
    task: { type: String, default: null },
    taskStatus: { type: String, default: 'idle' } // idle, pending, in-progress, completed
}, { toJSON: { transform: transformId } });

const resourceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    assignedTo: { type: String, default: null },
    available: { type: Boolean, default: true }
}, { toJSON: { transform: transformId } });

const zoneSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    status: String,   // critical, medium, safe
    reason: String,
    victims_prob: Number,
    rescueStatus: { type: String, default: 'unassigned' }, // unassigned, help-on-way, rescue-in-progress, completed
    assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
    assignedVolunteerNames: [String]
}, { toJSON: { transform: transformId } });

const alertSchema = new mongoose.Schema({
    message: String,
    type: String,
    timestamp: { type: Date, default: Date.now }
}, { toJSON: { transform: transformId } });

module.exports = {
    Incident: mongoose.model('Incident', incidentSchema),
    Volunteer: mongoose.model('Volunteer', volunteerSchema),
    Resource: mongoose.model('Resource', resourceSchema),
    Zone: mongoose.model('Zone', zoneSchema),
    Alert: mongoose.model('Alert', alertSchema)
};
