const { Volunteer, Resource, Zone, Alert, Incident } = require('./models');

async function seedDatabase() {
    try {
        const zoneCount = await Zone.countDocuments();
        
        if (zoneCount === 0) {
            console.log("Database empty. Seeding initial ResQSense data...");

            await Zone.insertMany([
                { lat: 26.1850, lng: 91.7450, status: "critical", reason: "Brahmaputra river overflow, submerged houses", victims_prob: 85 },
                { lat: 26.1800, lng: 91.7400, status: "medium", reason: "Rising water levels, minor waterlogging", victims_prob: 45 },
                { lat: 26.1300, lng: 91.8000, status: "safe", reason: "High ground setup complete", victims_prob: 5 }
            ]);

            await Volunteer.insertMany([
                { name: "Aman Singh", location: "Uzan Bazaar", skills: ["First Aid", "Boat Piloting"], status: "available" },
                { name: "Priya Sharma", location: "Fancy Bazaar", skills: ["Medical", "Rescue"], status: "on-mission" },
                { name: "Rahul Verma", location: "Dispur Base", skills: ["Heavy Machinery", "Rope Rescue"], status: "available" }
            ]);

            await Resource.insertMany([
                { type: "Ambulance", assignedTo: null, available: true },
                { type: "Rescue Boat", assignedTo: "Zone A", available: false },
                { type: "Food Supply Airdrop", assignedTo: null, available: true }
            ]);

            await Alert.insertMany([
                { message: "CRITICAL: Silent zone detected near Brahmaputra Riverbank. Dispatching NDRF boats.", type: "danger" },
                { message: "Update: Boat rescue team entering Uzan Bazaar.", type: "info" }
            ]);

            await Incident.insertMany([
                { 
                  title: "Massive Fire in Residential Area", 
                  description: "Fire broke out on 3rd floor. People trapped inside building.", 
                  urgency: "critical", 
                  location: { lat: 26.1700, lng: 91.7550 } 
                },
                { 
                  title: "Bridge Structural Failure", 
                  description: "Main bridge column showing deep cracks, collapsing risk.", 
                  urgency: "critical", 
                  location: { lat: 26.1850, lng: 91.7200 } 
                }
            ]);

            console.log("Seeding complete!");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

module.exports = seedDatabase;
