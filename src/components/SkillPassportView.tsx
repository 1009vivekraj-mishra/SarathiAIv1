/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Competency } from '../types';
import { 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText, 
  ExternalLink, 
  Milestone, 
  BookOpen, 
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface SkillPassportViewProps {
  competencies: Competency[];
  userCompetencyScores: Record<string, Record<string, number>>;
  currentUserId: string;
  lang?: 'en' | 'hi';
  onPassAssessment?: (compId: string, targetLevel: number) => void;
}

const ROADMAP_DATA: Record<string, {
  en: {
    explanation: string;
    steps: { phase: string; desc: string; milestone: string }[];
    resources: { title: string; type: 'video' | 'pdf' | 'link'; durOrSize: string; desc: string }[];
  };
  hi: {
    explanation: string;
    steps: { phase: string; desc: string; milestone: string }[];
    resources: { title: string; type: 'video' | 'pdf' | 'link'; durOrSize: string; desc: string }[];
  }
}> = {
  'COMP-001': {
    en: {
      explanation: 'Plant operations involve severe heat, hot metal transfer, and heavy mechanical forces. Effective safety compliance is based on active Hazard Identification & Risk Assessment (HIRA), strict Lockout-Tagout (LOTO) isolation protocols, and daily team safety briefings to isolate electrical/hydraulic energy sources before manual physical repairs.',
      steps: [
        { phase: 'Phase 1: Foundation & Isolation Standards', desc: 'Secure theoretical LOTO isolation tags and hazard assessment checklist rules.', milestone: 'Weeks 1-2' },
        { phase: 'Phase 2: Walkdowns & Logging', desc: 'Conduct standard safety walks and log at least 5 independent real hazard observations.', milestone: 'Weeks 3-4' },
        { phase: 'Phase 3: Toolbox Leadership', desc: 'Host a safety Toolbox Talk briefing and lead a mock plant emergency shutdown drill.', milestone: 'Weeks 5-6' }
      ],
      resources: [
        { title: 'Safety LOTO Key Isolation Procedures', type: 'video', durOrSize: '8:45 mins', desc: '6 critical steps for isolating heavy hydraulic electrical grids safely.' },
        { title: 'PPE & Active Site Hazard Observation', type: 'video', durOrSize: '12:20 mins', desc: 'Visual checklist of invisible metallurgical plant gas risks.' },
        { title: 'Corporate Environmental Safety Manual v5', type: 'pdf', durOrSize: '4.2 MB', desc: 'HIRA execution framework and emergency exit protocol codes.' }
      ]
    },
    hi: {
      explanation: 'संयंत्र संचालन में तीव्र गर्मी, गर्म धातु का संचरण और भारी यांत्रिक बल शामिल हैं। प्रभावी सुरक्षा अनुपालन सक्रिय खतरा पहचान और जोखिम मूल्यांकन (HIRA), सुरक्षित तालाबंदी-टैगआउट (LOTO) नियमों और दैनिक ब्रीफिंग पर आधारित है ताकि रिपेयर से पहले ऊर्जा स्रोतों को पूरी तरह सुरक्षित अलग किया जा सके।',
      steps: [
        { phase: 'चरण 1: बुनियादी ज्ञान और अलगाव नियम', desc: 'सैद्धांतिक LOTO अलगाव नियमों और खतरा मूल्यांकन चेकलिस्ट का पूर्ण ज्ञान प्राप्त करें।', milestone: 'सप्ताह 1-2' },
        { phase: 'चरण 2: साइट निरीक्षण और लॉगिंग', desc: 'सुरक्षा वॉकडाउन करें और कम से कम 5 स्वतंत्र वास्तविक खतरों की पहचान कर रिपोर्ट दर्ज करें।', milestone: 'सप्ताह 3-4' },
        { phase: 'चरण 3: सेफ्टी ब्रीफिंग एवं टीम नेतृत्व', desc: 'एक सेफ्टी टूलबॉक्स टॉक का आयोजन करें और संयंत्र आपातकालीन बंद करने की मॉक ड्रिल का नेतृत्व करें।', milestone: 'सप्ताह 5-6' }
      ],
      resources: [
        { title: 'सुरक्षा LOTO कुंजी अलगाव प्रक्रिया', type: 'video', durOrSize: '8:45 मिनट', desc: 'भारी हाइड्रोलिक विद्युत प्रणालियों को अलग रखने के 6 महत्वपूर्ण व्यावहारिक कदम।' },
        { title: 'पीपीई और साइट खतरा सक्रिय अवलोकन', type: 'video', durOrSize: '12:20 मिनट', desc: 'धातुकर्म संयंत्र में अदृश्य गैस एवं थर्मल जोखिमों का सचित्र विश्लेषण।' },
        { title: 'कॉर्पोरेट पर्यावरण सुरक्षा मैनुअल v5', type: 'pdf', durOrSize: '4.2 एमबी', desc: 'सक्रिय HIRA निष्पादन ढांचा और आपातकालीन सुरक्षित निकास योजना।' }
      ]
    }
  },
  'COMP-002': {
    en: {
      explanation: 'Standard Operating Procedures are the operational golden rules of heavy metallurgy. Adherence ensures consistency in hot metal chemistry, thermal conservation, and eliminates mechanical fatigue deviations caused due to shortcut steps.',
      steps: [
        { phase: 'Phase 1: Checklist Drills', desc: 'Log on-site checklists against exact active SOP databases for all standard shift activities.', milestone: 'Weeks 1-2' },
        { phase: 'Phase 2: Anomaly Reference Logging', desc: 'Identify and report 3 out-of-spec incidents that required immediate SOP reference to prevent quality degradation.', milestone: 'Weeks 3-4' },
        { phase: 'Phase 3: Telemetry Feedback Revision', desc: 'Draft an optimized SOP modification proposal based on metallurgical feedback loops.', milestone: 'Weeks 5-6' }
      ],
      resources: [
        { title: 'SOP Quality Alignment & Audit Prep', type: 'video', durOrSize: '15:10 mins', desc: 'How standard checklist verification prevents process downtime.' },
        { title: 'Steel Operations SOP General Index', type: 'pdf', durOrSize: '3.1 MB', desc: 'Active reference of metallurgical temperature limits and process timings.' },
        { title: 'Lessons Learned: High-Risk Out-of-Spec Logs', type: 'pdf', durOrSize: '1.8 MB', desc: 'Anonymized case studies of plant damage caused due to shortcut steps.' }
      ]
    },
    hi: {
      explanation: 'मानक संचालन प्रक्रियाएं (SOPs) धातुकर्म के स्वर्ण नियम हैं। इनका पालन गर्म धातु की गुणवत्ता, थर्मल संरक्षण को बेहतर बनाता है और यांत्रिक त्रुटियों को दूर करता है।',
      steps: [
        { phase: 'चरण 1: चेकलिस्ट अभ्यास', desc: 'सक्रिय SOP डेटा के खिलाफ दैनिक साइट चेकलिस्ट का कड़ाई से मिलान करें।', milestone: 'सप्ताह 1-2' },
        { phase: 'चरण 2: असंगति संदर्भ लॉगिंग', desc: '3 असंगत घटनाओं की पहचान करें जहां तत्काल SOP परामर्श आवश्यक था और गुणवत्ता रिसाव रोका गया।', milestone: 'सप्ताह 3-4' },
        { phase: 'चरण 3: टेलीमेट्री डेटा संशोधन योगदान', desc: 'धातुकर्म डेटा और व्यावहारिक टिप्पणियों का उपयोग करके एक अनुकूलित SOP संशोधन का प्रस्ताव दें।', milestone: 'सप्ताह 5-6' }
      ],
      resources: [
        { title: 'SOP गुणवत्ता संरेखण और ऑडिट तैयारी', type: 'video', durOrSize: '15:10 मिनट', desc: 'चेकलिस्ट सत्यापन प्रक्रियाओं को कैसे ठीक रखता है।' },
        { title: 'स्टील ऑपरेशंस SOP सामान्य सूचकांक', type: 'pdf', durOrSize: '3.1 एमबी', desc: 'धातुकर्म तापमान सीमाओं और समय का सक्रिय संदर्भ।' },
        { title: 'सीखे गए सबक: शॉर्टकट के कारण होने वाले नुकसान', type: 'pdf', durOrSize: '1.8 एमबी', desc: 'शॉर्टकट प्रक्रियाओं के कारण होने वाले नुकसान का वास्तविक अध्ययन।' }
      ]
    }
  },
  'COMP-003': {
    en: {
      explanation: 'Operation of high-value machinery like charging cranes, steam turbines, blast bellows, and converters demands rigorous pre-start calibrations, vibration feedback tracking, and safe hot-metal vector guidance.',
      steps: [
        { phase: 'Phase 1: Virtual Simulation Base', desc: 'Achieve 90%+ score in virtual hoist crane and loader operator simulation trials.', milestone: 'Weeks 1-3' },
        { phase: 'Phase 2: Supervised Active Custody', desc: 'Perform heavy ladles adjustments on the shop floor with direct supervision of a level 5 Senior Advisor.', milestone: 'Weeks 4-6' },
        { phase: 'Phase 3: independent Custody Certification', desc: 'Deliver 10 consecutive flawless operations to secure full independent machine custody.', milestone: 'Weeks 7-8' }
      ],
      resources: [
        { title: 'Overhead Charger Operation Vectors', type: 'video', durOrSize: '18:30 mins', desc: 'Safe travel limits, swing compensation, and torque vectors.' },
        { title: 'Hot Metal Kinetic Safety Blueprint', type: 'pdf', durOrSize: '5.5 MB', desc: 'Critical load centers, temperature thresholds, and pressure targets.' },
        { title: 'Hydraulic System Tolerances Checklist', type: 'pdf', durOrSize: '1.2 MB', desc: 'Pressure limit values for safe operation of hydraulic components.' }
      ]
    },
    hi: {
      explanation: 'चार्जिंग क्रेन, स्टीम टर्बाइन और कनवर्टर जैसी उच्च मूल्य वाली औद्योगिक मशीनों के संचालन के लिए पूर्व-सक्रिय अंशांकन, कंपन प्रतिक्रिया और सुरक्षित गर्म-धातु संचलन नियंत्रण की आवश्यकता होती है।',
      steps: [
        { phase: 'चरण 1: वर्चुअल सिमुलेशन बुनियादी अभ्यास', desc: 'वर्चुअल क्रेन और लोडर ऑपरेटर परीक्षणों में 90% से अधिक स्कोर प्राप्त करें।', milestone: 'सप्ताह 1-3' },
        { phase: 'चरण 2: पर्यवेक्षित सक्रिय संचालन', desc: 'वरिष्ठ अधिकारी के सीधे मार्गदर्शन में लैडल का संचालन और भारी भार उठायें।', milestone: 'सप्ताह 4-6' },
        { phase: 'चरण 3: पूर्ण मशीन संचालन स्वायत्त प्रमाणन', desc: 'मशीन संचालन का स्वतंत्र अधिकार प्राप्त करने के लिए 10 त्रुटिहीन संचालन प्रदर्शन दें।', milestone: 'सप्ताह 7-8' }
      ],
      resources: [
        { title: 'ओवरहेड चार्जर संचालन वेक्टर प्रशिक्षण', type: 'video', durOrSize: '18:30 मिनट', desc: 'क्रेन स्विंग मुआवजा और टॉर्क सीमा गणना।' },
        { title: 'गर्म धातु गतिकी सुरक्षा ब्लूप्रिंट', type: 'pdf', durOrSize: '5.5 एमबी', desc: 'महत्वपूर्ण लोड केंद्र और तापमान सीमाएं।' },
        { title: 'हाइड्रोलिक सिस्टम दबाव सीमा सूची', type: 'pdf', durOrSize: '1.2 एमबी', desc: 'सुरक्षित कामकाज के लिए दबाव सीमा मूल्यों की सूची।' }
      ]
    }
  },
  'COMP-004': {
    en: {
      explanation: 'Precision maintenance focuses on maximizing plant uptime and reliability (RCM). Troubleshooting focuses on root cause analysis (5 Whys), vibration acoustic signal extraction, and preventive thermal imaging.',
      steps: [
        { phase: 'Phase 1: Diagnostics Tooling Specialist', desc: 'Master using thermal cameras, vibrational probes, and acoustic wear detectors on rotating shafts.', milestone: 'Weeks 1-2' },
        { phase: 'Phase 2: Simulation Lab Cases', desc: 'Solve 3 simulated electrical & hydraulic machinery fault test cases inside the AI Dynamic Trainer.', milestone: 'Weeks 3-4' },
        { phase: 'Phase 3: Corrective Active Repairs', desc: 'Perform physical shaft alignments, bearing replacements, and lubricating logs with the maintenance team.', milestone: 'Weeks 5-6' }
      ],
      resources: [
        { title: 'Vibration Signature Analysis Guides', type: 'video', durOrSize: '14:15 mins', desc: 'How to diagnose bearing failures before they trigger critical alarm zones.' },
        { title: 'Reliability-Centered Maintenance Framework', type: 'pdf', durOrSize: '6.8 MB', desc: 'Lubrication schedules, torque specifications, and predictive maintenance logs.' },
        { title: 'Sarathi AI Diagnostic Interactive Sand-box', type: 'link', durOrSize: 'Interactive Link', desc: 'Virtual troubleshooting diagnostics sandbox to practice electrical isolations.' }
      ]
    },
    hi: {
      explanation: 'परिशुद्धता रखरखाव संयंत्र के अपटाइम और विश्वसनीयता (RCM) को अधिकतम करने पर केंद्रित है। समस्या निवारण 5-क्यों (5 Whys) मूल कारण विश्लेषण, कंपन और थर्मल विश्लेषण पर आधारित है।',
      steps: [
        { phase: 'चरण 1: नैदानिक ​​उपकरण विशेषज्ञ बनना', desc: 'घूर्णन शाफ्ट पर थर्मल कैमरे, कंपन रोधी जांच और पहनने के नैदानिक डिकोडर्स का उपयोग करना सीखें।', milestone: 'सप्ताह 1-2' },
        { phase: 'चरण 2: एआई सहायता दोषों को डिकोड करना', desc: 'एआई कोपायलट के भीतर 3 नकली मशीनरी असंगत संकेतों की खराबी को हल करें।', milestone: 'सप्ताह 3-4' },
        { phase: 'चरण 3: व्यावहारिक सुधारात्मक रखरखाव', desc: 'शाफ्ट संरेखण, पंप बियरिंग रिप्लेसमेंट और सील मरम्मत में सक्रिय रूप से भाग लें।', milestone: 'सप्ताह 5-6' }
      ],
      resources: [
        { title: 'वाइब्रेशन सिग्नेचर एनालिसिस गाइड', type: 'video', durOrSize: '14:15 मिनट', desc: 'गंभीर अलार्म बजने से पहले संभावित बियरिंग खराबी का निदान करना।' },
        { title: 'विश्वसनीयता-केंद्रित रखरखाव ढांचा', type: 'pdf', durOrSize: '6.8 एमबी', desc: 'दैनिक स्नेहन कार्यक्रम, टॉर्क सीमाएं और नैदानिक दिशानिर्देश।' },
        { title: 'सारथी एआई इंटरएक्टिव मैकेनिकल डायग्नोस्टिक्स', type: 'link', durOrSize: 'इंटरैक्टिव टूल', desc: 'खराबी के पीछे का असली कारण पता लगाने के कौशल का परीक्षण करने का टूल।' }
      ]
    }
  },
  'COMP-005': {
    en: {
      explanation: 'Industrial steel plants utilize extensive telemetry dashboards. Operators must master reading scatter plots, trend lines, alarm distributions, and spotting anomaly regressions to maintain seamless work continuity and spot process temperature spikes.',
      steps: [
        { phase: 'Phase 1: Telemetry Variables Training', desc: 'Understand normal/abnormal ranges for blast temperature, pressure grids, and carbon monoxide feedback.', milestone: 'Weeks 1-2' },
        { phase: 'Phase 2: Historical Outlier Isolation', desc: 'Audit past deviation incidents on plant SCADA history logs to spot regression trends.', milestone: 'Weeks 3-4' },
        { phase: 'Phase 3: Alert Customizations', desc: 'Set up 3 threshold custom alerts in your active team workspace dashboards for shift safety logging.', milestone: 'Weeks 5-6' }
      ],
      resources: [
        { title: 'SCADA Plant Telemetry Interpretation', type: 'video', durOrSize: '11:45 mins', desc: 'How to understand real-time dashboard fluctuations and critical zones.' },
        { title: 'Plant Telemetry Parameters Quick Guide', type: 'pdf', durOrSize: '2.6 MB', desc: 'Standard dictionary of abbreviations, parameters, and normal operating range definitions.' }
      ]
    },
    hi: {
      explanation: 'औद्योगिक स्टील प्लांट व्यापक टेलीमेट्री डैशबोर्ड का उपयोग करते हैं। निर्बाध कार्य निरंतरता बनाए रखने के लिए ऑपरेटरों को रुझान रेखाएं, विसंगतियां और महत्वपूर्ण संकेत पढ़ना आना चाहिए।',
      steps: [
        { phase: 'चरण 1: माप सूचकांक ज्ञान', desc: 'ब्लास्ट तापमान, ऑक्सीजन अनुपात और दबाव संकेतकों की सामान्य सीमाओं को समझें।', milestone: 'सप्ताह 1-2' },
        { phase: 'चरण 2: ऐतिहासिक समीक्षा और विचलन खोजना', desc: 'पुराने विचलनों को ढूंढने और गलती समझने के लिए SCADA इतिहास का विश्लेषण करें।', milestone: 'सप्ताह 3-4' },
        { phase: 'चरण 3: अलार्म कस्टमाइजेशन', desc: 'शिफ्ट सुरक्षा के लिए टीम डैशबोर्ड पर 3 विशिष्ट विसंगति चेतावनी सीमा नियम सेट करें।', milestone: 'सप्ताह 5-6' }
      ],
      resources: [
        { title: 'SCADA प्लांट टेलीमेट्री व्याख्या निर्देश', type: 'video', durOrSize: '11:45 मिनट', desc: 'वास्तविक समय में उतार-चढ़ाव और संकटपूर्ण क्षेत्रों को समझने की विधि।' },
        { title: 'प्लांट टेलीमेट्री पैरामीटर्स त्वरित गाइड', type: 'pdf', durOrSize: '2.6 एमबी', desc: 'सामान्य उपयोग होने वाले संक्षिप्ताक्षरों और संवेदी संकेतों की सूची और परिभाषाएं।' }
      ]
    }
  },
  'COMP-006': {
    en: {
      explanation: 'Integrating AI predictions with physical metallurgy. Leverage machine learning predictive health index algorithms, query telemetry trends, evaluate alarm confidence, and action predictive alerts before failure.',
      steps: [
        { phase: 'Phase 1: ML Model Understanding', desc: 'Learn how pre-fault health logs are calculated and grasp confidence rating meaning.', milestone: 'Weeks 1-2' },
        { phase: 'Phase 2: Predictive Alarm Validation', desc: 'Conduct 5 physical site audits of blast gas valves flagged with a low AI health prediction rating.', milestone: 'Weeks 3-4' },
        { phase: 'Phase 3: Prompt Orchestration', desc: 'Incorporate AI diagnostics directly into handover records and shift logs to prevent pipeline blockages.', milestone: 'Weeks 5-6' }
      ],
      resources: [
        { title: 'AI Analytical Modeling & Core Engines', type: 'video', durOrSize: '20:10 mins', desc: 'How predictive algorithms isolate pre-fault vibration signatures.' },
        { title: 'Predictive Maintenance Prompting Protocols', type: 'pdf', durOrSize: '1.9 MB', desc: 'Standards for querying the AI trainer for safe pressure release procedures.' },
        { title: 'Sarathi Anomaly Alarms Case Studies', type: 'pdf', durOrSize: '3.4 MB', desc: 'Review of major success reports of AI stopping blast furnace leaks.' }
      ]
    },
    hi: {
      explanation: 'भौतिक संचालन के साथ एआई भविष्यवाणियों का एकीकरण। मशीन लर्निंग भविष्यसूचक एल्गोरिदम का लाभ उठाना और निवारक सिग्नलों पर कार्रवाई करना।',
      steps: [
        { phase: 'चरण 1: जोखिम संकेतकों को समझना', desc: 'सारथी एआई मॉडल के जोखिम जोखिम स्कोर और एमएल भविष्यवाणियों को डिकोड करना सीखें।', milestone: 'सप्ताह 1-2' },
        { phase: 'चरण 2: भविष्यसूचक अलार्म भौतिक सत्यापन', desc: 'एआई चेतावनी वाले गैस पाइपलाइन घटकों की साइट पर जाकर 5 लाइव सुरक्षा ऑडिट करें।', milestone: 'सप्ताह 3-4' },
        { phase: 'चरण 3: एआई संवाद एकीकरण', desc: 'एआई सुझावों को सीधे मानक हैंडओवर फाइलों और ब्लास्ट फर्नेस ब्लॉक सुरक्षा डायरी में एकीकृत करें।', milestone: 'सप्ताह 5-6' }
      ],
      resources: [
        { title: 'संयंत्र संचालन में एआई और भविष्यवाणियां', type: 'video', durOrSize: '20:10 मिनट', desc: 'कैसे भविष्यसूचक अल्गोरिदम बियरिंग रिसाव के लक्षणों का पता लगाते हैं।' },
        { title: 'सारथी एआई कोपायलट संवाद नियमावली', type: 'pdf', durOrSize: '1.9 एमबी', desc: 'सुरक्षित संचालन पद्धतियों के लिए सारथी एआई से प्रश्न पूछने की मार्गदर्शिका।' },
        { title: 'सारथी विसंगति अलार्म केस स्टडीज', type: 'pdf', durOrSize: '3.4 एमबी', desc: 'एआई द्वारा ब्लास्ट फर्नेस लीक को रोकने वाली वास्तविक दर्ज घटनाओं की समीक्षा।' }
      ]
    }
  },
  'COMP-007': {
    en: {
      explanation: 'Effective shift handovers (using the SBAR method) and clear, proactive safety reports ensure complete work context preservation, preventing plant downtime.',
      steps: [
        { phase: 'Phase 1: SBAR Framework Protocols', desc: 'Master Situation-Background-Assessment-Recommendation checklists for metallurgical plant handovers.', milestone: 'Weeks 1-2' },
        { phase: 'Phase 2: Handover Audit Trials', desc: 'Perform 5 certified error-free shift handovers logged in the departmental registry.', milestone: 'Weeks 3-4' },
        { phase: 'Phase 3: Frontline Briefings', desc: 'Lead 2 shift handoff briefing drills to optimize cross-shift safety awareness.', milestone: 'Weeks 5-6' }
      ],
      resources: [
        { title: 'SBAR Method in Metallurgy Ingress', type: 'video', durOrSize: '9:20 mins', desc: 'How concise structure stops critical details from slipping during handovers.' },
        { title: 'Shift Handover Log Templates', type: 'pdf', durOrSize: '1.1 MB', desc: 'Standard printed layouts for heavy engineering shift checklists.' }
      ]
    },
    hi: {
      explanation: 'प्रभावी शिफ्ट हैंडओवर (SBAR पद्धति का उपयोग करके) और स्पष्ट, सक्रिय सुरक्षा रिपोर्ट पूर्ण कार्य संदर्भ संरक्षण सुनिश्चित करती हैं, जिससे अवांछित संयंत्र ठहराव रुकता है।',
      steps: [
        { phase: 'चरण 1: SBAR संचालन प्रोटोकॉल विकसित करना', desc: 'कमियों को दूर करने के लिए स्थिति-पृष्ठभूमि-मूल्यांकन-सिफारिश (SBAR) हैंडओवर नियम सीखें।', milestone: 'सप्ताह 1-2' },
        { phase: 'चरण 2: ऑडिट युक्त लाइव शिफ्ट हैंडओवर', desc: 'विभागीय रजिस्ट्री में लगातार 5 त्रुटिहीन प्रमाणित सुरक्षा हैंडओवर दर्ज करें।', milestone: 'सप्ताह 3-4' },
        { phase: 'चरण 3: सुरक्षा ब्रीफिंग का आयोजन', desc: 'संयंत्र कर्मियों के लिए लगातार 2 मॉर्निंग सुरक्षा संवाद सत्रों का सफलतापूर्वक नेतृत्व करें।', milestone: 'सप्ताह 5-6' }
      ],
      resources: [
        { title: 'धातुकर्म उद्योग में SBAR संचार पद्धति', type: 'video', durOrSize: '9:20 मिनट', desc: 'हैंडओवर के दौरान विवरणों को छूटने से बचाने वाली श्रेष्ठ संचार विधि।' },
        { title: 'शिफ्ट हैंडओवर रिपोर्ट टेम्प्लेट्स', type: 'pdf', durOrSize: '1.1 एमबी', desc: 'संयंत्र हैंडओवर सूचकांक दर्ज करने वाली मुद्रण योग्य चेकलिस्ट।' }
      ]
    }
  },
  'COMP-008': {
    en: {
      explanation: 'Preserving plant wisdom from retiring senior engineers. Transferring implicit operational nuances and acoustic pump deviations directly to younger colleagues.',
      steps: [
        { phase: 'Phase 1: Active Mentorship Tactics', desc: 'Study adult coaching concepts, safe communication, and goal alignment rules.', milestone: 'Weeks 1-2' },
        { phase: 'Phase 2: Shopfloor Diagnostic Audits', desc: 'Conduct 3 guided walkdowns around blast blower steam turbine grids with your assigned mentee.', milestone: 'Weeks 3-5' },
        { phase: 'Phase 3: Digital SOP Contribution', desc: 'Draft and upload 2 structured lessons-learned SOP guides to the Knowledge Repository.', milestone: 'Weeks 6-8' }
      ],
      resources: [
        { title: 'Implicit Knowledge Transfer Best Practices', type: 'video', durOrSize: '16:40 mins', desc: 'Methods to translate silent mechanical acoustic clues to text.' },
        { title: 'Expert Knowledge Retention Playbook', type: 'pdf', durOrSize: '3.9 MB', desc: 'Safeguarding plant operations before retirement changeovers.' }
      ]
    },
    hi: {
      explanation: 'मूल्यवान संगठनात्मक ज्ञान का संरक्षण। वरिष्ठ कर्मचारियों के हुनर और व्यावहारिक अनुभवों को सीधे नए तकनीकी सहयोगियों तक व्यवस्थित रूप से पहुंचाना ताकि अनुभव न खोए।',
      steps: [
        { phase: 'चरण 1: मेंटरशिप तकनीकें समझना', desc: 'वयस्क शिक्षण दृष्टिकोण और पारस्परिक लक्ष्यों के निर्धारण की बुनियादी तकनीकों को समझें।', milestone: 'सप्ताह 1-2' },
        { phase: 'चरण 2: व्यावहारिक संयंत्र वॉकडाउन', desc: 'अपने निर्दिष्ट नए ऑपरेटर के साथ मिल क्रेन और ब्लास्ट ब्लोअर का 3 बार संयुक्त सुरक्षा निरीक्षण करें।', milestone: 'सप्ताह 3-5' },
        { phase: 'चरण 3: नॉलेज रिपोजिटरी में SOP योगदान', desc: 'अपने अनुभवों का 2 विस्तृत SOP लेसन लर्न्ट (Lessons Learned) तैयार कर डिजिटल लायब्रेरी में जमा करें।', milestone: 'सप्ताह 6-8' }
      ],
      resources: [
        { title: 'अदृश्य ज्ञान हस्तांतरण सर्वोत्तम अभ्यास', type: 'video', durOrSize: '16:40 मिनट', desc: 'यांत्रिक उपकरणों की ध्वनियों और संकेतों को शब्दों में दर्ज करने की तकनीक।' },
        { title: 'विशेषज्ञ ज्ञान अवधारण गाइड बुक', type: 'pdf', durOrSize: '3.9 एमबी', desc: 'वरिष्ठ कामगारों की सेवानिवृत्ति से पहले ज्ञान संरक्षण नियम।' }
      ]
    }
  }
};

export default function SkillPassportView({
  competencies,
  userCompetencyScores,
  currentUserId,
  lang = 'en',
  onPassAssessment
}: SkillPassportViewProps) {
  const isEn = lang === 'en';
  const [expandedCompId, setExpandedCompId] = useState<string | null>(null);

  // States for active assessment
  const [activeAssessmentCompId, setActiveAssessmentCompId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'passed' | 'failed'>('idle');

  const toggleExpand = (compId: string) => {
    setExpandedCompId(expandedCompId === compId ? null : compId);
    // Reset assessment state on switching cards
    setActiveAssessmentCompId(null);
    setSelectedAnswers({});
    setAssessmentStatus('idle');
  };

  const ASSESSMENT_QUESTIONS: Record<string, {
    en: { question: string; options: string[]; correctIndex: number }[];
    hi: { question: string; options: string[]; correctIndex: number }[];
  }> = {
    'COMP-001': {
      en: [
        {
          question: "What is the correct sequence of Lockout-Tagout (LOTO) isolation physical execution?",
          options: [
            "Apply security locks, isolate electrical power grid, verify zero energy, turn off machinery",
            "Turn off machinery completely, isolate electrical power, apply personal safety padlocks, test & verify absolute zero energy state",
            "Isolate electrical power, verify zero energy state, turn off machine, apply locks immediately"
          ],
          correctIndex: 1
        },
        {
          question: "Under what operational conditions is a Hazard Identification & Risk Assessment (HIRA) mandatory?",
          options: [
            "Only during annual planned third-party inspections of blast furnaces",
            "Before launching any standard operating shift activity or manual safety-critical repairs",
            "Only when auditory site emergency warning sirens are actively sounding"
          ],
          correctIndex: 1
        }
      ],
      hi: [
        {
          question: "लॉकआउट-टैगआउट (LOTO) अलगाव के भौतिक क्रियान्वयन का सही क्रम क्या है?",
          options: [
            "सुरक्षा ताले लगाएं, बिजली ग्रिड अलग करें, शून्य ऊर्जा सत्यापित करें, मशीन बंद करें",
            "मशीन को पूरी तरह बंद करें, बिजली अलग करें, व्यक्तिगत ताले लगाएं, शून्य ऊर्जा की जांच कर सत्यापन करें",
            "बिजली अलग करें, शून्य ऊर्जा सत्यापित करें, मशीन बंद करें, तुरंत ताला लगाएं"
          ],
          correctIndex: 1
        },
        {
          question: "किस परिचालन स्थिति में खतरा पहचान और जोखिम मूल्यांकन (HIRA) अनिवार्य है?",
          options: [
            "केवल ब्लास्ट फर्नेस के वार्षिक नियोजित तीसरे पक्ष के निरीक्षण के दौरान",
            "किसी भी सामान्य शिफ्ट गतिविधि या सुरक्षा-महत्वपूर्ण मरम्मत कार्य को शुरू करने से पहले",
            "केवल तब जब साइट पर आपातकालीन चेतावनी सायरन बज रहे हों"
          ],
          correctIndex: 1
        }
      ]
    },
    'COMP-002': {
      en: [
        {
          question: "What is the critical immediate action if an on-site telemetry parameter behaves outside of safe spec limits?",
          options: [
            "Ignore as temporary variance and wait for the shift end to log it",
            "Halt or carefully adjust operations in strict adherence to exact active SOP reference guidelines",
            "Manually recalibrate the telemetry transducer board to reset the values"
          ],
          correctIndex: 1
        },
        {
          question: "Who must be formally notified if an operating procedure requires temporary adjustment due to physical field deviations?",
          options: [
            "The shift supervisor and plant safety controller for official SOP update logging",
            "No one, make localized adjustments to maintain productivity and speed",
            "The administrative raw materials procurement agent"
          ],
          correctIndex: 0
        }
      ],
      hi: [
        {
          question: "यदि साइट पर टेलीमेट्री पैरामीटर सुरक्षित सीमा से बाहर व्यवहार करता है, तो तत्काल महत्वपूर्ण कदम क्या है?",
          options: [
            "इसे केवल अस्थायी उतार-चढ़ाव समझकर छोड़ दें और शिफ्ट के अंत में दर्ज करें",
            "सक्रिय SOP संदर्भ दिशानिर्देशों के तहत संचालन रोकें या सावधानीपूर्वक समायोजित करें",
            "मूल्यों को रीसेट करने के लिए सीधे टेलीमेट्री बोर्ड को मैन्युअल रूप से बदलें"
          ],
          correctIndex: 1
        },
        {
          question: "यदि भौतिक भिन्नताओं के कारण मानक प्रक्रिया में संशोधन की आवश्यकता हो, तो किसे औपचारिक रूप से सूचित किया जाना चाहिए?",
          options: [
            "शिफ्ट प्रभारी और संयंत्र सुरक्षा नियंत्रक को आधिकारिक SOP अध्ययन अद्यतन के लिए",
            "किसी को नहीं, उत्पादकता और गति बनाए रखने के लिए स्थानीय स्तर पर बदलाव करें",
            "प्रशासनिक कच्चे माल की खरीद करने वाले एजेंट को"
          ],
          correctIndex: 0
        }
      ]
    },
    'COMP-003': {
      en: [
        {
          question: "What refers to 'swing compensation' when actively manipulating heavy overhead charging cranes with liquid metal?",
          options: [
            "Increasing crane travel speeds during high cross-winds to cut transition times",
            "Counter-steering current kinetic motion vectors to keep hot liquid metal surfaces perfectly stable",
            "Applying rapid brakes to check the hydraulic pressure of major load hoists"
          ],
          correctIndex: 1
        },
        {
          question: "What is the key pre-op check before hoisting a highly populated crane ladle?",
          options: [
            "Running hoist motors at max speed configuration without load first",
            "Ensuring clear path visibility, confirming dual independent hoist brake systems, and verifying temperature parameters",
            "Standard calibration check of the auditory alert speakers only"
          ],
          correctIndex: 1
        }
      ],
      hi: [
        {
          question: "तरल धातु के साथ भारी ओवरहेड चार्जिंग क्रेन का संचालन करते समय 'स्विंग मुआवजा' (Swing Compensation) से क्या तात्पर्य है?",
          options: [
            "संक्रमण समय को कम करने के लिए तेज हवाओं के दौरान क्रेन की गति बढ़ाना",
            "गर्म तरल धातु की सतहों को स्थिर रखने के लिए वर्तमान गतिज वैक्टरों को विपरीत दिशा में नियंत्रित करना",
            "मुख्य लोड लहरा के हाइड्रोलिक दबाव की जांच करने के लिए तेजी से ब्रेक लगाना"
          ],
          correctIndex: 1
        },
        {
          question: "क्रेन लैडल को उठाने से पहले आवश्यक पूर्व-परिचालन सुरक्षा जांच क्या है?",
          options: [
            "बिना लोड के पहले क्रेन लिफ्ट मोटर्स को सीधे अधिकतम गति पर चलाना",
            "पथ स्पष्टता सुनिश्चित करना, दोहरे स्वतंत्र ब्रेक प्रणालियों और तापमान सीमाओं को सत्यापित करना",
            "केवल चेतावनी स्पीकर की ध्वनि गुणवत्ता की जाँच करना"
          ],
          correctIndex: 1
        }
      ]
    },
    'COMP-004': {
      en: [
        {
          question: "Why is the structured '5-Why' analysis protocol deployed when investigating unexpected pump motor downtime?",
          options: [
            "To identify which individual shift worker is legally responsible for the error",
            "To systematically drill down through layers of symptoms to expose the true root physical failure mechanism",
            "To compute the exact material cost of mechanical components for insurance"
          ],
          correctIndex: 1
        },
        {
          question: "What does an unexpected high-amplitude vibration spike on a rolling shaft indicate?",
          options: [
            "Optimal operating flow velocities achieved within normal ranges",
            "Progressive bearing fatigue, rotor imbalance, or alignment deviation requiring corrective shutdown",
            "A benign electrical power grid frequency surge"
          ],
          correctIndex: 1
        }
      ],
      hi: [
        {
          question: "अप्रत्याशित पंप मोटर ठहराव की जांच करते समय व्यवस्थित '5-Why' विश्लेषण का उपयोग क्यों किया जाता है?",
          options: [
            "यह पता लगाने के लिए कि त्रुटि के लिए कानूनी रूप से कौन सा शिफ्ट कार्यकर्ता जिम्मेदार है",
            "लक्षणों की परतों के माध्यम से गहराई से जांच कर विफलता के वास्तविक मूल भौतिक कारण को उजागर करना",
            "बीमा दावों के लिए यांत्रिक पुर्जों की सटीक लागत की गणना करना"
          ],
          correctIndex: 1
        },
        {
          question: "घूर्णन शाफ्ट पर एक अप्रत्याशित उच्च-आयाम कंपन स्पाइक क्या दर्शाता है?",
          options: [
            "सामान्य सीमाओं के भीतर इष्टतम परिचालन प्रवाह वेग प्राप्त होना",
            "बियरिंग में थकावट, रोटर असंतुलन, या संरेखण विचलन जिसके लिए सुधारात्मक बंद आवश्यक है",
            "एक सामान्य विद्युत ग्रिड आवृत्ति लहर"
          ],
          correctIndex: 1
        }
      ]
    },
    'COMP-005': {
      en: [
        {
          question: "What diagnostic signal does a sudden carbon monoxide (CO) emission spike matching a furnace pressure decline convey?",
          options: [
            "Standard operating range fluctuations in iron ore reduction",
            "Immediate high-risk leakage within the primary gas duct systems or chimney draft blockage",
            "Successful calibration of temperature transducers in the safety network"
          ],
          correctIndex: 1
        },
        {
          question: "What is the standard authorized protocol when a Level-2 SCADA thermal threshold alarm is generated?",
          options: [
            "Deactivate the terminal visual and audible sirens to log the alert without disruption",
            "Verify the reading against physical redundant field gauges and execute safety isolation if validated",
            "Leave the alarm active and ignore as it will auto-resolve on shift handover"
          ],
          correctIndex: 1
        }
      ],
      hi: [
        {
          question: "फर्नेस के दबाव में गिरावट के साथ अचानक कार्बन मोनोऑक्साइड (CO) उत्सर्जन में वृद्धि क्या संकेत देती है?",
          options: [
            "लोह अयस्क निष्कर्षण प्रक्रिया में सामान्य परिचालन उतार-चढ़ाव",
            "प्राथमिक गैस संचरण वाल्वों में तत्काल उच्च-जोखिम का रिसाव या चिमनी रुकावट",
            "सुरक्षा नेटवर्क में तापमान ट्रांसड्यूसर का सफल अंशांकन"
          ],
          correctIndex: 1
        },
        {
          question: "लेवल-2 SCADA तापमान अलार्म आने पर अधिकृत मानक प्रोटोकॉल क्या है?",
          options: [
            "बिना किसी बाधा के काम जारी रखने के लिए ध्वनि और दृश्य संकेतों को बंद करना",
            "भौतिक रूप से लगे अन्य मीटरों से मिलान करना और पुष्टी होने पर तुरंत सुरक्षा अलगाव नियम अपनाना",
            "अलार्म को सक्रिय छोड़ दें और ध्यान न दें क्योंकि शिफ्ट हैंडओवर पर यह अपने आप हल हो जाएगा"
          ],
          correctIndex: 1
        }
      ]
    },
    'COMP-006': {
      en: [
        {
          question: "How should a 94% AI predictive fail rating on a blast gas line flow valve be actioned?",
          options: [
            "Conduct no action until a visible physical leak or material breach is confirmed",
            "Schedule immediate site audit, thermal imaging scan, and physical valve isolation protocols during the next scheduled slowdown",
            "Lower safety threshold level parameters on the ML engine configuration to avoid false alarms"
          ],
          correctIndex: 1
        },
        {
          question: "What is the most secure method to integrate AI-driven anomaly diagnostics into handover logs?",
          options: [
            "Withhold the AI warnings to prevent shift-team panic or workflow delay",
            "Explicitly detail current active ML predictions, recommended action intervals, and verification checklists in the shift logbook",
            "Record predictions on a personal computer without uploading to organizational cloud bases"
          ],
          correctIndex: 1
        }
      ],
      hi: [
        {
          question: "ब्लास्ट गैस लाइन प्रवाह वाल्व पर 94% एआई पूर्वानुमानित विफलता जोखिम स्कोर पर क्या कार्रवाई होनी चाहिए?",
          options: [
            "जब तक दृश्यमान भौतिक रिसाव या धातु क्षति की पुष्टि न हो, तब तक कोई कार्रवाई न करें",
            "नियोजित ठहराव के दौरान वाल्व के साइट सुरक्षा ऑडिट, थर्मल इमेजिंग स्कैन और भौतिक अलगाव की योजना बनाना",
            "झूठी चेतावनियों से बचने के लिए एआई मशीन लर्निंग सेटिंग्स में सुरक्षा अलर्ट सीमाओं को कम करना"
          ],
          correctIndex: 1
        },
        {
          question: "शिफ्ट हैंडओवर डायरी में एआई-संचालित विसंगति निदान को एकीकृत करने की सबसे सुरक्षित विधि क्या है?",
          options: [
            "काम में होने वाली किसी भी देरी को रोकने के लिए एआई चेतावनियों को छुपाकर रखना",
            "शिफ्ट लॉगबुक में वर्तमान सक्रिय एआई भविष्यवाणियों, अनुशंसित कार्रवाई और सत्यापन चेकलिस्ट का स्पष्ट रूप से विवरण देना",
            "संगठनात्मक क्लाउड बेस में अपलोड किए बिना व्यक्तिगत कंप्यूटर पर भविष्यवाणियों को रिकॉर्ड करना"
          ],
          correctIndex: 1
        }
      ]
    },
    'COMP-007': {
      en: [
        {
          question: "What critical operational step is conducted under 'A' (Assessment) of the SBAR handover structure?",
          options: [
            "Assigning basic operational tasks and assigning safety gear requirements to junior apprentices",
            "Summarizing current plant status, outstanding anomalies, safe pressure margins, and ongoing risks clearly",
            "Determining standard administrative time off schedules for the next full week"
          ],
          correctIndex: 1
        },
        {
          question: "Under the 'Situation' (S) block of SBAR, what information must be delivered with absolute precision?",
          options: [
            "A theoretical overview of metallurgical furnace design histories",
            "The current operating mode, ongoing metal processing volumes, and immediate critical safety concerns",
            "General feedback about the cleanliness of the control department room floor"
          ],
          correctIndex: 1
        }
      ],
      hi: [
        {
          question: "SBAR हैंडओवर संरचना के 'A' (Assessment - मूल्यांकन) के तहत कौन सा महत्वपूर्ण परिचालन कदम उठाया जाता है?",
          options: [
            "नए सहयोगियों को बुनियादी काम और सुरक्षा उपकरण आवश्यकताएं सौंपना",
            "संयंत्र की वर्तमान स्थिति, अनसुलझी विसंगतियों, सुरक्षित दबाव सीमाओं और चल रहे जोखिमों का संक्षिप्त विवरण देना",
            "अगले सप्ताह के लिए मानक प्रशासनिक अवकाश कार्यक्रम निर्धारित करना"
          ],
          correctIndex: 1
        },
        {
          question: "SBAR के 'Situation' (स्थिति - S) ब्लॉग के तहत कौन सी जानकारी पूर्ण सटीकता के साथ दी जानी चाहिए?",
          options: [
            "धातुकर्म प्रणाली फर्नेस डिजाइन इतिहास का एक सैद्धांतिक विवरण",
            "वर्तमान परिचालन स्थिति, वर्तमान धातु प्रसंस्करण मात्रा और तत्काल महत्वपूर्ण सुरक्षा चिंताएं",
            "नियंत्रण कक्ष के फर्श की सफाई के बारे में सामान्य प्रतिक्रिया"
          ],
          correctIndex: 1
        }
      ]
    },
    'COMP-008': {
      en: [
        {
          question: "What is the primary methodology to document 'implicit knowledge' from retiring master technicians for newly onboarded staff?",
          options: [
            "Leaving apprentices to deduce heavy machinery calibrations on their own via raw operational trial and error",
            "Publishing detailed lessons-learned bulletins, recording acoustic deviations, and conducting mentor-led site walkdowns",
            "Requiring retiring technicians to complete generic company HR surveys"
          ],
          correctIndex: 1
        },
        {
          question: "During mentor-guided live walkdowns of steam turbine grids, what is the key responsibility of the mentor?",
          options: [
            "Completing maintenance repair work independently while the trainee stands watch silently",
            "Demonstrating precise diagnostic probe points, discussing historic deviation signals, and checking safety compliance values",
            "Reviewing only the total commute times of the technician crew"
          ],
          correctIndex: 1
        }
      ],
      hi: [
        {
          question: "सेवानिवृत्त हो रहे कुशल तकनीकी विशेषज्ञों से नए कर्मचारियों के लिए 'अदृश्य संगठनात्मक ज्ञान' को दस्तावेज करने की प्राथमिक विधि क्या है?",
          options: [
            "नए कर्मचारियों को भारी मशीनरी अंशांकन के निर्णयों के लिए स्वतंत्र छोड़ देना और व्यावहारिक त्रुटियों से सीखने की अपेक्षा करना",
            "विस्तृत सबक-सीखे (Lessons Learned) बुलेटिन प्रकाशित करना, विशिष्ट ध्वनियों को सहेजना और गुरु-शिष्य क्षेत्र वॉकडाउन करना",
            "सेवानिवृत्त होने वाले तकनीशियनों को सामान्य प्रशासनिक मानव संसाधन (HR) सर्वेक्षणों को पूरा करने के लिए कहना"
          ],
          correctIndex: 1
        },
        {
          question: "स्टीम टर्बाइन ग्रिड के मेंटर-निर्देशित लाइव निरीक्षण के दौरान मेंटर की प्रमुख जिम्मेदारी क्या है?",
          options: [
            "प्रशिक्षणार्थी के चुपचाप खड़े रहने के दौरान स्वतंत्र रूप से मरम्मत कार्य पूरा करना",
            "सटीक नैदानिक ​​जांच बिंदुओं का प्रदर्शन, ऐतिहासिक विचलन संकेतों की चर्चा और सुरक्षा अनुपालन जांच करना",
            "तकनीशियन टीम के काम पर आने-जाने में लगने वाले समय की केवल समीक्षा करना"
          ],
          correctIndex: 1
        }
      ]
    }
  };
  
  return (
    <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 relative animate-fade-in space-y-6">
      
      {/* Header and subtitle */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-slate-850">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600/15 rounded-xl text-blue-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight uppercase font-display">
              {isEn ? 'Active Skill Passport Competencies Matrix' : 'सक्रिय कौशल पासपोर्ट क्षमता मैट्रिक्स'}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              {isEn ? 'LIVE RECORD FOR USER' : 'उपयोगकर्ता के लिए लाइव रिकॉर्ड'} • ID: {currentUserId}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-semibold bg-blue-950/50 border border-blue-900/30 text-blue-400 px-2.5 py-1 rounded uppercase tracking-wider">
          {isEn ? 'PASSBOOK VERIFIED' : 'पासबुक सत्यापित'}
        </span>
      </div>

      {/* Intro info box */}
      <div className="bg-[#10121a] border border-slate-850/60 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
            {isEn ? 'Personal Readiness & Growth Blueprint' : 'व्यक्तिगत तत्परता और विकास योजना'}
          </h5>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {isEn 
              ? 'Below is your authenticated plant capability index. If a competency fails to meet target standard levels (GAP), expand the card to view the dynamic roadmap, detailed operational briefings, safety isolation vectors, videos, and learning PDFs.'
              : 'नीचे आपकी प्रमाणित संयंत्र क्षमता सूचकांक है। यदि कोई क्षमता लक्षित स्तर (GAP) को पूरा नहीं करती है, तो डायनामिक रोडमैप, विस्तृत सुरक्षा निर्देश, वीडियो ट्यूटोरियल और उपयोगी पीडीएफ देखने के लिए कार्ड का विस्तार करें।'}
          </p>
        </div>
      </div>

      {/* Grid of Competencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {competencies.map(comp => {
          const currentLvl = (userCompetencyScores[currentUserId] || {})[comp.id] || 2;
          const targetLvl = comp.targetLevel;
          const gap = targetLvl - currentLvl;
          const hasGap = gap > 0;
          const isExpanded = expandedCompId === comp.id;
          const detail = ROADMAP_DATA[comp.id]?.[lang] || ROADMAP_DATA['COMP-001'][lang];
          
          return (
            <div 
              key={comp.id} 
              className={`bg-[#10121a]/85 border transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden ${
                isExpanded 
                  ? 'border-blue-600/60 shadow-lg shadow-blue-950/20 col-span-1 md:col-span-2' 
                  : hasGap 
                    ? 'border-orange-500/20 hover:border-orange-500/40' 
                    : 'border-slate-850 hover:border-slate-800'
              }`}
            >
              <div className="p-5 space-y-4">
                
                {/* ID, Category, Gap status */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] uppercase tracking-widest bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-blue-400 font-mono">
                      {comp.category}
                    </span>
                    <span className="text-[8px] uppercase text-slate-500 font-mono">
                      {comp.id}
                    </span>
                  </div>
                  
                  {hasGap ? (
                    <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-lg border border-orange-500/20 font-mono font-bold animate-pulse">
                      GAP L{gap} • {isEn ? 'ACTION REQD' : 'कार्रवाई आवश्यक'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 font-bold uppercase">
                      ✓ {isEn ? 'PASSED' : 'उत्तीर्ण'}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">{comp.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                    {comp.description}
                  </p>
                </div>
                
                {/* Level Display block with custom descriptions */}
                <div className="bg-slate-950/65 border border-slate-900 p-3 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
                      {isEn ? 'Current Certified Level' : 'वर्तमान प्रमाणित स्तर'}:
                    </span>
                    <span className="text-xs font-mono font-black text-blue-400">L{currentLvl}</span>
                  </div>
                  <p className="text-[10px] text-slate-350 italic leading-relaxed">
                    "{comp.levelDescriptions[currentLvl] || 'Capable shift supervision deployment'}"
                  </p>
                </div>

                {/* Metric level bar (1 to 5 dots) */}
                <div className="pt-2 border-t border-slate-850/50 flex flex-wrap items-center justify-between gap-3 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">{isEn ? 'Skill Level' : 'कौशल स्तर'}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <div
                          key={val}
                          className={`w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-mono font-bold transition-transform hover:scale-110 ${
                            val <= currentLvl
                              ? 'bg-blue-600 text-white font-black shadow shadow-blue-500/20'
                              : val <= targetLvl
                              ? 'bg-[#10121a] border border-orange-500/40 text-orange-400'
                              : 'bg-[#0a0b10] border border-slate-850 text-slate-700'
                          }`}
                          title={`Level ${val}`}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {isEn ? 'Target Level' : 'लक्षित स्तर'}: <b className="text-white">L{comp.targetLevel}</b>
                    </span>
                  </div>
                </div>

                {/* EXPANDED CONTENT DETAILS SECTION */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-850/80 space-y-6 animate-fade-in">
                    
                    {/* Detailed Topic Briefing */}
                    <div className="space-y-2 bg-slate-950/40 border border-slate-900 p-4.5 rounded-2xl">
                      <div className="flex items-center gap-2 text-blue-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-display">
                          {isEn ? 'Detailed Operational Briefing' : 'विस्तृत परिचालन दिशानिर्देश'}
                        </h5>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                        {detail.explanation}
                      </p>
                    </div>

                    {/* Bridges / Roadmap */}
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-orange-400">
                        <Milestone className="w-3.5 h-3.5" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-display">
                          {isEn ? 'Bridging Roadmap Ahead' : 'तत्परता विकास रोडमैप'}
                        </h5>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {detail.steps.map((st, sId) => (
                          <div key={sId} className="bg-[#0b0c10]/95 border border-slate-850 p-3.5 rounded-xl space-y-2 flex flex-col justify-between relative">
                            <div className="absolute top-2.5 right-2.5 text-[8px] bg-blue-900/40 text-blue-400 border border-blue-900/30 px-1.5 py-0.5 rounded font-mono font-medium">
                              {st.milestone}
                            </div>
                            <div className="space-y-1 pt-1">
                              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{st.phase}</span>
                              <p className="text-[9.5px] text-slate-300 leading-relaxed font-sans font-medium">
                                {st.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources: Videos, PDFs, links */}
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-display">
                          {isEn ? 'Curated Study & Training Materials' : 'क्यूरेटेड अध्ययन और प्रशिक्षण सामग्री'}
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {detail.resources.map((res, rId) => {
                          const isVid = res.type === 'video';
                          const isPdf = res.type === 'pdf';
                          
                          return (
                            <div 
                              key={rId} 
                              className="bg-slate-900/50 border border-slate-850 p-3.5 rounded-xl flex items-start gap-3 hover:bg-slate-900/80 transition-colors"
                            >
                              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                isVid ? 'bg-indigo-600/15 text-indigo-400' : isPdf ? 'bg-red-600/15 text-red-400' : 'bg-blue-600/15 text-blue-400'
                              }`}>
                                {isVid ? (
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                ) : isPdf ? (
                                  <FileText className="w-3.5 h-3.5" />
                                ) : (
                                  <ExternalLink className="w-3.5 h-3.5" />
                                )}
                              </div>

                              <div className="space-y-1 grow min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-slate-500">
                                    {isVid ? 'Video Clip' : isPdf ? 'PDF Manual' : 'Interactive'} • {res.durOrSize}
                                  </span>
                                </div>
                                <h6 className="text-[10px] font-bold text-white truncate uppercase tracking-wide">
                                  {res.title}
                                </h6>
                                <p className="text-[9px] text-slate-400 leading-normal line-clamp-2">
                                  {res.desc}
                                </p>
                              </div>

                              {/* Download or view button */}
                              <button 
                                onClick={() => alert(isEn ? `Launching resource: ${res.title}` : `संसाधन शुरू किया जा रहा है: ${res.title}`)}
                                className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border uppercase font-mono tracking-wider transition-all cursor-pointer self-center shrink-0 ${
                                  isVid 
                                    ? 'bg-indigo-900/30 text-indigo-400 border-indigo-900/45 hover:bg-indigo-600 hover:text-white' 
                                    : isPdf 
                                    ? 'bg-red-900/30 text-red-400 border-red-900/45 hover:bg-red-600 hover:text-white' 
                                    : 'bg-blue-900/30 text-blue-400 border-blue-900/45 hover:bg-blue-600 hover:text-white'
                                }`}
                              >
                                {isVid ? 'Play' : isPdf ? 'Download' : 'Open'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive Capability Assessment Module */}
                    <div className="border-t border-slate-850/85 pt-6 mt-6 space-y-4">
                      {hasGap ? (
                        <>
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Award className="w-4 h-4" />
                            <h5 className="text-[11px] font-bold uppercase tracking-wider font-display">
                              {isEn ? 'Gap-Bridging Capability Assessment' : 'गैप-ब्रिजिंग क्षमता आकलन'}
                            </h5>
                          </div>

                          {activeAssessmentCompId === comp.id ? (
                            <div className="bg-[#0b0c10] border border-slate-850/90 rounded-2xl p-5 space-y-5 animate-fade-in">
                              <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                                  {isEn ? `COMPETENCY ASSESSMENT: ${comp.id}` : `क्षमता योग्यता परख: ${comp.id}`}
                                </span>
                                <button
                                  onClick={() => {
                                    setActiveAssessmentCompId(null);
                                    setSelectedAnswers({});
                                    setAssessmentStatus('idle');
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-white transition-colors"
                                >
                                  {isEn ? 'Cancel' : 'रद्द करें'}
                                </button>
                              </div>

                              <div className="space-y-6">
                                {(ASSESSMENT_QUESTIONS[comp.id]?.[isEn ? 'en' : 'hi'] || ASSESSMENT_QUESTIONS['COMP-001'][isEn ? 'en' : 'hi']).map((q, qId) => (
                                  <div key={qId} className="space-y-2.5">
                                    <h6 className="text-[10.5px] font-semibold text-slate-200 leading-relaxed">
                                      {qId + 1}. {q.question}
                                    </h6>
                                    <div className="space-y-1.5 ml-1">
                                      {q.options.map((option, oId) => {
                                        const isSelected = selectedAnswers[qId] === oId;
                                        return (
                                          <button
                                            key={oId}
                                            onClick={() => {
                                              setSelectedAnswers(prev => ({ ...prev, [qId]: oId }));
                                            }}
                                            className={`w-full text-left p-3 rounded-xl border text-[10px] leading-relaxed transition-all flex items-start gap-2.5 ${
                                              isSelected
                                                ? 'bg-blue-600/10 border-blue-600/80 text-blue-300 font-medium'
                                                : 'bg-slate-950/45 border-slate-900 text-slate-400 hover:bg-slate-900/60 hover:text-slate-300'
                                            }`}
                                          >
                                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                              isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-750'
                                            }`}>
                                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <span>{option}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {assessmentStatus === 'failed' && (
                                <div className="p-3.5 bg-rose-950/15 border border-rose-900/40 text-[10px] text-rose-400 rounded-xl leading-relaxed flex items-start gap-2">
                                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                  <span>
                                    {isEn 
                                      ? "Assessment failed. One or more answers are incorrect. Please review the briefings and materials and try again." 
                                      : "मूल्यांकन विफल रहा। एक या अधिक उत्तर गलत हैं। कृपया विवरण और अध्ययन सामग्री की समीक्षा करें और पुनः प्रयास करें।"}
                                  </span>
                                </div>
                              )}

                              {assessmentStatus === 'passed' && (
                                <div className="p-4 bg-emerald-950/25 border border-emerald-500/40 text-[10.5px] text-emerald-400 rounded-xl leading-relaxed flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <b className="font-bold block uppercase tracking-wide">{isEn ? 'PERFORMANCE EXCELLENT - 100% SCORE!' : 'शानदार प्रदर्शन - 100% अंक प्राप्त!'}</b>
                                    <p className="text-slate-300 text-[10px] mt-0.5">
                                      {isEn 
                                        ? `Congratulations! You have successfully mastered and bridged the gap for ${comp.id}. Competency certification level is updated to L${comp.targetLevel}!`
                                        : `बधाई हो! आपने सफलतापूर्वक परीक्षण उत्तीर्ण किया। संशोधित कौशल स्तर अब L${comp.targetLevel} हो गया है!`}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {assessmentStatus !== 'passed' && (
                                <button
                                  onClick={() => {
                                    const questions = ASSESSMENT_QUESTIONS[comp.id]?.[isEn ? 'en' : 'hi'] || ASSESSMENT_QUESTIONS['COMP-001'][isEn ? 'en' : 'hi'];
                                    let allCorrect = true;
                                    
                                    questions.forEach((q, qId) => {
                                      if (selectedAnswers[qId] !== q.correctIndex) {
                                        allCorrect = false;
                                      }
                                    });

                                    // Make sure both are answered
                                    if (selectedAnswers[0] === undefined || selectedAnswers[1] === undefined) {
                                      alert(isEn ? "Please answer all questions before submitting." : "जमा करने से पहले कृपया सभी प्रश्नों के उत्तर दें।");
                                      return;
                                    }

                                    if (allCorrect) {
                                      setAssessmentStatus('passed');
                                      if (onPassAssessment) {
                                        onPassAssessment(comp.id, comp.targetLevel);
                                      }
                                    } else {
                                      setAssessmentStatus('failed');
                                    }
                                  }}
                                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <span>{isEn ? 'Submit Answers & Verify Mastery' : 'उत्तर जमा करें और सत्यापन प्राप्त करें'}</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4.5 flex flex-wrap justify-between items-center gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-white uppercase tracking-wide">
                                  {isEn ? 'Interactive Capability Assessment Module' : 'इंटरएक्टिव क्षमता मूल्यांकन मॉड्यूल'}
                                </p>
                                <p className="text-[9.5px] text-slate-400 max-w-xl">
                                  {isEn 
                                    ? `Complete the diagnostic multiple-choice assessment to bridge ${comp.id} gap. Achieving 100% correct answers authorizes and marks this operational competency gap as COMPLETED.`
                                    : `क्षमता अंतराल मिटाने के लिए ${comp.id} का प्रश्नोत्तरी अभ्यास पूरा करें। 100% अंक प्राप्त करने पर आपका यह क्रेडेंशियल 'PASSED' मार्क कर दिया जाएगा।`}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  setActiveAssessmentCompId(comp.id);
                                  setSelectedAnswers({});
                                  setAssessmentStatus('idle');
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] font-mono tracking-wider py-2 px-4.5 rounded-xl uppercase transition-colors cursor-pointer"
                              >
                                ⚡ {isEn ? 'Start Gap Assessment' : 'मूल्यांकन प्रारंभ करें'}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4.5 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                              {isEn ? 'No Competency Gap Detected' : 'कोई क्षमता अंतर नहीं पाया गया'}
                            </p>
                            <p className="text-[9.5px] text-slate-400 select-none">
                              {isEn 
                                ? `Excellent work! Your certified skill level (L${currentLvl}) meets or exceeds the target standard level (L${targetLvl}) for this plant operation.`
                                : `उत्कृष्ट कार्य! आपका प्रमाणित कौशल स्तर (L${currentLvl}) इस संयंत्र संचालन के लिए लक्षित स्तर (L${targetLvl}) से मेल खाता है या उससे अधिक है।`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>

              {/* Toggler Bar */}
              <button 
                onClick={() => toggleExpand(comp.id)}
                className={`w-full py-3 text-[10px] font-bold uppercase tracking-wider font-mono border-t transition-all flex items-center justify-center gap-1.5 ${
                  isExpanded 
                    ? 'bg-blue-950/20 text-blue-400 border-slate-850 hover:bg-blue-950/30' 
                    : hasGap 
                    ? 'bg-orange-500/5 text-orange-400 border-orange-500/10 hover:bg-orange-500/10' 
                    : 'bg-slate-950/40 text-slate-500 border-slate-850 hover:bg-slate-900/40 hover:text-slate-300'
                }`}
              >
                {isExpanded ? (
                  <>
                    <span>{isEn ? 'Close Details & Materials' : 'विवरण और सामग्री बंद करें'}</span>
                    <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
                  </>
                ) : (
                  <>
                    <span>
                      {hasGap 
                        ? (isEn ? '🗺️ Explore Bridge-The-Gap Roadmap' : '🗺️ अंतर पाटने का रोडमैप खोलें') 
                        : (isEn ? '📖 View Mastery Roadmap & Materials' : '📖 मास्टर रोडमैप और सामग्री देखें')}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}
