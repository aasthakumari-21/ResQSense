import React, { useState, useEffect } from 'react';
import { Truck, Navigation, CheckCircle, AlertTriangle, MapPin, Gauge } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';

export default function ResourceAllocation() {
  const { volunteers, zones } = useApp();
  const [activeMissions, setActiveMissions] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  // Sync active missions from volunteers on mission
  useEffect(() => {
    const missions = volunteers
      .filter(v => v.status === 'on-mission')
      .map(v => ({
        id: v.id,
        name: v.name,
        task: v.task,
        target: v.assignedZoneName,
        skill: v.skills?.[0] || 'Rescue'
      }));
    setActiveMissions(missions);
  }, [volunteers]);

  // Demo coords for Guwahati base and a few targets
  const baseCoords = [26.1433, 91.7898]; 
  const targetCoords = [26.1850, 91.7450];
  const routePoints = [baseCoords, [26.1550, 91.7700], [26.1700, 91.7580], targetCoords];

  const criticalZone = zones.find(z => z.status === 'critical' && z.rescueStatus === 'unassigned');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text flex items-center gap-2">
          <Truck className="text-primary" /> Logistics & Resource Control
        </h1>
        <p className="text-textMuted mt-1">Real-time tracking of personnel and assets in the field.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Status Stats & Suggestions */}
        <div className="space-y-6">
          {/* AI Optimizer Card */}
          {criticalZone && (
            <div className="glass-panel p-6 border-l-4 border-l-warning bg-gradient-to-br from-warning/10 to-transparent">
              <div className="flex items-start gap-4">
                <Gauge className="text-warning w-6 h-6 shrink-0 animate-pulse" />
                <div>
                  <h3 className="font-bold text-text mb-1">AI Optimization Suggestion</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Unassigned Critical Zone found at <span className="font-bold text-slate-800">{criticalZone.reason}</span>. 
                    Immediate deployment of specialized team recommended.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/silent-zones'}
                    className="text-xs px-4 py-2 bg-warning/20 hover:bg-warning/30 text-warning font-bold rounded-lg transition-all border border-warning/30"
                  >
                    Go to Assignment Panel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Asset List */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
              Active Missions
              <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-1 rounded-full">
                {activeMissions.length} deployed
              </span>
            </h2>
            <div className="space-y-3">
              {activeMissions.map(m => (
                <div key={m.id} className="p-3 rounded-lg bg-surface border border-slate-200/50 hover:border-primary/30 transition-all cursor-pointer" onClick={() => setSelectedZone(m)}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-800">{m.name}</span>
                    <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">En-Route</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">📍 {m.target}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-grow h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-[progress_3s_infinite]" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">ETA 8m</span>
                  </div>
                </div>
              ))}
              {activeMissions.length === 0 && (
                <div className="text-center py-8 text-slate-400 italic text-sm">
                  No active field deployments found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Strategic Map Tracking */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel overflow-hidden h-[500px] lg:h-[650px] relative flex flex-col">
            <div className="absolute top-4 left-4 z-[400] glass-card px-4 py-2 text-sm font-bold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary animate-pulse" /> Live Deployment Stream
            </div>
            
            <MapContainer center={[26.1645, 91.7650]} zoom={13} className="w-full h-full" zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              
              <Marker position={baseCoords}>
                <Popup><strong>HQ Command Center</strong><br />Dispur Base</Popup>
              </Marker>

              {activeMissions.length > 0 && (
                <>
                  <Marker position={targetCoords}>
                    <Popup><strong>Mission Target</strong><br />Brahmaputra Bank</Popup>
                  </Marker>
                  <Polyline positions={routePoints} color="#3B82F6" weight={4} opacity={0.6} dashArray="10, 10" className="animate-[dash_20s_linear_infinite]" />
                </>
              )}

              {/* Show all zones for context */}
              {zones.map(z => (
                <Marker key={z.id} position={[z.lat, z.lng]} opacity={0.4}>
                  <Popup>{z.reason}</Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="absolute bottom-6 left-6 right-6 z-[400]">
              <div className="glass-panel p-4 bg-white/90 shadow-2xl border-t-2 border-primary">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-800 text-sm">Mission Connectivity Status</h4>
                  <span className="flex items-center gap-1 text-xs text-success font-bold">
                    <span className="w-2 h-2 rounded-full bg-success"></span> Satellite Uplink Stable
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{activeMissions.length}</div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Personnel</div>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <div className="text-lg font-bold text-warning">14</div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Vehicles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-danger">2</div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Drones</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
