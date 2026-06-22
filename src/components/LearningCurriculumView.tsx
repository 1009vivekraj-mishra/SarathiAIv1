/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LearningResource, Competency } from '../types';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface LearningCurriculumViewProps {
  learningResources: LearningResource[];
  learningPaths: Record<string, Record<string, 'Not Started' | 'In Progress' | 'Completed'>>;
  currentUserId: string;
  competencies: Competency[];
  onMicroAssessmentTrigger: (competencyId: string) => void;
  lang?: 'en' | 'hi';
}

export default function LearningCurriculumView({
  learningResources,
  learningPaths,
  currentUserId,
  competencies,
  onMicroAssessmentTrigger,
  lang = 'en'
}: LearningCurriculumViewProps) {
  const isEn = lang === 'en';
  
  return (
    <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-850/80">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white tracking-tight font-display">
            {isEn ? 'Continuous Study Curriculum' : 'सतत अध्ययन पाठ्यक्रम'}
          </h3>
        </div>
        <span className="text-[9.5px] bg-[#111827] border border-slate-800 px-2 py-0.5 rounded text-emerald-400 uppercase tracking-widest font-mono font-bold">
          {isEn ? 'Active Curriculum' : 'सक्रिय पाठ्यक्रम'}
        </span>
      </div>

      <div className="space-y-4">
        {learningResources.map(res => {
          const userStatus = (learningPaths[currentUserId] || {})[res.id] || 'Not Started';
          const relatedComp = competencies.find(c => c.id === res.competencyId);
          
          return (
            <div key={res.id} className="bg-[#10121a]/80 border border-slate-850 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 transition-all hover:border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[8px] uppercase tracking-widest bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
                    {res.type}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono font-medium">
                    ⏱️ {res.durationMin} Mins
                  </span>
                  {relatedComp && (
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                      {isEn ? 'Mapped skill:' : 'संबद्ध कौशल:'} {relatedComp.name}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white mt-1.5">{res.title}</h4>
              </div>

              <div className="flex items-center gap-3">
                {userStatus === 'Completed' ? (
                  <span className="text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10 font-bold text-[10px] uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isEn ? 'Completed' : 'पूर्ण'}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 bg-amber-500/5 px-2.5 py-1.5 rounded-xl border border-amber-500/10 font-bold text-[10px] uppercase">
                      {isEn ? 'In Study Frame' : 'अध्ययनरत'}
                    </span>
                    {relatedComp && (
                      <button
                        type="button"
                        onClick={() => onMicroAssessmentTrigger(relatedComp.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-xl uppercase tracking-wider transition-all"
                      >
                        {isEn ? 'Take Re-Assessment' : 'पुनः मूल्यांकन लें'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
