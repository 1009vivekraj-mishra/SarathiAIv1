/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Competency, Question, LearningResource, KnowledgeAsset } from './types';

export const INITIAL_COMPETENCIES: Competency[] = [
  {
    id: 'COMP-001',
    category: 'Functional',
    name: 'Safety Compliance',
    description: 'Adherence to Zero-Harm plant safety, standards, and PPE regulations.',
    targetLevel: 4,
    levelDescriptions: {
      1: 'Unaware of full PPE guidelines and basic emergency exits.',
      2: 'Follows basic PPE and reports clear unsafe acts under supervision.',
      3: 'Fully compliant with standard plant safety, LOTO protocols, and hazard identification.',
      4: 'Conducts safety workshops, audits risk logs, and implements mitigation measures.',
      5: 'Architect of corporate Safety-First strategies, designs plant shut-down procedures.'
    }
  },
  {
    id: 'COMP-002',
    category: 'Functional',
    name: 'SOP Adherence',
    description: 'Strict execution of defined Standard Operating Procedures for processes.',
    targetLevel: 4,
    levelDescriptions: {
      1: 'Rarely checks written SOPs before execution of mechanical work.',
      2: 'Operates with standard checklists but needs supervision for out-of-spec incidents.',
      3: 'Executes processes autonomously by referencing active SOP indices.',
      4: 'Reviews and updates process SOPs based on metallurgical or mechanical modifications.',
      5: 'Defines SOP governance for high-risk heavy metallurgy operations.'
    }
  },
  {
    id: 'COMP-003',
    category: 'Technical',
    name: 'Equipment Operation',
    description: 'Operation of furnace valves, mill feeders, and high-pressure steam boiler turbines.',
    targetLevel: 4,
    levelDescriptions: {
      1: 'Apprentice tracking control panels under strict supervisory oversight.',
      2: 'Operates core feeders and valves under stable state plant conditions.',
      3: 'Independently controls, calibrates, and starts cooling systems and conveyors.',
      4: 'Diagnoses complex thermodynamic faults, handles emergency blast furnace purges.',
      5: 'Optimizes entire steel melting shop (SMS) throughput and furnace operations.'
    }
  },
  {
    id: 'COMP-004',
    category: 'Technical',
    name: 'Maintenance & Troubleshooting',
    description: 'Corrective and predictive mechanical and electrical maintenance.',
    targetLevel: 3,
    levelDescriptions: {
      1: 'Basic component greasing and belt tension checks during shutdowns.',
      2: 'Replaces generic bearing pads, checks oil levels, and tightens standard bolts.',
      3: 'Identifies mechanical misalignment and troubleshoots hydraulic pressure degradation.',
      4: 'Conducts vibration root-cause analysis, commissions new mill motors.',
      5: 'Deploys plant-wide predictive maintenance AI models and vibration baselines.'
    }
  },
  {
    id: 'COMP-005',
    category: 'Digital',
    name: 'Data & Dashboard Literacy',
    description: 'Interpretation of SCADA telemetry, industrial IoT signals, and operational reports.',
    targetLevel: 3,
    levelDescriptions: {
      1: 'Reads simplistic digital gauges but cannot correlate indicators.',
      2: 'Monitors real-time SCADA dashboards but relies on control room operators for alerts.',
      3: 'Successfully correlates pressure lines with fuel feed rates to optimize process.',
      4: 'Builds customized business-intelligence views, queries SQL plant registers.',
      5: 'Designs enterprise-wide control-systems telemetry architectures.'
    }
  },
  {
    id: 'COMP-006',
    category: 'Digital',
    name: 'AI & SCADA Integration',
    description: 'Utilizing automated assistance tools, predictive alerts, and AI Trainers.',
    targetLevel: 3,
    levelDescriptions: {
      1: 'Dismisses smart cognitive guidelines or prefers manually printed logs.',
      2: 'Understands basic automated alerts but ignores recommendations.',
      3: 'Uses Sarathi AI and expert engines to formulate remediation actions.',
      4: 'Configures neural network alarms for preventative mill thermal triggers.',
      5: 'Spearheads full-scale cognitive plant integration and system automation.'
    }
  },
  {
    id: 'COMP-007',
    category: 'Behavioral',
    name: 'Proactive Communications',
    description: 'Clear, concise briefing of shift details, hazard incidents, and handovers.',
    targetLevel: 3,
    levelDescriptions: {
      1: 'Fails to document shift handovers or notify supervisors of pressure changes.',
      2: 'Relays basic work orders but lacks detail in diagnostic reports.',
      3: 'Delivers comprehensive shift-change briefings, logs technical changes professionally.',
      4: 'Leads cross-department emergency taskforce communication during shutdowns.',
      5: 'Mentors organization on executive communication and plant risk reporting.'
    }
  },
  {
    id: 'COMP-008',
    category: 'Leadership',
    name: 'Coaching & Mentoring',
    description: 'Preserving, teaching, and distributing metallurgy and safety expertise.',
    targetLevel: 3,
    levelDescriptions: {
      1: 'Unwillingness to document troubleshooting solutions or guide trainees.',
      2: 'Occasionally answers questions from junior technicians in the shift.',
      3: 'Acts as active mentor, records knowledge assets, approves standard procedures.',
      4: 'Structures apprentice rotation programs, establishes talent readiness criteria.',
      5: 'Created plant-wide Technical Academy of Excellence, coaches plant heads.'
    }
  }
];

