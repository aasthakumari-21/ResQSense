import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Activity, Users, Truck, AlertCircle } from 'lucide-react';

// Fix for leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Dashboard() {
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    // Fetch mock data from our local Express server
    const fetchData = async () => {
      try {
        const zonesRes = await fetch('http://localhost:5000/api/get-zones');
        const zonesData = await zonesRes.json();
        setZones(zonesData.zones);

        const alertsRes = await fetch('http://localhost:5000/api/alerts');
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts);

        const incRes = await fetch('http://localhost:5000/api/incidents');
        const incData = await incRes.json();
        setIncidents(incData.incidents);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
    
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getZoneColor = (status) => {
    switch(status) {
      case 'critical': return '#EF4444'; // danger
      case 'medium': return '#F59E0B'; // warning
      case 'safe': return '#10B981'; // success
      default: return '#3B82F6';
    }
  };

  // Advanced Flood Affected Polygon overlay for realism
  const floodAffectedShape = [
    [26.1980, 91.7300], [26.1900, 91.7380], [26.1850, 91.7500],
    [26.1800, 91.7650], [26.1700, 91.7500], [26.1750, 91.7350], [26.1850, 91.7200]
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-text flex items-center gap-2">
        <Activity className="text-primary animate-pulse" /> Live Disaster Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-l-4 border-l-danger">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted text-sm font-semibold uppercase">Total Affected Areas</p>
              <h3 className="text-3xl font-bold mt-2">{zones.length > 0 ? zones.length + 12 : 15}</h3>
            </div>
            <AlertCircle className="w-8 h-8 text-danger opacity-80" />
          </div>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted text-sm font-semibold uppercase">Active Rescue Missions</p>
              <h3 className="text-3xl font-bold mt-2">8</h3>
            </div>
            <Users className="w-8 h-8 text-primary opacity-80" />
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-warning">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted text-sm font-semibold uppercase">Resources Deployed</p>
              <h3 className="text-3xl font-bold mt-2">42</h3>
            </div>
            <Truck className="w-8 h-8 text-warning opacity-80" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[500px] lg:h-[600px]">
        {/* Interactive Map */}
        <div className="lg:w-2/3 flex-grow min-h-[400px] lg:min-h-full glass-panel relative overflow-hidden">
          <div className="absolute top-4 left-4 z-[400] glass-card px-4 py-2 bg-surface/90 font-bold">
            Live Risk Map
          </div>
          <MapContainer 
            center={[26.1445, 91.7362]} // Guwahati
            zoom={12} 
            className="w-full h-full"
            zoomControl={false}
          >
            {/* Dark themed map tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            
            {/* Flooded Region Impact Overlay */}
            <Polygon 
              positions={floodAffectedShape} 
              pathOptions={{ fillColor: '#3B82F6', color: '#1E3A8A', fillOpacity: 0.35, weight: 2 }} 
            >
              <Popup>Affected Floodplain</Popup>
            </Polygon>

            {zones.map((zone) => (
              <React.Fragment key={zone.id}>
                <Circle 
                  center={[zone.lat, zone.lng]}
                  pathOptions={{ 
                    color: getZoneColor(zone.status), 
                    fillColor: getZoneColor(zone.status),
                    fillOpacity: 0.4,
                    className: zone.status === 'critical' ? 'animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]' : ''
                  }}
                  radius={zone.status === 'critical' ? 2000 : 1500}
                >
                  <Popup className="custom-popup">
                    <div className="text-slate-900 p-1">
                      <h4 className="font-bold text-lg mb-1">Zone {zone.id}</h4>
                      <p className="text-sm"><span className="font-semibold">Status:</span> <span className="uppercase" style={{color: getZoneColor(zone.status)}}>{zone.status}</span></p>
                      <p className="text-sm mt-1">{zone.reason}</p>
                    </div>
                  </Popup>
                </Circle>
                {zone.status === 'critical' && (
                  <Marker position={[zone.lat, zone.lng]} />
                )}
              </React.Fragment>
            ))}

            {/* Render User Reported Incidents as Red Alerts */}
            {incidents.map((inc, i) => inc.location && inc.location.lat && (
              <React.Fragment key={`inc-${i}`}>
                <Circle 
                  center={[inc.location.lat, inc.location.lng]}
                  pathOptions={{ fillColor: '#EF4444', color: '#B91C1C', fillOpacity: 0.6, className: 'animate-ping origin-center drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' }}
                  radius={600}
                >
                  <Popup className="custom-popup">
                    <div className="text-slate-900 p-1">
                      <h4 className="font-bold text-danger flex items-center gap-1"><AlertCircle className="w-4 h-4"/> USER-REPORTED ALERT</h4>
                      <p className="font-semibold text-lg">{inc.title}</p>
                      <p className="text-sm mt-1">{inc.description}</p>
                      <div className="text-xs uppercase font-bold mt-2 bg-danger text-white rounded-full px-2 py-1 inline-block">Urgency: {inc.urgency}</div>
                    </div>
                  </Popup>
                </Circle>
                <Marker position={[inc.location.lat, inc.location.lng]} />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="lg:w-1/3 h-full glass-panel flex flex-col">
          <div className="p-4 border-b border-slate-200/80 bg-surface border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
              </span>
              Real-time Alerts
            </h2>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {alerts.length > 0 ? alerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg border-l-4 animate-fade-in ${
                  alert.type === 'danger' ? 'bg-danger/10 border-danger' : 
                  alert.type === 'warning' ? 'bg-warning/10 border-warning' : 
                  'bg-primary/10 border-primary'
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-textMuted mt-2 text-right">Just now</p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-textMuted opacity-50 space-y-4">
                <Activity className="w-12 h-12" />
                <p>Waiting for incoming alerts...</p>
              </div>
            )}
            
            {/* Fake historical alerts for UI fullness */}
            <div className="p-4 rounded-lg border-l-4 bg-warning/10 border-warning opacity-70">
              <p className="text-sm">WARNING: Water levels rising in Zone 2.</p>
              <p className="text-xs text-textMuted mt-2 text-right">12 mins ago</p>
            </div>
            <div className="p-4 rounded-lg border-l-4 bg-surfaceLight border-surface opacity-70">
              <p className="text-sm">INFO: Resource Alpha deployed to Safe Zone.</p>
              <p className="text-xs text-textMuted mt-2 text-right">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
