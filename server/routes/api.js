const express = require('express');
const router = express.Router();
const { Incident, Zone, Resource, Volunteer, Alert } = require('../models');

// ── HELPERS ──────────────────────────────────────────────────
const withMockFallback = async (mongooseCall, mockAction) => {
    if (global.isUsingMockDB) return mockAction();
    try { return await mongooseCall(); } catch (err) { return mockAction(); }
};

// ── ZONES & INCIDENTS (TASKS) ───────────────────────────────
router.get('/get-zones', async (req, res) => {
    const zones = await withMockFallback(() => Zone.find(), () => global.mockStore.zones);
    res.json({ zones });
});

router.get('/incidents', async (req, res) => {
    const incidents = await withMockFallback(() => Incident.find().sort({ timestamp: -1 }), () => global.mockStore.incidents);
    res.json({ incidents });
});

router.post('/report-incident', async (req, res) => {
    const { volunteerId, ...incidentData } = req.body;
    const coreData = { 
        ...incidentData, 
        timestamp: new Date(), 
        status: volunteerId ? 'in-progress' : 'pending',
        rescueStatus: volunteerId ? 'help-on-way' : 'unassigned'
    };

    const result = await withMockFallback(
        async () => {
            const inc = new Incident(coreData);
            await inc.save();

            let assignedVol = null;
            if (volunteerId) {
                assignedVol = await Volunteer.findById(volunteerId);
                if (assignedVol) {
                    assignedVol.status = 'on-mission';
                    assignedVol.task = `Reported Event: ${coreData.title}`;
                    assignedVol.taskStatus = 'in-progress';
                    assignedVol.assignedZone = inc._id;
                    assignedVol.assignedZoneName = coreData.title;
                    await assignedVol.save();
                    inc.assignedVolunteerNames = [assignedVol.name];
                    await inc.save();
                }
            }

            const alert = new Alert({
                message: assignedVol ? `🔥 ${coreData.title} & ${assignedVol.name} deployed!` : `🚨 NEW ${coreData.title} reported!`,
                type: coreData.urgency === 'critical' ? 'danger' : 'warning'
            });
            await alert.save();
            return { incident: inc.toJSON(), alert: alert.toJSON(), volunteer: assignedVol ? assignedVol.toJSON() : null };
        },
        () => {
            const inc = { _id: `inc-${Date.now()}`, id: `inc-${Date.now()}`, ...coreData, assignedVolunteerNames: [] };
            let assignedVol = null;
            if (volunteerId) {
                assignedVol = global.mockStore.volunteers.find(v => v._id === volunteerId || v.id === volunteerId);
                if (assignedVol) {
                    assignedVol.status = 'on-mission';
                    assignedVol.task = `Reported Event: ${coreData.title}`;
                    assignedVol.taskStatus = 'in-progress';
                    assignedVol.assignedZoneName = inc.title;
                    inc.assignedVolunteerNames.push(assignedVol.name);
                }
            }
            const alert = { _id: `a-${Date.now()}`, message: assignedVol ? `🔥 ${inc.title} assigned to ${assignedVol.name}` : `🚨 NEW ${inc.title} reported!`, type: 'warning', timestamp: new Date() };
            global.mockStore.incidents.unshift(inc);
            global.mockStore.alerts.unshift(alert);
            return { incident: inc, alert: alert, volunteer: assignedVol };
        }
    );

    if (global.io) {
        global.io.emit('new-incident', result.incident);
        global.io.emit('new-alert', result.alert);
        if (result.volunteer) global.io.emit('volunteer-assigned', { volunteer: result.volunteer, zone: result.incident });
    }
    res.status(201).json({ success: true, incident: result.incident });
});

// ── VOLUNTEERS ───────────────────────────────────────────────
router.get('/volunteers', async (req, res) => {
    const volunteers = await withMockFallback(() => Volunteer.find().sort({ status: 1 }), () => global.mockStore.volunteers);
    res.json({ volunteers });
});

