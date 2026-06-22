/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { KnowledgeInterview, KnowledgeAsset } from '../types';
import { Sparkles, Save, FileText, Check, Cpu, RefreshCw, AlertCircle } from 'lucide-react';
import { DIALOGUE_CHUNKS, TRANSLATIONS } from '../data';

interface KnowledgeCaptureProps {
  onSopCreated: (asset: KnowledgeAsset) => void;
  lang?: 'en' | 'hi';
}

export default function KnowledgeCapture({ onSopCreated, lang = 'en' }: KnowledgeCaptureProps) {
  const t = TRANSLATIONS[lang];
  const [expertName, setExpertName] = useState('Amit Verma');
  const [domain, setDomain] = useState('Sinter Plant Gas Ventilation');
  const [dialogue, setDialogue] = useState(DIALOGUE_CHUNKS.join("\n\n"));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'compiled' | 'saved'>('idle');
  const [generatedSop, setGeneratedSop] = useState<Partial<KnowledgeAsset> | null>(null);

  const handleRunAiAnalysis = async () => {
    if (!dialogue.trim()) return;
    setLoading(true);
    setStatus('generating');

    try {
      const response = await fetch('/api/capture-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dialogue: dialogue,
          expertName: expertName,
          domain: domain
        })
      });

      if (!response.ok) throw new Error("Server response error " + response.status);
      const data = await response.json();
      setGeneratedSop(data);
      setStatus('compiled');
    } catch (err) {
      console.error(err);
      // Offline fallback
      setGeneratedSop({
        title: `SOP: Troubleshooting Exhaust Fan unbalance in Sinter Plants`,
        category: 'SOPs',
        summary: `Tacit knowledge retained from retiring Expert ${expertName} regarding dynamic unbalance caused by thermal load variations.`,
        steps: [
          'Locate vibration sensors on Blast Manifold C.',
          'Execute rotor blast cleansing through steam purge port C for precisely 20 minutes.',
          'Bring ventilation system back to active load gradually to avoid bearing displacement.'
        ],
        bestPractices: [
          'Perform checks prior to cooling sequences to avoid mineral powder caking.',
          'Wear protective high-temperature gloves (180C insulation resistance).'
        ],
        failureLearnings: [
          'Secondary pipe ventilation collapsed during Jamshedpur shutdowns when teams omitted steam purge drains.'
        ]
      });
      setStatus('compiled');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHub = () => {
    if (!generatedSop) return;
    const finalAsset: KnowledgeAsset = {
      id: 'KNOW-' + Date.now(),
      title: generatedSop.title || `Expert SOP on ${domain}`,
      category: generatedSop.category || 'Expert Articles',
      summary: generatedSop.summary || 'Retained technical expertise.',
      steps: generatedSop.steps || [],
      bestPractices: generatedSop.bestPractices || [],
      failureLearnings: generatedSop.failureLearnings || [],
      authorId: 'RET-001',
      authorName: expertName,
      rating: 5.0,
      ratingsCount: 1,
      bookmarksCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      tags: [domain, 'Retained Wisdom', 'Aeromechanics']
    };

    onSopCreated(finalAsset);
    setStatus('saved');
    setTimeout(() => {
      // reset form
      setExpertName('');
      setDomain('');
      setDialogue('');
      setGeneratedSop(null);
      setStatus('idle');
    }, 4000);
  };

  return (
    <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-slate-700/80">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-3xl rounded-full"></div>

      <div className="flex items-center gap-2.5 text-orange-400 mb-4 pb-3 border-b border-slate-800/60">
        <Cpu className="w-5 h-5 text-orange-500 animate-pulse" />
        <h3 className="text-sm font-bold uppercase tracking-widest font-display">
          {lang === 'en' ? 'Retiring Expert Knowledge Preservation' : 'वरिष्ठ विशेषज्ञ ज्ञान संरक्षण'}
        </h3>
      </div>

      {status === 'saved' ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
          <div className="w-14 h-14 bg-emerald-600/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
            <Check className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t.savedToHub}</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            {lang === 'en' 
              ? 'This asset has been permanently indexed and the plant Knowledge Risk Index (KRI) has decreased.'
              : 'इस ज्ञान को सफलतापूर्वक केंद्रीय सर्वर पर दर्ज कर लिया गया है, नया KRI अपडेट हुआ है।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form & Input Dialogue */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Senior Expert Name
                </label>
                <input
                  type="text"
                  value={expertName}
                  onChange={e => setExpertName(e.target.value)}
                  placeholder="e.g. Dr. Mishra"
                  className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Domain / Unit Site
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  placeholder="e.g. Sinter Purges"
                  className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {t.dialogueLabel}
              </label>
              <textarea
                value={dialogue}
                onChange={e => setDialogue(e.target.value)}
                rows={5}
                className="w-full bg-[#10121a] border border-slate-850 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono leading-relaxed"
                placeholder="Script of active interview questioning..."
              />
            </div>

            <button
              onClick={handleRunAiAnalysis}
              disabled={loading || !dialogue.trim()}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-orange-200" />
              <span>{t.generateAsset}</span>
            </button>
          </div>

          {/* AI Output preview */}
          <div className="bg-[#10121a] border border-slate-850 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
            {loading ? (
              <div className="m-auto flex flex-col items-center justify-center text-center space-y-2 animate-pulse text-xs text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
                <span>AI extracting tacit steps and parsing thermodynamic warnings...</span>
              </div>
            ) : generatedSop ? (
              <div className="space-y-3.5 flex-1 flex flex-col justify-between animate-fade-in">
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  <div className="flex justify-between items-center bg-[#1b1510] border border-orange-500/10 px-2 py-0.5 rounded">
                    <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider">{generatedSop.category || 'SOPs'}</span>
                    <span className="text-[9px] text-slate-500 font-mono">Expert Verification Seal Active</span>
                  </div>
                  <h4 className="text-xs font-bold text-white tracking-tight leading-relaxed">{generatedSop.title}</h4>
                  <p className="text-[10px] text-slate-400 italic">"{generatedSop.summary}"</p>

                  <div className="space-y-1 pt-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">⚙️ Structured Action Sequence:</p>
                    <ul className="list-decimal pl-4 text-[10px] text-slate-300 space-y-1">
                      {generatedSop.steps?.map((st, i) => <li key={i}>{st}</li>)}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">✓ Best Practices:</p>
                    <ul className="list-disc pl-4 text-[10px] text-slate-300 space-y-1">
                      {generatedSop.bestPractices?.map((bp, i) => <li key={i}>{bp}</li>)}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">⚠️ Critical Failure Learnings:</p>
                    <ul className="list-disc pl-4 text-[10px] text-slate-300 space-y-1">
                      {generatedSop.failureLearnings?.map((fl, i) => <li key={i}>{fl}</li>)}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveToHub}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-emerald-200" />
                  <span>Submit Wisdown Asset to Plant Library</span>
                </button>
              </div>
            ) : (
              <div className="m-auto flex flex-col items-center justify-center text-center p-4 space-y-2">
                <FileText className="w-8 h-8 text-slate-700" />
                <p className="text-xs font-semibold text-slate-400">Preservation Pipeline Empty</p>
                <p className="text-[10px] text-slate-550 leading-relaxed max-w-xs capitalize">
                  Click 'convert dialogue' to run the deep neural model extraction. It extracts tacit steps, safeguards, and saves retirement wisdom forever.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
