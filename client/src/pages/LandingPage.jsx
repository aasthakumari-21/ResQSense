import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, ShieldAlert, Radar, Truck, Users,
  AlertTriangle, ArrowRight, Zap, Globe, Eye,
  ChevronDown, Navigation, Bell
} from 'lucide-react';

const features = [
  {
    icon: <Radar className="w-8 h-8" />,
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-100',
    title: 'Silent Zone Detection',
    desc: 'AI identifies areas with zero digital activity in high-density zones — locating invisible victims no one else can find.'
  },
  {
    icon: <Activity className="w-8 h-8" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-100',
    title: 'Live Disaster Dashboard',
    desc: 'Real-time interactive maps showing flood zones, landslides, fire outbreaks and structural collapses with risk overlays.'
  },
  {
    icon: <Truck className="w-8 h-8" />,
    color: 'text-amber-500',
    bg: 'bg-amber-50 border-amber-100',
    title: 'Resource Allocation',
    desc: 'AI-driven dispatch suggestions with live route tracking — put the right team at the right place in minutes.'
  },
  {
    icon: <Users className="w-8 h-8" />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 border-emerald-100',
    title: 'Volunteer Network',
    desc: 'Manage and mobilise certified rescue volunteers with real-time task assignment and skill-based routing.'
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    color: 'text-orange-500',
    bg: 'bg-orange-50 border-orange-100',
    title: 'Incident Reporting',
    desc: 'Victims and bystanders can broadcast SOS alerts with GPS precision, photos and urgency levels directly from any device.'
  },
  {
    icon: <Bell className="w-8 h-8" />,
    color: 'text-purple-500',
    bg: 'bg-purple-50 border-purple-100',
    title: 'Multi-Disaster Alerts',
    desc: 'Floods, fires, earthquakes, landslides — all disasters surface as live red-alert beacons on a unified command map.'
  }
];

