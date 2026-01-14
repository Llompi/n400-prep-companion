import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flag, LayoutDashboard, CalendarDays, BookOpen, FolderCheck, Settings, 
  AlertCircle, XCircle, FileWarning, PlusCircle, Plus, Trash2, Folder, 
  Link as LinkIcon, AlertTriangle, Paperclip, X, CheckCircle, ArrowLeft, 
  ArrowRight, Check, Circle, RotateCcw, Download, Upload, MessageSquare,
  ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react';

// --- ICON MAPPING ---
const ICON_MAP = {
  'flag': Flag,
  'layout-dashboard': LayoutDashboard,
  'calendar-days': CalendarDays,
  'book-open': BookOpen,
  'folder-check': FolderCheck,
  'settings': Settings,
  'alert-circle': AlertCircle,
  'x-circle': XCircle,
  'file-warning': FileWarning,
  'plus-circle': PlusCircle,
  'plus': Plus,
  'trash-2': Trash2,
  'folder': Folder,
  'link': LinkIcon,
  'alert-triangle': AlertTriangle,
  'paperclip': Paperclip,
  'x': X,
  'check-circle': CheckCircle,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'check': Check,
  'circle': Circle,
  'rotate-ccw': RotateCcw,
  'download': Download,
  'upload': Upload,
  'message-square': MessageSquare,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'more-horizontal': MoreHorizontal
};

const Icon = ({ name, size = 20, className = "" }) => {
  const IconComp = ICON_MAP[name];
  if (IconComp) {
    return <IconComp size={size} className={className} />;
  }
  return <span className={`font-bold ${className}`}>{name}</span>;
};

// --- DATA: 2008 Civics Questions (Sample) ---
const INITIAL_QUESTIONS = [
    { id: 1, q: "What is the supreme law of the land?", a: "The Constitution", section: "Principles" },
    { id: 2, q: "What does the Constitution do?", a: "Sets up the government; Defines the government; Protects basic rights of Americans", section: "Principles" },
    { id: 3, q: "The idea of self-government is in the first three words of the Constitution. What are these words?", a: "We the People", section: "Principles" },
    { id: 4, q: "What is an amendment?", a: "A change (to the Constitution); An addition (to the Constitution)", section: "Principles" },
    { id: 5, q: "What do we call the first ten amendments to the Constitution?", a: "The Bill of Rights", section: "Principles" },
    { id: 6, q: "What is one right or freedom from the First Amendment?", a: "Speech; Religion; Assembly; Press; Petition the government", section: "Principles" },
    { id: 7, q: "How many amendments does the Constitution have?", a: "Twenty-seven (27)", section: "Principles" },
    { id: 8, q: "What did the Declaration of Independence do?", a: "Announced our independence (from Great Britain)", section: "Principles" },
    { id: 9, q: "What are two rights in the Declaration of Independence?", a: "Life; Liberty; Pursuit of happiness", section: "Principles" },
    { id: 10, q: "What is freedom of religion?", a: "You can practice any religion, or not practice a religion", section: "Principles" },
    { id: 13, q: "Name one branch or part of the government.", a: "Congress; Legislative; President; Executive; The courts; Judicial", section: "System of Gov" },
    { id: 14, q: "What stops one branch of government from becoming too powerful?", a: "Checks and balances; Separation of powers", section: "System of Gov" },
    { id: 26, q: "We elect a President for how many years?", a: "Four (4)", section: "System of Gov" },
    { id: 27, q: "In what month do we vote for President?", a: "November", section: "System of Gov" },
    { id: 56, q: "When is the last day you can send in federal income tax forms?", a: "April 15", section: "Rights" },
];

