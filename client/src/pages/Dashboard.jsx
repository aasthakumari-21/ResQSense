import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Activity, Users, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ZONE_COLOR = { critical: '#EF4444', medium: '#F59E0B', safe: '#10B981' };

const floodAffectedShape = [
  [26.1980, 91.7300], [26.1900, 91.7380], [26.1850, 91.7500],
  [26.1800, 91.7650], [26.1700, 91.7500], [26.1750, 91.7350], [26.1850, 91.7200]
];

export default function Dashboard() {
  const { incidents, zones, alerts } = useApp();

  const getZoneColor = (status) => ZONE_COLOR[status] || '#3B82F6';

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
              <h3 className="text-3xl font-bold mt-2">{zones.length + incidents.length}</h3>
            </div>
            <AlertCircle className="w-8 h-8 text-danger opacity-80" />
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted text-sm font-semibold uppercase">Active Rescue Missions</p>
              <h3 className="text-3xl font-bold mt-2">{zones.filter(z => z.rescueStatus === 'help-on-way' || z.rescueStatus === 'rescue-in-progress').length}</h3>
            </div>
            <Users className="w-8 h-8 text-primary opacity-80" />
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-warning">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-textMuted text-sm font-semibold uppercase">Incidents Reported</p>
              <h3 className="text-3xl font-bold mt-2">{incidents.length}</h3>
            </div>
            <Truck className="w-8 h-8 text-warning opacity-80" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[500px] lg:h-[620px]">
        {/* Interactive Map */}
        <div className="lg:w-2/3 flex-grow min-h-[400px] lg:min-h-full glass-panel relative overflow-hidden">
          <div className="absolute top-4 left-4 z-[400] glass-card px-4 py-2 bg-surface/90 font-bold text-sm">
            🗺️ Live Risk Map — Guwahati Flood Zone
          </div>
          <MapContainer
            center={[26.1445, 91.7362]}
            zoom={12}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

            {/* Flood Affected Polygon */}
            <Polygon
              positions={floodAffectedShape}
              pathOptions={{ fillColor: '#3B82F6', color: '#1E3A8A', fillOpacity: 0.3, weight: 2 }}
            >
              <Popup><strong>Affected Floodplain</strong><br />Brahmaputra River overflow zone</Popup>
            </Polygon>

            {/* Zone circles from DB */}
            {zones.map((zone) => (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  pathOptions={{
                    color: getZoneColor(zone.status),
                    fillColor: getZoneColor(zone.status),
                    fillOpacity: 0.4,
                    className: zone.status === 'critical' ? 'animate-pulse' : ''
                  }}
                  radius={zone.status === 'critical' ? 2000 : 1500}
                >
                  <Popup>
                    <div className="p-1 text-slate-900 min-w-[200px]">
                      <h4 className="font-bold text-base mb-1" style={{ color: getZoneColor(zone.status) }}>
                        ● {zone.status?.toUpperCase()} ZONE
                      </h4>
                      <p className="text-sm mb-2">{zone.reason}</p>
                      <div className="text-xs font-semibold uppercase bg-slate-100 rounded px-2 py-1 inline-block mb-2">
                        Rescue Status: {zone.rescueStatus || 'unassigned'}
                      </div>
                      {zone.assignedVolunteerNames?.length > 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                          <p className="font-bold text-green-700 mb-1">✅ Volunteer Team Assigned:</p>
                          {zone.assignedVolunteerNames.map((n, i) => (
                            <p key={i} className="text-green-800">👤 {n}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Circle>
                {zone.status === 'critical' && <Marker position={[zone.lat, zone.lng]} />}
              </React.Fragment>
            ))}

            {/* User-reported Incidents — live red alerts */}
            {incidents.map((inc, i) => inc.location?.lat && (
              <React.Fragment key={`inc-${i}`}>
                <Circle
                  center={[inc.location.lat, inc.location.lng]}
                  pathOptions={{ fillColor: '#EF4444', color: '#B91C1C', fillOpacity: 0.65, className: 'animate-ping' }}
                  radius={600}
                >
                  <Popup>
                    <div className="p-1 text-slate-900 min-w-[220px]">
                      <h4 className="font-bold text-danger flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> USER-REPORTED ALERT
                      </h4>
                      <p className="font-semibold text-base mt-1">{inc.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{inc.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs uppercase font-bold bg-danger text-white rounded-full px-2 py-0.5">
                          {inc.urgency}
                        </span>
                        {inc.disasterType && (
                          <span className="text-xs uppercase font-bold bg-slate-700 text-white rounded-full px-2 py-0.5">
                            {inc.disasterType}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{new Date(inc.timestamp).toLocaleString()}</p>
                    </div>
                  </Popup>
                </Circle>
                <Marker position={[inc.location.lat, inc.location.lng]} />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="lg:w-1/3 h-full glass-panel flex flex-col min-h-[350px]">
          <div className="p-4 border-b border-slate-200/80 bg-surface">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger" />
              </span>
              Real-time Alerts
              <span className="ml-auto text-xs text-textMuted font-normal">{alerts.length} total</span>
            </h2>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={alert.id || idx}
                className={`p-3 rounded-lg border-l-4 animate-fade-in ${
                  alert.type === 'danger' ? 'bg-danger/10 border-danger' :
                  alert.type === 'warning' ? 'bg-warning/10 border-warning' :
                  'bg-primary/10 border-primary'
                }`}
              >
                <p className="text-sm leading-snug">{alert.message}</p>
                <p className="text-xs text-textMuted mt-1 text-right">
                  {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                </p>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-textMuted opacity-50 space-y-3">
                <Activity className="w-12 h-12" />
                <p>Waiting for incoming alerts...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
