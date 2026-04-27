// In-Memory storage for when MongoDB is unavailable
const mockStore = {
    zones: [
        { _id: 'z1', id: 'z1', lat: 26.1982, lng: 91.7533, status: 'critical', reason: 'Uzan Bazaar Embankment Breach', victims_prob: 88, rescueStatus: 'unassigned', assignedVolunteers: [], assignedVolunteerNames: [] },
        { _id: 'z2', id: 'z2', lat: 26.1750, lng: 91.7300, status: 'medium', reason: 'High water level in Sarabbhati', victims_prob: 45, rescueStatus: 'unassigned', assignedVolunteers: [], assignedVolunteerNames: [] },
        { _id: 'z3', id: 'z3', lat: 26.1445, lng: 91.7360, status: 'critical', reason: 'Silent Zone: Signal loss in Athgaon', victims_prob: 92, rescueStatus: 'unassigned', assignedVolunteers: [], assignedVolunteerNames: [] }
    ],
    volunteers: [
        { _id: 'v1', id: 'v1', name: "Rahul Sharma", location: "Pan Bazaar", skills: ["Medical", "First Aid"], status: "available", taskStatus: "idle" },
        { _id: 'v2', id: 'v2', name: "Priya Das", location: "Zoo Road", skills: ["Boat Piloting"], status: "available", taskStatus: "idle" },
        { _id: 'v3', id: 'v3', name: "Arjun Kalita", location: "Maligaon", skills: ["Rope Rescue"], status: "available", taskStatus: "idle" },
        { _id: 'v4', id: 'v4', name: "Suman Baruah", location: "Beltola", skills: ["Heavy Machinery", "Truck Driving"], status: "available", taskStatus: "idle" },
        { _id: 'v5', id: 'v5', name: "Neha Gogoi", location: "Guwahati Club", skills: ["Paramedic", "Triage"], status: "available", taskStatus: "idle" },
        { _id: 'v6', id: 'v6', name: "Vikram Singh", location: "Noonmati", skills: ["Search & Rescue", "Diver"], status: "available", taskStatus: "idle" }
    ],
    incidents: [],
    alerts: [
        { _id: 'a1', message: "🚀 ResQSense System initializing...", type: "info", timestamp: new Date() }
    ],
    resources: []
};

module.exports = mockStore;