router.post('/volunteers', async (req, res) => {
    try {
        const result = await withMockFallback(
            async () => {
                const vol = new Volunteer(req.body);
                await vol.save();
                return vol.toJSON();
            },
            () => {
                const vol = { _id: `v-${Date.now()}`, id: `v-${Date.now()}`, ...req.body, status: 'available', taskStatus: 'idle' };
                global.mockStore.volunteers.push(vol);
                return vol;
            }
        );
        if (global.io) global.io.emit('volunteer-updated', result);
        res.status(201).json({ success: true, volunteer: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register volunteer' });
    }
});

router.post('/assign-volunteer', async (req, res) => {
    const { volunteerId, targetId, targetType, taskName } = req.body;

    const result = await withMockFallback(
        async () => {
            const volunteer = await Volunteer.findById(volunteerId);
            let target = null;
            if (targetType === 'zone') target = await Zone.findById(targetId);
            else target = await Incident.findById(targetId);

            if (!volunteer || !target) throw new Error('Not found');

            volunteer.status = 'on-mission';
            volunteer.task = taskName;
            volunteer.taskStatus = 'in-progress';
            volunteer.assignedZone = targetId; 
            volunteer.assignedZoneName = target.reason || target.title;
            await volunteer.save();

            target.rescueStatus = 'help-on-way';
            if (targetType === 'zone') {
                if (!target.assignedVolunteers.includes(volunteerId)) {
                    target.assignedVolunteers.push(volunteerId);
                    target.assignedVolunteerNames.push(volunteer.name);
                }
            }
            await target.save();

            const alert = new Alert({ message: `🚑 ${volunteer.name} deployed to: ${volunteer.assignedZoneName}`, type: 'info' });
            await alert.save();
            return { volunteer: volunteer.toJSON(), target: target.toJSON(), alert: alert.toJSON() };
        },
        () => {
            const v = global.mockStore.volunteers.find(v => v._id === volunteerId || v.id === volunteerId);
            let t = null;
            if (targetType === 'zone') t = global.mockStore.zones.find(z => z._id === targetId || z.id === targetId);
            else t = global.mockStore.incidents.find(i => i._id === targetId || i.id === targetId);

            if (!v || !t) return null;

            v.status = 'on-mission';
            v.task = taskName;
            v.taskStatus = 'in-progress';
            v.assignedZoneName = t.reason || t.title;

            t.rescueStatus = 'help-on-way';
            if (!t.assignedVolunteerNames) t.assignedVolunteerNames = [];
            if (!t.assignedVolunteerNames.includes(v.name)) t.assignedVolunteerNames.push(v.name);

            const alert = { _id: `a-${Date.now()}`, message: `🚑 ${v.name} deployed to: ${v.assignedZoneName}`, type: 'info', timestamp: new Date() };
            global.mockStore.alerts.unshift(alert);
            return { volunteer: v, target: t, alert: alert };
        }
    );

    if (!result) return res.status(404).json({ success: false });

    if (global.io) {
        global.io.emit('volunteer-assigned', { volunteer: result.volunteer, zone: result.target });
        global.io.emit('new-alert', result.alert);
    }
    res.json({ success: true, ...result });
});

router.patch('/volunteers/:id/complete', async (req, res) => {
    const result = await withMockFallback(
        async () => {
            const v = await Volunteer.findById(req.params.id);
            if (!v) return null;
            
            const targetId = v.assignedZone;
            const prevName = v.assignedZoneName;
            
            v.status = 'available';
            v.taskStatus = 'completed';
            v.task = null;
            v.assignedZone = null;
            v.assignedZoneName = null;
            await v.save();

            // Try to find the target in zones OR incidents to remove the task (mark as resolved)
            let target = await Zone.findById(targetId) || await Incident.findById(targetId);
            if (target) {
                target.rescueStatus = 'completed';
                // If it's an incident, we might want to "remove" it or hide it
                if (target.title) { // It's an incident
                    target.status = 'resolved';
                }
                await target.save();
            }

            const alert = new Alert({ message: `✅ Mission completed at ${prevName} by ${v.name}`, type: 'info' });
            await alert.save();
            return { volunteer: v.toJSON(), target: target ? target.toJSON() : null, alert: alert.toJSON() };
        },
        () => {
            const v = global.mockStore.volunteers.find(v => v._id === req.params.id || v.id === req.params.id);
            if (!v) return null;
            
            const prevName = v.assignedZoneName;
            v.status = 'available';
            v.taskStatus = 'completed';
            v.task = null;
            v.assignedZoneName = null;

            // In mock, search both lists
            const t = global.mockStore.zones.find(z => z.reason === prevName) || 
                      global.mockStore.incidents.find(i => i.title === prevName);
            
            if (t) {
                t.rescueStatus = 'completed';
                if (t.title) t.status = 'resolved';
            }

            const alert = { _id: `a-${Date.now()}`, message: `✅ Mission completed at ${prevName} by ${v.name}`, type: 'info', timestamp: new Date() };
            global.mockStore.alerts.unshift(alert);
            return { volunteer: v, target: t, alert: alert };
        }
    );

    if (!result) return res.status(404).json({ success: false });

    if (global.io) {
        global.io.emit('volunteer-updated', result.volunteer);
        global.io.emit('new-alert', result.alert);
        if (result.target) global.io.emit('zone-updated', result.target);
    }
    res.json({ success: true });
});

// ── ALERTS ───────────────────────────────────────────────────
router.get('/alerts', async (req, res) => {
    const alerts = await withMockFallback(() => Alert.find().sort({ timestamp: -1 }).limit(20), () => global.mockStore.alerts);
    res.json({ alerts });
});

// ── SYSTEM ────────────────────────────────────────────────────
router.post('/reset', async (req, res) => {
    try { await global.resetSystemState(); res.json({ success: true }); } catch (err) { res.status(500).json({ error: 'Reset failed' }); }
});

module.exports = router;