// Baseline Question Bank containing exactly 25 questions divided into 5 categories:
// technical, soft skill, digital literacy, scenario based, leadership
export const BASELINE_QUESTION_BANK: Question[] = [
  // CATEGORY 1: Technical (5 Questions)
  {
    id: 'Q-001',
    category: 'technical',
    competencyId: 'COMP-004',
    questionText: 'What is the root cause when you notice a localized high-frequency whistling noise near a hydraulic pump manifold?',
    options: [
      'Normal fluid thermal expansion',
      'High-pressure fluid cavitation or seal degradation',
      'Normal motor cooling fan sound',
      'Standard structural vibration'
    ],
    correctAnswerIndex: 1,
    type: 'technical',
    level: 3
  },
  {
    id: 'Q-002',
    category: 'technical',
    competencyId: 'COMP-003',
    questionText: 'Which parameters must be verified prior to initiating the hot air blast valve sequence in a Blast Furnace?',
    options: [
      'Only raw ore storage level',
      'Valve pressure seals, nitrogen purging line status, and hydraulic fluid pressure values',
      'Total plant ambient humidity only',
      'The number of operators active in the control grid'
    ],
    correctAnswerIndex: 1,
    type: 'technical',
    level: 4
  },
  {
    id: 'Q-003',
    category: 'technical',
    competencyId: 'COMP-004',
    questionText: 'In predictive maintenance of roll mills, what does a sudden elevation in the 3rd harmonic frequency of a bearing vibration spectrum signify?',
    options: [
      'Normal lubricating grease viscosity increase',
      'Structural base bolt loosening or major shaft misalignment faults',
      'Slight increase in electrical grid frequency',
      'An expected breakdown of outer race metal that can be ignored for months'
    ],
    correctAnswerIndex: 1,
    type: 'technical',
    level: 4
  },
  {
    id: 'Q-004',
    category: 'technical',
    competencyId: 'COMP-001',
    questionText: 'What is the safe procedure before performing mechanical work on a high-temperature rotary motor kiln?',
    options: [
      'Switch off the local toggler and begin work immediately',
      'Implement complete LOTO (Lockout-Tagout), bleed residual pneumatic lines, and verify zero kinetic state',
      'Tell the adjacent conveyor technician to not start the conveyor system',
      'Wait exactly 5 minutes for the kiln to naturally stop spinning'
    ],
    correctAnswerIndex: 1,
    type: 'safety',
    level: 3
  },
  {
    id: 'Q-005',
    category: 'technical',
    competencyId: 'COMP-003',
    questionText: 'Which electrical protective relay detects insulation failures and high leakage current within a 6.6KV high voltage pump motor?',
    options: [
      'Simple overcurrent thermal breaker',
      'Zero sequence current Earth Fault Relay',
      'Phase balance relay',
      'Standard fuse elements'
    ],
    correctAnswerIndex: 1,
    type: 'technical',
    level: 4
  },

  // CATEGORY 2: Soft Skill (Proactive Communications) (5 Questions)
  {
    id: 'Q-006',
    category: 'soft skill',
    competencyId: 'COMP-007',
    questionText: 'During a critical shift change, you detect anomalous fuel fluctuations. What is the most functional action?',
    options: [
      'Wait for the next morning log review to let administrative leads decide',
      'Log the exact telemetry in the transition sheet and conduct a verbal, high-priority briefing with the incoming technician',
      'Leave immediately to catch the shift transport; they will notice the dashboard alert anyway',
      'Send an email to the plant manager and hope they check it early tomorrow'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 3
  },
  {
    id: 'Q-007',
    category: 'soft skill',
    competencyId: 'COMP-007',
    questionText: 'Your co-worker is bypassing a non-safety SOP checklist to expedite a delayed mill batch. How do you communicate this?',
    options: [
      'Publicly call them out over the plant walkie-talkie to enforce SOP guidelines',
      'Discuss private concerns immediately, highlighting that a batch failure is more expensive than a 10-minute calibration delay',
      'Ignore it as long as the supervisor is not looking',
      'Immediately file a formal human resources complaint without talking with the technician first'
    ],
    correctAnswerIndex: 1,
    type: 'mcq',
    level: 3
  },
  {
    id: 'Q-008',
    category: 'soft skill',
    competencyId: 'COMP-007',
    questionText: 'Which style of technical report is most effective for an plant shutdown review?',
    options: [
      'Detailed narrative prose describing general shift layout history',
      'Bullet points detailing target metrics, specific mechanical failures with timestamps, and precise root-cause analysis findings',
      'A one-sentence confirmation that the team did its best but breakdown happened',
      'An informal chat summary screenshots pasted in a standard text file'
    ],
    correctAnswerIndex: 1,
    type: 'problem',
    level: 3
  },
  {
    id: 'Q-009',
    category: 'soft skill',
    competencyId: 'COMP-007',
    questionText: 'A shift supervisor gives you contrasting verbal instructions vs the standard plant Safety SOP guidelines. What is your response?',
    options: [
      'Follow the supervisor blindly since they bear full organizational accountability',
      'Assertively cite the Safety SOP framework, pointing out potential hazardous exposures, and seek written override if required',
      'Bypass all safety guidelines but execute very quickly to prevent accidents',
      'Complain to secondary operators on other lines instead of confronting the supervisor'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 3
  },
  {
    id: 'Q-010',
    category: 'soft skill',
    competencyId: 'COMP-002',
    questionText: 'When leading a toolbox meeting before hot mill maintenance, which topic holds absolute operational precedence?',
    options: [
      'A review of yesterday production efficiency outputs',
      'LOTO checklist audits, escape path clarifications, and job safety hazards breakdown',
      'Discussion on global corporate metallurgical market trends',
      'General shift schedule assignments and overtime allocations'
    ],
    correctAnswerIndex: 1,
    type: 'mcq',
    level: 2
  },

  // CATEGORY 3: Digital Literacy (5 Questions)
  {
    id: 'Q-011',
    category: 'digital literacy',
    competencyId: 'COMP-005',
    questionText: 'A SCADA screen shows the cooling loop pressure blinking bright magenta with a "COMM STALE" flag. What does this mean?',
    options: [
      'The water pipeline has completely frozen',
      'The dashboard has lost active sensor communication with the field telemetry transducer',
      'The pressure is exceeding advanced safety limits and needs emergency purge',
      'The software interface has completed a routine update schedule'
    ],
    correctAnswerIndex: 1,
    type: 'mcq',
    level: 3
  },
  {
    id: 'Q-012',
    category: 'digital literacy',
    competencyId: 'COMP-005',
    questionText: 'You want to check the historical fluid levels of the fuel tanks over the last 14 days. Where should you look?',
    options: [
      'The current active alarm panel grid',
      'The SCADA Historical Historian trends logger interface',
      'Directly on the physical glass pipe of the vessel tank',
      'The paper register locked in the main office storage unit'
    ],
    correctAnswerIndex: 1,
    type: 'technical',
    level: 3
  },
  {
    id: 'Q-013',
    category: 'digital literacy',
    competencyId: 'COMP-006',
    questionText: 'How is Sarathi AI cognitive assistant tool used to resolve an unexpected PLC alarm fault code 0xF44?',
    options: [
      'Type the code into a generic public web search machine',
      'Utilize Sarathi AI cognitive search to cross-reference plant-specific manuals, related SOP codes, and expert resolution logs',
      'Contact the local utility team to reinstall the software interface',
      'Manually search all physical storage rooms for a Siemens manual from 2008'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 3
  },
  {
    id: 'Q-014',
    category: 'digital literacy',
    competencyId: 'COMP-005',
    questionText: 'Which telemetry system compiles sensory data from physical transducers across the plant and routes it to central operators?',
    options: [
      'Standard ERP database pipelines',
      'SCADA (Supervisory Control and Data Acquisition) / industrial IoT networks',
      'Local power generators and thermal converters',
      'Digital feedback portals completed by plant technicians'
    ],
    correctAnswerIndex: 1,
    type: 'mcq',
    level: 3
  },
  {
    id: 'Q-015',
    category: 'digital literacy',
    competencyId: 'COMP-006',
    questionText: 'What is the role of an industrial internet of things (IIoT) edge vibrational gateway?',
    options: [
      'To physically balance the rotate mills alignment',
      'To record high-frequency electrical vibrations and stream predictive warnings to cloud databases',
      'To provide internet access to office personnel during shift breaks',
      'To regulate the voltage current within cooling water units'
    ],
    correctAnswerIndex: 1,
    type: 'mcq',
    level: 4
  },

  // CATEGORY 4: Scenario Based (5 Questions)
  {
    id: 'Q-016',
    category: 'scenario based',
    competencyId: 'COMP-001',
    questionText: 'Scenario: You detect standard water puddling next to a high resistance overhead electrical conduit grid. What is your immediate action?',
    options: [
      'Get a dry mop and wipe the water yourself immediately',
      'Isolate the zone visually, report potential insulation hazards to Electrical Maintenance, and initiate a barrier cordon',
      'Ignore it because the cable lines are supposed to be fully insulated',
      'Keep working nearby but avoid taking off your safety gloves'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },
  {
    id: 'Q-017',
    category: 'scenario based',
    competencyId: 'COMP-002',
    questionText: 'Scenario: Plant throughput demands require a chemical blast temperature of 1200C, but the pipeline vessel SOP states max safety load is 1150C. What should you do?',
    options: [
      'Slowly boost thermodynamic feed and hope automatic cooling handles the high temperature deviation',
      'Strictly restrict blast values to the SOP threshold of 1150C, file a throughput safety incident report, and alert operation control',
      'Bypass manual safety triggers to fulfill organization production requirements for the shift',
      'Ask secondary contractors if they are comfortable heating it past safe thresholds'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },
  {
    id: 'Q-018',
    category: 'scenario based',
    competencyId: 'COMP-003',
    questionText: 'Scenario: During standard operating cycles of an oxygen feeder boiler, the indicator light turns bright amber accompanied by low-frequency pressure shuddering.',
    options: [
      'Accelerate coal feed to bypass the drop in pressure levels',
      'Trigger safety steam bypass, verify inlet flow pressure values via physical line gages, and cross-reference emergency SOP index 4.2',
      'Turn off all monitoring control panels and wait 10 minutes for pressures to normalize',
      'Keep standard operating procedures running normally and wait for high supervisor intervention'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },
  {
    id: 'Q-019',
    category: 'scenario based',
    competencyId: 'COMP-004',
    questionText: 'Scenario: A conveyer belt carrying high-grade iron ore begins tracking heavily towards the left side, causing side wear.',
    options: [
      'Apply industrial lubricating oil directly on the top surface of the belt',
      'Execute SOP belt centering: adjust tensioning pulleys on the side, check tail pully dirt collection, and verify roller wear state',
      'Reduce speed of feeder mill to 20% capacity to avoid high-temperature friction',
      'Wait for the shift conveyor to naturally center the structural loads'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 3
  },
  {
    id: 'Q-020',
    category: 'scenario based',
    competencyId: 'COMP-001',
    questionText: 'Scenario: An automated carbon monoxide leak sensor alert triggers in Tunnel Area B, but physical team members report no visible smoke or gaseous smells. What is your response?',
    options: [
      'Cancel the digital alert trigger so the team can finish repairs in Area B',
      'Evacuate Tunnel Area B immediately, treat as an active hazard, test with portable chemical detectors, and secure safe breathing environment',
      'Wait 30 minutes to cross-check if other alarms trigger before evacuating',
      'Send a trainee down to inspect the chemical sensor calibration status'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },

  // CATEGORY 5: Leadership (5 Questions)
  {
    id: 'Q-021',
    category: 'leadership',
    competencyId: 'COMP-008',
    questionText: 'Your new apprentice has failed the safety threshold check twice during cooling loop drills. What is your coaching response?',
    options: [
      'Recommend their registration contract be removed immediately',
      'Set an intensive 1-on-1 walkthrough of the SOP criteria, visually illustrate valve flow sequences, and conduct a safe micro-assessment',
      'Tell them to observe other crew members but don\'t let them handle physical valves again',
      'Mark their score as passing to save team stats and let them learn on live operations'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },
  {
    id: 'Q-022',
    category: 'leadership',
    competencyId: 'COMP-008',
    questionText: 'You notice two distinct senior mechanical experts have contradicting methods to troubleshoot boiler alignments. How do you resolve this?',
    options: [
      'Pick the method of the expert with the highest designation years and ignore the other',
      'Convene a peer panel review, compare empirical vibration trends of both methods, and update the Standard operating guidelines (SOP)',
      'Let them debate during shift handovers; competitive technical styles are good for productivity',
      'Avoid intervening and allow each technician to work how they prefer'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },
  {
    id: 'Q-023',
    category: 'leadership',
    competencyId: 'COMP-008',
    questionText: 'A retiring shift lead with 40 years of blast furnace experience has not documented unique emergency mitigation methods. How do you preserve this?',
    options: [
      'Write a general note thanking them for their dedicated service',
      'Incentivize them to engage in Sarathi AI Knowledge Preservation workflow, audio-capture structural emergency steps, and publish structured SOP assets',
      'Let them retire without documentation; standard manuals from equipment suppliers are enough',
      'Ask adjacent junior technicians to take quick pictures of what they do'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },
  {
    id: 'Q-024',
    category: 'leadership',
    competencyId: 'COMP-008',
    questionText: 'Your department is introducing high-tech digital SCADA grids, but several experienced older technicians are highly resistant. How do you lead them?',
    options: [
      'Reprimand technicians who do not use the software on shift logs',
      'Launch peer-to-peer training paired with young digital natives, highlighting how SCADA protects physical safety and prevents shutdowns',
      'Only use SCADA for the younger generation and let older shift workers bypass digital systems entirely',
      'Postpone SCADA rollout indefinitely to maintain team comfort'
    ],
    correctAnswerIndex: 1,
    type: 'scenario',
    level: 4
  },
  {
    id: 'Q-025',
    category: 'leadership',
    competencyId: 'COMP-008',
    questionText: 'Which metrics are fundamental to determine if your department succession planning pipeline is organizational robust?',
    options: [
      'The average daily shift overtime recorded this year',
      'Ready Now and Ready in 12 Months successor competency indicators linked directly with calculated WRI values',
      'Total count of general resume applications in HR database',
      'The number of corporate emails sent per week'
    ],
    correctAnswerIndex: 1,
    type: 'mcq',
    level: 4
  }
];

export const INITIAL_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'RES-001',
    title: 'Zero-Harm Emergency LOTO Shutdown Protocol',
    category: 'Safety Regulations',
    type: 'SOP Document',
    durationMin: 20,
    link: '#SOP-001',
    competencyId: 'COMP-001'
  },
  {
    id: 'RES-002',
    title: 'Blast Furnace Hydration & Cooler Seal Checkup Guidelines',
    category: 'Blast Furnace Ops',
    type: 'SOP Document',
    durationMin: 30,
    link: '#SOP-002',
    competencyId: 'COMP-002'
  },
  {
    id: 'RES-003',
    title: 'SCADA Panel Level Troubleshooting Flowchart',
    category: 'Telemetry Integration',
    type: 'Interactive Simulator',
    durationMin: 15,
    link: '#SOP-003',
    competencyId: 'COMP-005'
  },
  {
    id: 'RES-004',
    title: 'Predictive Vibration Harmonics Diagnostic Course',
    category: 'Reliability Maintenance',
    type: 'Video Tutorial',
    durationMin: 45,
    link: '#SOP-004',
    competencyId: 'COMP-004'
  },
  {
    id: 'RES-005',
    title: 'PLC Logic Gate Adjustment & Interfacing',
    category: 'Digital Systems',
    type: 'Manual',
    durationMin: 25,
    link: '#SOP-005',
    competencyId: 'COMP-006'
  },
  {
    id: 'RES-006',
    title: 'Active Technical Mentorship & Plant Communication Best Practices',
    category: 'Leadership Skills',
    type: 'Video Tutorial',
    durationMin: 15,
    link: '#SOP-006',
    competencyId: 'COMP-008'
  }
];

export const INITIAL_KNOWLEDGE_ASSETS: KnowledgeAsset[] = [
  {
    id: 'KNOW-001',
    title: 'Troubleshooting Critical Blast Furnace Charging Valve Seals',
    category: 'Troubleshooting Guides',
    summary: 'Preserved knowledge of retiring senior expert V. Krishnamurthy (34 yrs Exp). Details emergency hydraulic bypass guidelines when secondary charging valve seals show mechanical failure or vibration triggers.',
    steps: [
      'Stop automatic raw ore feeding sequence immediately.',
      'Check cooling manifold pressure and compare gauge 40B vs control panel logs.',
      'Initiate secondary gaseous nitrogen seal purge line manually from control deck B.'
    ],
    bestPractices: [
      'Listen for low-frequency whistling: it warns of standard rubber casing erosion early.',
      'Always keep manual spare seal kits pre-cooked in oil storage to prevent rubber crisping.',
      'Never operate furnace core above 1150C if pressure differential exceeded 15%.'
    ],
    failureLearnings: [
      'We had a total line freeze in 2018 when mechanical teams ignored primary warning alarms for 4 hours. Use the pre-heating purge protocols before manual intervention.'
    ],
    authorId: 'EMP-001',
    authorName: 'V. Krishnamurthy',
    rating: 4.8,
    ratingsCount: 24,
    bookmarksCount: 15,
    createdAt: '2026-05-15',
    tags: ['Blast Furnace', 'Valves', 'Hydraulics', 'Emergency SOP']
  },
  {
    id: 'KNOW-002',
    title: 'Hot Strip Mill Roll Alignment Calibration Metrics',
    category: 'SOPs',
    summary: 'Procedures to calibrate structural mill rollers to prevent side-tracking and strip curl during high-velocity steel rolling drafts.',
    steps: [
      'Execute complete machinery power lockout (LOTO).',
      'Use ultrasonic micrometers to check parallelism at both ends of mill rollers.',
      'Adjust horizontal tension block settings in 0.2mm micro-increments.'
    ],
    bestPractices: [
      'Repeat check once rollers cool down below 80C to avoid thermal expansion bias.',
      'Conduct a visual tracking pilot batch using recycled carbon sheet rolls.'
    ],
    failureLearnings: [
      'Calibrating hot rolls directly causes structural calibration drift. Always wait for thermal equilibrium.'
    ],
    authorId: 'EMP-002',
    authorName: 'Sujata Banerjee',
    rating: 4.9,
    ratingsCount: 18,
    bookmarksCount: 9,
    createdAt: '2026-04-10',
    tags: ['Rolling Mill', 'SOP Adherence', 'Calibration', 'Predictive Maintenance']
  },
  {
    id: 'KNOW-003',
    title: 'Preventative Earth Fault Purging for 6.6KV Slag Pumps',
    category: 'Lessons Learned',
    summary: 'Lessons harvested from secondary motor failures in Slag Pump Station 3. This operational checklist keeps current insulation values stable during intense slurry flow periods.',
    steps: [
      'Perform monthly winding insulation resistance checks via mega-ohm gauges.',
      'Redirect slurry splash-guards to eliminate mineral moisture deposit on junction blocks.'
    ],
    bestPractices: [
      'Inspect the earth pit connection salt content quarterly. If dry, add electrolyte solution.'
    ],
    failureLearnings: [
      'Unprotected terminals on slag pump motors easily corrode in ambient high-humidity steam environments, leading to immediate breaker trips.'
    ],
    authorId: 'EMP-003',
    authorName: 'Amit Verma',
    rating: 4.6,
    ratingsCount: 12,
    bookmarksCount: 7,
    createdAt: '2026-06-01',
    tags: ['Electrical', 'Preventative', 'Pump Maintenance', 'Safety Compliance']
  }
];

export const DIALOGUE_CHUNKS = [
  "Sarathi AI: Welcome, Senior Expert Amit Verma. Let's record your wisdom. What critical failure should the next generation of engineers know about the Sinter Plant Gas Exhaust Fan?",
  "Amit Verma: Ah, yes. The Sinter Plant Exhaust is prone to sudden vibration spikes. When the hot exhaust gases cool too fast, dust deposits build unevenly on the fan blades. This causes immediate dynamic rotor unbalance.",
  "Sarathi AI: Fascinating. What specific troubleshooting steps should a junior engineer execute if they detect a warning vibration of 6.2 mm/s on active SCADA screens?",
  "Amit Verma: First, they must NEVER ignore it. Second, they should immediately schedule a visual check. Third, they must blast the rotor blades with high-pressure dry steam through purge port C while rotating the shaft slowly. That cleans off the localized slag dust perfectly without destroying the bearings. This takes precisely 20 minutes and saves us a 10-hour breakdown!",
  "Sarathi AI: Excellent. Are there key safety precautions during purge?",
  "Amit Verma: The steam is superheated at 180C. Proper thermal isolation gloves are life-saving. Verify steam drain valves are cleared or backpressure will explode the nozzle seals. Junior techs always forget this!"
];

export const INITIAL_SUCCESSION_PLANS = [
  {
    id: 'SUC-001',
    roleName: 'Plant Head - Blast Furnace Ops',
    department: 'Blast Furnace',
    criticalSuccessorId: 'SUC-USR-01',
    successorName: 'Rajesh Mukherji',
    readyTimeline: 'Ready Now' as const,
    fitnessScore: 92.5,
    status: 'Active' as const
  },
  {
    id: 'SUC-002',
    roleName: 'Head Metallurgist',
    department: 'Quality Control',
    criticalSuccessorId: 'SUC-USR-02',
    successorName: 'Anjali Sharma',
    readyTimeline: 'Ready in 6 Months' as const,
    fitnessScore: 81.2,
    status: 'Active' as const
  },
  {
    id: 'SUC-003',
    roleName: 'Electrical Infrastructure Senior Advisor',
    department: 'Maintenance & Reliability',
    criticalSuccessorId: 'EMP-003',
    successorName: 'Amit Verma',
    readyTimeline: 'Ready in 12 Months' as const,
    fitnessScore: 78.4,
    status: 'Approved' as const
  }
];

// Multilingual Dictionary
export const TRANSLATIONS = {
  en: {
    // Top-level Info
    tagline: "Develop People. Preserve Knowledge. Measure Capability.",
    enterpriseMode: "Workforce Intelligence Loop Active",
    loggedAs: "Logged in as",
    switchRole: "View Persona Workspace:",
    languageLabel: "Language",
    employeesManaged: "Employees Managed",
    knowledgeAssetsCount: "Knowledge Assets",
    systemHealth: "System Health",
    askTrainerButton: "Ask Sarathi AI",
    retiringWarn: "Retirement Preservations Active",
    alertSOP: "Blast Furnace retirements approaching. Capture interview status: active.",
    
    // Auth & Onboarding
    createAccount: "Create Enterprise Identity Account",
    authSubtitle: "Secure identity registration into the industrial cognitive loop.",
    namePlaceholder: "Full Name (e.g., Rajesh Mukherji)",
    empIdPlaceholder: "Employee ID (e.g., SF-2026-BF9)",
    emailPlaceholder: "Corporate Email",
    passPlaceholder: "Password",
    registerBtn: "Initiate Registration",
    alreadyHave: "Back to login",
    needAccount: "Register new operative account",
    loginTitle: "Operational Access Point",
    loginBtn: "Authorize Entry",

    onboardingTitle: "Step-by-Step Onboarding Sequence",
    onboardingSub: "Build baseline skill configuration mapped to your plant unit.",
    step1: "1. Plant Organization",
    step2: "2. Credentials & Experience",
    step3: "3. Role Competency Init",
    step4: "4. Baseline Assessment",
    companyLabel: "Plant Enterprise Company Name",
    unitLabel: "Operational Unit / Plant Site",
    deptLabel: "Primary Department",
    desigLabel: "Corporate Designation",
    roleLabel: "Functional Role Profile",
    othersSpecify: "Specify manual customized role designation...",
    expLabel: "Primary Experience (Years)",
    eduLabel: "Highest Technical/Industrial Education",
    certLabel: "Acquired Certifications (comma separated)",
    retiringQuestion: "Are you planning to retire or leave within the next 12 months?",
    retiringIntro: "If yes, the system will prompt the Expert Knowledge Capture program to preserve your system expertise.",
    yesLabel: "Yes, transitioning within 12 months",
    noLabel: "No, ongoing growth focus",
    nextBtn: "Authenticate & Proceed",
    prevBtn: "Return Sequence",

    compInitTitle: "Automated Target Competency Assignment",
    compInitSub: "The plant framework has automatically assigned target capability lines for your role.",
    cannotAssign: "Skill target levels are managed by core HR framework and cannot be modified by individuals.",
    targetLevel: "Target Level",

    compulsoryTitle: "Compulsory Baseline Assessment",
    compulsoryIntro: "To unlock the system dashboards, you must complete this dynamic, randomized baseline evaluation consisting of exactly 25 questions across 5 industrial pillars.",
    categoryLabel: "Category Group",
    questionLabel: "Question",
    selectedAns: "Select your active operational response:",
    submitAssessment: "Finalize Baseline Evaluation & Score Gaps",
    mustAtLeast: "Please answer all questions. Score will compute baseline WRI. Remaining:",

    // Dashboard Items
    wriTitle: "Workforce Readiness Index (WRI)",
    wriTrans: "Calculated from: 35% Competencies, 25% Assessments, 20% Learning, 10% Knowledge contribution, 10% Engagement.",
    wriLevel: "Readiness State",
    kriTitle: "Knowledge Risk Index (KRI)",
    kriDescription: "Refers to: Retirement concentration, documentation coverage, successor coverage, and team dependency.",
    skillPassport: "Active Skill Passport Identity",
    careerAdviser: "Succession & Career Path Advising",
    personalStats: "Personal Analytics Card",
    growthHistory: "Competency Progression History",
    
    // Modules / Tabs
    tabLearning: "Learning Intelligence",
    tabKnowledge: "Knowledge Intelligence",
    tabManagement: "Command Center",
    
    // Learning Center
    trainerTitle: "AI Cognitive Trainer Protocol",
    trainerHelper: "Ask technical mechanical, electrical queries in English, Hindi status, or Hinglish. Sarathi RAG system cross-checks SOP standard manuals.",
    askQueryPlaceholder: "e.g., LOTO procedures in high voltage pumps? / Blast furnace pressure valve alarm check kaise karein?",
    confidenceScore: "Confidence Score",
    sourceCiting: "Standard Manual Citation",
    recLearning: "Suggested Practice Course",
    relatedExpert: "Identified Discipline Expert",
    learningCenter: "Active Learning Hub & Path Engine",
    viewSopText: "Read SOP / Start Training Path",
    takeReassess: "Operate Micro Re-Assessment to upgrade Competency score",
    effectivenessScore: "Learning Effectiveness Gain",
    completedPath: "Upgrade Complete!",
    
    // Knowledge Center
    khubTitle: "Enterprise Structured Knowledge Hub",
    khubSub: "Seeded plant knowledge files, field checklists, and expert interview SOPs.",
    searchPlaceholder: "Search SOPs / troubleshooting guides by keywords...",
    addKnowledgeTitle: "Contribute New SOP / Lesson Learned",
    submitSop: "Inject SOP into Knowledge System",
    expertBrain: "PreserveRetiring Knowledge Interviews (AI)",
    dialogueLabel: "Retiring Expert Dialogue / Interview Transcript",
    generateAsset: "AI Convert Dialogue to Structured SOP",
    savedToHub: "Preserved and saved permanently in Central knowledge base!",
    expertTitle: "Automated Expert Identification Engine",
    experScore: "Calculated Expert Index Score",
    mentorTitle: "Active Mentor Connect Grid",
    requestMentorBtn: "Initiate Mentorship Request",
    mentorPending: "Pending Approval",
    mentorApproved: "Connected - Active Session",
    
    // Manager Metrics
    managerWorkspace: "Operational Manager Workspace",
    viewPersonal: "Self Competency Reports",
    viewTeam: "Team Capability Report Grid",
    teamReadiness: "Team Capability Heatmap Matrix",
    actionRequired: "Pending Apprentice Mentorship Requests",
    approveBtn: "Approve Mentorship Support",
    rejectBtn: "Reject Request",
    successionPipelineTitle: "Critical Role Succession Pipelines",

    // Leadership Metrics
    leadershipWorkspace: "Strategic Workforce Command Center",
    viewEmployeeReport: "Employee Skill Passports Ledger",
    viewTeamReport: "High-level Operations Heatmaps",
    viewOrgReport: "Organizational Readiness Index (WRI)",
    gapsSeverity: "Active Plant Capability Gaps",
    criticalRiskTitle: "Immediate System Risk Warning",
    configTitle: "Enterprise Framework Configuration",
    addCompBtn: "Add New Competency Requirement",
    mapRoleBtn: "Map Requirement to Designation Role",

    // General Words
    score: "Score",
    level: "Level",
    status: "Status",
    actions: "Process Action",
    department: "Plant Department",
    company: "Company",
    designation: "Designation",
    yes: "Yes",
    no: "No",
    critical: "Critical",
    developing: "Developing",
    ready: "Ready",
    advanced: "Advanced",
    futureReady: "Future Ready",
    high: "High",
    medium: "Medium",
    low: "Low",
    others: "Others (Manual Entry)"
  },
  hi: {
    // Top-level Info
    tagline: "लोगों का विकास करें। ज्ञान को संजोएं। क्षमता का आकलन करें।",
    enterpriseMode: "कार्यबल इंटेलिजेंस लूप सक्रिय",
    loggedAs: "लॉग इन किया हुआ",
    switchRole: "भूमिका कार्यस्थान बदलें:",
    languageLabel: "भाषा",
    employeesManaged: "प्रबंधित कर्मचारी",
    knowledgeAssetsCount: "ज्ञान परिसंपत्तियां",
    systemHealth: "प्रणाली स्वास्थ्य",
    askTrainerButton: "सारथी AI से पूछें",
    retiringWarn: "सेवानिवृत्ति संरक्षण सक्रिय",
    alertSOP: "ब्लास्ट फर्नेस सेवानिवृत्तियां निकट आ रही हैं। ज्ञान कैप्चर स्थिति: सक्रिय।",

    // Auth & Onboarding
    createAccount: "उद्यम पहचान खाता बनाएं",
    authSubtitle: "औद्योगिक संज्ञानात्मक लूप में सुरक्षित पहचान पंजीकरण।",
    namePlaceholder: "पूरा नाम (उदा. राजेश मुखर्जी)",
    empIdPlaceholder: "कर्मचारी आईडी (उदा. SF-2026-BF9)",
    emailPlaceholder: "कॉर्पोरेट ईमेल ID",
    passPlaceholder: "पासवर्ड दर्ज करें",
    registerBtn: "पंजीकरण शुरू करें",
    alreadyHave: "लॉगिन पर वापस जाएं",
    needAccount: "नया पहचान पत्र दर्ज करें",
    loginTitle: "परिचालन पहुंच केंद्र (Login)",
    loginBtn: "प्रवेश अधिकृत करें",

    onboardingTitle: "क्रमशः ऑनबोर्डिंग प्रक्रिया",
    onboardingSub: "अपने संयंत्र इकाई के अनुसार बुनियादी कौशल विन्यास स्थापित करें।",
    step1: "1. संयंत्र संगठन",
    step2: "2. क्रेडेंशियल्स और अनुभव",
    step3: "3. भूमिका कौशल परिभाषा",
    step4: "4. आधार रेखा मूल्यांकन",
    companyLabel: "संयंत्र उद्यम कंपनी का नाम",
    unitLabel: "परिचालन इकाई / संयंत्र स्थल",
    deptLabel: "मुख्य विभाग",
    desigLabel: "कॉर्पोरेट पद",
    roleLabel: "कार्यात्मक भूमिका प्रोफाइल",
    othersSpecify: "मैनुअल अनुकूलित भूमिका पद निर्दिष्ट करें...",
    expLabel: "प्राथमिक अनुभव (वर्षों में)",
    eduLabel: "उच्चतम तकनीकी/औद्योगिक शिक्षा",
    certLabel: "प्राप्त प्रमाणपत्र (अल्पविराम से अलग)",
    retiringQuestion: "क्या आप अगले 12 महीनों में सेवानिवृत्त होने की योजना बना रहे हैं?",
    retiringIntro: "यदि हाँ, तो प्रणाली आपको आपके विशेषज्ञ ज्ञान को संरक्षित करने की सूचना देगी।",
    yesLabel: "हाँ, अगले 12 महीनों में सेवानिवृत्ति",
    noLabel: "नहीं, विकास पर ध्यान केंद्रित है",
    nextBtn: "सत्यापित करें और आगे बढ़ें",
    prevBtn: "पिछला अनुक्रम",

    compInitTitle: "स्वचालित लक्ष्य क्षमता असाइनमेंट",
    compInitSub: "संयंत्र ढांचे ने आपकी भूमिका के लिए लक्ष्य क्षमता स्तरों को स्वचालित रूप से असाइन किया है।",
    cannotAssign: "कौशल लक्ष्य स्तर कोर एचआर ढांचे द्वारा प्रबंधित हैं और व्यक्तियों द्वारा संशोधित नहीं किए जा सकते।",
    targetLevel: "लक्ष्य स्तर",

    compulsoryTitle: "अनिवार्य आधार रेखा मूल्यांकन",
    compulsoryIntro: "संयंत्र डैशबोर्ड को अनलॉक करने के लिए, आपको 5 औद्योगिक स्तंभों में बिल्कुल 25 प्रश्नों से युक्त इस गतिशील, यादृच्छिक मूल्यांकन को पूरा करना होगा।",
    categoryLabel: "श्रेणी समूह",
    questionLabel: "प्रश्न",
    selectedAns: "सक्रिय परिचालन प्रतिक्रिया चुनें:",
    submitAssessment: "मूल्यांकन पूरा करें और अंतराल मापें",
    mustAtLeast: "कृपया सभी प्रश्नों के उत्तर दें। न्यूनतम शेष प्रश्न:",

    // Dashboard Items
    wriTitle: "कार्यबल तत्परता सूचकांक (WRI)",
    wriTrans: "गणना: 35% क्षमताएं, 25% मूल्यांकन, 20% प्रशिक्षण, 10% ज्ञान संपत्तियां, 10% सहभागिता।",
    wriLevel: "तत्परता की स्थिति",
    kriTitle: "ज्ञान जोखिम सूचकांक (KRI)",
    kriDescription: "संदर्भ: सेवानिवृत्ति संकेंद्रण, प्रलेखन कवरेज, उत्तराधिकारी कवरेज, और संकट स्तर।",
    skillPassport: "सक्रिय कौशल पासपोर्ट पहचान",
    careerAdviser: "उत्तराधिकार और करियर पथ सलाह",
    personalStats: "व्यक्तिगत विश्लेषिकी कार्ड",
    growthHistory: "क्षमताओं की प्रगति का इतिहास",

    // Modules / Tabs
    tabLearning: "लर्निंग इंटेलिजेंस (सीखना)",
    tabKnowledge: "नॉलेज इंटेलिजेंस (ज्ञान)",
    tabManagement: "कमांड सेंटर (प्रबंधन)",

    // Learning Center
    trainerTitle: "AI संज्ञानात्मक प्रशिक्षक प्रोटोकॉल",
    trainerHelper: "अंग्रेजी, हिंदी, या हिंग्लिश में तकनीकी प्रश्न पूछें। सारथी RAG प्रणाली SOP मानक पुस्तिकाओं की जांच करती है।",
    askQueryPlaceholder: "जैसे, एलओटीओ प्रक्रियाएं? / ब्लास्ट फर्नेस प्रेशर वाल्व एलार्म कैसे चेक करें?",
    confidenceScore: "विश्वास स्कोर",
    sourceCiting: "मानक मैनुअल संदर्भ",
    recLearning: "सुझाया गया अभ्यास पाठ्यक्रम",
    relatedExpert: "पहचाने गए विशेषज्ञ",
    learningCenter: "सक्रिय शिक्षण हब और विकास पथ",
    viewSopText: "एसओपी पढ़ें / प्रशिक्षण प्रारंभ करें",
    takeReassess: "योग्यता स्कोर अपग्रेड करने के लिए माइक्रो मूल्यांकन लें",
    effectivenessScore: "सीखने की प्रभावशीलता में लाभ",
    completedPath: "अपग्रेड पूरा हुआ!",

    // Knowledge Center
    khubTitle: "संस्थान संरचित ज्ञान केंद्र",
    khubSub: "सेव किए गए संयंत्र ज्ञान दस्तावेज, फील्ड चेकलिस्ट और विशेषज्ञ साक्षात्कार प्रक्रियाएं।",
    searchPlaceholder: "कीवर्ड द्वारा एसओपी/समस्या निवारण खोजें...",
    addKnowledgeTitle: "नया ज्ञान/एसओपी योगदान दें",
    submitSop: "ज्ञान प्रणाली में एसओपी दर्ज करें",
    expertBrain: "सेवानिवृत्त होने वाले वरिष्ठों का साक्षात्कार (AI)",
    dialogueLabel: "सेवानिवृत्त विशेषज्ञ संवाद / साक्षात्कार प्रतिलेख",
    generateAsset: "AI द्वारा संवाद को संरचित एसओपी में बदलें",
    savedToHub: "सफलतापूर्वक ज्ञान प्रणाली में सहेजा गया और KRI अपडेट हुआ!",
    expertTitle: "स्वचालित विशेषज्ञ पहचान प्रणाली",
    experScore: "विशेषज्ञ सूचकांक स्कोर",
    mentorTitle: "सक्रिय मेंटर कनेक्ट ग्रिड",
    requestMentorBtn: "मेंटरशिप अनुरोध शुरू करें",
    mentorPending: "मंजूरी लंबित",
    mentorApproved: "कनेक्टेड - सक्रिय सत्र",

    // Manager Metrics
    managerWorkspace: "परिचालन प्रबंधक कार्यस्थान",
    viewPersonal: "स्व-योग्यता रिपोर्ट",
    viewTeam: "टीम क्षमता रिपोर्ट ग्रिड",
    teamReadiness: "टीम क्षमता हीटमैप मैट्रिक्स",
    actionRequired: "लंबित प्रशिक्षु मेंटरशिप अनुरोध",
    approveBtn: "मेंटरशिप समर्थन स्वीकृत करें",
    rejectBtn: "अनुरोध अस्वीकार करें",
    successionPipelineTitle: "क्रिटिकल रोल्स उत्तराधिकार पाइपलाइन",

    // Leadership Metrics
    leadershipWorkspace: "रणनीतिक कार्यबल कमांड सेंटर",
    viewEmployeeReport: "कर्मचारी कौशल पासपोर्ट बही",
    viewTeamReport: "उच्च स्तरीय संचालन हीटमैप",
    viewOrgReport: "संगठनात्मक तत्परता सूचकांक (WRI)",
    gapsSeverity: "सक्रिय संयंत्र क्षमता अंतराल",
    criticalRiskTitle: "त्वरित प्रणाली जोखिम चेतावनी",
    configTitle: "उद्यम फ्रेमवर्क विन्यास",
    addCompBtn: "नया वांछित कौशल जोड़ें",
    mapRoleBtn: "पदनाम भूमिका से कौशल जोड़ें",

    // General Words
    score: "स्कोर",
    level: "स्तर",
    status: "स्थिति",
    actions: "प्रक्रिया कार्रवाई",
    department: "संयंत्र विभाग",
    company: "कंपनी",
    designation: "पद",
    yes: "हाँ",
    no: "नहीं",
    critical: "क्रांतिक (Critical)",
    developing: "विकासशील (Developing)",
    ready: "तैयार (Ready)",
    advanced: "उन्नत (Advanced)",
    futureReady: "भविष्य के लिए तैयार",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    others: "अन्य (मैनुअल प्रविष्टि)"
  }
};