// ── Animated SVG disaster canvas  ──────────────────────────────────────
function DisasterCanvas() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Outer ambient pulse rings */}
      <div className="absolute w-80 h-80 rounded-full border-2 border-blue-200 animate-ping opacity-20" />
      <div className="absolute w-64 h-64 rounded-full border-2 border-blue-300 animate-ping opacity-30" style={{ animationDelay: '0.5s' }} />

      {/* Central globe */}
      <div className="relative z-10 w-52 h-52 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-700 shadow-[0_0_60px_rgba(59,130,246,0.6)] flex items-center justify-center">
        <Globe className="w-28 h-28 text-white opacity-90 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      {/* Orbiting alert nodes */}
      {[
        { label: '🌊 Flood', top: '8%',  left: '20%',  color: 'bg-blue-100 border-blue-400',   delay: '0s' },
        { label: '🔥 Fire',  top: '12%', right: '12%', color: 'bg-red-100 border-red-400',     delay: '0.4s' },
        { label: '⛰️ Slide', bottom: '18%', left: '10%',  color: 'bg-slate-100 border-slate-400', delay: '0.8s' },
        { label: '🏗️ Collapse', bottom: '10%', right: '20%', color: 'bg-amber-100 border-amber-400', delay: '1.2s' },
      ].map((node, i) => (
        <div
          key={i}
          className={`absolute px-3 py-1.5 rounded-full border ${node.color} text-xs font-semibold shadow-md animate-bounce`}
          style={{
            top: node.top, left: node.left,
            bottom: node.bottom, right: node.right,
            animationDelay: node.delay
          }}
        >
          {node.label}
        </div>
      ))}

      {/* Scan line sweep */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <div
          className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
          style={{ animation: 'scanline 3s linear infinite' }}
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Intersection Observer for scroll-in animations
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('opacity-100', 'translate-y-0');
      }),
      { threshold: 0.15 }
    );
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 overflow-x-hidden">

      {/* ── TOP NAV ──────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-blue-600" />
            <span className="font-extrabold text-xl tracking-tight">
              ResQ<span className="text-blue-600">Sense</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={scrollToFeatures} className="hover:text-blue-600 transition-colors">Features</button>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md hover:shadow-blue-300"
            >
              Launch Dashboard
            </button>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="md:hidden px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        {/* Ambient background blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

          {/* Left: Text content */}
          <div className="animate-fade-in">
            {/* Alert badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-600 text-sm font-semibold mb-8 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              Live Disaster Monitoring Active
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">ResQ</span>
              <span className="text-slate-900">Sense</span>
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 leading-snug">
              "We find the people who
              <br className="hidden sm:block" />
              <span className="text-red-500"> cannot call for help."</span>
            </p>

            <p className="text-lg text-slate-600 max-w-xl mb-10 leading-relaxed">
              An AI-powered disaster response platform that detects <strong className="text-slate-800">invisible victims</strong> in flood zones, landslides, and collapse sites — using signal anomalies, last-known locations and environmental data.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-blue-300 transition-all duration-300"
              >
                <Navigation className="w-5 h-5" />
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToFeatures}
                className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-semibold rounded-full shadow-sm transition-all duration-300"
              >
                <Eye className="w-5 h-5" /> Explore Features
              </button>
            </div>

            {/* Quick stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
              {[
                { val: '94%', label: 'Detection Accuracy' },
                { val: '< 2min', label: 'Alert Dispatch' },
                { val: '6 types', label: 'Disaster Coverage' },
              ].map((s, i) => (
                <div key={i} className="bg-white/80 border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-blue-600">{s.val}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated illustration */}
          <div className="relative h-[480px] hidden lg:block">
            <DisasterCanvas />
          </div>
        </div>

        {/* Scroll down cue */}
        <button
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-blue-600 transition-colors animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white/60 backdrop-blur-sm border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How ResQSense Works</h2>
          <p className="text-slate-500 text-lg mb-16 max-w-2xl mx-auto">Three intelligent layers working together to save lives in real-time.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01', icon: <Zap className="w-6 h-6" />, color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
                title: 'Detect Anomalies',
                desc: 'AI scans for signal drops, inactivity spikes and environmental changes to identify disaster zones in real-time.'
              },
              {
                step: '02', icon: <Globe className="w-6 h-6" />, color: 'text-blue-500 bg-blue-50 border-blue-200',
                title: 'Map & Prioritise',
                desc: 'All incidents and predicted zones are plotted on a live map with colour-coded risk levels and victim probability scores.'
              },
              {
                step: '03', icon: <Navigation className="w-6 h-6" />, color: 'text-green-500 bg-green-50 border-green-200',
                title: 'Dispatch & Rescue',
                desc: 'AI recommends optimal resource dispatch with live route tracking to reach victims in the fastest possible time.'
              }
            ].map((s, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-left hover:shadow-md transition-shadow">
                <div className="text-6xl font-black text-slate-100 absolute top-4 right-4">{s.step}</div>
                <div className={`inline-flex p-3 rounded-xl border ${s.color} mb-4`}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section ref={featuresRef} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Platform Features</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Every tool built for one purpose — getting rescue teams to invisible victims before it's too late.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card opacity-0 translate-y-8 transition-all duration-700 bg-white rounded-2xl p-7 border shadow-sm hover:shadow-xl hover:-translate-y-1 group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`inline-flex p-3 rounded-xl border ${f.bg} ${f.color} mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-2xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <ShieldAlert className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Every second counts.
            <br />
            <span className="text-cyan-200">Deploy ResQSense now.</span>
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Access the live command center and start tracking, responding and saving lives with cutting-edge AI disaster intelligence.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-slate-50 text-blue-700 font-extrabold rounded-full text-lg shadow-2xl hover:shadow-white/30 transition-all duration-300"
          >
            <Navigation className="w-6 h-6" />
            Launch Dashboard
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-white">ResQ<span className="text-blue-400">Sense</span></span>
            <span className="text-slate-600 text-xs ml-2">v1.0 — Built for emergency response</span>
          </div>
          <p className="text-sm">"We find the people who cannot call for help."</p>
        </div>
      </footer>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(300px); }
        }
      `}</style>
    </div>
  );
}
