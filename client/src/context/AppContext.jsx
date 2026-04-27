import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const API = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [zones, setZones] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);

  // ── Initial data fetch ──────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [incRes, zoneRes, volRes, alertRes] = await Promise.all([
        fetch(`${API}/incidents`),
        fetch(`${API}/get-zones`),
        fetch(`${API}/volunteers`),
        fetch(`${API}/alerts`)
      ]);
      const [incData, zoneData, volData, alertData] = await Promise.all([
        incRes.json(), zoneRes.json(), volRes.json(), alertRes.json()
      ]);
      setIncidents(incData.incidents || []);
      setZones(zoneData.zones || []);
      setVolunteers(volData.volunteers || []);
      setAlerts(alertData.alerts || []);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Socket.io real-time listeners ───────────────────────────
  useEffect(() => {
    const sock = io(SOCKET_URL);
    setSocket(sock);

    sock.on('new-incident', (incident) => {
      setIncidents(prev => [incident, ...prev]);
    });

    sock.on('new-alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 20));
    });

    sock.on('volunteer-assigned', ({ volunteer, zone }) => {
      setVolunteers(prev => prev.map(v => v.id === volunteer.id ? volunteer : v));
      setZones(prev => prev.map(z => z.id === zone.id ? zone : z));
    });

    sock.on('volunteer-updated', (volunteer) => {
      setVolunteers(prev => prev.map(v => v.id === volunteer.id ? volunteer : v));
    });

    sock.on('zone-updated', (zone) => {
      setZones(prev => prev.map(z => z.id === zone.id ? zone : z));
    });

    sock.on('system-reset', () => {
      fetchAll();
    });

    return () => sock.disconnect();
  }, [fetchAll]);

  // ── Actions ──────────────────────────────────────────────────
  const resetSystem = async () => {
    const res = await fetch(`${API}/reset`, { method: 'POST' });
    const data = await res.json();
    if (data.success) fetchAll();
    return data;
  };

  const reportIncident = async (formData) => {
    const res = await fetch(`${API}/report-incident`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return res.json();
  };

  const assignVolunteer = async (volunteerId, targetId, targetType, taskName) => {
    const res = await fetch(`${API}/assign-volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerId, targetId, targetType, taskName })
    });
    return res.json();
  };

  const markTaskComplete = async (volunteerId) => {
    const res = await fetch(`${API}/volunteers/${volunteerId}/complete`, {
      method: 'PATCH'
    });
    return res.json();
  };

  const registerVolunteer = async (volunteerData) => {
    const res = await fetch(`${API}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteerData)
    });
    return res.json();
  };

  return (
    <AppContext.Provider value={{
      incidents, zones, volunteers, alerts,
      reportIncident, assignVolunteer, markTaskComplete, resetSystem, fetchAll, registerVolunteer
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
