import React, { useState } from 'react';
import { Truck, Navigation, CheckCircle, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ResourceAllocation() {
  const [resources, setResources] = useState([
    { id: 101, type: "Medical Team Alpha", status: "idle", location: "Base 1" },
    { id: 102, type: "Rescue Boat B", status: "en-route", location: "Zone 2" },
    { id: 103, type: "Ambulance Unit", status: "idle", location: "Base 1" },
  ]);

  const [aiSuggestion, setAiSuggestion] = useState(true);
  const [activeRoute, setActiveRoute] = useState(false);

  // Approximate coordinates for demonstration (Guwahati)
  const baseCoords = [26.1433, 91.7898]; // Dispur Base
  const targetCoords = [26.1850, 91.7450]; // Uzan Bazaar Bank
  const routePoints = [
    baseCoords,
    [26.1550, 91.7700], // Midpoint 1
    [26.1700, 91.7580], // Midpoint 2
    targetCoords        // Target
  ];

  const handleDispatch = (id) => {
    setResources(resources.map(r => r.id === id ? { ...r, status: "en-route", location: "Brahmaputra Bank" } : r));
    setAiSuggestion(false);
    setActiveRoute(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text flex items-center gap-2">
        <Truck className="text-primary" /> Resource Allocation
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AI Suggestion Panel */}
        {aiSuggestion && (
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-primary/50 rounded-xl p-6 relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Navigation className="text-primary w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-text mb-2">AI Dispatch Suggestion</h3>
                  <p className="text-textMuted mb-4">
                    Critical Silent Zone detected at <span className="text-text font-semibold">Brahmaputra Riverbank</span>. High probability of trapped victims.
                    Suggested action: <span className="text-warning font-semibold">Dispatch 1 Rescue Boat immediately.</span>
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleDispatch(101)}
                      className="px-6 py-2 bg-primary hover:bg-blue-600 text-text rounded-md font-medium transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve & Dispatch
                    </button>
                    <button 
                      onClick={() => setAiSuggestion(false)}
                      className="px-6 py-2 bg-surfaceLight hover:bg-surface text-text rounded-md font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources List */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-slate-200/80 pb-2">Available Resources</h2>
          <div className="space-y-4">
            {resources.map(res => (
              <div key={res.id} className="flex items-center justify-between p-4 bg-surface border-slate-200 rounded-lg border border-slate-200/50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${res.status === 'idle' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">{res.type}</h4>
                    <p className="text-xs text-textMuted text-uppercase">ID: {res.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${res.status === 'idle' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                    {res.status}
                  </span>
                  <p className="text-xs text-textMuted mt-1">{res.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Optimization Preview */}
        <div className="glass-panel p-6 overflow-hidden relative flex flex-col">
          <h2 className="text-xl font-bold mb-6 border-b border-slate-200/80 pb-2 flex items-center gap-2">
            <Navigation className="w-5 h-5" /> Live Route Tracking
          </h2>
          
          <div className="w-full h-[300px] flex-grow bg-surfaceLight/50 rounded-lg relative overflow-hidden border border-slate-300">
            {activeRoute ? (
              <MapContainer center={[26.1645, 91.7650]} zoom={13} className="w-full h-full" zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Marker position={baseCoords} />
                <Marker position={targetCoords} />
                <Polyline positions={routePoints} color="#3B82F6" weight={5} opacity={0.7} />
              </MapContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center flex-col text-slate-500 bg-slate-100">
                <AlertTriangle className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">Awaiting dispatch to initialize live tracking.</p>
              </div>
            )}
          </div>
          
          {activeRoute && (
            <div className="mt-6 space-y-2 animate-fade-in">
               <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Estimated Route ETA (Riverbank):</span>
                  <span className="text-text font-bold text-primary">14 mins left</span>
               </div>
               <div className="w-full bg-surfaceLight rounded-full h-2 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                  <div className="bg-primary h-2 rounded-full relative z-10 transition-all duration-1000" style={{ width: '30%' }}></div>
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
