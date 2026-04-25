import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MapPin, Star, X } from 'lucide-react';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/volunteers')
      .then(res => res.json())
      .then(data => setVolunteers(data.volunteers))
      .catch(err => console.error(err));
  }, []);

  const handleAssign = (volId, name) => {
    setVolunteers(volunteers.map(v => v.id === volId ? { ...v, status: 'on-mission' } : v));
    alert(`Priority task successfully assigned to ${name}!`);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newVol = {
       id: Date.now(),
       name: e.target.fullName.value,
       location: "Nearby Area",
       skills: [e.target.primarySkill.value],
       status: 'available'
    };
    setVolunteers([newVol, ...volunteers]);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-text flex items-center gap-2">
          <Users className="text-success" /> Volunteer Network
        </h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="px-6 py-2 bg-success hover:bg-green-600 text-white rounded-md font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <UserPlus className="w-5 h-5" /> Register as Volunteer
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 glass-panel border border-success border-2 bg-white/95">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold text-text">New Volunteer Registration</h3>
             <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-danger">
               <X className="w-6 h-6" />
             </button>
          </div>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required name="fullName" type="text" placeholder="Full Name" className="p-3 bg-surface border border-slate-300 rounded focus:border-primary focus:outline-none" />
            <select required name="primarySkill" className="p-3 bg-surface border border-slate-300 rounded focus:border-primary focus:outline-none">
              <option value="">Select Primary Skill...</option>
              <option value="First Aid">First Aid</option>
              <option value="Debris Removal">Debris Removal</option>
              <option value="Transportation">Transportation / Driving</option>
              <option value="Rope Rescue">Rope Rescue</option>
            </select>
            <button type="submit" className="bg-primary hover:bg-blue-600 font-bold text-white p-3 rounded">Start Saving Lives</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map(vol => (
          <div key={vol.id} className={`glass-card p-6 flex flex-col ${vol.status === 'on-mission' ? 'opacity-80' : ''}`}>
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
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${vol.status === 'available' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                {vol.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {vol.skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-blue-700">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center">
              <div className="flex text-warning">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 text-slate-200" />
              </div>
              <button 
                onClick={() => handleAssign(vol.id, vol.name)} 
                disabled={vol.status !== 'available'} 
                className={`text-sm px-4 py-1.5 rounded-md transition-colors ${vol.status === 'available' ? 'bg-primary hover:bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {vol.status === 'available' ? 'Assign Task' : 'On Mission'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
