const express = require('express');
const router = express.Router();
const { Incident, Zone, Resource, Volunteer, Alert } = require('../models');

// Extract all zones
router.get('/get-zones', async (req, res) => {
    try {
        const zones = await Zone.find();
        res.json({ zones });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all reported incidents
router.get('/incidents', async (req, res) => {
    try {
        const incidents = await Incident.find();
        res.json({ incidents });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Report a new incident
router.post('/report-incident', async (req, res) => {
    try {
        const newIncident = new Incident(req.body);
        await newIncident.save();
        res.status(201).json({ success: true, incident: newIncident });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to report incident' });
    }
});

// Resource retrieval and allocation
router.post('/allocate-resources', async (req, res) => {
    try {
        const { resourceId, zoneId } = req.body;
        const resource = await Resource.findById(resourceId);
        if(resource) {
            resource.assignedTo = zoneId;
            resource.available = false;
            await resource.save();
            res.json({ success: true, message: "Resource allocated successfully", resource });
        } else {
            res.status(404).json({ success: false, message: "Resource not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get volunteers and register dummy volunteer (via GET param simulation if needed, but normally handled frontend)
router.get('/volunteers', async (req, res) => {
    try {
        // Sort available volunteers to top
        const volunteers = await Volunteer.find().sort({ status: 1 }); 
        res.json({ volunteers });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get alerts
router.get('/alerts', async (req, res) => {
    try {
        // Find most recent alerts
        const alerts = await Alert.find().sort({ timestamp: -1 }).limit(10);
        res.json({ alerts });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
