/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Competency, Question, AssessmentAttempt } from '../types';
import { BASELINE_QUESTION_BANK, INITIAL_COMPETENCIES, TRANSLATIONS } from '../data';
import { Check, ArrowRight, Shield, Award, BookOpen, AlertCircle, ChevronRight, CheckCircle, LogIn, UserPlus } from 'lucide-react';

interface OnboardingFlowProps {
  onCompleted: (user: User, attempt: AssessmentAttempt) => void;
  lang: 'en' | 'hi';
  employees: User[];
  onLogin: (user: User) => void;
}

export default function OnboardingFlow({ onCompleted, lang, employees, onLogin }: OnboardingFlowProps) {
  const t = TRANSLATIONS[lang];
  
  // Registration and Authentication State
  const [authState, setAuthState] = useState<'register' | 'login'>('register');
  const [isRegistered, setIsRegistered] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    password: '',
    role: 'Employee' as const
  });
  
  const [loginForm, setLoginForm] = useState({
    employeeId: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  
  // Onboarding Steps
  const [step, setStep] = useState(1); // 1 = Organization Details, 2 = Professional Details, 3 = Competency Init, 4 = Baseline Assessment
  const [onboardForm, setOnboardForm] = useState({
    companyName: 'SteelForce Industries (Generic)',
    unit: 'Blast Furnace III Site',
    department: 'Blast Furnace Ops',
    designation: 'Maintenance Technician',
    roleType: 'Maintenance Technician', // prefilled
    customRoleType: '',
    experienceYears: 5,
    education: 'B.Tech / Poly Diploma in Metallurgy',
    certifications: 'LOTO Safety, Hazard Zone Fire Response',
    isRetiringNext12Months: false
  });

  // Assessment State
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [attemptError, setAttemptError] = useState('');

  // Role selections mapping seeds
  const availableCompanies = [
    "SteelForce Industries (Generic)", 
    "Tata Steel - Jamshedpur East", 
    "Tata Steel - Jamshedpur West", 
    "Tata Steel - Kalinganagar", 
    "Jindal Steel & Power", 
    "JSW Steel", 
    "SAIL", 
    "Others (Manual Entry)"
  ];
  const availableUnits = ["Jamshedpur Coke Plant", "Kalinganagar Hot Mill", "Angul Sinter Unit", "Bhilai Section Rail", "Others (Manual Entry)"];
  const availableDepts = ["Blast Furnace Ops", "Maintenance & Reliability", "Safety & Compliance", "Digital & Telemetry", "Others (Manual Entry)"];
  const availableRoles = [
    "Maintenance Technician", 
    "Control Room Supervisor", 
    "Boiler Boiler Senior Inspector", 
    "Sinter Plant Specialist", 
    "Quality Assurance Analyst",
    "Others (Manual Entry)"
  ];

  const handleRegisterInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.employeeId || !regForm.password) {
      alert(lang === 'en' ? 'Please fill in all identity registration details.' : 'कृपया सभी क्रेडेंशियल्स भरें।');
      return;
    }
    setIsRegistered(true);
  };

  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.employeeId) {
      setLoginError(lang === 'en' ? 'Employee ID is required.' : 'कर्मचारी आईडी आवश्यक है।');
      return;
    }
    
    // Find matching employee by ID
    const foundUser = employees.find(
      emp => emp.employeeId.trim().toLowerCase() === loginForm.employeeId.trim().toLowerCase()
    );
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setLoginError(lang === 'en' 
        ? 'Employee ID not found. Register first or use a valid seed expert ID.' 
        : 'कर्मचारी आईडी नहीं मिली। पहले पंजीकरण करें या मान्य बीज विशेषज्ञ आईडी दर्ज करें।'
      );
    }
  };

  const handleOnboardInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOnboardForm({ ...onboardForm, [e.target.name]: e.target.value });
  };

  const handleOnboardBooleanInput = (retiring: boolean) => {
    setOnboardForm({ ...onboardForm, isRetiringNext12Months: retiring });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!onboardForm.companyName || !onboardForm.unit || !onboardForm.department || !onboardForm.designation) {
        alert(lang === 'en' ? 'Please input all plant structure locations.' : 'कृपया सभी परिचालन स्थान दर्ज करें।');
        return;
      }
    }
    if (step === 2) {
      if (onboardForm.experienceYears <= 0) {
        alert(lang === 'en' ? 'Please supply realistic professional experience.' : 'कृपया उपयुक्त कार्य अनुभव दर्ज करें।');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    setAnswers({ ...answers, [qId]: optIdx });
    setAttemptError('');
    // Advance to next questions automatically for UX slickness
    if (activeQuestionIdx < BASELINE_QUESTION_BANK.length - 1) {
      setTimeout(() => {
        setActiveQuestionIdx(prev => prev + 1);
      }, 250);
    }
  };

  const handleSubmitAllAnswers = () => {
    if (Object.keys(answers).length < BASELINE_QUESTION_BANK.length) {
      setAttemptError(`${t.mustAtLeast} ${BASELINE_QUESTION_BANK.length - Object.keys(answers).length}`);
      return;
    }

    // Grade baseline results
    let correctCount = 0;
    const answeredQs = BASELINE_QUESTION_BANK.map(q => {
      const selected = answers[q.id] ?? 0;
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect
      };
    });

    const finalPercent = (correctCount / BASELINE_QUESTION_BANK.length) * 100;

    // Calculate category-specific scores
    const categoriesList = ['technical', 'soft skill', 'digital literacy', 'scenario based', 'leadership'];
    const catScores: Record<string, number> = {};
    
    categoriesList.forEach(cat => {
      const catQs = BASELINE_QUESTION_BANK.filter(q => q.category === cat);
      const catCorrect = catQs.filter(q => answers[q.id] === q.correctAnswerIndex).length;
      catScores[cat] = catQs.length > 0 ? (catCorrect / catQs.length) * 100 : 80;
    });

    // Create user object
    const createdUser: User = {
      id: 'USR-' + regForm.employeeId,
      name: regForm.name,
      email: regForm.email,
      employeeId: regForm.employeeId,
      language: lang,
      role: regForm.role,
      registrationStatus: 'active',
      
      companyName: onboardForm.companyName === 'Others (Manual Entry)' ? onboardForm.customRoleType || 'Custom Plant Co' : onboardForm.companyName,
      unit: onboardForm.unit === 'Others (Manual Entry)' ? onboardForm.customRoleType || 'Unit B' : onboardForm.unit,
      department: onboardForm.department === 'Others (Manual Entry)' ? onboardForm.customRoleType || 'Core Dept' : onboardForm.department,
      designation: onboardForm.designation === 'Others (Manual Entry)' ? onboardForm.customRoleType || 'Custom Dev' : onboardForm.designation,
      roleType: onboardForm.roleType,
      customRoleType: onboardForm.customRoleType,
      
      experienceYears: Number(onboardForm.experienceYears),
      education: onboardForm.education,
      certifications: onboardForm.certifications.split(',').map(s => s.trim()).filter(Boolean),
      
      isRetiringNext12Months: onboardForm.isRetiringNext12Months,
      hasTakenBaselineAssessment: true,
      contributionsCount: onboardForm.isRetiringNext12Months ? 0 : 2, // Retiring starts with 0 mock contributions to let them seed
      engagementScore: 75
    };

    // Create attempt
    const attempt: AssessmentAttempt = {
      id: 'ATT-' + Date.now(),
      userId: createdUser.id,
      title: 'Baseline Assessment',
      category: 'Baseline',
      score: finalPercent,
      categoryScores: catScores,
      timeSpentSec: 320,
      completedAt: new Date().toISOString(),
      answeredQuestions: answeredQs
    };

    onCompleted(createdUser, attempt);
  };

  // Pre-login state if they haven't submitted register form
  if (!isRegistered) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-radial from-[#0d0f18] to-[#040508]">
        <div className="w-full max-w-md bg-[#0c0d12] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-3 mb-6">
            {/* Logo */}
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-xl overflow-hidden shadow-lg border border-blue-400/30">
              <svg 
                viewBox="0 0 24 24" 
                className="w-5.5 h-5.5 text-white relative z-10"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" strokeDasharray="3 3"/>
                <path d="M12 2v20M2 12h20M12 8l-4 4 4 4 4-4-4-4z" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white font-display">SARATHI AI</h2>
              <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Workforce Intelligence</p>
            </div>
          </div>

          {/* Authentication State Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#10121a] border border-slate-800/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setAuthState('register'); setLoginError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                authState === 'register'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Register' : 'पंजीकरण करें'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthState('login'); setLoginError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                authState === 'login'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Login' : 'लॉग इन करें'}</span>
            </button>
          </div>

          {authState === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-slate-100">{t.createAccount}</h3>
                <p className="text-[10.5px] text-slate-500 mt-0.5">{t.authSubtitle}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.namePlaceholder}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={regForm.name}
                  onChange={handleRegisterInput}
                  placeholder="e.g. Mukesh Sen"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.empIdPlaceholder}</label>
                <input
                  type="text"
                  name="employeeId"
                  required
                  value={regForm.employeeId}
                  onChange={handleRegisterInput}
                  placeholder="e.g. SF-SMS-3019"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.emailPlaceholder}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={regForm.email}
                  onChange={handleRegisterInput}
                  placeholder="mukesh.sen@industrial-plant.com"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.passPlaceholder}</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={regForm.password}
                  onChange={handleRegisterInput}
                  placeholder="••••••••"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.switchRole}</label>
                <select
                  name="role"
                  value={regForm.role}
                  onChange={handleRegisterInput}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  <option value="Employee">Employee (संयंत्र कर्मचारी)</option>
                  <option value="Manager">Manager (परिचालन प्रबंधक)</option>
                  <option value="Leadership">Leadership / Admin (रणनीतिक नेतृत्व)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl tracking-wider uppercase transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>{t.registerBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  {lang === 'en' ? 'Welcome Back' : 'वापसी पर स्वागत है'}
                </h3>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  {lang === 'en' ? 'Sign in using your registered Employee ID.' : 'अपनी पंजीकृत कर्मचारी आईडी से लॉग इन करें।'}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {lang === 'en' ? 'Employee ID' : 'कर्मचारी आईडी'}
                </label>
                <input
                  type="text"
                  name="employeeId"
                  required
                  value={loginForm.employeeId}
                  onChange={handleLoginInput}
                  placeholder="e.g. STEEL-BF-109 or custom ID"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {lang === 'en' ? 'Password' : 'पासवर्ड'}
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={loginForm.password}
                  onChange={handleLoginInput}
                  placeholder="••••••••"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
                />
              </div>

              {loginError && (
                <p className="text-[10px] text-red-400 font-semi bg-red-500/5 border border-red-500/10 px-3 py-2 rounded-lg leading-normal">
                  ⚠️ {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl tracking-wider uppercase transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Sign In' : 'लॉग इन करें'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Usability helper for quick seed experts login */}
              <div className="pt-4 border-t border-slate-900/80">
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-2.5">
                  📁 {lang === 'en' ? 'Autofill Seed Registered Profiles' : 'पंजीकृत प्रोफाइल स्वतः भरें'}:
                </p>
                <div className="space-y-1.5">
                  {employees.slice(0, 3).map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => {
                        setLoginForm({
                          employeeId: emp.employeeId,
                          password: 'password123'
                        });
                        setLoginError('');
                      }}
                      className="w-full flex items-center justify-between text-left p-2.5 rounded-lg bg-[#0e1017] hover:bg-[#141622] border border-slate-850 hover:border-blue-500/20 text-[10px] text-slate-400 transition-all group shrink-0"
                    >
                      <span className="font-medium group-hover:text-blue-400 transition-colors">
                        👤 {emp.name} ({lang === 'en' ? emp.role : (emp.role === 'Manager' ? 'प्रबंधक' : 'कर्मचारी')})
                      </span>
                      <span className="font-mono text-[9px] bg-slate-950 text-slate-500 group-hover:text-blue-400 px-1.5 py-0.5 rounded border border-slate-900">
                        {emp.employeeId}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono uppercase">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Industrial Compliance Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding sequence
  return (
    <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto justify-center bg-radial from-[#0a0d15] to-[#040508]">
      {/* Step Progression Bar */}
      <div className="mb-6 flex justify-between items-center bg-[#0c0d12] border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white font-display ">{t.onboardingTitle}</h2>
            <p className="text-[10px] text-slate-400">{t.onboardingSub}</p>
          </div>
        </div>
        
        {/* Step dots */}
        <div className="flex gap-1.5 items-center">
          {[1, 2, 3, 4].map(sIdx => (
            <React.Fragment key={sIdx}>
              <div
                className={`w-7 h-7 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold border transition-all ${
                  step === sIdx
                    ? 'bg-blue-600 border-blue-400 text-white scale-110'
                    : step > sIdx
                    ? 'bg-emerald-600/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-[#10121a] border-slate-800 text-slate-500'
                }`}
              >
                {step > sIdx ? '✓' : `0${sIdx}`}
              </div>
              {sIdx < 4 && <div className={`w-4 h-px border-t ${step > sIdx ? 'border-emerald-500/40' : 'border-slate-800'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="bg-[#0c0d12] border border-slate-800 rounded-3xl p-6 shadow-xl min-h-[420px] flex flex-col justify-between">
        
        {/* STEP 1: plant organisation info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-slate-800/60 pb-2">
              {t.step1}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.companyLabel}</label>
                <select
                  name="companyName"
                  value={onboardForm.companyName}
                  onChange={handleOnboardInput}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  {availableCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.unitLabel}</label>
                <select
                  name="unit"
                  value={onboardForm.unit}
                  onChange={handleOnboardInput}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.deptLabel}</label>
                <select
                  name="department"
                  value={onboardForm.department}
                  onChange={handleOnboardInput}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  {availableDepts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.roleLabel}</label>
                <select
                  name="designation"
                  value={onboardForm.designation}
                  onChange={handleOnboardInput}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* If any field is "Others (Manual Entry)" show manual text field */}
            {(onboardForm.companyName === 'Others (Manual Entry)' || 
              onboardForm.unit === 'Others (Manual Entry)' || 
              onboardForm.department === 'Others (Manual Entry)' ||
              onboardForm.designation === 'Others (Manual Entry)') && (
              <div className="pt-2 animate-pulse">
                <label className="block text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">
                  ⚠️ {t.othersSpecify}
                </label>
                <input
                  type="text"
                  name="customRoleType"
                  required
                  value={onboardForm.customRoleType}
                  onChange={handleOnboardInput}
                  placeholder="e.g. Sinter Purge Supervisor / Jindal Metallurgy"
                  className="w-full bg-[#10121a] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 2: professional credentials & retiring indicator */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-slate-800/60 pb-2">
              {t.step2}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.expLabel}</label>
                <input
                  type="number"
                  name="experienceYears"
                  min="1"
                  max="45"
                  value={onboardForm.experienceYears}
                  onChange={handleOnboardInput}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.eduLabel}</label>
                <input
                  type="text"
                  name="education"
                  value={onboardForm.education}
                  onChange={handleOnboardInput}
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t.certLabel}</label>
                <input
                  type="text"
                  name="certifications"
                  value={onboardForm.certifications}
                  onChange={handleOnboardInput}
                  placeholder="e.g. ISO 9001 Metallurgy Compliance, OSHA Plant Hazard L4, SCADA System Operator"
                  className="w-full bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Retiring question logic: secure knowledge retention loop */}
            <div className="bg-[#1b1510] border border-amber-600/20 p-4 rounded-2xl space-y-2 mt-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">{t.retiringQuestion}</h4>
                  <p className="text-[10px] text-amber-200/80 leading-normal mt-0.5">{t.retiringIntro}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleOnboardBooleanInput(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all uppercase ${
                    onboardForm.isRetiringNext12Months
                      ? 'bg-amber-600 border-amber-400 text-white'
                      : 'bg-[#10121a] border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.yesLabel} (+ {lang === 'en' ? 'Preservation Protocol' : 'संरक्षण नियम'})
                </button>
                <button
                  type="button"
                  onClick={() => handleOnboardBooleanInput(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all uppercase ${
                    !onboardForm.isRetiringNext12Months
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-[#10121a] border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.noLabel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Automated competency target mapping */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-slate-800/60 pb-2">
              {t.step3}
            </h3>

            <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-500/20 space-s-2 mb-2">
              <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Award className="w-4 h-4 shrink-0 text-blue-400" />
                {t.compInitTitle}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed capitalize">
                {t.compInitSub} • <span className="text-amber-500">{t.cannotAssign}</span>
              </p>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
              {INITIAL_COMPETENCIES.map(comp => (
                <div key={comp.id} className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-blue-400 font-mono">
                      {comp.category}
                    </span>
                    <h5 className="text-xs font-bold text-white mt-1">{comp.name}</h5>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{comp.description}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] text-slate-500 font-mono uppercase">{t.targetLevel}</span>
                    <span className="text-sm font-black text-white font-mono bg-blue-600/10 px-2 py-0.5 rounded border border-blue-500/20">
                      L{comp.targetLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: baseline assessment dashboard unlock */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <h3 className="text-white text-xs font-bold uppercase tracking-widest text-blue-400">
                  {t.step4}
                </h3>
                <span className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded text-blue-400 font-mono uppercase">
                  Pillar Group Evaluation
                </span>
              </div>

              <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10 text-xs text-slate-400 flex gap-2.5 mt-2 mb-3.5">
                <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-normal">
                  <span className="text-red-400 font-bold uppercase">{lang === 'en' ? 'Compulsory' : 'अनिवार्य'}:</span> {t.compulsoryIntro}
                </p>
              </div>

              {/* Multi-step question solver widget */}
              <div className="bg-[#10121a] border border-slate-800/80 rounded-2xl p-4 relative">
                {/* Progress bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-slate-850 rounded-t-2xl overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((Object.keys(answers).length) / BASELINE_QUESTION_BANK.length) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-1 mb-2 uppercase">
                  <span>
                    {t.categoryLabel}: <b className="text-blue-400">{BASELINE_QUESTION_BANK[activeQuestionIdx].category}</b>
                  </span>
                  <span>
                    Question {activeQuestionIdx + 1} of {BASELINE_QUESTION_BANK.length}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-white leading-relaxed mb-4 min-h-[36px]">
                  {BASELINE_QUESTION_BANK[activeQuestionIdx].questionText}
                </h4>

                <div className="space-y-2">
                  {BASELINE_QUESTION_BANK[activeQuestionIdx].options.map((option, oIdx) => {
                    const isSelected = answers[BASELINE_QUESTION_BANK[activeQuestionIdx].id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(BASELINE_QUESTION_BANK[activeQuestionIdx].id, oIdx)}
                        className={`w-full text-left p-3 text-xs rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-medium'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">SELECTED</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Back / Next micro links */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-850">
                  <button
                    type="button"
                    disabled={activeQuestionIdx === 0}
                    onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed uppercase"
                  >
                    ← Previous Q
                  </button>

                  <div className="flex gap-1.5">
                    {BASELINE_QUESTION_BANK.map((_, qIndex) => {
                      const isAnswered = answers[BASELINE_QUESTION_BANK[qIndex].id] !== undefined;
                      const isActive = qIndex === activeQuestionIdx;
                      return (
                        <button
                          key={qIndex}
                          type="button"
                          onClick={() => setActiveQuestionIdx(qIndex)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            isActive
                              ? 'bg-blue-500 scale-125'
                              : isAnswered
                              ? 'bg-emerald-500/60'
                              : 'bg-slate-800'
                          }`}
                          title={`Go to Question ${qIndex + 1}`}
                        />
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={activeQuestionIdx === BASELINE_QUESTION_BANK.length - 1}
                    onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed uppercase"
                  >
                    Next Q →
                  </button>
                </div>
              </div>
            </div>

            {attemptError && (
              <p className="text-[10px] text-red-400 font-bold bg-red-500/5 border border-red-500/15 p-2 rounded-xl text-center">
                {attemptError}
              </p>
            )}

            <div className="pt-2 text-right">
              {Object.keys(answers).length === BASELINE_QUESTION_BANK.length ? (
                <button
                  type="button"
                  onClick={handleSubmitAllAnswers}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl tracking-wider uppercase transition-colors shadow-lg shadow-emerald-950/20 inline-flex items-center gap-2"
                >
                  <span>{t.submitAssessment}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-100" />
                </button>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono uppercase bg-[#10121a] border border-slate-800 px-3 py-1.5 rounded-xl">
                  {lang === 'en' ? 'Solve remaining questions to unlock primary screen' : 'प्राथमिक स्क्रीन अनलॉक करने के लिए शेष प्रश्न हल करें'}: {BASELINE_QUESTION_BANK.length - Object.keys(answers).length} / 25
                </span>
              )}
            </div>
          </div>
        )}

        {/* Navigation Section */}
        {step < 4 && (
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex justify-between items-center bg-[#0c0d12]">
            <button
              onClick={handlePrevStep}
              className={`text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              ← {t.prevBtn}
            </button>
            <button
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl tracking-wider uppercase transition-colors shadow-lg flex items-center gap-1.5"
            >
              <span>{t.nextBtn}</span>
              <ChevronRight className="w-4 h-4 text-blue-200" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
