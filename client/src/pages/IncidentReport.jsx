import React, { useState } from 'react';
import { AlertTriangle, MapPin, Camera, Send } from 'lucide-react';

export default function IncidentReport() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: 'medium'
  });
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getLoc = () => {
    setLoadingLoc(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ 
            lat: position.coords.latitude.toFixed(6), 
            lng: position.coords.longitude.toFixed(6) 
          });
          setLoadingLoc(false);
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Could not access live location. Please ensure location permissions are granted.');
          setLoadingLoc(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLoadingLoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/report-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, location})
      });
      setSubmitted(true);
      setFormData({ title: '', description: '', urgency: 'medium' });
      setLocation(null);
      setTimeout(() => setSubmitted(false), 3000);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-text flex items-center gap-2">
        <AlertTriangle className="text-warning" /> Report an Incident
      </h1>

      {submitted && (
        <div className="mb-6 p-4 bg-success/20 border border-success/50 rounded-lg text-success font-semibold flex items-center gap-2">
          Incident reported successfully. Help is being notified.
        </div>
      )}

      <div className="glass-panel p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Type / Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Building collapse, Flood, Fire"
              className="w-full bg-surface border-slate-200 border border-slate-200/80 rounded-lg px-4 py-3 text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow flex items-center px-4 py-3 bg-surface border-slate-200 border border-slate-200/80 rounded-lg text-slate-600">
                <MapPin className="w-5 h-5 mr-2 text-textMuted" />
                {location ? `Lat: ${location.lat}, Lng: ${location.lng}` : 'No location specified'}
              </div>
              <button 
                type="button" 
                onClick={getLoc}
                className="px-6 py-3 bg-surfaceLight hover:bg-surface border border-slate-200/80 rounded-lg text-text font-medium transition-colors"
              >
                {loadingLoc ? 'Detecting...' : 'Auto-Locate'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Urgency Level</label>
              <select 
                className="w-full bg-surface border-slate-200 border border-slate-200/80 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={formData.urgency}
                onChange={e => setFormData({...formData, urgency: e.target.value})}
              >
                <option value="low">Low (Non-life threatening)</option>
                <option value="medium">Medium (Requires attention)</option>
                <option value="critical">Critical (Immediate danger)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Image Setup (Optional)</label>
              <label className="w-full border border-dashed border-slate-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-textMuted hover:text-text hover:border-slate-200/500 transition-colors cursor-pointer">
                <Camera className="w-5 h-5" /> Capture / Upload Photo
                <input type="file" accept="image/*" capture="environment" className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Details</label>
            <textarea 
              rows="4" 
              required
              placeholder="Describe the situation... Are there people trapped?"
              className="w-full bg-surface border-slate-200 border border-slate-200/80 rounded-lg px-4 py-3 text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-danger to-warning hover:from-red-600 hover:to-orange-600 text-text font-bold rounded-lg overflow-hidden shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" /> Broadcast Alert
          </button>
        </form>
      </div>
    </div>
  );
}
