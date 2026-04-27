require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const seedDatabase = require('./seed');

const app = express();
const server = http.createServer(app);
const mockStore = require('./mock_db');

// Global state for when we lack a database
global.isUsingMockDB = false;
global.mockStore = mockStore;

const getInitialMockData = () => JSON.parse(JSON.stringify(require('./mock_db')));

global.resetSystemState = async () => {
    if (global.isUsingMockDB) {
        const fresh = getInitialMockData();
        global.mockStore.incidents = [];
        global.mockStore.alerts = [{ _id: 'a1', message: "🚀 System Reset. Ready for new simulation.", type: "info", timestamp: new Date() }];
        global.mockStore.zones = fresh.zones;
        global.mockStore.volunteers = fresh.volunteers;
    } else {
        await seedDatabase();
    }
    if (global.io) {
        global.io.emit('system-reset');
    }
};

// Socket.io with CORS
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] }
});

// Make io globally accessible to routes
global.io = io;

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection with In-Memory fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resqsense';
let isUsingMockDB = false;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB.');
    await seedDatabase();
  })
  .catch(async (err) => {
    console.error('❌ MongoDB Connection Error. Switching to In-Memory Mock DB.');
    global.isUsingMockDB = true;
  });

// Socket.io events
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.send('ResQSense API running.'));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
