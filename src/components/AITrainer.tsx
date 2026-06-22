/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Sparkles, AlertTriangle, Cpu, Bookmark, UserCheck, RefreshCw } from 'lucide-react';
import { LearningResource } from '../types';

interface AITrainerProps {
  resources: LearningResource[];
  lang?: 'en' | 'hi';
}

export default function AITrainer({ resources, lang = 'en' }: AITrainerProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    sender: 'user' | 'sarathi';
    text: string;
    confidence?: number;
    source?: string;
    relatedLearning?: string;
    relatedExpertSkill?: string;
    isFallback?: boolean;
  }>>([
    {
      sender: 'sarathi',
      text: lang === 'en' 
        ? "Hello, operative. I am Sarathi AI, your enterprise industrial trainer assistant. Ask me anything about standard safety guidelines, maintenance checklists, or SCADA indicators (e.g. 'Blast furnace valve check in Hinglish' or 'hydraulic pump fault codes')."
        : "नमस्ते ऑपरेटर। मैं सारथी AI हूँ, आपका औद्योगिक प्रशिक्षक सहायक। मुझसे सुरक्षा दिशानिर्देशों, रखरखाव चेकलिस्ट, या SCADA कोड के बारे में कुछ भी पूछें (उदा. 'LOTO Procedures क्या हैं?' या 'Exhaust fan troubleshooting').",
      confidence: 100,
      source: "Sarathi Engine - Core-Industrial-v4.2.1"
    }
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = query;
    setQuery('');
    setConversation(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    // Filter relevant local SOP context elements to pass as seeds to the API
    const contextSops = [
      { id: 'SOP-001', title: 'Zero-Harm Emergency LOTO Shutdown Protocol', content: 'Lockout-Tagout protocols mandate isolating all power breakers, clearing gravity energy, and securing zero kinetic valves before physical entry into boiler cavities.' },
      { id: 'SOP-002', title: 'Blast Furnace Cooler Seal Safety Calibration', content: 'Cooling loop thermal gradients should never exceed 15% tolerance. If the sensor readings diverge, check nitrogen purge pressure limits and manual isolation seals.' },
      { id: 'SOP-003', title: 'SCADA Stale Comm Diagnostic Sequence', content: 'Magenta alarm indicator triggers mean the field transducer has lost physical signals. Verify serial cable insulation, check voltage output, or reset the gateway.' }
    ];

    try {
      const response = await fetch('/api/trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          lang: lang,
          context: contextSops
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const result = await response.json();
      setConversation(prev => [...prev, {
        sender: 'sarathi',
        text: result.answer,
        confidence: result.confidence || 90,
        source: result.source || "SOP Standards Reference Code",
        relatedLearning: result.relatedLearning || "LOTO General Safety Path (SAFE-101)",
        relatedExpertSkill: result.relatedExpertSkill || "Maintenance Operations Specialist",
        isFallback: !!result.warning
      }]);
    } catch (err: any) {
      console.error(err);
      // Hard fallback if backend has an issue or network is slow
      setConversation(prev => [...prev, {
        sender: 'sarathi',
        text: `[OFFLINE CONTINGENCY ENGINE MATCH]:
Here is the standard plant directive related to your request:
1. Complete Isolation: Ensure the correct valves are locked under strict LOTO safety requirements.
2. Pressure Relief: Purge nitrogen gas line valves before checking charging indicators.
3. Live Guidance: Use premium protective equipment, and immediately inform the Shift Operations Lead if SCADA telemetry values do not reset.

Please re-connect your environment's active API secret token to activate real-time cognitive responses!`,
        confidence: 80,
        source: "Manual Safety Appendix SAF-B9",
        relatedLearning: "SOP Blast Furnace Operations (BF-301)",
        relatedExpertSkill: "Discipline Expert Team Leader"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0e1015] border border-slate-800 rounded-2xl flex flex-col h-[540px] overflow-hidden">
      {/* Header */}
      <div className="bg-[#0c0d12] border-b border-slate-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight font-display">
              {lang === 'en' ? 'AI Cognitive Trainer' : 'AI संज्ञानात्मक प्रशिक्षक'}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              Enterprise RAG • English • Hindi • Hinglish
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2- h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-blue-400 font-mono">
            RAG - KNOWLEDGE CORRELATING
          </span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none font-sans font-medium'
                  : 'bg-slate-900 border border-slate-800/80 text-slate-300 rounded-bl-none'
              }`}
            >
              {msg.sender === 'sarathi' ? (
                <div className="space-y-2 whitespace-pre-line">
                  <div>{msg.text}</div>
                  
                  {msg.source && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono items-center">
                      <span className="flex items-center gap-1 bg-[#161b25] px-2 py-0.5 rounded text-blue-400">
                        <Bookmark className="w-3 h-3 text-blue-500" />
                        Source: {msg.source}
                      </span>
                      {msg.confidence && (
                        <span className="flex items-center gap-1 bg-[#161b25] px-2 py-0.5 rounded text-green-400">
                          Confidence: {msg.confidence}%
                        </span>
                      )}
                    </div>
                  )}

                  {msg.relatedLearning && (
                    <div className="bg-[#0f172a]/80 border border-blue-900/30 rounded-xl p-2 mt-2 text-[10px] text-blue-200">
                      <p className="font-semibold text-blue-400 mb-0.5">💡 Recommended Learning Directive:</p>
                      <p>{msg.relatedLearning}</p>
                    </div>
                  )}

                  {msg.relatedExpertSkill && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <UserCheck className="w-3.5 h-3.5 text-orange-400" />
                      <span>{lang === 'en' ? 'SOP Expert Owner' : 'संयंत्र विशेषज्ञ संदर्भ'}: <b>{msg.relatedExpertSkill}</b></span>
                    </div>
                  )}

                  {msg.isFallback && (
                    <div className="text-[9px] text-amber-500 bg-amber-500/10 p-2 border border-amber-500/20 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Interactive Live AI key not calibrated. Responding in offline-safe developer preview mode.</span>
                    </div>
                  )}
                </div>
              ) : (
                msg.text
              )}
            </div>
            <span className="text-[9px] text-slate-600 mt-1 font-mono uppercase tracking-tighter">
              {msg.sender === 'user' ? 'operative dispatch' : 'Sarathi Cognitive Response'}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            <span>Sarathi AI scanning SOP repositories & parsing telemetry...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-[#0c0d12] border-t border-slate-800 p-3 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={lang === 'en' ? "Ask: 'Blast Furnace valve operation safety' or in Hinglish..." : "यहाँ पूछें: 'SOP Maintenance का पालन कैसे करें'..."}
          className="flex-1 bg-[#10121a] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 font-sans"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
