import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, Polygon } from 'react-leaflet';
import { Radar, AlertOctagon, BrainCircuit } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function SilentZones() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // Silent Zones show a DISTINCT area from Dashboard
    // Dashboard = Guwahati river flood
    // Silent Zones = Himalayan landslide region near Shimla (HP)
    const mockSilentZones = [
      { id: "M-01", lat: 31.1150, lng: 77.1600, status: "critical", reason: "Major landslide detected, 100% signal loss", victims_prob: 94 },
      { id: "M-02", lat: 31.0900, lng: 77.1800, status: "medium", reason: "Mountain road collapse, limited connectivity", victims_prob: 62 }
    ];
    setZones(mockSilentZones);
  }, []);

  // Gray polygon = debris/landslide affected zone
  const mountainImpactShape = [
    [31.1250, 77.1450], [31.1200, 77.1550], [31.1150, 77.1700],
    [31.1100, 77.1800], [31.1000, 77.1700], [31.1050, 77.1550], [31.1150, 77.1400]
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-danger to-warning flex items-center gap-3">
          <Radar className="w-10 h-10 text-danger animate-pulse" />
          Silent Zone Detection
        </h1>
        <p className="text-textMuted mt-2 max-w-2xl text-lg">
          Our AI scans for "Invisible Victims" by identifying zones with high population density but zero digital activity — no network, no movement signals detected.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Detail Cards */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="glass-panel p-6 border-t-4 border-t-danger relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertOctagon className="text-danger" /> AI Analysis
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              <strong className="text-text">Anomaly Detected:</strong> Himalayan Northern ridge near Shimla shows a 100% drop in cellular signaling over the last 6 hours post-landslide. Prior demographic data indicates a dense local village.
            </p>
            <div className="bg-danger/20 border border-danger/30 rounded-md p-3">
              <p className="text-danger font-semibold text-center uppercase tracking-widest text-sm">
                Possible Trapped Victims
              </p>
              <p className="text-xs text-center text-danger/80 mt-1">Landslide collapse probability: Very High</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 text-text">Priority Targets</h3>
            <div className="space-y-3">
              {zones.map((zone, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surfaceLight/50 hover:bg-surfaceLight transition-colors cursor-pointer border-l-2" style={{borderLeftColor: zone.status === 'critical' ? '#EF4444' : '#F59E0B'}}>
                  <div>
                    <h4 className="font-semibold text-sm">Zone {zone.id}</h4>
                    <p className="text-xs text-textMuted">{zone.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-text bg-surface px-2 py-1 rounded">
                      {zone.victims_prob}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Map Heatmap — Himalayan Landslide Region */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col">
          <div className="glass-panel min-h-[450px] lg:h-[600px] w-full relative overflow-hidden p-1 flex-grow">
            {/* Scanner Animation overlay */}
            <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">
                <div className="w-full h-full border-t border-primary/30 animate-[scanner_4s_linear_infinite]" 
                     style={{
                       background: 'linear-gradient(to bottom, rgba(59,130,246,0) 0%, rgba(59,130,246,0.1) 100%)',
                     }}>
                </div>
            </div>
            
            <MapContainer 
              center={[31.1048, 77.1734]}
              zoom={13}
              className="w-full h-full rounded-xl"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              />

              {/* Landslide / Debris Zone - Gray polygon */}
              <Polygon 
                positions={mountainImpactShape} 
                pathOptions={{ fillColor: '#9CA3AF', color: '#4B5563', fillOpacity: 0.55, weight: 2, dashArray: '6 4' }} 
              />
              
              {/* Heatmap-like Circles */}
              {zones.map((zone, idx) => (
                <Circle 
                  key={idx}
                  center={[zone.lat, zone.lng]}
                  pathOptions={{ 
                    stroke: false,
                    fillColor: zone.status === 'critical' ? '#EF4444' : '#F59E0B',
                    fillOpacity: zone.status === 'critical' ? 0.6 : 0.3,
                    className: zone.status === 'critical' ? 'animate-pulse' : ''
                  }}
                  radius={zone.status === 'critical' ? 800 : 600}
                >
                  <Tooltip permanent direction="center" className="bg-transparent border-0 text-text font-bold drop-shadow-md text-lg">
                    {zone.victims_prob}%
                  </Tooltip>
                </Circle>
              ))}
              
              {/* Pulsing epicentre rings for the critical landslide zone */}
              <Circle center={[31.1150, 77.1600]} pathOptions={{ stroke: false, fillColor: '#EF4444', fillOpacity: 0.75, className: 'animate-pulse origin-center' }} radius={400} />
              <Circle center={[31.1150, 77.1600]} pathOptions={{ stroke: false, fillColor: '#ffffff', fillOpacity: 0.85, className: 'animate-ping origin-center' }} radius={120} />

              {/* Red Alert rings for medium zone */}
              <Circle center={[31.0900, 77.1800]} pathOptions={{ stroke: true, color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.35, className: 'animate-pulse' }} radius={500} />

            </MapContainer>
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes scanner {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
