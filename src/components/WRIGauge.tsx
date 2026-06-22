/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';

interface WRIGaugeProps {
  score: number;
  label?: string;
  competencyReadiness?: number;
  assessmentPerformance?: number;
  learningEffectiveness?: number;
  knowledgeContribution?: number;
  engagement?: number;
  lang?: 'en' | 'hi';
}

export default function WRIGauge({
  score,
  label = "Workforce Readiness Index",
  competencyReadiness = 78,
  assessmentPerformance = 82,
  learningEffectiveness = 74,
  knowledgeContribution = 80,
  engagement = 85,
  lang = 'en'
}: WRIGaugeProps) {
  const [showFormula, setShowFormula] = useState(false);

  // Determine readiness category
  const getReadinessLevel = (val: number) => {
    if (val < 40) return { name: lang === 'en' ? 'Critical' : 'क्रांतिक', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    if (val < 60) return { name: lang === 'en' ? 'Developing' : 'विकासशील', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    if (val < 75) return { name: lang === 'en' ? 'Ready' : 'तैयार', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (val < 90) return { name: lang === 'en' ? 'Advanced' : 'उन्नत', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    return { name: lang === 'en' ? 'Future Ready' : 'भविष्य के लिए तैयार', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-200/20' };
  };

  const level = getReadinessLevel(score);

  // Map score (0 - 100) to gauge rotation degree (0 to 180) pointing from left to right
  const angle = (score / 100) * 180;

  return (
    <div className="bg-[#0e1015] border border-slate-800 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-slate-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans mb-1">{label}</h3>
          <p className="text-3xl font-light text-white font-display">{score.toFixed(1)}%</p>
        </div>
        <div className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${level.bg} ${level.color} ${level.border}`}>
          {level.name}
        </div>
      </div>

      {/* Modern SVG Gauge */}
      <div className="relative h-28 flex items-end justify-center mt-2">
        <svg viewBox="0 0 100 50" className="w-full max-w-[200px] overflow-visible">
          {/* Background Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#161b25"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Active Process Value Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gauge-gradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="125"
            strokeDashoffset={125 - (125 * score) / 100}
          />
          
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Needle path with smooth transition */}
          <g 
            transform={`rotate(${angle} 50 50)`} 
            style={{ transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            className="origin-[50px_50px]"
          >
            {/* Soft backdrop shadow of the needle to give 3D depth */}
            <polygon
              points="48,48.5 15,50 48,51.5"
              fill="rgba(0, 0, 0, 0.6)"
              transform="translate(1, 1)"
            />
            {/* Elegant tapered needle body in high-contrast neon flame red */}
            <polygon
              points="48,48 14,50 48,52"
              fill="#ef4444"
            />
            {/* Ultra-sharp pointer tip highlight */}
            <polygon
              points="24,49.2 14,50 24,50.8"
              fill="#f97316"
            />
            {/* Shiny 3D silver/white center ridge line */}
            <line
              x1="47"
              y1="50"
              x2="18"
              y2="50"
              stroke="#ffffff"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>

          {/* Precision hub stack */}
          <circle cx="50" cy="50" r="5" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <circle cx="50" cy="50" r="3.2" fill="#ef4444" />
          <circle cx="50" cy="50" r="1.2" fill="#ffffff" />
        </svg>

        {/* Labels below Arc */}
        <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 text-[9px] font-mono text-slate-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs">
        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          {lang === 'en' ? 'Calculated Live' : 'लाइव परिकलित'}
        </span>
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
          title="Show calculation methodology"
        >
          <Info className="w-3.5 h-3.5" />
          {lang === 'en' ? 'Breakdown Formula' : 'गणना सूत्र व्याख्या'}
        </button>
      </div>

      {showFormula && (
        <div className="absolute inset-0 bg-[#0c0d12]/98 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between z-10 animate-fade-in">
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                {lang === 'en' ? 'Formula & Logic Weightage' : 'WRI गणना सूत्र एवं वेटेज'}
              </h4>
              <button
                onClick={() => setShowFormula(false)}
                className="text-slate-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-slate-400 capitalize italic leading-relaxed">
              {lang === 'en' 
                ? 'WRI = (35% Comp Readiness) + (25% Assessments) + (20% Learning effectiveness) + (10% Knowledge assets) + (10% Engagement)'
                : 'WRI = (35% क्रेडेंशियल्स) + (25% आकलन) + (20% शिक्षण प्रभावशीलता) + (10% ज्ञान संपत्ति) + (10% जुड़ाव)'
              }
            </p>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">📊 Competency Gaps (35%)</span>
                <span className="text-white font-mono">{competencyReadiness.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">📝 Assessment Scoring (25%)</span>
                <span className="text-white font-mono">{assessmentPerformance.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">⚡ Learning Path Index (20%)</span>
                <span className="text-white font-mono">{learningEffectiveness.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">📚 Knowledge Assets Log (10%)</span>
                <span className="text-white font-mono">{knowledgeContribution.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">🔌 Active Engagement (10%)</span>
                <span className="text-white font-mono">{engagement.toFixed(0)}%</span>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-500 leading-normal border-t border-slate-800/60 pt-2 font-mono">
            *All weights drive the organizational readiness heatmap hierarchy instantly from live employee logs.
          </p>
        </div>
      )}
    </div>
  );
}
