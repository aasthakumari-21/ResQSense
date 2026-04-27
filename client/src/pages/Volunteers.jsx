import React, { useState } from 'react';
import { Users, UserPlus, MapPin, Star, CheckCircle, Clock, X, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STATUS_CONFIG = {
  idle:        { label: 'Available',    cls: 'bg-success/20 text-success' },
  'in-progress': { label: 'In Progress',  cls: 'bg-warning/20 text-warning' },
  pending:     { label: 'Pending',      cls: 'bg-primary/20 text-primary' },
  completed:   { label: 'Completed',    cls: 'bg-slate-100 text-slate-500' },
};

export default function Volunteers() {
  const { volunteers, markTaskComplete, registerVolunteer } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [completing, setCompleting] = useState({});

  // All volunteers come from global context now
  const allVolunteers = volunteers;

  const handleComplete = async (vol) => {
    setCompleting(c => ({ ...c, [vol.id]: true }));
    await markTaskComplete(vol.id);
    setCompleting(c => ({ ...c, [vol.id]: false }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const volData = {
      name: e.target.fullName.value,
      location: 'Local Volunteer Force',
      skills: [e.target.primarySkill.value]
    };
    await registerVolunteer(volData);
    setShowForm(false);
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-text flex items-center gap-2">
          <Users className="text-success" /> Volunteer Network
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-success hover:bg-green-600 text-white rounded-md font-medium transition-colors flex items-center gap-2 shadow-md"
        >
          <UserPlus className="w-5 h-5" /> Register as Volunteer
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="mb-8 p-6 glass-panel border-2 border-success bg-white/95">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-text">New Volunteer Registration</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-danger">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required name="fullName" type="text" placeholder="Full Name"
              className="p-3 bg-surface border border-slate-300 rounded-lg focus:border-primary focus:outline-none" />
            <select required name="primarySkill"
              className="p-3 bg-surface border border-slate-300 rounded-lg focus:border-primary focus:outline-none">
              <option value="">Select Primary Skill...</option>
              <option value="First Aid">First Aid</option>
              <option value="Boat Piloting">Boat Piloting</option>
              <option value="Rope Rescue">Rope Rescue</option>
              <option value="Medical">Medical</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
            </select>
            <button type="submit"
              className="bg-primary hover:bg-blue-700 font-bold text-white p-3 rounded-lg transition-colors">
              Join the Mission
            </button>
          </form>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Available', count: allVolunteers.filter(v => v.status === 'available').length, color: 'text-success' },
          { label: 'On Mission', count: allVolunteers.filter(v => v.status === 'on-mission').length, color: 'text-warning' },
          { label: 'Completed', count: allVolunteers.filter(v => v.taskStatus === 'completed').length, color: 'text-primary' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-textMuted mt-1 uppercase font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Volunteer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allVolunteers.map(vol => {
          const statusCfg = STATUS_CONFIG[vol.taskStatus] || STATUS_CONFIG.idle;
          const isOnMission = vol.status === 'on-mission';
          return (
            <div key={vol.id} className={`glass-card p-6 flex flex-col ${isOnMission ? 'ring-2 ring-warning/50' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xl text-primary border border-slate-200">
                    {vol.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text">{vol.name}</h3>
                    <p className="text-xs text-textMuted flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {vol.location}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${statusCfg.cls}`}>
                  {statusCfg.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {vol.skills?.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Assigned Task Block */}
              {isOnMission && vol.task && (
                <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg text-xs">
                  <p className="font-bold text-warning mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Active Assignment
                  </p>
                  <p className="text-slate-700">{vol.task}</p>
                  {vol.assignedZoneName && (
                    <p className="text-slate-500 mt-1">📍 {vol.assignedZoneName}</p>
                  )}
                </div>
              )}

              {vol.taskStatus === 'completed' && (
                <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg text-xs flex items-center gap-2 text-success font-semibold">
                  <CheckCircle className="w-4 h-4" /> Task completed successfully!
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center">
                <div className="flex text-warning">
                  {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <Star className="w-4 h-4 text-slate-200" />
                </div>

                {isOnMission ? (
                  <button
                    onClick={() => handleComplete(vol)}
                    disabled={completing[vol.id]}
                    className="text-sm px-4 py-1.5 rounded-md bg-success hover:bg-green-700 text-white font-semibold transition-colors flex items-center gap-1"
                  >
                    {completing[vol.id]
                      ? <><Loader className="w-3 h-3 animate-spin" /> Saving...</>
                      : <><CheckCircle className="w-3 h-3" /> Mark Complete</>
                    }
                  </button>
                ) : (
                  <span className={`text-sm px-4 py-1.5 rounded-md font-medium ${vol.status === 'available'
                    ? 'bg-success/20 text-success'
                    : 'bg-slate-100 text-slate-400'}`}
                  >
                    {vol.status === 'available' ? '✔ Ready to Deploy' : 'Completed'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
