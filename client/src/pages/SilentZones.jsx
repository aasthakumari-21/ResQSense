import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, Polygon } from 'react-leaflet';
import { Radar, AlertOctagon, BrainCircuit, Users, CheckCircle, ClipboardList, Send, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';

export default function SilentZones() {
  const { zones, volunteers, incidents, assignVolunteer } = useApp();
  const [assigning, setAssigning] = useState({}); // taskId -> volunteerId selected
  const [loading, setLoading] = useState({});
  const [success, setSuccess] = useState({});

  // 1. Unified Tasks: Combine AI Zones and User-reported Incidents (excluding resolved ones)
  const aiTasks = zones
    .filter(z => z.status !== 'safe' && z.rescueStatus !== 'completed')
    .map(z => ({ 
      id: z.id || z._id, 
      type: 'zone',
      title: 'Silent Zone Detected',
      desc: z.reason,
      urgency: z.status,
      prob: z.victims_prob,
      rescueStatus: z.rescueStatus || 'unassigned',
      volunteers: z.assignedVolunteerNames || []
    }));

  const userTasks = incidents
    .filter(i => i.status !== 'resolved' && i.rescueStatus !== 'completed')
    .map(i => ({
      id: i.id || i._id,
      type: 'incident',
      title: `Citizen Report: ${i.title}`,
      desc: i.description,
      urgency: i.urgency,
      prob: 100, // User reports are 100% verified sightings theoretically
      rescueStatus: i.rescueStatus || 'unassigned',
      volunteers: i.assignedVolunteerNames || []
    }));

  const allActiveTasks = [...aiTasks, ...userTasks];

  const availableVolunteers = volunteers.filter(v => v.status === 'available');

  const mountainImpactShape = [
    [31.1250, 77.1450], [31.1200, 77.1550], [31.1150, 77.1700],
    [31.1100, 77.1800], [31.1000, 77.1700], [31.1050, 77.1550], [31.1150, 77.1400]
  ];

  const handleAssign = async (task) => {
    const volId = assigning[task.id];
    if (!volId) return alert('Please select a volunteer first');
    
    setLoading(l => ({ ...l, [task.id]: true }));
    const taskName = `${task.type === 'zone' ? 'System Zone' : 'Citizen Alert'}: ${task.desc}`;
    
    await assignVolunteer(volId, task.id, task.type, taskName);
    
    setLoading(l => ({ ...l, [task.id]: false }));
    setSuccess(s => ({ ...s, [task.id]: true }));
    setAssigning(a => ({ ...a, [task.id]: '' }));
    setTimeout(() => setSuccess(s => ({ ...s, [task.id]: false })), 3000);
  };

  const getRescueLabel = (status) => {
    const map = {
      'unassigned': { text: 'Unassigned', cls: 'bg-slate-100 text-slate-600' },
      'help-on-way': { text: '🚑 Deployment Started', cls: 'bg-blue-100 text-blue-700' },
      'rescue-in-progress': { text: '🟢 On Site', cls: 'bg-green-100 text-green-700' },
      'completed': { text: '✅ Resolved', cls: 'bg-emerald-100 text-emerald-700' },
    };
    return map[status] || map['unassigned'];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-danger to-warning flex items-center gap-3">
            <Radar className="w-10 h-10 text-danger animate-pulse" />
            Task Assignment Center
          </h1>
          <p className="text-textMuted mt-2 max-w-2xl text-lg">
            Register for tasks and deploy volunteers to AI-detected Silent Zones or Citizen Emergency Reports.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-3">
           <Users className="text-primary w-5 h-5" />
           <div>
             <div className="text-xs font-bold text-primary uppercase">Available Force</div>
             <div className="text-xl font-bold text-text">{availableVolunteers.length} Personnel</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Pending Task List */}
        <div className="lg:col-span-1 space-y-6 flex flex-col h-[700px]">
          <div className="glass-panel p-6 flex flex-col flex-grow overflow-hidden">
            <h3 className="font-bold mb-4 text-text flex items-center gap-2 sticky top-0 bg-surface z-10 pb-2 border-b border-slate-100">
              <ClipboardList className="w-5 h-5 text-primary" /> Pending Registration Tasks
            </h3>
            
            <div className="overflow-y-auto pr-2 space-y-4 flex-grow scrollbar-thin">
              {allActiveTasks.map((task) => {
                const label = getRescueLabel(task.rescueStatus);
                const isCritical = task.urgency === 'critical';
                
                return (
                  <div key={task.id} className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${
                    task.type === 'zone' ? 'bg-slate-50' : 'bg-orange-50/30 border-orange-200'
                  }`}
                    style={{ borderLeftColor: isCritical ? '#EF4444' : '#F59E0B' }}>
                    
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {task.type === 'incident' ? <AlertTriangle className="w-4 h-4 text-warning" /> : <Radar className="w-4 h-4 text-primary" />}
                        <h4 className="font-bold text-sm text-slate-800">{task.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-white/80 border px-1.5 py-0.5 rounded shadow-sm">
                        {task.prob}% Priority
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-3 italic">"{task.desc}"</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight ${label.cls}`}>
                        {label.text}
                      </span>
                      {task.volunteers.length > 0 && (
                        <span className="text-[10px] text-slate-500 font-medium">👤 {task.volunteers.join(', ')}</span>
                      )}
                    </div>

                    {task.rescueStatus === 'unassigned' && (
                      <div className="flex gap-2 animate-fade-in">
                        <select
                          value={assigning[task.id] || ''}
                          onChange={e => setAssigning(a => ({ ...a, [task.id]: e.target.value }))}
                          className="flex-grow text-xs p-2 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-primary outline-none"
                        >
                          <option value="">Choose Personnel...</option>
                          {availableVolunteers.map(v => (
                            <option key={v.id} value={v.id}>{v.name} — {v.skills?.[0]}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(task)}
                          disabled={loading[task.id] || availableVolunteers.length === 0}
                          className="bg-primary hover:bg-blue-700 text-white p-2 rounded-lg transition-transform active:scale-95 disabled:opacity-30"
                        >
                          {loading[task.id] ? '...' : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {success[task.id] && (
                      <div className="flex items-center gap-1 text-success text-[10px] font-bold mt-2 animate-bounce">
                        <CheckCircle className="w-3 h-3" /> Registration Successful
                      </div>
                    )}
                  </div>
                );
              })}

              {allActiveTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-60">
                   <CheckCircle className="w-12 h-12 mb-2" />
                   <p className="text-sm italic">All tasks registered and resolved.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Map & AI Context */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel min-h-[450px] lg:h-[700px] w-full relative overflow-hidden p-1 flex-grow">
            <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">
               <div className="w-full h-full border-t border-primary/20 animate-[scanner_8s_linear_infinite]"
                 style={{ background: 'linear-gradient(to bottom, rgba(59,130,246,0) 0%, rgba(59,130,246,0.05) 100%)' }}>
               </div>
            </div>

            <MapContainer center={[31.1048, 77.1734]} zoom={13} className="w-full h-full rounded-xl">
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

              <Polygon
                positions={mountainImpactShape}
                pathOptions={{ fillColor: '#9CA3AF', color: '#4B5563', fillOpacity: 0.3, weight: 2, dashArray: '6 4' }}
              />

              {/* Only show AI Zones on mountain map for realism */}
              {[
                { id: 'M-01', lat: 31.1150, lng: 77.1600, status: 'critical', reason: 'Signal Blackout — Sector A' },
                { id: 'M-02', lat: 31.0900, lng: 77.1800, status: 'medium', reason: 'Signal Fluctuating — Sector B' }
              ].map((zone, idx) => (
                <Circle key={idx} center={[zone.lat, zone.lng]}
                  pathOptions={{
                    stroke: false,
                    fillColor: zone.status === 'critical' ? '#EF4444' : '#F59E0B',
                    fillOpacity: 0.4,
                    className: zone.status === 'critical' ? 'animate-pulse' : ''
                  }}
                  radius={700}
                >
                  <Tooltip permanent direction="center" className="bg-transparent border-0 text-text font-bold drop-shadow-md text-xs">
                    AI TARGET {zone.id}
                  </Tooltip>
                </Circle>
              ))}
            </MapContainer>
            
            <div className="absolute bottom-4 right-4 z-[400] glass-card p-4 max-w-xs border-l-4 border-l-primary">
               <div className="flex items-center gap-2 mb-2 text-primary">
                 <BrainCircuit className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-tight">AI Neural Signal Log</span>
               </div>
               <p className="text-[10px] text-slate-600 leading-tight">
                 Anomaly detected: 94% deviation in standard device heartbeat logs in Northern Sector. 0 packets received from 124 known MAC addresses. 
               </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanner { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