// --- INITIAL DOCUMENT CHECKLIST ---
const INITIAL_DOCS = [
    { id: 'd1', name: "Permanent Resident Card", status: "missing", required: true, notes: "Front & Back copy", meta: { expiry: '', issuer: 'USCIS', location: '' } },
    { id: 'd2', name: "Driver's License / State ID", status: "missing", required: true, notes: "Current and valid", meta: { expiry: '', issuer: 'DMV', location: '' } },
    { id: 'd3', name: "All Passports", status: "missing", required: true, notes: "Current & Expired", meta: { expiry: '', issuer: '', location: '' } },
    { id: 'd4', name: "Marriage Certificate", status: "missing", required: false, notes: "Current marriage", meta: { expiry: 'N/A', issuer: '', location: '' } },
    { id: 'd5', name: "Tax Transcripts (5 Years)", status: "missing", required: true, notes: "IRS Form 1040", meta: { expiry: 'N/A', issuer: 'IRS', location: '' } },
];

// --- COMPONENTS ---

// 1. Integrated Note Component
const IntegratedNote = ({ id, notes, setNotes, label = "Add a note..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const noteContent = notes[id] || "";

    const handleSave = (text) => {
        setNotes(prev => ({ ...prev, [id]: text }));
    };

    return (
        <div className="mt-2 w-full">
            {!isOpen && !noteContent && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-wider"
                >
                    <Icon name="message-square" size={12} />
                    {label}
                </button>
            )}
            {(isOpen || noteContent) && (
                <div className="relative group">
                    <textarea 
                        className="w-full bg-amber-50/50 border border-amber-100 rounded-md p-2 text-xs text-slate-600 focus:outline-none focus:border-amber-300 transition-all resize-none font-serif leading-relaxed"
                        rows={isOpen || noteContent.length > 50 ? 3 : 1}
                        placeholder="Type your notes here..."
                        value={noteContent}
                        onChange={(e) => handleSave(e.target.value)}
                        onBlur={() => !noteContent && setIsOpen(false)}
                        autoFocus={isOpen}
                    />
                    {noteContent && (
                         <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => {handleSave(""); setIsOpen(false);}} className="text-slate-300 hover:text-red-300">
                                <Icon name="x" size={12} />
                            </button>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 2. Custom Particle Background for Study Mode
const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        let particles = [];
        const particleCount = 40;
        const connectionDistance = 100;
        let mouse = { x: null, y: null };

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.color = `rgba(191, 219, 254, ${Math.random() * 0.5 + 0.2})`; // Soft Blue
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wall bounce
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse repulsion
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (100 - distance) / 100;
                        const directionX = forceDirectionX * force * 0.5;
                        const directionY = forceDirectionY * force * 0.5;
                        this.vx -= directionX;
                        this.vy -= directionY;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connections
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx*dx + dy*dy);

                    if (distance < connectionDistance) {
                        ctx.strokeStyle = `rgba(226, 232, 240, ${1 - distance/connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
};

// 3. Modern Progress Bar
const SoftProgressBar = ({ value, max, colorClass = "bg-blue-300" }) => {
    const percentage = Math.round((value / max) * 100);
    return (
        <div className="relative h-5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
                className={`absolute top-0 left-0 h-full ${colorClass} transition-all duration-1000 ease-out opacity-60`} 
                style={{ width: `${percentage}%` }}
            ></div>
             {/* Text inside the bar */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-[10px] font-bold text-slate-600 tracking-wider font-sans">
                    {percentage}%
                </span>
            </div>
        </div>
    );
};

const NavButton = ({ id, icon, label, active, set }) => (
    <button 
        onClick={() => set(id)}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${active === id ? 'text-blue-600 bg-blue-50/50 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
    >
        <Icon name={icon} size={22} className={active === id ? "fill-blue-100" : ""} />
        <span className={`text-[10px] mt-1 font-medium font-sans ${active === id ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
    </button>
);

// --- MAIN SECTIONS ---

const Dashboard = ({ events, mastery, questions, docs, settings, setSettings, setActiveTab, notes, setNotes }) => {
    const daysUntil = useMemo(() => {
        if (!settings.interviewDate) return null;
        const diff = new Date(settings.interviewDate) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }, [settings.interviewDate]);

    const docsReady = docs.filter(d => d.status === 'packed' || d.status === 'uploaded').length;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-medium text-slate-800 mb-1">Welcome, {settings.name}</h2>
                    <p className="text-slate-500 font-sans text-sm mb-6">Your journey to citizenship is underway.</p>
                    
                    {daysUntil !== null ? (
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-5xl font-serif text-slate-800">{daysUntil}</span>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Days Left</span>
                            </div>
                            <div className="h-12 w-px bg-slate-200"></div>
                            <div>
                                <div className="font-serif text-lg text-slate-700">{new Date(settings.interviewDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}</div>
                                <div className="text-xs text-blue-400 font-medium">Interview Date</div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setActiveTab('settings')} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition">
                            Set Interview Date
                        </button>
                    )}
                    <IntegratedNote id="dash_header" notes={notes} setNotes={setNotes} label="Add Daily Goal / Note" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Study Card */}
                <div onClick={() => setActiveTab('study')} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition">
                            <Icon name="book-open" className="text-green-600 opacity-80" />
                        </div>
                        <Icon name="arrow-right" className="text-slate-300 group-hover:text-slate-500 transition" size={16} />
                    </div>
                    <h3 className="text-lg font-serif text-slate-800 mb-1">Civics Mastery</h3>
                    <div className="mb-3">
                        <SoftProgressBar value={Object.keys(mastery).length} max={questions.length} colorClass="bg-green-300" />
                    </div>
                    <p className="text-xs text-slate-400">
                        {Object.keys(mastery).length} of {questions.length} questions mastered
                    </p>
                     <IntegratedNote id="dash_study" notes={notes} setNotes={setNotes} />
                </div>

                {/* Docs Card */}
                <div onClick={() => setActiveTab('docs')} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition">
                            <Icon name="folder-check" className="text-amber-600 opacity-80" />
                        </div>
                        <Icon name="arrow-right" className="text-slate-300 group-hover:text-slate-500 transition" size={16} />
                    </div>
                    <h3 className="text-lg font-serif text-slate-800 mb-1">Documents</h3>
                     <div className="mb-3">
                        <SoftProgressBar value={docsReady} max={docs.length} colorClass="bg-amber-300" />
                    </div>
                    <p className="text-xs text-slate-400">
                        {docsReady} of {docs.length} items ready
                    </p>
                    <IntegratedNote id="dash_docs" notes={notes} setNotes={setNotes} />
                </div>

                {/* Timeline Card */}
                <div onClick={() => setActiveTab('timeline')} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition">
                            <Icon name="calendar-days" className="text-blue-600 opacity-80" />
                        </div>
                        <Icon name="arrow-right" className="text-slate-300 group-hover:text-slate-500 transition" size={16} />
                    </div>
                    <h3 className="text-lg font-serif text-slate-800 mb-1">Timeline</h3>
                    <div className="text-2xl font-sans font-light text-slate-700 mb-1">{events.length} <span className="text-sm text-slate-400">Events</span></div>
                    <p className="text-xs text-slate-400">Track residence & travel history</p>
                    <IntegratedNote id="dash_timeline" notes={notes} setNotes={setNotes} />
                </div>
            </div>
        </div>
    );
};

const TimelineManager = ({ events, setEvents, settings, notes, setNotes }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState('all'); 
    const [newEvent, setNewEvent] = useState({
        date: '', endDate: '', type: 'address', title: '', desc: '', evidenceRef: '', evidenceLink: ''
    });

    const sortedEvents = useMemo(() => [...events].sort((a, b) => new Date(b.date) - new Date(a.date)), [events]);
    const filteredEvents = sortedEvents.filter(e => filter === 'all' || e.type === filter);

    const addEvent = (e) => {
        e.preventDefault();
        setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
        setIsAdding(false);
        setNewEvent({ date: '', endDate: '', type: 'address', title: '', desc: '', evidenceRef: '', evidenceLink: '' });
    };

    const getTypeColor = (type) => {
        const map = {
            'trip': 'text-purple-400 bg-purple-50',
            'address': 'text-green-400 bg-green-50',
            'employment': 'text-blue-400 bg-blue-50',
            'legal': 'text-red-400 bg-red-50',
            'tax': 'text-amber-400 bg-amber-50',
            'other': 'text-slate-400 bg-slate-50'
        };
        return map[type] || map['other'];
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-slate-800">Timeline</h2>
                <button onClick={() => setIsAdding(true)} className="bg-slate-800 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow hover:bg-slate-700 transition">
                    <Icon name="plus" size={16} /> Add Event
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {['all', 'address', 'employment', 'trip', 'tax', 'legal'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition border ${filter === f ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="relative pl-8 border-l border-slate-200 space-y-8">
                {/* Future Node */}
                <div className="relative">
                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-blue-400 ring-4 ring-blue-50"></div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start">
                             <div>
                                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">Upcoming</span>
                                <h3 className="font-serif text-lg text-slate-800 mt-1">Interview</h3>
                                <div className="text-sm text-slate-500 font-sans mt-1">{settings.interviewDate || "Date pending"}</div>
                             </div>
                             <Icon name="flag" className="text-blue-200" size={24} />
                        </div>
                        <IntegratedNote id="timeline_target" notes={notes} setNotes={setNotes} />
                    </div>
                </div>

                {filteredEvents.map(ev => (
                    <div key={ev.id} className="relative group">
                        <div className={`absolute -left-[37px] top-5 w-4 h-4 rounded-full bg-white border-2 border-slate-300 z-10 group-hover:scale-110 transition`}></div>
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${getTypeColor(ev.type)}`}>{ev.type}</span>
                                    <h3 className="font-serif text-lg text-slate-800 mt-2">{ev.title}</h3>
                                    <div className="text-sm text-slate-400 font-mono mt-1">
                                        {ev.date} {ev.endDate ? `— ${ev.endDate}` : ''}
                                    </div>
                                </div>
                                <button onClick={() => { if(confirm("Delete?")) setEvents(events.filter(e => e.id !== ev.id)) }} className="text-slate-200 hover:text-red-300 transition">
                                    <Icon name="trash-2" size={16} />
                                </button>
                            </div>
                            
                            {ev.desc && <p className="text-sm text-slate-600 mt-3 font-sans leading-relaxed">{ev.desc}</p>}
                            
                            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                                {ev.evidenceRef || ev.evidenceLink ? (
                                    <>
                                        {ev.evidenceRef && (
                                            <span className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                                <Icon name="folder" size={12} className="text-amber-400" /> {ev.evidenceRef}
                                            </span>
                                        )}
                                        {ev.evidenceLink && (
                                            <a href={ev.evidenceLink} target="_blank" className="flex items-center gap-2 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition">
                                                <Icon name="link" size={12} /> Link
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-xs text-red-300 italic flex items-center gap-1"><Icon name="alert-triangle" size={12} /> No proof attached</span>
                                )}
                            </div>
                            <IntegratedNote id={`evt_${ev.id}`} notes={notes} setNotes={setNotes} />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-serif text-lg">Add Timeline Event</h3>
                            <button onClick={() => setIsAdding(false)}><Icon name="x" className="text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <form onSubmit={addEvent} className="p-6 space-y-4">
                             {/* Form inputs same as before but styled cleaner */}
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Date</label>
                                    <input type="date" required className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-200" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Date</label>
                                    <input type="date" className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-200" value={newEvent.endDate} onChange={e => setNewEvent({...newEvent, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                                <select className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                                    <option value="address">Address History</option>
                                    <option value="employment">Employment</option>
                                    <option value="trip">Travel Abroad</option>
                                    <option value="tax">Tax Return</option>
                                    <option value="legal">Legal/Citation</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                                <input type="text" placeholder="e.g. Moved to Seattle" className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                                <textarea className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm resize-none" rows="3" value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})}></textarea>
                            </div>
                            <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition">Save Event</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StudyMode = ({ questions, setQuestions, mastery, setMastery, notes, setNotes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showMastered, setShowMastered] = useState(true);

    const activeQuestions = useMemo(() => {
        return showMastered ? questions : questions.filter(q => !mastery[q.id]);
    }, [questions, mastery, showMastered]);

    const currentQ = activeQuestions[currentIndex];

    // Card Flip Logic
    const nextCard = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex((prev) => (prev + 1) % activeQuestions.length), 200); };
    const prevCard = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex((prev) => (prev - 1 + activeQuestions.length) % activeQuestions.length), 200); };
    const toggleMastery = (id) => { setMastery(prev => { const n = { ...prev }; if (n[id]) delete n[id]; else n[id] = true; return n; }); };

    // Questions Import/Export
    const handleQExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions));
        const a = document.createElement('a');
        a.href = dataStr; a.download = "n400_questions.json"; a.click();
    };
    const handleQImport = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { try { setQuestions(JSON.parse(ev.target.result)); alert("Questions Imported"); } catch(err){ alert("Invalid JSON"); }};
        reader.readAsText(file);
    };

    if (!currentQ) return <div className="p-10 text-center font-serif text-slate-500">No questions available.</div>;

    return (
        <div className="relative min-h-[600px] flex flex-col">
            {/* Physics Background */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-50 z-0">
                <ParticleBackground />
            </div>

            <div className="relative z-10 max-w-lg mx-auto w-full space-y-6 pt-6">
                <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm">
                    <h2 className="text-lg font-serif pl-4 text-slate-700">Flashcards</h2>
                    <div className="flex items-center gap-3 pr-2">
                        <label className="text-xs text-slate-500 font-bold flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition">
                            <input type="checkbox" checked={!showMastered} onChange={() => {setShowMastered(!showMastered); setCurrentIndex(0);}} className="accent-slate-800" />
                            Study Needs
                        </label>
                        <div className="flex gap-1">
                            <button onClick={handleQExport} title="Export Questions" className="p-2 text-slate-400 hover:text-blue-500"><Icon name="download" size={16}/></button>
                            <label className="p-2 text-slate-400 hover:text-blue-500 cursor-pointer">
                                <Icon name="upload" size={16}/>
                                <input type="file" className="hidden" accept=".json" onChange={handleQImport} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* 3D Card */}
                <div className="h-80 w-full perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                        
                        {/* FRONT */}
                        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl border-2 border-white flex flex-col items-center justify-center p-8 text-center backface-hidden">
                            <div className="absolute top-6 left-6 text-xs font-bold text-slate-300 uppercase tracking-widest">{currentQ.section}</div>
                            <div className="absolute top-6 right-6 text-2xl font-serif text-slate-100 font-bold">Q{currentQ.id}</div>
                            <h3 className="text-2xl font-serif text-slate-800 leading-snug">{currentQ.q}</h3>
                            <div className="absolute bottom-6 text-xs font-bold text-blue-300 uppercase tracking-widest animate-pulse">Tap to Reveal</div>
                        </div>

                        {/* BACK */}
                        <div className="absolute w-full h-full bg-slate-800 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center backface-hidden rotate-y-180 border-2 border-slate-700">
                             <div className="absolute top-6 left-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Answer</div>
                            <p className="text-xl font-medium text-slate-50 font-serif leading-relaxed">{currentQ.a}</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between px-4">
                    <button onClick={prevCard} className="p-4 bg-white rounded-full shadow-sm hover:shadow-md text-slate-400 hover:text-slate-600 transition"><Icon name="arrow-left" /></button>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleMastery(currentQ.id); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-sm transition transform active:scale-95 ${mastery[currentQ.id] ? 'bg-green-100 text-green-700 ring-2 ring-green-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                        {mastery[currentQ.id] ? <><Icon name="check" size={16} /> Mastered</> : <><Icon name="circle" size={16} /> Mark as Mastered</>}
                    </button>

                    <button onClick={nextCard} className="p-4 bg-white rounded-full shadow-sm hover:shadow-md text-slate-400 hover:text-slate-600 transition"><Icon name="arrow-right" /></button>
                </div>

                {/* Card-Specific Note */}
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
                    <IntegratedNote id={`q_${currentQ.id}`} notes={notes} setNotes={setNotes} label={`Notes on Q${currentQ.id}`} />
                </div>
            </div>
            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

const DocManager = ({ docs, setDocs, notes, setNotes }) => {
    const [expanded, setExpanded] = useState(null);

    const toggleStatus = (id, e) => {
        e.stopPropagation();
        setDocs(docs.map(d => {
            if (d.id !== id) return d;
            const statuses = ['missing', 'found', 'copied', 'uploaded', 'packed'];
            const idx = statuses.indexOf(d.status);
            return { ...d, status: statuses[Math.min(idx + 1, 4)] };
        }));
    };

    const updateMeta = (id, field, val) => {
        setDocs(docs.map(d => d.id === id ? { ...d, meta: { ...d.meta, [field]: val } } : d));
    };

    const getStatusColor = (s) => {
        switch(s) {
            case 'packed': return 'bg-green-100 text-green-700 border-green-200';
            case 'uploaded': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'copied': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'found': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif text-slate-800">Documents</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {docs.map(doc => {
                    const isExp = expanded === doc.id;
                    return (
                        <div key={doc.id} className={`border-b border-slate-50 transition-colors ${isExp ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                            {/* Main Row */}
                            <div className="p-5 cursor-pointer flex items-center justify-between gap-4" onClick={() => setExpanded(isExp ? null : doc.id)}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-serif text-base ${doc.status === 'packed' ? 'text-green-700 line-through opacity-70' : 'text-slate-800'}`}>{doc.name}</h3>
                                        {doc.required && <span className="text-[9px] font-bold bg-red-50 text-red-400 px-1.5 py-0.5 rounded tracking-wider uppercase">Req</span>}
                                    </div>
                                    <p className="text-xs text-slate-400 font-sans">{doc.notes}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={(e) => toggleStatus(doc.id, e)} 
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${getStatusColor(doc.status)} flex items-center gap-2 min-w-[100px] justify-center`}
                                    >
                                        <Icon name={doc.status === 'packed' ? 'check-circle' : 'circle'} size={12} />
                                        {doc.status}
                                    </button>
                                    <Icon name={isExp ? 'chevron-up' : 'chevron-down'} size={16} className="text-slate-300" />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExp && (
                                <div className="px-5 pb-5 pt-0 animate-fade-in">
                                    <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiration Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full text-xs bg-slate-50 border-none rounded p-2"
                                                    value={doc.meta?.expiry || ''}
                                                    onChange={(e) => updateMeta(doc.id, 'expiry', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Issuing Authority</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. DMV" 
                                                    className="w-full text-xs bg-slate-50 border-none rounded p-2"
                                                    value={doc.meta?.issuer || ''}
                                                    onChange={(e) => updateMeta(doc.id, 'issuer', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Physical Location Details</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Blue binder, second sleeve" 
                                                className="w-full text-xs bg-slate-50 border-none rounded p-2"
                                                value={doc.meta?.location || ''}
                                                onChange={(e) => updateMeta(doc.id, 'location', e.target.value)}
                                            />
                                        </div>
                                        <IntegratedNote id={`doc_${doc.id}`} notes={notes} setNotes={setNotes} label="Add notes about this document" />
                                        <div className="pt-2 flex justify-end">
                                            <button onClick={() => setDocs(docs.map(d => d.id === doc.id ? { ...d, status: 'missing' } : d))} className="text-xs text-red-300 hover:text-red-500">Reset Status</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Settings = ({ settings, setSettings, handleExport, handleImport, clearData }) => (
    <div className="space-y-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-serif text-slate-800">Settings</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-serif text-lg text-slate-700">Profile</h3>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Interview Date</label>
                <input type="date" className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm" value={settings.interviewDate} onChange={e => setSettings({...settings, interviewDate: e.target.value})} />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Arrival Date (USA)</label>
                <input type="date" className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm" value={settings.arrivalDate} onChange={e => setSettings({...settings, arrivalDate: e.target.value})} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-serif text-lg text-slate-700">Data</h3>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={handleExport} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                    <Icon name="download" className="mb-2 text-slate-500" />
                    <span className="text-xs font-bold text-slate-600">Backup All</span>
                </button>
                <label className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                    <Icon name="upload" className="mb-2 text-slate-500" />
                    <span className="text-xs font-bold text-slate-600">Restore All</span>
                    <input type="file" className="hidden" onChange={handleImport} accept=".json" />
                </label>
            </div>
            <button onClick={clearData} className="w-full text-red-400 text-xs py-3 hover:bg-red-50 rounded-xl transition">
                Reset Application Data
            </button>
        </div>
    </div>
);

// --- MAIN APP ---
const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [events, setEvents] = useState([]);
    const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
    const [docs, setDocs] = useState(INITIAL_DOCS);
    const [mastery, setMastery] = useState({}); 
    const [notes, setNotes] = useState({}); // New Global Notes Store
    const [settings, setSettings] = useState({ arrivalDate: '', greenCardDate: '', filingDate: '', interviewDate: '', name: 'Applicant' });

    useEffect(() => {
        const savedData = localStorage.getItem('n400_data_v2'); // New version key
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.events) setEvents(parsed.events);
                if (parsed.mastery) setMastery(parsed.mastery);
                if (parsed.docs) setDocs(parsed.docs);
                if (parsed.settings) setSettings(parsed.settings);
                if (parsed.notes) setNotes(parsed.notes);
                if (parsed.questions) setQuestions(parsed.questions);
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('n400_data_v2', JSON.stringify({ events, mastery, docs, settings, notes, questions }));
    }, [events, mastery, docs, settings, notes, questions]);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ events, mastery, docs, settings, notes, questions }));
        const a = document.createElement('a'); a.href = dataStr; a.download = "n400_full_backup.json"; a.click();
    };

    const handleImport = (e) => {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const parsed = JSON.parse(e.target.result);
                setEvents(parsed.events || []); setMastery(parsed.mastery || {}); setDocs(parsed.docs || INITIAL_DOCS);
                setSettings(parsed.settings || {}); setNotes(parsed.notes || {}); 
                if(parsed.questions) setQuestions(parsed.questions);
                alert("Restored Successfully");
            } catch (err) { alert("Error importing"); }
        };
        reader.readAsText(e.target.files[0]);
    };

    const clearData = () => { if(confirm("Reset everything?")) { localStorage.removeItem('n400_data_v2'); window.location.reload(); }};

    return (
        <div className="min-h-screen pb-24 md:pb-0 bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Minimal Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 text-white p-2 rounded-lg"><Icon name="flag" size={16} /></div>
                        <h1 className="text-lg font-serif font-bold text-slate-800 tracking-tight">N-400 <span className="font-sans font-normal text-slate-400">Companion</span></h1>
                    </div>
                    <div className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {settings.interviewDate ? new Date(settings.interviewDate).toLocaleDateString() : 'Set Date'}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6">
                {activeTab === 'dashboard' && <Dashboard events={events} mastery={mastery} questions={questions} docs={docs} settings={settings} setSettings={setSettings} setActiveTab={setActiveTab} notes={notes} setNotes={setNotes} />}
                {activeTab === 'timeline' && <TimelineManager events={events} setEvents={setEvents} settings={settings} notes={notes} setNotes={setNotes} />}
                {activeTab === 'study' && <StudyMode questions={questions} setQuestions={setQuestions} mastery={mastery} setMastery={setMastery} notes={notes} setNotes={setNotes} />}
                {activeTab === 'docs' && <DocManager docs={docs} setDocs={setDocs} notes={notes} setNotes={setNotes} />}
                {activeTab === 'settings' && <Settings settings={settings} setSettings={setSettings} handleExport={handleExport} handleImport={handleImport} clearData={clearData} />}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-2 z-40">
                <div className="max-w-md mx-auto flex justify-around">
                    <NavButton id="dashboard" icon="layout-dashboard" label="Home" active={activeTab} set={setActiveTab} />
                    <NavButton id="timeline" icon="calendar-days" label="Time" active={activeTab} set={setActiveTab} />
                    <NavButton id="study" icon="book-open" label="Study" active={activeTab} set={setActiveTab} />
                    <NavButton id="docs" icon="folder-check" label="Docs" active={activeTab} set={setActiveTab} />
                    <NavButton id="settings" icon="settings" label="Config" active={activeTab} set={setActiveTab} />
                </div>
            </nav>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap');
                .font-serif { font-family: 'DM Serif Display', serif; }
                .font-sans { font-family: 'Inter', sans-serif; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default App;
