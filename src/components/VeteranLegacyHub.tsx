import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Heart, 
  Send, 
  BookOpen, 
  Download, 
  MessageSquare,
  Users,
  Shield,
  Calendar,
  CheckCircle2,
  Lock,
  ThumbsUp,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface LegacyNote {
  id: string;
  retireeId: string;
  retireeName: string;
  category: 'Operational Wisdom' | 'Safety Rules' | 'General Life Advice';
  text: string;
  timestamp: string;
}

interface ApprenticeSalute {
  id: string;
  retireeId: string;
  authorName: string;
  authorDesignation: string;
  message: string;
  timestamp: string;
  likes: number;
}

interface VeteranLegacyHubProps {
  employees: User[];
  currentUser: User;
  lang?: 'en' | 'hi';
}

export default function VeteranLegacyHub({ employees, currentUser, lang = 'en' }: VeteranLegacyHubProps) {
  const isEn = lang === 'en';

  // Identify all veteran candidates (retiring soon or experience >= 20 years)
  const veterans = employees.filter(emp => emp.isRetiringNext12Months || (emp.experienceYears && emp.experienceYears >= 20));

  const [selectedRetiree, setSelectedRetiree] = useState<User | null>(veterans[0] || null);
  const [showCertificateModal, setShowCertificateModal] = useState<string | null>(null); // holds employee id if shown

  // Legacy Notes (Pre-seeded with deep, inspirational operational wisdom)
  const [legacyNotes, setLegacyNotes] = useState<LegacyNote[]>([
    {
      id: 'NOTE-1',
      retireeId: 'EMP-001',
      retireeName: 'V. Krishnamurthy',
      category: 'Safety Rules',
      text: isEn 
        ? "Never bypass LOTO protocols even when pressure from the scheduler is extreme. The steel will always wait; your life and the lives of your fellow blast engineers will not. Keep your ears open for the seal whistle."
        : "शेड्यूलर का अत्यधिक दबाव होने पर भी कभी भी LOTO प्रोटोकॉल को बायपास न करें। लोहा हमेशा इंतजार करेगा, लेकिन आपकी और आपके साथी इंजीनियरों की जान नहीं। वाल्व की सीटी की आवाज पर हमेशा ध्यान दें।",
      timestamp: '2026-06-15'
    },
    {
      id: 'NOTE-2',
      retireeId: 'EMP-001',
      retireeName: 'V. Krishnamurthy',
      category: 'Operational Wisdom',
      text: isEn 
        ? "Every furnace has its own voice. If pressure readings fluctuate by even 0.05 bar on the manifold, physical verification on pressure latch 2C beats any L-2 SCADA dashboard alert. Rely on telemetry, but verify on the floor."
        : "प्रत्येक भट्टी (Furnace) की अपनी एक आवाज होती है। यदि मैनिफोल्ड पर दबाव रीडिंग में 0.05 बार का भी उतार-चढ़ाव होता है, तो भौतिक जांच हमेशा डिजिटल सेंसर से बेहतर परिणाम देती है। टेलीमेट्री पर भरोसा करें, लेकिन जमीन पर जांच स्वयं करें।",
      timestamp: '2026-06-18'
    },
    {
      id: 'NOTE-3',
      retireeId: 'EMP-003',
      retireeName: 'Amit Verma',
      category: 'Operational Wisdom',
      text: isEn 
        ? "Vibration spikes on a rolling shaft are like high-temperature fever down the line. Shut it down and test the insulation resistance early. Saving 30 minutes of downtime is never worth ruining a multi-million centrifugal blower."
        : "घूर्णन शाफ्ट पर कंपन का बढ़ना एक गंभीर चेतावनी है। इसे जल्द रोकें और बियरिंग इन्सुलेशन की जांच करें। कुछ मिनट बचाने की तुलना में करोड़ों के सेंट्रीफ्यूगल ब्लोअर को जलने से बचाना कहीं अधिक मूल्यवान है।",
      timestamp: '2026-06-19'
    }
  ]);

  // Apprentice Salutes (Pre-seeded with rich apprentice gratitude comments)
  const [salutes, setSalutes] = useState<ApprenticeSalute[]>([
    {
      id: 'SAL-1',
      retireeId: 'EMP-001',
      authorName: 'Rohan Sharma',
      authorDesignation: 'Junior Apprentice Metal-melt L1',
      message: isEn 
        ? "Sir, thank you for showing me how to handle high backdraft hazards during my first week on Blast Furnace III. Your patient hands-on training gave me the confidence to stand securely on the deck."
        : "सर, ब्लास्ट फर्नेस III पर मेरे पहले सप्ताह के दौरान हॉट बैकड्राफ्ट खतरों से सुरक्षित रहने का प्रदर्शन करने के लिए धन्यवाद। आपके मार्गदर्शन ने मुझे संयंत्र पर सुरक्षित खड़े होने का विश्वास दिया।",
      timestamp: 'Just now',
      likes: 8
    },
    {
      id: 'SAL-2',
      retireeId: 'EMP-001',
      authorName: 'Sujata Banerjee',
      authorDesignation: 'Head Metallurgist',
      message: isEn 
        ? "An absolute legend of SteelForce. Your 34 years of uncompromising safety stance created the culture we all live by today. Have an incredible retirement, Krishnamurthy sir!"
        : "स्टीलफोर्स के एक सच्चे महानायक। आपके 34 वर्षों के अटूट सुरक्षा सिद्धांतों ने उस कार्य संस्कृति को जन्म दिया जिसका हम सभी पालन करते हैं। आपका सेवानिवृत्ति जीवन मंगलमय हो सर!",
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: 'SAL-3',
      retireeId: 'EMP-003',
      authorName: 'Vijay Kadam',
      authorDesignation: 'Reliability Associate',
      message: isEn 
        ? "Amit, your vibration calibration guidelines are physically laminated and pasted right on our maintenance grid control board. You have saved us from numerous blower failures!"
        : "अमित सर, आपकी कंपन विश्लेषण गाइडलाइन्स को हमने विशेष रूप से लैमिनेट करके रखरखाव बोर्ड पर चिपका रखा है। आपने अनगिनत अचानक टर्बाइन विफलताओं से हमें बचाया है!",
      timestamp: '1 day ago',
      likes: 5
    }
  ]);

  // New Note / Message Form states
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Operational Wisdom' | 'Safety Rules' | 'General Life Advice'>('Operational Wisdom');
  const [newSaluteAuthor, setNewSaluteAuthor] = useState('');
  const [newSaluteText, setNewSaluteText] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedRetiree) return;

    const newNote: LegacyNote = {
      id: `NOTE-${Date.now()}`,
      retireeId: selectedRetiree.id,
      retireeName: selectedRetiree.name,
      category: newNoteCategory,
      text: newNoteText,
      timestamp: new Date().toISOString().split('T')[0]
    };

    setLegacyNotes(prev => [newNote, ...prev]);
    setNewNoteText('');
  };

  const handleAddSalute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaluteText.trim() || !selectedRetiree) return;

    const newSalute: ApprenticeSalute = {
      id: `SAL-${Date.now()}`,
      retireeId: selectedRetiree.id,
      authorName: newSaluteAuthor.trim() || (currentUser.role === 'Leadership' ? 'Strategic Director S. Raghavan' : currentUser.name),
      authorDesignation: currentUser.id === selectedRetiree.id ? 'Self-Legacy' : currentUser.designation || 'Site Apprentice',
      message: newSaluteText,
      timestamp: isEn ? 'Just now' : 'अभी-अभी',
      likes: 0
    };

    setSalutes(prev => [newSalute, ...prev]);
    setNewSaluteText('');
    setNewSaluteAuthor('');
  };

  const handleLikeSalute = (id: string) => {
    setSalutes(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
  };

  const activeNotes = legacyNotes.filter(n => n.retireeId === selectedRetiree?.id);
  const activeSalutes = salutes.filter(s => s.retireeId === selectedRetiree?.id);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Dynamic celebratory layout */}
      <div className="bg-gradient-to-r from-amber-600/15 via-slate-900/40 to-slate-950 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 left-10 w-32 h-32 bg-yellow-500/5 blur-2xl rounded-full"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/15 text-amber-500 border border-amber-500/25 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {isEn ? 'VETERAN HERITAGE PORTAL' : 'वरिष्ठ विरासत पोर्टल'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">ESTD 1992</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-100 font-display">
              {isEn ? 'The Golden Legacy Registry & Hall of Honor' : 'स्वर्ण विरासत रजिस्ट्री और सम्मान हॉल'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn 
                ? 'Dedicated to honoring the uncompromising safety posture, deep domain mechanics, and continuous plant mentorship logs of our retiring leaders. Their hands protected our works; their wisdom fuels our tomorrow.'
                : 'हमारे सेवानिवृत्त होने वाले विशेषज्ञों की उत्कृष्ट सुरक्षा प्रतिबद्धता, यांत्रिक ज्ञान और सतत संरक्षण को समर्पित। उनके हाथों ने हमेशा हमारे संयंत्र की सुरक्षा की; उनकी सलाह हमारे उज्ज्वल कल का निर्माण करती है।'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-850 px-5 py-3 rounded-2xl text-center shadow-lg">
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wide">{isEn ? 'VETERANS TOTAL' : 'कुल वरिष्ठ जन'}</p>
              <p className="text-2xl font-bold text-amber-500 font-display leading-none mt-1">{veterans.length}</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-850 px-5 py-3 rounded-2xl text-center shadow-lg">
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wide">{isEn ? 'LEGACY LESSONS' : 'संरक्षित सबक'}</p>
              <p className="text-2xl font-bold text-emerald-400 font-display leading-none mt-1">{legacyNotes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Veterans Grid and Selection Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Retiring legends list */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            {isEn ? 'Certified Legends of the Plant' : 'संयंत्र के प्रमाणित वरिष्ठ सितारे'}
          </h3>

          <div className="grid grid-cols-1 gap-3.5 max-h-[580px] overflow-y-auto pr-1">
            {veterans.map(vet => {
              const isSelected = selectedRetiree?.id === vet.id;
              const retireeSalutesCount = salutes.filter(s => s.retireeId === vet.id).length;
              const retireeNotesCount = legacyNotes.filter(n => n.retireeId === vet.id).length;

              return (
                <button
                  key={vet.id}
                  onClick={() => setSelectedRetiree(vet)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all relative overflow-hidden group hover:bg-[#12141a]/95 ${
                    isSelected
                      ? 'bg-amber-950/15 border-amber-500/40 shadow-[0_5px_15px_-5px_rgba(245,158,11,0.1)]'
                      : 'bg-[#0d0f14] border-slate-850/70 hover:border-slate-800'
                  }`}
                >
                  {/* Subtle golden background glow on selection */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.04] blur-xl rounded-full"></div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs font-bold uppercase transition-colors font-sans ${isSelected ? 'text-amber-400' : 'text-slate-200 group-hover:text-amber-500'}`}>
                          {vet.name}
                        </h4>
                        <span className="text-[8.5px] bg-slate-950/70 border border-slate-850 text-slate-400 px-2 py-0.5 rounded font-mono font-medium">
                          {vet.employeeId}
                        </span>
                      </div>
                      
                      <p className="text-[10.5px] text-slate-400 font-sans tracking-wide">
                        {vet.designation} • <span className="text-blue-400 font-bold">{vet.experienceYears} Yrs</span>
                      </p>
                      
                      <p className="text-[10px] text-slate-500 font-sans">
                        {vet.department} • {vet.unit}
                      </p>
                    </div>

                    <Award className={`w-6 h-6 shrink-0 transition-all ${isSelected ? 'text-amber-400 scale-110' : 'text-slate-600 group-hover:text-amber-400'}`} />
                  </div>

                  {/* Summary badges */}
                  <div className="flex items-center gap-3 pt-3.5 mt-3.5 border-t border-slate-900 text-[9px] font-mono text-slate-500">
                    <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded">
                      🛡️ {retireeNotesCount} {isEn ? 'Wisdom Rules' : 'विरासत सूत्र'}
                    </span>
                    <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded">
                      ❤️ {retireeSalutesCount} {isEn ? 'Apprentice Salutes' : 'सलामी सन्देश'}
                    </span>
                    {vet.isRetiringNext12Months && (
                      <span className="ml-auto text-[8.5px] font-bold text-amber-500 px-1.5 py-0.5 rounded uppercase animate-pulse">
                        ⌛ {isEn ? 'Impending Retirement' : 'सेवा-निवृत्ति निकट'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Detailed Profile, interactive Note section, and Salute creation */}
        <div className="lg:col-span-7 space-y-6">
          {selectedRetiree ? (
            <div className="space-y-6">
              
              {/* Profile Card Summary & Certificate Launcher */}
              <div className="bg-[#0e1016] border border-slate-850 rounded-3xl p-5.5 relative overflow-hidden font-sans">
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                    {isEn ? 'Plant Guardian' : 'संयंत्र प्रहरी'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-5">
                  {/* Decorative Profile Initials badge */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-950 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-2xl tracking-normal shrink-0">
                    {selectedRetiree.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold uppercase text-white tracking-wide flex items-center gap-2">
                      {selectedRetiree.name}
                    </h3>
                    <p className="text-[11px] text-slate-350">{selectedRetiree.designation}</p>
                    <p className="text-[10px] text-slate-500 font-sans">
                      {selectedRetiree.department} • {selectedRetiree.unit}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedRetiree.certifications.slice(0, 3).map((cert, cidx) => (
                        <span key={cidx} className="bg-slate-950 text-slate-400 text-[8.5px] border border-slate-900 px-2 py-0.5 rounded-md font-sans">
                          ✓ {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Honor & Certification Highlight row */}
                <div className="border-t border-slate-900 mt-5 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block tracking-wider">{isEn ? 'Years of Duty' : 'कुल सेवा वर्ष'}</span>
                      <span className="text-sm font-bold text-amber-400 font-display">{selectedRetiree.experienceYears} Years</span>
                    </div>
                    <div className="w-px h-8 bg-slate-900"></div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block tracking-wider">{isEn ? 'Enterprise Rank' : 'संगठन श्रेणी'}</span>
                      <span className="text-sm font-bold text-blue-400">Noble Master Elite</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCertificateModal(selectedRetiree.id)}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-[10px] uppercase font-mono tracking-wider py-2 px-4 rounded-xl shadow-lg hover:shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-250 animate-pulse" />
                    <span>🏆 {isEn ? 'View Legacy Certificate' : 'क्रेडेंशियल प्रमाण पत्र देखें'}</span>
                  </button>
                </div>
              </div>

              {/* Wisdom Notes (Golden Scroll) section */}
              <div className="bg-[#0e1016] border border-slate-850 rounded-3xl p-6.5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
                      {isEn ? "The Veteran's Golden Wisdom Scroll" : "वरिष्ठ स्वर्ण सलाह सूची (विरासत Scroll)"}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    {activeNotes.length} {isEn ? 'GUIDES DIRECTED' : 'अधिग्रहण सूत्र'}
                  </span>
                </div>

                {/* Scroll display */}
                {activeNotes.length > 0 ? (
                  <div className="space-y-4.5 max-h-[220px] overflow-y-auto pr-1">
                    {activeNotes.map(note => (
                      <div 
                        key={note.id} 
                        className="bg-[#12141a]/60 border border-slate-850/60 p-4 rounded-2xl space-y-2 relative group hover:border-amber-500/15 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-550 border-b border-slate-900/40 pb-1.5">
                          <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded uppercase font-bold text-[8.5px]">
                            {note.category}
                          </span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 italic leading-relaxed pl-3.5 border-l-2 border-amber-500/40 font-serif">
                          "{note.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-slate-950/45 rounded-2xl border border-slate-900">
                    <span className="text-2xl block mb-2 opacity-50">✍️</span>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">
                      {isEn ? 'No Legacy Notes Penned' : 'कोई सलाह वर्तमान में उपस्थित नहीं है'}
                    </p>
                    <p className="text-[10px] text-slate-550 mt-1 max-w-sm mx-auto">
                      {isEn 
                        ? 'Be the first to pen some operational directives or general life advices for incoming apprentices.'
                        : 'नए शिक्षार्थियों के लिए पहले विशेष परिचालन निर्देश या सामान्य सलाह को यहाँ अंकित करें।'}
                    </p>
                  </div>
                )}

                {/* Add Wisdom Scroll Form (Only if Retiree matches active profile, or Supervisor writes, but open to everyone for premium feel) */}
                <form onSubmit={handleAddNote} className="space-y-3 pt-2 bg-[#090a0e] p-4.5 rounded-2xl border border-slate-900">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-450 font-mono">
                    {isEn ? '👉 Record New Wisdom Note for this Expert' : '👉 इस विशेषज्ञ के लिए नया क्रेडेंशियल मंत्र जोड़ें'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        required
                        value={newNoteText}
                        onChange={e => setNewNoteText(e.target.value)}
                        placeholder={isEn ? "e.g. Turn pressure valves anti-clockwise to unlock secondary backup lock" : "उदाहरण: वैकल्पिक बैकअप लॉक रिसाव को रोकने के लिए दबाव वाल्व बाईं ओर घुमाएं"}
                        className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <select
                        value={newNoteCategory}
                        onChange={e => setNewNoteCategory(e.target.value as any)}
                        className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-600"
                      >
                        <option value="Operational Wisdom">{isEn ? 'Operational Wisdom' : 'कार्यविधि सलाह'}</option>
                        <option value="Safety Rules">{isEn ? 'Critical Safety' : 'महत्वपूर्ण सुरक्षा'}</option>
                        <option value="General Life Advice">{isEn ? 'Life Guideline' : 'जीवन मार्गदर्शन'}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#12141a] hover:bg-[#1a1c24] text-amber-500 hover:text-amber-400 font-bold font-mono text-[9.5px] uppercase tracking-wider py-1.5 px-4 rounded-xl border border-amber-500/25 transition-all text-center flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{isEn ? 'Affix to Scroll' : 'विरासत स्क्रॉल में जोड़ें'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Apprentice Salute Board */}
              <div className="bg-[#0e1016] border border-slate-855 rounded-3xl p-6.5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
                      {isEn ? "The Generational Apprentice Salute Board" : "भावी भावी पीढ़ी सलामी (धन्यवाद अभिवादन बोर्ड)"}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-slate-550">
                    {activeSalutes.length} {isEn ? 'RESPECT SALUTES' : 'अभिवादन प्राप्त'}
                  </span>
                </div>

                {/* List of apprentice salutes */}
                {activeSalutes.length > 0 ? (
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {activeSalutes.map(salute => (
                      <div 
                        key={salute.id} 
                        className="bg-slate-950/50 border border-slate-900/60 p-4 rounded-2xl flex items-start gap-4 transition-all hover:bg-slate-950 hover:border-slate-850"
                      >
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs shrink-0 select-none">
                          {salute.authorName.split(' ').map(n => n[0]).join('')}
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap text-[10px] font-sans">
                            <div>
                              <span className="font-bold text-slate-200">{salute.authorName}</span>
                              <span className="text-slate-500 font-normal ml-2">({salute.authorDesignation})</span>
                            </div>
                            <span className="text-[9.5px] text-slate-600 font-mono">{salute.timestamp}</span>
                          </div>

                          <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans font-light">
                            {salute.message}
                          </p>

                          <div className="flex items-center gap-3 pt-2">
                            <button 
                              onClick={() => handleLikeSalute(salute.id)}
                              className="text-[9.5px] font-mono text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3 text-slate-600 hover:text-rose-500" />
                              <span>{isEn ? 'Honor' : 'अभिवादन करें'} ({salute.likes})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6">{isEn ? 'No salutes posted yet. Be the first to express and post gratitude!' : 'अभी तक कोई सलामी संदेश नहीं है। आभार व्यक्त करने वाले पहले व्यक्ति बनें!'}</p>
                )}

                {/* Write a Salute / Respect form */}
                <form onSubmit={handleAddSalute} className="space-y-3 pt-3 bg-[#0a0b10] p-4.5 rounded-2xl border border-slate-900 border-dashed">
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {isEn ? 'Post a Corporate Respect & Thank-You Card' : 'संस्थागत आभार व धन्यवाद सन्देश पोस्ट करें'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <input
                        type="text"
                        value={newSaluteAuthor}
                        onChange={e => setNewSaluteAuthor(e.target.value)}
                        placeholder={isEn ? "Your Name (Leave empty for default)" : "आपका नाम (वैकल्पिक)"}
                        className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-705 focus:outline-none focus:border-rose-600"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        required
                        value={newSaluteText}
                        onChange={e => setNewSaluteText(e.target.value)}
                        placeholder={isEn ? `Send high regards and warm farewell words to ${selectedRetiree.name}...` : `${selectedRetiree.name} को अपनी शुभकामनाएं व धन्यवाद भेजें...`}
                        className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-705 focus:outline-none focus:border-rose-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#10121a] hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 font-bold font-mono text-[9px] uppercase tracking-wider py-1.5 px-4.5 rounded-xl border border-rose-500/15 transition-all text-center flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isEn ? 'Dispatch Respect Card' : 'सम्मान पत्र भेजें'}</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            <div className="text-center p-12 bg-slate-950/30 rounded-3xl border border-slate-850 border-dashed flex flex-col items-center justify-center space-y-3">
              <Award className="w-12 h-12 text-slate-700 stroke-1" />
              <p className="text-sm font-semibold text-slate-400">{isEn ? 'Select a Senior Veteran Expert' : 'एक वरिष्ठ विशेषज्ञ का चयन करें'}</p>
              <p className="text-[11px] text-slate-550 max-w-sm">
                {isEn ? 'Select any veteran from the list to view their deep certified profile, download their legacy certificate, and read or add wisdom scrolls.' : 'उनके प्रमाणित विवरण, सम्मान पत्र और सलाह के इतिहास को देखने के लिए सूची से किसी भी सेवा-निवृत्त सदस्य को चुनें।'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* 🏆 ==================== BEAUTIFUL EXPANDED CERTIFICATE OF HONOR VIEW MODAL ==================== */}
      {showCertificateModal && (
        (() => {
          const vet = employees.find(e => e.id === showCertificateModal);
          if (!vet) return null;

          return (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-[#0b0c10] border-2 border-amber-500/40 rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden font-sans">
                
                {/* Vintage decorative border layout */}
                <div className="absolute inset-2 border border-amber-500/20 pointer-events-none rounded-2xl"></div>
                <div className="absolute inset-4 border border-dashed border-amber-500/10 pointer-events-none rounded-xl"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/[0.03] blur-2xl rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/[0.03] blur-2xl rounded-full"></div>

                {/* Close Button */}
                <button
                  onClick={() => setShowCertificateModal(null)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-950/80 border border-slate-850 p-1.5 rounded-full z-10 cursor-pointer"
                >
                  ✕
                </button>

                {/* Certificate Core Printable Frame */}
                <div className="space-y-8 text-center py-6 relative z-10 font-sans">
                  
                  {/* Seal representation */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center p-1.5 bg-gradient-to-tr from-amber-950/30 to-black relative">
                      <div className="w-full h-full rounded-full border border-dashed border-amber-500/40 flex items-center justify-center bg-black">
                        <Award className="w-8 h-8 text-amber-500 animate-pulse" />
                      </div>
                      {/* Certified Ring of text snippet */}
                      <span className="absolute -bottom-1 text-[8px] bg-amber-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                        30+ YRS
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-xl mx-auto">
                    <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest font-mono">
                      {isEn ? 'STEELEFORCE ENERGY & INDUSTRIAL CONGLOMERATE' : 'स्टीलफोर्स एनर्जी औद्योगिक संगठन'}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-serif text-slate-100 italic tracking-wide font-normal">
                      {isEn ? 'Certificate of Silent Stewardship & Legacy Honor' : 'महान विरंगना व सुरक्षा संरक्षक क्रेडेंशियल सम्मान पत्र'}
                    </h1>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans pt-1">
                      {isEn 
                        ? 'This official enterprise credential is high-verifiably conferred upon an individual of exceptional professional character in recognition of outstanding steel operations tenure, absolute safety compliance, and deep worker heritage transfer.'
                        : 'यह आधिकारिक उद्यम क्रेडेंशियल उत्कृष्ट स्टील संचालन कार्यकाल और गहन सुरक्षा मार्गदर्शन के सम्मान में विशिष्ट योगदानकर्ता को अत्यंत सम्मानपूर्वक प्रदान किया जाता है।'}
                    </p>
                  </div>

                  <div className="py-6 border-y border-amber-500/10 max-w-lg mx-auto space-y-1.5 bg-amber-500/[0.01] rounded-lg">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{isEn ? 'RECIPIENT RETIREE' : 'सम्मानित वरिष्ठ अधिकारी'}</p>
                    <p className="text-xl font-bold text-amber-400 tracking-wide uppercase font-serif">{vet.name}</p>
                    <p className="text-xs text-slate-300 font-sans uppercase tracking-wider">{vet.designation}</p>
                    <p className="text-[10.5px] text-slate-500">{vet.department} • {vet.unit}</p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <p className="text-xs text-slate-350 italic font-mono leading-relaxed bg-black/40 p-4 rounded-xl border border-slate-900">
                      🍀 "{isEn 
                          ? `With ${vet.experienceYears} consecutive years of steel plant safety service, this legend has completed absolute knowledge preservation parameters, resulting in certified, structured operational legacy assets.`
                          : `स्टील प्लांट में लगातार ${vet.experienceYears} वर्षों की सुरक्षा व तकनीकी सेवा के उत्कृष्ट निष्पादन के साथ, इस वरिष्ठ सितारे ने संस्थागत ज्ञान विरासत को पूरी तरह सहेज कर अगली सक्षम पीढ़ी को सुपुर्द कर दिया है।`}"
                    </p>
                  </div>

                  {/* High Quality signature seals */}
                  <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-6 text-center text-[10px] font-mono">
                    <div className="space-y-1.5 border-t border-slate-850 pt-2.5">
                      <p className="text-[#a16207] italic select-none font-serif text-xs">Raghavan. S</p>
                      <p className="text-slate-550 uppercase tracking-widest font-sans font-bold text-[8.5px]">{isEn ? 'Strategic Director' : 'रणनीतिक निदेशक'}</p>
                      <p className="text-[8.5px] text-slate-650 font-mono">ID: SF-DIR-101</p>
                    </div>
                    <div className="space-y-1.5 border-t border-slate-850 pt-2.5">
                      <p className="text-emerald-500 font-bold select-none text-[10px] bg-emerald-500/5 py-0.5 max-w-[120px] mx-auto rounded border border-emerald-500/10">
                        ✓ SECURED LEGACY
                      </p>
                      <p className="text-slate-555 uppercase tracking-widest font-sans font-bold text-[8.5px]">{isEn ? 'GOVERNANCE AUDITOR' : 'प्रशासनिक संकलनकर्ता'}</p>
                      <p className="text-[8.5px] text-slate-650 font-mono">VERIFIED REF ID: {vet.employeeId}</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      onClick={() => {
                        alert(isEn ? 'Certificate layout initiated for physical steel-registry print. Successfully queued!' : 'भौतिक प्रिंटर के लिए व्यवस्था सफतलतापूर्वक सुनिश्चित की जा चुकी है!');
                      }}
                      className="bg-[#12141a] hover:bg-[#181a22] text-amber-500 hover:text-amber-400 font-bold font-mono text-[10px] uppercase tracking-wider py-2 px-5 rounded-xl border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Generate Printable PDF' : 'प्रिंट करने योग्य क्रेडेंशियल डाउनलोड करें'}</span>
                    </button>
                    <button
                      onClick={() => setShowCertificateModal(null)}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white font-bold font-mono text-[10px] uppercase py-2 px-4 rounded-xl border border-slate-800 transition-all cursor-pointer"
                    >
                      {isEn ? 'Close Details' : 'विवरण बंद करें'}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })()
      )}

    </div>
  );
}
