import React, { useState } from 'react';
import { AlertTriangle, MapPin, Camera, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function IncidentReport() {
  const { reportIncident, volunteers } = useApp();
  const [formData, setFormData] = useState({
    title: '', description: '', urgency: 'medium', volunteerId: ''
  });
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoName, setPhotoName] = useState(null);

  const getLoc = () => {
    setLoadingLoc(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6)
          });
          setLoadingLoc(false);
        },
        () => {
          alert('Could not access location. Please grant permissions.');
          setLoadingLoc(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation not supported by your browser.');
      setLoadingLoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await reportIncident({ ...formData, location });
    setSubmitted(true);
    setFormData({ title: '', description: '', urgency: 'medium', volunteerId: '' });
    setLocation(null);
    setPhotoName(null);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const availableVolunteers = volunteers.filter(v => v.status === 'available');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text flex items-center gap-2">
        <AlertTriangle className="text-warning" /> Report an Incident
      </h1>

      {submitted && (
        <div className="mb-6 p-5 bg-success/20 border-2 border-success rounded-xl text-success flex items-start gap-3 animate-fade-in">
          <CheckCircle className="w-6 h-6 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-lg">Alert Broadcast Successfully!</p>
            <p className="text-sm opacity-80 mt-1">
              Your report is now live on the <strong>Dashboard Map</strong> and <strong>Alerts Panel</strong> — rescue teams are being notified.
            </p>
          </div>
        </div>
      )}

      <div className="glass-panel p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title Area */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Emergency Title *</label>
            <input
              required type="text"
              placeholder="e.g. Building collapse at Sector 7, Major fire"
              className="w-full bg-surface border border-slate-200 rounded-lg px-4 py-3 text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* New Row: Urgency + Volunteer Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Urgency Level</label>
              <select
                className="w-full bg-surface border border-slate-200 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                value={formData.urgency}
                onChange={e => setFormData({ ...formData, urgency: e.target.value })}
              >
                <option value="low">🟢 Low — Non-life threatening</option>
                <option value="medium">🟡 Medium — Requires attention</option>
                <option value="critical">🔴 Critical — Immediate danger</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Direct Deployment (Optional)</label>
              <select
                className="w-full bg-surface border border-slate-200 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                value={formData.volunteerId}
                onChange={e => setFormData({ ...formData, volunteerId: e.target.value })}
              >
                <option value="">-- Let System Assign --</option>
                {availableVolunteers.map(v => (
                   <option key={v.id} value={v.id}>{v.name} ({v.skills?.[0]})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Area */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`flex-grow flex items-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                location
                  ? 'bg-success/10 border-success/50 text-success'
                  : 'bg-surface border-slate-200 text-slate-500'
              }`}>
                <MapPin className="w-5 h-5 mr-2 shrink-0" />
                {location
                  ? `📍 Lat: ${location.lat},  Lng: ${location.lng}`
                  : 'No location captured yet'}
              </div>
              <button
                type="button"
                onClick={getLoc}
                className="px-5 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary font-semibold text-sm transition-colors"
              >
                {loadingLoc ? '⏳ Detecting...' : '📡 Auto-Locate Me'}
              </button>
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Photo Evidence (Optional)</label>
            <label className={`w-full border-2 border-dashed rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer ${
              photoName
                ? 'border-success/50 bg-success/10 text-success'
                : 'border-slate-300 text-slate-500 hover:border-primary hover:text-primary'
            }`}>
              <Camera className="w-5 h-5" />
              {photoName ? `✅ ${photoName}` : 'Capture / Upload Photo'}
              <input
                type="file" accept="image/*" capture="environment" className="hidden"
                onChange={e => setPhotoName(e.target.files[0]?.name || null)}
              />
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Situation Details *</label>
            <textarea
              rows="5" required
              placeholder="Describe the emergency... Are there people trapped? Any hazards?"
              className="w-full bg-surface border border-slate-200 rounded-lg px-4 py-3 text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-danger to-warning hover:from-red-600 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            <Send className="w-5 h-5" /> Broadcast Alert to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
