/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, 
  Competency, 
  Question, 
  AssessmentAttempt, 
  LearningResource, 
  KnowledgeAsset, 
  Mentor, 
  MentorRequest, 
  SuccessionPlan,
  CompetencyGap,
  WRIHistory
} from './types';
import { 
  INITIAL_COMPETENCIES, 
  BASELINE_QUESTION_BANK, 
  INITIAL_LEARNING_RESOURCES, 
  INITIAL_KNOWLEDGE_ASSETS, 
  INITIAL_SUCCESSION_PLANS, 
  TRANSLATIONS 
} from './data';
import WRIGauge from './components/WRIGauge';
import AITrainer from './components/AITrainer';
import OnboardingFlow from './components/OnboardingFlow';
import KnowledgeCapture from './components/KnowledgeCapture';
import SkillPassportView from './components/SkillPassportView';
import LearningCurriculumView from './components/LearningCurriculumView';
import VeteranLegacyHub from './components/VeteranLegacyHub';
import { 
  Briefcase, 
  BookOpen, 
  Cpu, 
  Users, 
  UserCheck, 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Bookmark, 
  Share2, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  FolderPlus, 
  Settings, 
  Layers, 
  Activity, 
  Sliders, 
  Globe, 
  Power,
  Star,
  ArrowLeft,
  MessageSquare,
  Send
} from 'lucide-react';

export default function App() {
  // Localization state
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const t = TRANSLATIONS[lang];

  // Current Active Persona
  const [currentPersona, setCurrentPersona] = useState<'Employee' | 'Manager' | 'Leadership'>('Employee');

  // Active expanded feature in bento dashboard
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Multi-tab manager view options
  const [managerSubView, setManagerSubView] = useState<'Personal' | 'Team'>('Team');
  // Multi-tab leadership view options
  const [leadershipSubView, setLeadershipSubView] = useState<'Employees' | 'Managers' | 'Teams' | 'Organization' | 'Retirement'>('Organization');

  // Leadership direct connections
  const [activeConnectManagerId, setActiveConnectManagerId] = useState<string | null>(null);
  const [activeConnectTeamId, setActiveConnectTeamId] = useState<string | null>(null);

  // Retirement Repository & Knowledge Assessment States
  const [selectedRetiree, setSelectedRetiree] = useState<User | null>(null);
  const [retirementFocus, setRetirementFocus] = useState<string>("Furnace High-Pressure Valve Safety Protocol");
  const [retirementStep, setRetirementStep] = useState<'idle' | 'interview' | 'synthesizing' | 'completed'>('idle');
  const [retirementPromptIdx, setRetirementPromptIdx] = useState<number>(0);
  const [retirementSynthesizedSop, setRetirementSynthesizedSop] = useState<any>(null);

  // Currently Logged In User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sarathi_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  
  // Profile edit state variables
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editExpYears, setEditExpYears] = useState<number>(0);
  const [editEducation, setEditEducation] = useState<string>('');
  const [editCerts, setEditCerts] = useState<string>('');
  
  // High fidelity database records state (pre-filled with seed experts)
  const [allEmployees, setAllEmployees] = useState<User[]>(() => {
    const saved = localStorage.getItem('sarathi_all_employees');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'EMP-001',
        name: 'V. Krishnamurthy',
        email: 'krishna.m@steelforce.com',
        employeeId: 'STEEL-BF-109',
        language: 'en',
        role: 'Employee',
        registrationStatus: 'active',
        companyName: 'SteelForce Industries (Generic)',
        unit: 'Blast Furnace III Site',
        department: 'Blast Furnace Ops',
        designation: 'Senior Lead Blast Engineer',
        roleType: 'SOP Lead',
        experienceYears: 34,
        education: 'M.Tech Metallurgy (IIT Kharagpur)',
        certifications: ['High Pressure Valve Governance', 'Blast Safety Masterclass'],
        isRetiringNext12Months: true,
        hasTakenBaselineAssessment: true,
        contributionsCount: 15,
        engagementScore: 94
      },
      {
        id: 'EMP-002',
        name: 'Sujata Banerjee',
        email: 'sujata.b@steelforce.com',
        employeeId: 'STEEL-HSM-224',
        language: 'en',
        role: 'Employee',
        registrationStatus: 'active',
        companyName: 'SteelForce Industries (Generic)',
        unit: 'Kalinganagar Hot Mill',
        department: 'Quality Control',
        designation: 'Head Metallurgist',
        roleType: 'Quality Analyst',
        experienceYears: 18,
        education: 'B.Tech Metallurgical Engineering',
        certifications: ['Ultrasonic Fault Micrometry', 'ISO 9001 Lead Auditor'],
        isRetiringNext12Months: false,
        hasTakenBaselineAssessment: true,
        contributionsCount: 8,
        engagementScore: 88
      },
      {
        id: 'EMP-003',
        name: 'Amit Verma',
        email: 'amit.verma@steelforce.com',
        employeeId: 'STEEL-REL-882',
        language: 'en',
        role: 'Manager',
        registrationStatus: 'active',
        companyName: 'SteelForce Industries (Generic)',
        unit: 'Angul Sinter Unit',
        department: 'Maintenance & Reliability',
        designation: 'Senior Reliability Advisor',
        roleType: 'Electrical Advisor',
        experienceYears: 24,
        education: 'Poly Diploma in Electrical Engineering',
        certifications: ['LOTO Safety Instructor', 'Vibration Analysis L3'],
        isRetiringNext12Months: true,
        hasTakenBaselineAssessment: true,
        contributionsCount: 12,
        engagementScore: 92
      }
    ];
  });

  // Assessment Attempts Log
  const [assessmentAttempts, setAssessmentAttempts] = useState<AssessmentAttempt[]>(() => {
    const saved = localStorage.getItem('sarathi_assessment_attempts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ATT-001',
        userId: 'EMP-001',
        title: 'Baseline Assessment',
        category: 'Baseline',
        score: 92,
        categoryScores: { 'technical': 96, 'soft skill': 88, 'digital literacy': 90, 'scenario based': 92, 'leadership': 94 },
        timeSpentSec: 280,
        completedAt: '2026-05-10T14:22:00Z',
        answeredQuestions: []
      },
      {
        id: 'ATT-002',
        userId: 'EMP-002',
        title: 'Baseline Assessment',
        category: 'Baseline',
        score: 84,
        categoryScores: { 'technical': 88, 'soft skill': 80, 'digital literacy': 82, 'scenario based': 86, 'leadership': 84 },
        timeSpentSec: 340,
        completedAt: '2026-04-01T09:15:00Z',
        answeredQuestions: []
      }
    ];
  });

  // Competencies list state
  const [competencies, setCompetencies] = useState<Competency[]>(INITIAL_COMPETENCIES);

  // Mapped user scores (historical & live progress values)
  const [userCompetencyScores, setUserCompetencyScores] = useState<Record<string, Record<string, number>>>(() => {
    const saved = localStorage.getItem('sarathi_user_competency_scores');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'EMP-001': { 'COMP-001': 5, 'COMP-002': 5, 'COMP-003': 5, 'COMP-004': 4, 'COMP-005': 4, 'COMP-006': 4, 'COMP-007': 5, 'COMP-008': 5 },
      'EMP-002': { 'COMP-001': 4, 'COMP-002': 4, 'COMP-003': 3, 'COMP-004': 3, 'COMP-005': 4, 'COMP-006': 3, 'COMP-007': 4, 'COMP-008': 4 },
      'EMP-003': { 'COMP-001': 5, 'COMP-002': 4, 'COMP-003': 4, 'COMP-004': 5, 'COMP-005': 3, 'COMP-006': 3, 'COMP-007': 4, 'COMP-008': 4 }
    };
  });

  // Learning Paths assignments
  const [learningResources, setLearningResources] = useState<LearningResource[]>(INITIAL_LEARNING_RESOURCES);
  const [learningPaths, setLearningPaths] = useState<Record<string, Record<string, 'Not Started' | 'In Progress' | 'Completed'>>>(() => {
    const saved = localStorage.getItem('sarathi_learning_paths');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'EMP-001': { 'RES-001': 'Completed', 'RES-002': 'Completed' },
      'EMP-002': { 'RES-003': 'In Progress', 'RES-004': 'Completed' }
    };
  });

  // Knowledge Hub Assets
  const [knowledgeAssets, setKnowledgeAssets] = useState<KnowledgeAsset[]>(() => {
    const saved = localStorage.getItem('sarathi_knowledge_assets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_KNOWLEDGE_ASSETS;
  });
  const [bookmarkedAssets, setBookmarkedAssets] = useState<Record<string, boolean>>({});
  const [knowSearch, setKnowSearch] = useState('');
  const [selectedAssetCategory, setSelectedAssetCategory] = useState<string>('All');

  // Sync state variables to localStorage when changed
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sarathi_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sarathi_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sarathi_all_employees', JSON.stringify(allEmployees));
  }, [allEmployees]);

  useEffect(() => {
    localStorage.setItem('sarathi_assessment_attempts', JSON.stringify(assessmentAttempts));
  }, [assessmentAttempts]);

  useEffect(() => {
    localStorage.setItem('sarathi_user_competency_scores', JSON.stringify(userCompetencyScores));
  }, [userCompetencyScores]);

  useEffect(() => {
    localStorage.setItem('sarathi_learning_paths', JSON.stringify(learningPaths));
  }, [learningPaths]);

  useEffect(() => {
    localStorage.setItem('sarathi_knowledge_assets', JSON.stringify(knowledgeAssets));
  }, [knowledgeAssets]);

  // Manager-to-Employee Live Connections & Assignments state
  const [interactions, setInteractions] = useState<any[]>([
    {
      id: 'INT-001',
      employeeId: 'EMP-001',
      managerName: 'Surendra Prasad',
      type: 'assignment',
      content: 'Required target level alignment for Safety Compliance upgraded to L4.',
      timestamp: '2026-06-18 • 10:30 AM',
      assignedCompetencyName: 'Safety Compliance'
    },
    {
      id: 'INT-002',
      employeeId: 'EMP-002',
      managerName: 'Surendra Prasad',
      type: 'explanation',
      content: 'Shared the "Steel Operations SOP General Index" to reinforce extreme high-temperature metallurgical stability guides.',
      timestamp: '2026-06-19 • 02:40 PM',
      attachedSopTitle: 'Steel Operations SOP General Index'
    }
  ]);
  
  const [activeConnectEmployeeId, setActiveConnectEmployeeId] = useState<string | null>(null);
  const [connectTab, setConnectTab] = useState<Record<string, string>>({});
  const [connectMessage, setConnectMessage] = useState<Record<string, string>>({});
  const [connectCompId, setConnectCompId] = useState<Record<string, string>>({});
  const [connectTargetLevel, setConnectTargetLevel] = useState<Record<string, number>>({});
  const [connectAttachedAsset, setConnectAttachedAsset] = useState<Record<string, string>>({});
  const [connectExplanationText, setConnectExplanationText] = useState<Record<string, string>>({});

  // Handler for sending a text message
  const handleSendConnectMessage = (employeeId: string, employeeName: string) => {
    const text = connectMessage[employeeId]?.trim();
    if (!text) return;
    
    const newInteraction = {
      id: `INT-${Date.now()}`,
      employeeId,
      managerName: currentUser?.name || 'Authorized Manager',
      type: 'message' as const,
      content: text,
      timestamp: new Date().toLocaleTimeString(lang === 'en' ? 'en-US' : 'hi-IN', { hour: '2-digit', minute: '2-digit' }) + ' • Live'
    };
    
    setInteractions(prev => [newInteraction, ...prev]);
    setConnectMessage(prev => ({ ...prev, [employeeId]: '' }));
  };

  // Handler for assigning a competency target
  const handleAssignCompetencyTarget = (employeeId: string, employeeName: string) => {
    const compId = connectCompId[employeeId] || competencies[0]?.id;
    const targetLvl = connectTargetLevel[employeeId] || 4;
    const compName = competencies.find(c => c.id === compId)?.name || 'Specified Competency';
    
    setUserCompetencyScores(prev => {
      const uScores = prev[employeeId] || {};
      return {
        ...prev,
        [employeeId]: {
          ...uScores,
          [compId]: uScores[compId] || 2
        }
      };
    });
    
    const newInteraction = {
      id: `INT-${Date.now()}`,
      employeeId,
      managerName: currentUser?.name || 'Authorized Manager',
      type: 'assignment' as const,
      content: `Target level set to L${targetLvl} for "${compName}". Pre-requisite simulator training assigned.`,
      timestamp: new Date().toLocaleTimeString(lang === 'en' ? 'en-US' : 'hi-IN', { hour: '2-digit', minute: '2-digit' }) + ' • Assigned',
      assignedCompetencyName: compName
    };
    
    setInteractions(prev => [newInteraction, ...prev]);
  };

  // Handler for explaining/sharing an SOP reference
  const handleShareSopExplanation = (employeeId: string, employeeName: string) => {
    const assetId = connectAttachedAsset[employeeId] || knowledgeAssets[0]?.id;
    const notes = connectExplanationText[employeeId]?.trim() || '';
    const assetTitle = knowledgeAssets.find(a => a.id === assetId)?.title || 'Standard Operating Procedure';
    
    const explanationContent = `Shared SOP: "${assetTitle}".${notes ? ` Briefing note: "${notes}"` : ''}`;
    
    const newInteraction = {
      id: `INT-${Date.now()}`,
      employeeId,
      managerName: currentUser?.name || 'Authorized Manager',
      type: 'explanation' as const,
      content: explanationContent,
      timestamp: new Date().toLocaleTimeString(lang === 'en' ? 'en-US' : 'hi-IN', { hour: '2-digit', minute: '2-digit' }) + ' • Shared',
      attachedSopTitle: assetTitle
    };
    
    setInteractions(prev => [newInteraction, ...prev]);
    setConnectExplanationText(prev => ({ ...prev, [employeeId]: '' }));
  };

  // Mentorship connection maps
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: 'MENT-001',
      userId: 'EMP-001',
      employeeId: 'TATA-BF-109',
      name: 'V. Krishnamurthy',
      expertiseScore: 98,
      department: 'Blast Furnace Ops',
      experienceYrs: 34,
      skillsExpert: ['Safety Compliance', 'SOP Adherence', 'Equipment Operation'],
      activeSlots: 1,
      maxSlots: 3
    },
    {
      id: 'MENT-002',
      userId: 'EMP-003',
      employeeId: 'TATA-REL-882',
      name: 'Amit Verma',
      expertiseScore: 92,
      department: 'Maintenance & Reliability',
      experienceYrs: 24,
      skillsExpert: ['Maintenance & Troubleshooting', 'Safety Compliance'],
      activeSlots: 0,
      maxSlots: 4
    }
  ]);

  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([
    {
      id: 'REQ-001',
      requesterId: 'EMP-002',
      requesterName: 'Sujata Banerjee',
      mentorId: 'MENT-001',
      mentorName: 'V. Krishnamurthy',
      status: 'Pending',
      requestedCompetencyId: 'COMP-001',
      competencyName: 'Safety Compliance',
      message: 'Hello, senior. I seek hands-on calibration insights on high pressure blowers before the planned winter shutdowns.',
      createdAt: '2026-06-15T09:00:00Z'
    }
  ]);

  // Succession plans
  const [successionPlans, setSuccessionPlans] = useState<SuccessionPlan[]>(INITIAL_SUCCESSION_PLANS);

  // Framework Settings configurations (Leadership tool)
  const [competencyCategoryInput, setCompetencyCategoryInput] = useState<'Functional' | 'Technical' | 'Digital' | 'Behavioral' | 'Leadership'>('Technical');
  const [competencyNameInput, setCompetencyNameInput] = useState('');
  const [competencyDescInput, setCompetencyDescInput] = useState('');
  const [leadershipSearchInput, setLeadershipSearchInput] = useState('');
  const [leadershipManagerSearchInput, setLeadershipManagerSearchInput] = useState('');

  // --------------------------------------------------------------------------------------------------
  // DEMO SKIP HANDLER
  // --------------------------------------------------------------------------------------------------
  const handleSkipToDemoModeRole = (role: 'Employee' | 'Manager' | 'Leadership') => {
    let demoUser: User;
    if (role === 'Employee') {
      demoUser = {
        id: 'EMP-DEMO-01',
        name: 'Sanjeev Jha',
        email: 'sanjeev.jha@industrial-plant.com',
        employeeId: 'SF-BF-302',
        language: lang,
        role: 'Employee',
        registrationStatus: 'active',
        companyName: 'SteelForce Industries (Generic)',
        unit: 'Blast Furnace III Site',
        department: 'Blast Furnace Ops',
        designation: 'Cooling Loop Line Operator',
        experienceYears: 7,
        education: 'Polytechnic Diploma in Mechanical Engineering',
        certifications: ['Boiler Isolation Safeguards', 'Zero-Harm Induction'],
        isRetiringNext12Months: false,
        hasTakenBaselineAssessment: true,
        contributionsCount: 2,
        engagementScore: 82
      };
    } else if (role === 'Manager') {
      demoUser = {
        id: 'EMP-DEMO-02',
        name: 'Amit Verma',
        email: 'amit.verma@industrial-plant.com',
        employeeId: 'SF-REL-882',
        language: lang,
        role: 'Manager',
        registrationStatus: 'active',
        companyName: 'SteelForce Industries (Generic)',
        unit: 'Angul Sinter Unit',
        department: 'Maintenance & Reliability',
        designation: 'Senior Reliability Advisor',
        experienceYears: 24,
        education: 'Poly Diploma in Electrical Engineering',
        certifications: ['LOTO Safety Instructor', 'Vibration Analysis L3'],
        isRetiringNext12Months: true,
        hasTakenBaselineAssessment: true,
        contributionsCount: 12,
        engagementScore: 92
      };
    } else {
      demoUser = {
        id: 'EMP-DEMO-03',
        name: 'Director S. Raghavan',
        email: 'raghavan.s@industrial-plant.com',
        employeeId: 'SF-DIR-101',
        language: lang,
        role: 'Leadership',
        registrationStatus: 'active',
        companyName: 'SteelForce Industries (Generic)',
        unit: 'Corporate Headquarters',
        department: 'Plant Operations & Governance',
        designation: 'Strategic Operations Director',
        experienceYears: 30,
        education: 'Ph.D Metallurgy (IIT Bombay)',
        certifications: ['ISO 55001 Asset Management', 'Executive Safety Fellowship'],
        isRetiringNext12Months: false,
        hasTakenBaselineAssessment: true,
        contributionsCount: 25,
        engagementScore: 98
      };
    }

    const demoAttempt: AssessmentAttempt = {
      id: 'ATT-DEMO-' + Date.now(),
      userId: demoUser.id,
      title: 'Baseline Assessment',
      category: 'Baseline',
      score: role === 'Employee' ? 72 : role === 'Manager' ? 92 : 96,
      categoryScores: { 'technical': 80, 'soft skill': 80, 'digital literacy': 80, 'scenario based': 80, 'leadership': 80 },
      timeSpentSec: 420,
      completedAt: new Date().toISOString(),
      answeredQuestions: []
    };

    handleOnboardingCompleted(demoUser, demoAttempt);
  };

  const handleOnboardingCompleted = (newUser: User, attempt: AssessmentAttempt) => {
    // Inject user into data registries
    setCurrentUser(newUser);
    setAllEmployees(prev => [...prev, newUser]);
    setAssessmentAttempts(prev => [...prev, attempt]);

    // Map default level scores (Levels initialized to standard initial baseline based on evaluation score)
    const initScores: Record<string, number> = {};
    const baseLevel = attempt.score > 80 ? 4 : attempt.score > 60 ? 3 : 2;
    INITIAL_COMPETENCIES.forEach(comp => {
      initScores[comp.id] = baseLevel;
    });

    setUserCompetencyScores(prev => ({
      ...prev,
      [newUser.id]: initScores
    }));

    // Assign initial paths 
    const initPaths: Record<string, 'Not Started' | 'In Progress' | 'Completed'> = {};
    INITIAL_LEARNING_RESOURCES.slice(0, 3).forEach(res => {
      initPaths[res.id] = 'In Progress';
    });
    setLearningPaths(prev => ({
      ...prev,
      [newUser.id]: initPaths
    }));

    // Toggle current viewing persona as requested during registration
    setCurrentPersona(newUser.role);
  };

  const handleLoginCompleted = (matchedUser: User) => {
    setCurrentUser(matchedUser);
    setCurrentPersona(matchedUser.role);
  };

  // --------------------------------------------------------------------------------------------------
  // KNOWLEDGE ASSET CREATION CALLBACK
  // --------------------------------------------------------------------------------------------------
  const handleSopCreated = (newAsset: KnowledgeAsset) => {
    setKnowledgeAssets(prev => [newAsset, ...prev]);
    // Award contribution points to authors
    if (currentUser && newAsset.authorId === currentUser.id) {
      setCurrentUser(prev => prev ? {
        ...prev,
        contributionsCount: prev.contributionsCount + 1,
        engagementScore: Math.min(100, prev.engagementScore + 5)
      } : null);
    } else {
      setAllEmployees(prev => prev.map(emp => {
        if (emp.id === newAsset.authorId) {
          return {
            ...emp,
            contributionsCount: emp.contributionsCount + 1,
            engagementScore: Math.min(100, emp.engagementScore + 5)
          };
        }
        return emp;
      }));
    }
  };

  // --------------------------------------------------------------------------------------------------
  // LIVE FORMULA METERS CALCULATIONS
  // --------------------------------------------------------------------------------------------------
  
  // Calculate specific user's WRI metric
  const calculateEmployeeWRI = (empId: string): number => {
    const emp = allEmployees.find(e => e.id === empId);
    if (!emp) return 0;

    const scores = userCompetencyScores[empId] || {};
    const competenciesCount = competencies.length;
    
    // 1. Competency scores vs target gaps (35% Weight)
    let compTotalPercentage = 0;
    competencies.forEach(comp => {
      const currentVal = scores[comp.id] || 1;
      const targetVal = comp.targetLevel;
      // capped ratio
      const ratio = Math.min(1, currentVal / targetVal);
      compTotalPercentage += ratio * 100;
    });
    const avgCompReadiness = competenciesCount > 0 ? compTotalPercentage / competenciesCount : 75;

    // 2. Assessment scoring performance (25% Weight)
    const userAttempts = assessmentAttempts.filter(at => at.userId === empId);
    const avgAssessScore = userAttempts.length > 0 
      ? userAttempts.reduce((sum, item) => sum + item.score, 0) / userAttempts.length 
      : 70;

    // 3. Learning Path completion effectiveness (20% Weight)
    const userPaths = learningPaths[empId] || {};
    const totalResources = Object.keys(userPaths).length;
    const completedResources = Object.values(userPaths).filter(st => st === 'Completed').length;
    const avgLearningIndex = totalResources > 0 ? (completedResources / totalResources) * 100 : 70;

    // 4. Knowledge Contribution impact (10% Weight)
    const knowledgeIndex = Math.min(100, emp.contributionsCount * 25);

    // 5. Engagement indices logs (10% Weight)
    const engagementIndex = emp.engagementScore || 80;

    return (
      (avgCompReadiness * 0.35) + 
      (avgAssessScore * 0.25) + 
      (avgLearningIndex * 0.20) + 
      (knowledgeIndex * 0.10) + 
      (engagementIndex * 0.10)
    );
  };

  // Retrieve current active user's calculated WRI stats
  const activeWRIStats = useMemo(() => {
    if (!currentUser) return { wri: 0, comp: 0, assess: 0, learning: 0, knowledge: 0, engagement: 0 };
    
    // Compute breakdown pieces of active user
    const empId = currentUser.id;
    const scores = userCompetencyScores[empId] || {};
    let compTotalPercentage = 0;
    competencies.forEach(comp => {
      const currentVal = scores[comp.id] || 1;
      compTotalPercentage += Math.min(1, currentVal / comp.targetLevel) * 100;
    });
    const compReadiness = competencies.length > 0 ? compTotalPercentage / competencies.length : 70;

    const userAttempts = assessmentAttempts.filter(at => at.userId === empId);
    const assessScore = userAttempts.length > 0 ? userAttempts[0].score : 70;

    const userPaths = learningPaths[empId] || {};
    const totalResources = Object.keys(userPaths).length;
    const completedResources = Object.values(userPaths).filter(st => st === 'Completed').length;
    const learningIndex = totalResources > 0 ? (completedResources / totalResources) * 100 : 70;

    const knowledgeIndex = Math.min(100, currentUser.contributionsCount * 25);
    const engIndex = currentUser.engagementScore || 80;

    const finalWri = (compReadiness * 0.35) + (assessScore * 0.25) + (learningIndex * 0.20) + (knowledgeIndex * 0.10) + (engIndex * 0.10);

    return { 
      wri: finalWri, 
      comp: compReadiness, 
      assess: assessScore, 
      learning: learningIndex, 
      knowledge: knowledgeIndex, 
      engagement: engIndex 
    };
  }, [currentUser, userCompetencyScores, assessmentAttempts, learningPaths, competencies]);

  // Overall plant / organizational WRI index
  const orgWRI = useMemo(() => {
    const totalEmployees = allEmployees.length;
    if (totalEmployees === 0) return 78.4;
    const totalSum = allEmployees.reduce((sum, emp) => sum + calculateEmployeeWRI(emp.id), 0);
    return totalSum / totalEmployees;
  }, [allEmployees, userCompetencyScores, assessmentAttempts, learningPaths, competencies]);

  // Organization WRI stats averages for Leadership view
  const orgWRIStats = useMemo(() => {
    let sumCompReadiness = 0;
    let sumAssessScore = 0;
    let sumLearningIndex = 0;
    let sumKnowledgeIndex = 0;
    let sumEngIndex = 0;
    const count = allEmployees.length;

    if (count === 0) {
      return { comp: 80, assess: 80, learning: 80, knowledge: 80, engagement: 80 };
    }

    allEmployees.forEach(emp => {
      const empId = emp.id;
      const scores = userCompetencyScores[empId] || {};
      let compTotalPercentage = 0;
      competencies.forEach(comp => {
        const currentVal = scores[comp.id] || 1;
        compTotalPercentage += Math.min(1, currentVal / comp.targetLevel) * 100;
      });
      const compReadiness = competencies.length > 0 ? compTotalPercentage / competencies.length : 70;
      sumCompReadiness += compReadiness;

      const userAttempts = assessmentAttempts.filter(at => at.userId === empId);
      const assessScore = userAttempts.length > 0 ? userAttempts[0].score : 70;
      sumAssessScore += assessScore;

      const userPaths = learningPaths[empId] || {};
      const totalResources = Object.keys(userPaths).length;
      const completedResources = Object.values(userPaths).filter(st => st === 'Completed').length;
      const learningIndex = totalResources > 0 ? (completedResources / totalResources) * 100 : 70;
      sumLearningIndex += learningIndex;

      const knowledgeIndex = Math.min(100, emp.contributionsCount * 25);
      sumKnowledgeIndex += knowledgeIndex;

      const engIndex = emp.engagementScore || 80;
      sumEngIndex += engIndex;
    });

    return {
      comp: sumCompReadiness / count,
      assess: sumAssessScore / count,
      learning: sumLearningIndex / count,
      knowledge: sumKnowledgeIndex / count,
      engagement: sumEngIndex / count
    };
  }, [allEmployees, userCompetencyScores, assessmentAttempts, learningPaths, competencies]);

  // Knowledge Risk Index (KRI) map. Calculated continuously!
  // It increases if expert retires and decreases if documentation coverage high (retained SOP assets count)
  const krRiskData = useMemo(() => {
    // 1. Retirement Concentration (count of retiring next 12 months)
    const retiringCount = allEmployees.filter(e => e.isRetiringNext12Months).length;
    const retirementScore = Math.min(100, retiringCount * 25);

    // 2. Documentation Coverage (Ratio based on Knowledge Assets vs standard 10 targets)
    const docsCount = knowledgeAssets.length;
    const documentationCoverage = Math.min(100, (docsCount / 8) * 100);

    // 3. Successor Availability (Ratio of filled critical role succession plans)
    const plansActive = successionPlans.filter(p => p.status === 'Active' || p.status === 'Approved').length;
    const successorAvailability = Math.min(100, (plansActive / 3) * 100);

    // KRI formula: Higher Retirement concentration increases risk; higher doc coverage & successor availability decreases risk!
    const baseRisk = (retirementScore * 0.5) + ((100 - documentationCoverage) * 0.3) + ((100 - successorAvailability) * 0.2);
    
    let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    if (baseRisk > 75) severity = 'Critical';
    else if (baseRisk > 50) severity = 'High';
    else if (baseRisk > 25) severity = 'Medium';

    return {
      score: baseRisk,
      retirementScore,
      documentationCoverage,
      successorAvailability,
      severity
    };
  }, [allEmployees, knowledgeAssets, successionPlans]);

  // Gaps Severity list
  const activeGaps: CompetencyGap[] = useMemo(() => {
    const gapList: CompetencyGap[] = [];
    allEmployees.forEach(emp => {
      const scores = userCompetencyScores[emp.id] || {};
      competencies.forEach(comp => {
        const currentVal = scores[comp.id] || 1;
        const requiredVal = comp.targetLevel;
        if (currentVal < requiredVal) {
          const gapPct = ((requiredVal - currentVal) / requiredVal) * 100;
          let severity: 'Critical' | 'Strong' | 'Needs Improvement' | 'Moderate' = 'Moderate';
          if (gapPct >= 50) severity = 'Critical';
          else if (gapPct >= 25) severity = 'Strong';
          
          gapList.push({
            userId: emp.id,
            competencyId: comp.id,
            currentLevel: currentVal,
            requiredLevel: requiredVal,
            gapPercentage: gapPct,
            severity: severity === 'Moderate' ? 'Needs Improvement' : severity === 'Strong' ? 'Strong' : 'Critical'
          });
        }
      });
    });
    return gapList;
  }, [allEmployees, userCompetencyScores, competencies]);

  // --------------------------------------------------------------------------------------------------
  // INTERFERENCE PROCESSOR HANDLERS
  // --------------------------------------------------------------------------------------------------
  const handleMicroAssessmentTrigger = (compId: string) => {
    // Elevate user score for this competency instantly by 1 level
    if (!currentUser) return;
    const currentScores = userCompetencyScores[currentUser.id] || {};
    const beforeVal = currentScores[compId] || 1;
    const newVal = Math.min(5, beforeVal + 1);

    setUserCompetencyScores(prev => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        [compId]: newVal
      }
    }));

    // Update path status as 'Completed'
    const targetResource = learningResources.find(r => r.competencyId === compId);
    if (targetResource) {
      setLearningPaths(prev => ({
        ...prev,
        [currentUser.id]: {
          ...prev[currentUser.id],
          [targetResource.id]: 'Completed'
        }
      }));
    }

    // Award bonus engagement count
    setCurrentUser(prev => prev ? {
      ...prev,
      engagementScore: Math.min(100, prev.engagementScore + 10)
    } : null);

    alert(lang === 'en' 
      ? `SUCCESSFUL RE-ASSESSMENT! Your competency level has upgraded from L${beforeVal} to L${newVal}. Calculated WRI updated.`
      : `सफल पुन: मूल्यांकन! आपकी क्षमता का स्तर L${beforeVal} से बढ़कर L${newVal} हो गया है।`);
  };

  const handlePassCompetencyAssessment = (userId: string, compId: string, level: number) => {
    setUserCompetencyScores(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        [compId]: level
      }
    }));

    const targetResource = learningResources.find(r => r.competencyId === compId);
    if (targetResource) {
      setLearningPaths(prev => ({
        ...prev,
        [userId]: {
          ...(prev[userId] || {}),
          [targetResource.id]: 'Completed'
        }
      }));
    }

    if (userId === currentUser?.id) {
      setCurrentUser(prev => prev ? {
        ...prev,
        engagementScore: Math.min(100, prev.engagementScore + 15)
      } : null);
    }
  };

  const handleBookmarkedAssetToggle = (assetId: string) => {
    setBookmarkedAssets(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
  };

  const handleRequestMentorship = (mentor: Mentor, compId: string, compName: string) => {
    if (!currentUser) return;
    const newRequest: MentorRequest = {
      id: 'REQ-' + Date.now(),
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      mentorId: mentor.id,
      mentorName: mentor.name,
      status: 'Pending',
      requestedCompetencyId: compId,
      competencyName: compName,
      message: `Enrolling in structured mentorship sequence to cover gap in ${compName}.`,
      createdAt: new Date().toISOString()
    };

    setMentorRequests(prev => [newRequest, ...prev]);
    alert(lang === 'en' ? `Mentorship alignment dispatch sent to Senior Advisor ${mentor.name}!` : `मेंटरशिप अनुरोध वरिष्ठ सहायक ${mentor.name} को भेजा गया!`);
  };

  const handleApproveRequest = (reqId: string) => {
    setMentorRequests(prev => prev.map(req => {
      if (req.id === reqId) return { ...req, status: 'Approved' };
      return req;
    }));
  };

  const handleAddCompetency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competencyNameInput || !competencyDescInput) return;
    const newComp: Competency = {
      id: 'COMP-00' + (competencies.length + 1),
      category: competencyCategoryInput,
      name: competencyNameInput,
      description: competencyDescInput,
      targetLevel: 4,
      levelDescriptions: {
        1: 'Novice guidelines check',
        2: 'Supervised handling procedures',
        3: 'Autonomous deployment operation',
        4: 'Audit and update validation',
        5: 'Global frameworks design authority'
      }
    };

    setCompetencies(prev => [...prev, newComp]);
    setCompetencyNameInput('');
    setCompetencyDescInput('');
    alert(lang === 'en' ? 'New plant requirement added successfully to organization database!' : 'नया वांछित कौशल संगठन प्रणालियों में जोड़ा गया!');
  };

  // Searching assets in Knowledge base
  const filteredAssets = useMemo(() => {
    return knowledgeAssets.filter(asset => {
      const matchSearch = asset.title.toLowerCase().includes(knowSearch.toLowerCase()) || 
                          asset.summary.toLowerCase().includes(knowSearch.toLowerCase()) ||
                          asset.tags.some(t => t.toLowerCase().includes(knowSearch.toLowerCase()));
      const matchCategory = selectedAssetCategory === 'All' || asset.category === selectedAssetCategory;
      return matchSearch && matchCategory;
    });
  }, [knowledgeAssets, knowSearch, selectedAssetCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-[#050608] text-slate-300 font-sans selection:bg-blue-600/30 selection:text-white">
      
      {/* --------------------------------------------------------------------------------------------------
          TOP BRAND COMMAND BAR
          -------------------------------------------------------------------------------------------------- */}
      <header className="h-16 border-b border-slate-800 bg-[#0c0d12]/95 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          {/* Custom polished App Logo representing Sarathi (Guide/Chariot Wheel/Star) */}
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 border border-blue-400/30 group">
            {/* Ambient background accent pulse */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-fuchsia-400/10 animate-pulse"></div>
            {/* Compass / Guide-wheel inline vector */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-5.5 h-5.5 text-white relative z-10 drop-shadow-[0_1.5px_4px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:rotate-45"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" strokeDasharray="3 3" className="opacity-80" stroke="currentColor"/>
              <path d="M12 2v20M2 12h20M12 8l-4 4 4 4 4-4-4-4z" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <div className="absolute -inset-0.5 bg-blue-500/30 rounded-xl blur opacity-30 hover:opacity-100 transition duration-1000"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-wider font-display uppercase font-bold text-center flex items-center shrink-0">SARATHI AI</h1>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {lang === 'en' ? 'Develop People. Preserve Knowledge. Measure Capability' : 'लोगों का विकास करें। ज्ञान को संजोएं। क्षमता का आकलन करें।'}
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          
          {/* Home / Switch Profile state */}
          {currentUser && (
            <button
              onClick={() => {
                setCurrentUser(null);
                setActiveFeature(null);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-950/30 border border-red-500/20 hover:bg-red-900/30 hover:border-red-500/40 text-red-400 text-xs font-bold rounded-xl transition-all"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Home State / Log out</span>
            </button>
          )}

          {/* Bilingual Select */}
          <div className="flex bg-slate-900/80 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase ${
                lang === 'en' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold ${
                lang === 'hi' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Network Health */}
          <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <span className="inline-block w-2- h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>{t.systemHealth}: <b className="text-green-500 uppercase">OPTIMAL</b></span>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------------------------------------
          MAIN ENGINE WORKSPACE
          -------------------------------------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col">
        {!currentUser ? (
          /* Registration & Onboarding Flow */
          <div className="flex-1 flex flex-col justify-center py-10 relative">
            <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/5 blur-3xl rounded-full"></div>
            
            <OnboardingFlow 
              onCompleted={handleOnboardingCompleted} 
              lang={lang} 
              employees={allEmployees} 
              onLogin={handleLoginCompleted} 
            />
            
            {/* Quick Bypass Buttons */}
            <div className="max-w-xl mx-auto text-center mt-6 z-10 px-4">
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl shadow-xl">
                <p className="text-xs text-slate-400 font-medium mb-3">
                  {lang === 'en' 
                    ? '⚡ Evaluator Sandbox Bypass: Access separate isolated role dashboards instantly.' 
                    : '⚡ त्वरित पहुंच: सीधे संबंधित भूमिका के मुख्य डैशबोर्ड का परीक्षण करें।'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSkipToDemoModeRole('Employee')}
                    className="bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 hover:border-blue-500/30 text-[10px] font-bold py-2.5 px-3 rounded-xl uppercase tracking-wider transition-all active:scale-95 animate-fade-in"
                  >
                    Bypass as Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSkipToDemoModeRole('Manager')}
                    className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/30 text-[10px] font-bold py-2.5 px-3 rounded-xl uppercase tracking-wider transition-all active:scale-95 animate-fade-in"
                  >
                    Bypass as Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSkipToDemoModeRole('Leadership')}
                    className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/30 text-[10px] font-bold py-2.5 px-3 rounded-xl uppercase tracking-wider transition-all active:scale-95 animate-fade-in"
                  >
                    Bypass as Leadership
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Primary Enterprise Console */
          <div className="p-6 grid grid-cols-12 gap-6 items-start max-w-7xl mx-auto w-full">
            
            {/* Header Alert banner if retiring */}
            {currentUser.isRetiringNext12Months && (
              <div className="col-span-12 bg-[#1b1510] border border-amber-500/25 p-4 rounded-2xl flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t.retiringWarn}</h4>
                    <p className="text-[11px] text-amber-200/80 leading-relaxed capitalize mt-0.5">{t.alertSOP}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('knowledge-preservation-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg uppercase tracking-wider transition-all"
                >
                  Go to Preservation Desk
                </button>
              </div>
            )}

            {/* --------------------------------------------------------------------------------------------------
                LEFT COLUMN: Dynamic calculated indices & Core Profile Skill Passport
                -------------------------------------------------------------------------------------------------- */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* Profile Card / Identity */}
              <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-slate-700">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full"></div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 bg-slate-800 border-2 border-blue-500/30 rounded-full flex items-center justify-center font-bold text-white text-base">
                    {currentUser.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-mono text-blue-400">
                      State Passport: Active
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-none mt-1 uppercase font-display">
                      {currentUser.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      ID: {currentUser.employeeId} • {currentUser.designation}
                    </p>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!currentUser) return;
                    const parsedCerts = editCerts.split(',').map(c => c.trim()).filter(Boolean);
                    const updatedUser = {
                      ...currentUser,
                      experienceYears: Number(editExpYears),
                      education: editEducation,
                      certifications: parsedCerts,
                    };
                    setCurrentUser(updatedUser);
                    setAllEmployees(prev => prev.map(emp => emp.id === currentUser.id ? updatedUser : emp));
                    setIsEditingProfile(false);
                  }} className="space-y-3.5 pt-4 border-t border-slate-850 text-[11.5px]">
                    <div>
                      <label className="text-slate-400 uppercase text-[9px] block mb-1 font-mono font-bold">
                        {lang === 'en' ? 'Years of Experience' : 'अनुभव के वर्ष'}
                      </label>
                      <input 
                        type="number"
                        min="0"
                        max="60"
                        required
                        value={editExpYears}
                        onChange={(e) => setEditExpYears(Number(e.target.value))}
                        className="w-full bg-[#12141c] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-[#3b82f6] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 uppercase text-[9px] block mb-1 font-mono font-bold">
                        {lang === 'en' ? 'Educations' : 'शिक्षा'}
                      </label>
                      <input 
                        type="text"
                        required
                        value={editEducation}
                        onChange={(e) => setEditEducation(e.target.value)}
                        className="w-full bg-[#12141c] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-[#3b82f6] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 uppercase text-[9px] block mb-1 font-mono font-bold">
                        {lang === 'en' ? 'Credentials / Certifications (comma separated)' : 'क्रेडेंशियल / सर्टिफिकेट (कॉमा से अलग करें)'}
                      </label>
                      <textarea 
                        rows={2}
                        value={editCerts}
                        onChange={(e) => setEditCerts(e.target.value)}
                        placeholder="e.g. High Pressure Safety, LOTO Expert"
                        className="w-full bg-[#12141c] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-250 focus:outline-[#3b82f6] outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                      >
                        {lang === 'en' ? 'Cancel' : 'रद्द करें'}
                      </button>
                      <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-[0_2px_10px_-3px_rgba(37,99,235,0.4)]"
                      >
                        {lang === 'en' ? 'Save' : 'सहेजें'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-2.5 pt-4 border-t border-slate-850/80 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 uppercase text-[9.5px]">Plant Entity:</span>
                        <span className="text-slate-300 font-medium truncate max-w-[200px]">{currentUser.companyName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 uppercase text-[9.5px]">Operational Unit:</span>
                        <span className="text-slate-300 font-medium">{currentUser.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 uppercase text-[9.5px]">Main Department:</span>
                        <span className="text-slate-300 font-medium">{currentUser.department}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 uppercase text-[9.5px]">{t.expLabel}:</span>
                        <span className="text-slate-300 font-mono font-bold">{currentUser.experienceYears} Years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 uppercase text-[9.5px]">Educations:</span>
                        <span className="text-slate-300 truncate max-w-[170px]">{currentUser.education}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-900 mt-2">
                        <span className="text-slate-500 uppercase text-[9.5px] block mb-1">Credentials & Certifications:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentUser.certifications && currentUser.certifications.length > 0 ? (
                            currentUser.certifications.map((c, i) => (
                              <span key={i} className="bg-slate-950 border border-slate-900/50 text-[9px] text-slate-400 px-2 py-0.5 rounded font-sans flex items-center gap-1">
                                <span className="text-blue-500">✓</span> {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-600 italic">No certifications listed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          setEditExpYears(currentUser.experienceYears || 0);
                          setEditEducation(currentUser.education || '');
                          setEditCerts(currentUser.certifications?.join(', ') || '');
                          setIsEditingProfile(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/15 hover:border-blue-500/30 transition-all cursor-pointer select-none"
                      >
                        ⚡ <span>{lang === 'en' ? 'Edit Credentials & Exp' : 'क्रेडेंशियल व अनुभव बदलें'}</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Micro metrics */}
                <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-850/80 bg-slate-900/35 p-3 rounded-2xl">
                  <div className="text-center border-r border-slate-800">
                    <p className="text-[9.5px] text-slate-500 uppercase tracking-tighter">Engagement</p>
                    <p className="text-base font-black text-white font-mono mt-0.5">{currentUser.engagementScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9.5px] text-slate-500 uppercase tracking-tighter">Contributions</p>
                    <p className="text-base font-black text-emerald-400 font-mono mt-0.5">{currentUser.contributionsCount}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic WRI Indicator Gauges */}
              <WRIGauge 
                score={currentPersona === 'Leadership' ? orgWRI : activeWRIStats.wri} 
                label={currentPersona === 'Leadership' ? (lang === 'en' ? "Enterprise-wide index (Plant WRI)" : "संयंत्र-व्यापी तत्परता सूचकांक") : undefined}
                competencyReadiness={currentPersona === 'Leadership' ? orgWRIStats.comp : activeWRIStats.comp}
                assessmentPerformance={currentPersona === 'Leadership' ? orgWRIStats.assess : activeWRIStats.assess}
                learningEffectiveness={currentPersona === 'Leadership' ? orgWRIStats.learning : activeWRIStats.learning}
                knowledgeContribution={currentPersona === 'Leadership' ? orgWRIStats.knowledge : activeWRIStats.knowledge}
                engagement={currentPersona === 'Leadership' ? orgWRIStats.engagement : activeWRIStats.engagement}
                lang={lang}
              />

              {/* KRI (Knowledge Risk Index) Card */}
              <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-slate-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.kriTitle}</h3>
                    <p className="text-2xl font-light text-white font-mono mt-1">{krRiskData.score.toFixed(1)}%</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                    krRiskData.severity === 'Critical' 
                      ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                      : krRiskData.severity === 'High' 
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                      : 'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {krRiskData.severity} RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mb-4">
                  {t.kriDescription}
                </p>

                <div className="space-y-3.5 pt-1.5 border-t border-slate-850/80">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Retirement Concentration (12mo)</span>
                      <span className="text-white font-mono">{krRiskData.retirementScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-550 transition-all duration-1000"
                        style={{ width: `${krRiskData.retirementScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">SOP Documentation Coverage</span>
                      <span className="text-white font-mono">{krRiskData.documentationCoverage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-550 transition-all duration-1000"
                        style={{ width: `${krRiskData.documentationCoverage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Successor Pool Coverage</span>
                      <span className="text-white font-mono">{krRiskData.successorAvailability.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-550 transition-all duration-1000"
                        style={{ width: `${krRiskData.successorAvailability}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* --------------------------------------------------------------------------------------------------
                RIGHT COLUMN: Workspace Desks & Interfaces
                -------------------------------------------------------------------------------------------------- */}
            <div className="col-span-12 lg:col-span-8 space-y-6">


              
              {/* ==================================================================================================
                  WORKFLOW PERSONA 1: EMPLOYEE WORKSPACE
                  ================================================================================================== */}
              {/* If no feature is active, show the clean Employee Bento Hub */}
              {currentPersona === 'Employee' && activeFeature === null && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-[#0e1015] border border-slate-850 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full"></div>
                    <h3 className="text-sm font-black text-white tracking-tight font-display mb-1 uppercase">
                      Operative Hub & Credentials Control
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Align skill target levels, review custom active study path modules, request mentors, or search indexed plant SOP procedures.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveFeature('passport')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-blue-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-blue-600/15 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                            <Award className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-blue-950/40 text-blue-400 px-2 py-0.5 rounded border border-blue-900/30">
                            Passport
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">My Skill Passport</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          View your live capability matrix, current operational levels, and compliance gaps.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2">8 Active Competencies</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('curriculum')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-emerald-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-emerald-600/15 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border border-blue-900/30">
                            Open Hub
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Learning Curriculum</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Access study guides, safety briefings, and take dynamic micro reassessments to resolve gaps.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2">Active Modules Listed</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('training')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-purple-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-purple-600/15 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-purple-950/40 text-purple-400 px-2 py-0.5 rounded border border-blue-900/30">
                            Live Copilot
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">AI Cognitive Trainer</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Practice safe LOTO calculations, diagnostic checks, or ask plant standard checklists.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2 font-bold text-purple-400">Sarathi AI Engine Live</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('capture')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-amber-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-amber-600/15 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                            <FolderPlus className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-amber-950/40 text-amber-500 px-2 py-0.5 rounded border border-blue-900/30">
                            Capture SOP
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">SOP Preservation Hub</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Record procedural logs, lessons learned, and secure experienced knowledge limits.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2">SOP Synthesizer Ready</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('mentorship')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-cyan-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-cyan-600/15 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-cyan-950/40 text-cyan-400 px-2 py-0.5 rounded border border-blue-900/30">
                            Mentors
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Expert Mentorship Matching</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Align structurally with professional Senior Advisors and request dedicated support.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2 font-bold text-cyan-400">2 Advisors Online</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('khub')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-indigo-600/15 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                            <Search className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-indigo-950/40 text-indigo-400 px-2 py-0.5 rounded border border-blue-900/30">
                            SOP Hub
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display font-medium">Knowledge Repository</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Browse shift log summaries, compiled standards, and bookmark high-value SOP guidelines.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2">{knowledgeAssets.length} SOPs Indexed</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('legacy')}
                      className="bg-gradient-to-br from-[#0e1015] to-[#1a1310] border border-amber-500/20 rounded-2xl p-5 text-left transition-all hover:border-amber-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-amber-500/15 rounded-xl text-amber-500 group-hover:scale-110 transition-transform animate-pulse">
                            <Award className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-amber-950/40 text-amber-500 px-2 py-0.5 rounded border border-amber-900/30">
                            Wall of Fame
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">{lang === 'en' ? 'Retiree Hall of Honor' : 'वरिष्ठ सम्मान हॉल'}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          {lang === 'en' ? 'Express gratitude, post respect cards, and read eternal advice from retiring legends.' : 'वरिष्ठ सदस्यों का प्रमाणपत्र देखें, विदाई सन्देश भेजें और उनकी स्वर्णिम सलाह पढ़ें।'}
                        </p>
                      </div>
                      <span className="text-[9px] text-amber-500 font-mono mt-2 font-bold uppercase tracking-wider">🌟 {lang === 'en' ? 'Honor Roll Portal Live' : 'सम्मान सूचि सक्रिय'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If an Employee feature is active, show the back button bar and render the selected module */}
              {currentPersona === 'Employee' && activeFeature !== null && (
                <div className="space-y-6">
                  {/* Back button */}
                  <div className="flex items-center justify-between bg-[#0e1015] border border-slate-800 p-4 rounded-2xl select-none">
                    <button
                      onClick={() => setActiveFeature(null)}
                      className="flex items-center gap-1.5 text-xs font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest font-mono cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>← Back to Employee Hub</span>
                    </button>
                    <span className="text-[9px] bg-slate-900 border border-slate-805 px-2.5 py-1 rounded text-slate-400 font-mono font-bold uppercase tracking-widest hidden sm:inline">
                      READY INTEL • PORTAL ACTIVE
                    </span>
                  </div>

                  {/* 1. Skill Passport feature (EMPLOYEE ONLY) */}
                  {currentPersona === 'Employee' && activeFeature === 'passport' && (
                <SkillPassportView
                  competencies={competencies}
                  userCompetencyScores={userCompetencyScores}
                  currentUserId={currentUser.id}
                  lang={lang}
                  onPassAssessment={(compId, level) => handlePassCompetencyAssessment(currentUser.id, compId, level)}
                />
              )}

              {/* 2. Learning Curriculum (EMPLOYEE ONLY) */}
              {currentPersona === 'Employee' && activeFeature === 'curriculum' && (
                <LearningCurriculumView
                  learningResources={learningResources}
                  learningPaths={learningPaths}
                  currentUserId={currentUser.id}
                  competencies={competencies}
                  onMicroAssessmentTrigger={handleMicroAssessmentTrigger}
                  lang={lang}
                />
              )}

              {/* 3. Expert Mentorship matching panel (EMPLOYEE ONLY) */}
              {currentPersona === 'Employee' && activeFeature === 'mentorship' && (
                <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 animate-fade-in">
                  <h3 className="text-sm font-semibold text-white mb-4 pb-3 border-b border-slate-850/80 font-display uppercase tracking-wider">
                    {t.mentorTitle}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allEmployees.filter(e => e.experienceYears >= 12 && e.id !== currentUser.id).map(expert => {
                      const expertId = expert.id;
                      const specMentor = mentors.find(m => m.userId === expertId) || {
                        id: 'M-' + expertId,
                        name: expert.name,
                        department: expert.department || 'Steel Ops',
                        expertiseScore: 92,
                        skillsExpert: ['SOP Adherence', 'Equipment Operation']
                      };
                      
                      return (
                        <div key={expert.id} className="bg-[#10121a]/85 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white uppercase">{expert.name}</h4>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Department: {expert.department} • Exp: {expert.experienceYears} Yrs
                            </p>
                            
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {specMentor.skillsExpert?.map(sk => (
                                <span key={sk} className="text-[8.5px] bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-blue-400">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 uppercase font-mono">Expert Score: <b className="text-white">{specMentor.expertiseScore}/100</b></span>
                            
                            <button
                              onClick={() => handleRequestMentorship(specMentor as Mentor, 'COMP-001', 'Safety Compliance')}
                              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[9px] py-1.5 px-3 rounded-lg border border-slate-700 uppercase"
                            >
                              {t.requestMentorBtn}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. AI Cognitive Trainer (EMPLOYEE ONLY) */}
              {currentPersona === 'Employee' && activeFeature === 'training' && (
                <div className="space-y-6 animate-fade-in">
                  <AITrainer resources={learningResources} lang={lang} />
                </div>
              )}

              {/* 5. SOP Preservation Hub (EMPLOYEE ONLY) */}
              {currentPersona === 'Employee' && activeFeature === 'capture' && (
                <div id="knowledge-preservation-anchor" className="space-y-6 animate-fade-in">
                  <KnowledgeCapture onSopCreated={handleSopCreated} lang={lang} />
                </div>
              )}

              {/* 6. Knowledge Repository asset viewer (EMPLOYEE ONLY) */}
              {currentPersona === 'Employee' && activeFeature === 'khub' && (
                <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 animate-fade-in">
                  <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3 border-b border-slate-850">
                    <div>
                      <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">{t.khubTitle}</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t.khubSub}</p>
                    </div>
                    
                    {/* Category choices */}
                    <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
                      {['All', 'SOPs', 'Lessons Learned', 'Troubleshooting Guides'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedAssetCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] uppercase font-bold text-slate-400 hover:text-slate-200 transition-all ${
                            selectedAssetCategory === cat ? 'bg-slate-800 text-white' : ''
                          }`}
                        >
                          {cat === 'All' ? 'All' : cat.substring(0, 10)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search controller */}
                  <div className="relative mb-5">
                    <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={knowSearch}
                      onChange={e => setKnowSearch(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-[#10121a] border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 placeholder-slate-650 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Grid */}
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map(asset => {
                        const isSaved = bookmarkedAssets[asset.id];
                        return (
                          <div key={asset.id} className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl relative transition-all hover:border-slate-800">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[8px] uppercase tracking-widest bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-blue-400 font-mono">
                                {asset.category}
                              </span>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleBookmarkedAssetToggle(asset.id)}
                                  className={`text-slate-500 hover:text-white transition-colors`}
                                  title="Bookmark asset"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-blue-500 fill-blue-500' : ''}`} />
                                </button>
                              </div>
                            </div>

                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{asset.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 italic">
                              "{asset.summary}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3.5 mt-3 border-t border-slate-850/50 text-[10px]">
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">⚙️ Sequence:</p>
                                <ul className="list-decimal pl-4.5 text-slate-300 space-y-0.5 mt-1">
                                  {asset.steps.slice(0, 3).map((st, i) => <li key={i}>{st}</li>)}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">✓ Best Practices:</p>
                                <ul className="list-disc pl-4.5 text-slate-300 space-y-0.5 mt-1">
                                  {asset.bestPractices.slice(0, 2).map((bp, i) => <li key={i}>{bp}</li>)}
                                </ul>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-3.5 border-t border-slate-850/50 text-[9px] text-slate-500 font-mono uppercase">
                              <span>Author Reference: <b>{asset.authorName}</b></span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="text-white font-bold">{asset.rating}</span>
                                <span>({asset.ratingsCount} reviews)</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        No matching registered SOP found in local libraries. Try searching 'valve' or 'alignment'.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentPersona === 'Employee' && activeFeature === 'legacy' && (
                <VeteranLegacyHub
                  employees={allEmployees}
                  currentUser={currentUser}
                  lang={lang}
                />
              )}

                </div>
              )}

              {currentPersona === 'Manager' && activeFeature === null && (
                <>
                  <div className="bg-[#0e1015] border border-slate-850 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full"></div>
                    <h3 className="text-sm font-black text-white tracking-tight font-display mb-1 uppercase">
                      Manager Administrative Command
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Review personal verification credentials, monitor live departmental capability scores, approve training linkage requests, or capture experienced SOP procedures.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveFeature('manager_passport')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-blue-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-blue-600/15 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                            <Award className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-blue-950/40 text-blue-400 px-2 py-0.5 rounded border border-blue-900/30">
                            Personal
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">My Skills Index</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Review your personal verified competency frameworks and capability levels.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2">Verified Passport</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('manager_team')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-emerald-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-emerald-600/15 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border border-blue-900/30">
                            Team Matrix
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display font-medium">Department Readiness Matrix</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Inspect heatmaps, map employee operational scores, and detect competency gaps.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2">WRI Analytics Online</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('manager_mentorship')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-purple-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-purple-600/15 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-purple-950/40 text-purple-400 px-2 py-0.5 rounded border border-blue-900/30">
                            Approvals
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display font-semibold">Linkage & Mentors Queue</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Approve or deny expert pairing requests and oversee active plant mentors.
                        </p>
                      </div>
                      <span className="text-[9px] text-purple-400 font-mono mt-2 font-bold">{mentorRequests.filter(r=>r.status === 'Pending').length} Pending Requests</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('capture')}
                      className="bg-[#0e1015] border border-slate-800 rounded-2xl p-5 text-left transition-all hover:border-amber-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-amber-600/15 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                            <FolderPlus className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-amber-950/40 text-amber-500 px-2 py-0.5 rounded border border-blue-900/30">
                            SOP Hub
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">SOP Preservation Hub</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          Capture experienced knowledge logs, review or publish critical steelworks standards.
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-2">Verify SOP Submissions</span>
                    </button>

                    <button
                      onClick={() => setActiveFeature('legacy')}
                      className="bg-gradient-to-br from-[#0e1015] to-[#12141c] border border-amber-500/20 rounded-2xl p-5 text-left transition-all hover:border-amber-500/50 hover:bg-slate-900/40 flex flex-col justify-between h-40 group select-none cursor-pointer"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="p-2 bg-amber-500/15 rounded-xl text-amber-500 group-hover:scale-110 transition-transform animate-pulse">
                            <Award className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] uppercase font-mono font-bold bg-amber-950/40 text-amber-500 px-2 py-0.5 rounded border border-amber-900/30">
                            Wall of Fame
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">{lang === 'en' ? 'Retiree Hall of Honor' : 'वरिष्ठ सम्मान हॉल'}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                          {lang === 'en' ? 'Review legend credentials, print honor certificates, and read expert legacy advice scrolls.' : 'वरिष्ठ सदस्यों का प्रमाणपत्र देखें, विदाई सन्देश भेजें और उनकी स्वर्णिम सलाह पढ़ें।'}
                        </p>
                      </div>
                      <span className="text-[9px] text-amber-500 font-mono mt-2 font-bold uppercase tracking-wider">🌟 {lang === 'en' ? 'Honor Roll Portal Live' : 'सम्मान सूचि सक्रिय'}</span>
                    </button>
                  </div>
                </>
              )}

              {/* If a Manager feature is active, show the back button bar and render the selected module */}
              {currentPersona === 'Manager' && activeFeature !== null && (
                <div className="space-y-6">
                  {/* Back button */}
                  <div className="flex items-center justify-between bg-[#0e1015] border border-slate-800 p-4 rounded-2xl select-none">
                    <button
                      onClick={() => setActiveFeature(null)}
                      className="flex items-center gap-1.5 text-xs font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest font-mono cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>← Back to Manager Workspace</span>
                    </button>
                    <span className="text-[9px] bg-slate-900 border border-slate-805 px-2.5 py-1 rounded text-slate-400 font-mono font-bold uppercase tracking-widest hidden sm:inline">
                      MANAGER CONSOLE • ACTIVE
                    </span>
                  </div>

                  {/* 1. Personal Passport replication for Manager */}
                  {activeFeature === 'manager_passport' && (
                    <SkillPassportView
                      competencies={competencies}
                      userCompetencyScores={userCompetencyScores}
                      currentUserId={currentUser?.id || 'EMP-003'}
                      lang={lang}
                      onPassAssessment={(compId, level) => handlePassCompetencyAssessment(currentUser?.id || 'EMP-003', compId, level)}
                    />
                  )}

                  {/* 2. Team readiness matrix heatmap */}
                  {activeFeature === 'manager_team' && (
                    <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-850">
                        <h3 className="text-sm font-semibold text-white tracking-tight font-display">{t.teamReadiness}</h3>
                        <div className="text-[9px] flex gap-2.5 font-mono">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-600"></span> L4-5</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> L3</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-600"></span> L1-2</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {allEmployees.map(emp => {
                          const empWri = calculateEmployeeWRI(emp.id);
                          const baseScores = userCompetencyScores[emp.id] || {};
                          
                          return (
                            <div key={emp.id} className="bg-[#10121a]/80 border border-slate-855 rounded-2xl p-4 space-y-3.5">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-xs font-bold text-white uppercase">{emp.name}</h4>
                                  <p className="text-[10px] text-slate-500">{emp.designation} • Exp: {emp.experienceYears} Years</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9.5px] text-slate-500 block">WRI Index</span>
                                  <span className="text-xs font-mono font-bold text-blue-400">{empWri.toFixed(1)}%</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1 border-t border-slate-855">
                                {competencies.map(comp => {
                                  const val = baseScores[comp.id] || 2;
                                  let color = 'bg-orange-600 text-white';
                                  if (val >= 4) color = 'bg-blue-600 text-white';
                                  else if (val >= 3) color = 'bg-emerald-600 text-white';
                                  
                                  return (
                                    <div key={comp.id} className="text-center rounded p-1 flex flex-col justify-between" title={`${comp.name}: Level ${val}`}>
                                      <span className="text-[7.5px] text-slate-500 block uppercase truncate font-mono">{comp.name.substring(0,6)}</span>
                                      <span className={`text-[10px] font-mono font-bold rounded py-0.5 mt-0.5 ${color}`}>L{val}</span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Connect Action Bar */}
                              <div className="pt-3 border-t border-slate-850 flex flex-wrap gap-2.5 justify-between items-center sm:flex-nowrap">
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {interactions.filter(item => item.employeeId === emp.id).length} Active Connections / Operations Logged
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveConnectEmployeeId(activeConnectEmployeeId === emp.id ? null : emp.id)}
                                  className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                                    activeConnectEmployeeId === emp.id
                                      ? 'bg-blue-600 text-white shadow shadow-blue-500/10'
                                      : 'bg-slate-900 border border-slate-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/30'
                                  }`}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{activeConnectEmployeeId === emp.id ? (lang === 'en' ? 'Close Desk' : 'डेस्क बंद करें') : (lang === 'en' ? 'Connect' : 'कनेक्ट करें')}</span>
                                </button>
                              </div>

                              {/* Connect Panel Content */}
                              {activeConnectEmployeeId === emp.id && (
                                <div className="mt-4 pt-4 border-t border-slate-850/80 space-y-4 animate-fade-in text-left">
                                  {/* Header banner */}
                                  <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-slate-900">
                                    <div>
                                      <h5 className="text-[10px] font-bold text-white uppercase tracking-wider font-display">
                                        {lang === 'en' ? `Direct Connection Console • ${emp.name}` : `सीधा संपर्क कंसोल • ${emp.name}`}
                                      </h5>
                                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                                        {lang === 'en' 
                                          ? 'Instruct directly, assign target skill benchmarks, and share customized SOP files/explanations.' 
                                          : 'निर्देश दें, लक्षित योग्यताएं सौंपें, और विस्तृत एसओपी नियम समझाएं।'}
                                      </p>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                  </div>

                                  {/* Row split */}
                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                    {/* Action Desk Form (7 columns) */}
                                    <div className="lg:col-span-7 space-y-4">
                                      {/* Sub views selection tabs */}
                                      <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-850 flex gap-1 text-[9px] text-slate-400 font-bold uppercase select-none">
                                        {['message', 'assignment', 'explanation'].map((tab) => {
                                          const activeTab = connectTab[emp.id] || 'message';
                                          const isAct = activeTab === tab;
                                          return (
                                            <button
                                              key={tab}
                                              type="button"
                                              onClick={() => {
                                                setConnectTab(prev => ({ ...prev, [emp.id]: tab }));
                                              }}
                                              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center font-bold font-mono tracking-wider ${
                                                isAct ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'hover:text-slate-250 hover:bg-slate-900/50'
                                              }`}
                                            >
                                              {tab === 'message' 
                                                ? (lang === 'en' ? '💬 Message' : '💬 संदेश') 
                                                : tab === 'assignment' 
                                                ? (lang === 'en' ? '🎯 Assign Target' : '🎯 लक्ष्य आवंटन') 
                                                : (lang === 'en' ? '📖 Explain SOP' : '📖 SOP समझाएं')}
                                            </button>
                                          );
                                        })}
                                      </div>

                                      {/* Tab 1: Message and advice */}
                                      {(connectTab[emp.id] || 'message') === 'message' && (
                                        <div className="space-y-3.5 bg-slate-950/25 p-4 rounded-2xl border border-slate-850/60">
                                          <div>
                                            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider font-mono">
                                              {lang === 'en' ? 'Transmit Pulse Instruction / Advice' : 'त्वरित परिचालन निर्देश/सलाह भेजें'}
                                            </label>
                                            <textarea
                                              value={connectMessage[emp.id] || ''}
                                              onChange={(e) => setConnectMessage(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                              placeholder={lang === 'en' 
                                                ? "Type specific directives, shift alerts, quality reminders..." 
                                                : "विशिष्ट निर्देश, सुरक्षा चेतावनियाँ या गुणवत्ता अनुस्मारक टाइप करें..."}
                                              className="w-full h-18 bg-[#0b0c10] border border-slate-850 rounded-xl px-3 py-2 text-[10.5px] text-slate-350 focus:outline-none focus:border-blue-600 font-sans leading-normal focus:text-white"
                                            />
                                          </div>

                                          {/* Quick Suggestion Chips */}
                                          <div className="space-y-1.5">
                                            <span className="text-[8px] text-slate-500 font-bold uppercase block tracking-widest font-mono">
                                              {lang === 'en' ? '⚡ Click Quick Templates:' : '⚡ त्वरित संदेश चयन:'}
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                              {[
                                                '⚠️ Ensure strict LOTO procedures on rotating bearing repairs.',
                                                '💪 Excellent progress in digital metrics! Keep the focus up.',
                                                '📌 Document your diagnostic method on pump bearings for the team.',
                                                '🧪 Validate carbon level stability in the next tap-out phase.'
                                              ].map((chip) => (
                                                <button
                                                  key={chip}
                                                  type="button"
                                                  onClick={() => setConnectMessage(prev => ({ ...prev, [emp.id]: chip }))}
                                                  className="bg-slate-900 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-705 text-[8.5px] px-2 py-1 rounded transition-all truncate max-w-full font-sans cursor-pointer text-left"
                                                >
                                                  {chip}
                                                </button>
                                              ))}
                                            </div>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => handleSendConnectMessage(emp.id, emp.name)}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-mono"
                                          >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>{lang === 'en' ? `Transmit Directive to ${emp.name.split(' ')[0]}` : `${emp.name.split(' ')[0]} को निर्देश भेजें`}</span>
                                          </button>
                                        </div>
                                      )}

                                      {/* Tab 2: Assign Target with score alignment simulation */}
                                      {(connectTab[emp.id] || 'message') === 'assignment' && (
                                        <div className="space-y-3.5 bg-slate-950/25 p-4 rounded-2xl border border-slate-850/60 font-sans">
                                          <div className="grid grid-cols-2 gap-3.5">
                                            <div>
                                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider font-mono">
                                                {lang === 'en' ? 'Select Competency Area' : 'योग्यता क्षेत्र का चयन करें'}
                                              </label>
                                              <select
                                                value={connectCompId[emp.id] || competencies[0]?.id}
                                                onChange={(e) => setConnectCompId(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                                className="w-full bg-[#0b0c10] border border-slate-850 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-600 font-medium"
                                              >
                                                {competencies.map(c => (
                                                  <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                              </select>
                                            </div>
                                            <div>
                                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider font-mono">
                                                {lang === 'en' ? 'Target Benchmark Level' : 'लक्षित बेंचमार्क स्तर'}
                                              </label>
                                              <select
                                                value={connectTargetLevel[emp.id] || 4}
                                                onChange={(e) => setConnectTargetLevel(prev => ({ ...prev, [emp.id]: parseInt(e.target.value) }))}
                                                className="w-full bg-[#0b0c10] border border-slate-850 rounded-lg px-2 py-1.5 text-[10px] text-slate-350 focus:outline-none focus:border-blue-600 font-mono"
                                              >
                                                {[3, 4, 5].map(lvl => (
                                                  <option key={lvl} value={lvl}>Level L{lvl}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>

                                          <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-900 text-[10px] text-slate-400 space-y-1">
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-mono">🎯 Assignment Scope Details:</span>
                                            <p className="leading-relaxed">
                                              {lang === 'en' 
                                                ? 'This assignment triggers a certified skill-gap remediation mission. The user is issued simulator modules and micro-assessments to align their active level on the shift layout.' 
                                                : 'यह कार्य प्रमाणित कौशल अंतराल को पाटने की प्रक्रिया शुरू करता है। ऑपरेटर को उनके स्तर को उत्कृष्ट बनाने के लिए सिम्युलेटर मॉड्यूल और परीक्षण जारी किए जाते हैं।'}
                                            </p>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => handleAssignCompetencyTarget(emp.id, emp.name)}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-mono"
                                          >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>{lang === 'en' ? 'Authorize Target & Training Scope' : 'लक्ष्य और प्रशिक्षण क्षेत्र अधिकृत करें'}</span>
                                          </button>
                                        </div>
                                      )}

                                      {/* Tab 3: Explain SOP / Share Assets */}
                                      {(connectTab[emp.id] || 'message') === 'explanation' && (
                                        <div className="space-y-3.5 bg-slate-950/25 p-4 rounded-2xl border border-slate-850/60 font-sans">
                                          <div>
                                            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider font-mono">
                                              {lang === 'en' ? 'Select SOP Guide or Lessons Learned Archive' : 'एसओपी गाइड या सबक सीखे गए संग्रह का चयन करें'}
                                            </label>
                                            <select
                                              value={connectAttachedAsset[emp.id] || knowledgeAssets[0]?.id}
                                              onChange={(e) => setConnectAttachedAsset(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                              className="w-full bg-[#0b0c10] border border-slate-850 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-600 font-medium"
                                            >
                                              {knowledgeAssets.map(asset => (
                                                <option key={asset.id} value={asset.id}>{asset.title} ({asset.category})</option>
                                              ))}
                                            </select>
                                          </div>

                                          <div>
                                            <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider font-mono">
                                              {lang === 'en' ? 'Operational Advice / Explanation Note' : 'परिचालन निर्देश / व्यावहारिक व्याख्या नोट'}
                                            </label>
                                            <textarea
                                              value={connectExplanationText[emp.id] || ''}
                                              onChange={(e) => setConnectExplanationText(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                              placeholder={lang === 'en' 
                                                ? "Elaborate or highlight critical steps of this SOP to explain it to them clearly..." 
                                                : "ऑपरेटर को स्पष्टता प्रदान करने के लिए इस एसओपी के व्यावहारिक या महत्वपूर्ण चरणों को विस्तार से साझा करें..."}
                                              className="w-full h-15 bg-[#0b0c10] border border-slate-850 rounded-xl px-3 py-2 text-[10.5px] text-slate-350 focus:outline-none focus:border-blue-600 font-sans leading-normal focus:text-white"
                                            />
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => handleShareSopExplanation(emp.id, emp.name)}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-mono"
                                          >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>{lang === 'en' ? 'Share Reference & Explain Guidelines' : 'एसओपी संदर्भ साझा करें और समझाएं'}</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    {/* Interaction Feed Thread log (5 columns) */}
                                    <div className="lg:col-span-5 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/70 flex flex-col h-full min-h-[220px]">
                                      <div className="flex justify-between items-center pb-2 border-b border-slate-850 mb-3 select-none">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                          {lang === 'en' ? 'Communication Dispatch Logs' : 'प्रेषण संचार इतिहास'}
                                        </span>
                                        <span className="text-[8px] text-emerald-400 font-mono flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                                          {lang === 'en' ? 'THREAD ACTIVE' : 'धागा सक्रिय'}
                                        </span>
                                      </div>

                                      {/* Scrollable interactions list */}
                                      <div className="space-y-3 overflow-y-auto max-h-[210px] flex-1 pr-1">
                                        {interactions.filter(item => item.employeeId === emp.id).length > 0 ? (
                                          interactions
                                            .filter(item => item.employeeId === emp.id)
                                            .map((item) => {
                                              const isMsg = item.type === 'message';
                                              const isAss = item.type === 'assignment';
                                              return (
                                                <div 
                                                  key={item.id} 
                                                  className={`p-3 rounded-xl border relative space-y-1.5 text-left transition-all hover:bg-slate-900/10 ${
                                                    isMsg 
                                                      ? 'bg-slate-900/40 border-slate-850/70' 
                                                      : isAss 
                                                      ? 'bg-blue-950/15 border-blue-900/20' 
                                                      : 'bg-emerald-950/15 border-emerald-900/20'
                                                  }`}
                                                >
                                                  <div className="flex justify-between items-center gap-1.5">
                                                    <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded font-mono ${
                                                      isMsg 
                                                        ? 'bg-slate-950 text-slate-450 border border-slate-850/40' 
                                                        : isAss 
                                                        ? 'bg-blue-950 text-blue-400 border border-blue-900/30' 
                                                        : 'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                                                    }`}>
                                                      {isMsg ? (lang === 'en' ? 'Message' : 'संदेश') : isAss ? (lang === 'en' ? 'Mission' : 'मिशन') : (lang === 'en' ? 'SOP Briefing' : 'एसओपी ब्रीफिंग')}
                                                    </span>
                                                    <span className="text-[8px] text-slate-500 font-mono">
                                                      {item.timestamp}
                                                    </span>
                                                  </div>
                                                  <p className="text-[9.5px] text-slate-350 font-sans leading-relaxed">
                                                    {item.content}
                                                  </p>
                                                  {item.attachedSopTitle && (
                                                    <div className="text-[8.5px] bg-emerald-950/50 border border-emerald-900/30 px-2 py-0.5 rounded text-emerald-400 font-mono inline-block">
                                                      📄 {item.attachedSopTitle}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })
                                        ) : (
                                          <div className="h-full flex flex-col items-center justify-center text-center py-8 text-slate-600 select-none">
                                            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
                                              No Terminal Directives Sent
                                            </span>
                                            <span className="text-[8.5px] mt-1 text-slate-550 max-w-[180px] mx-auto leading-relaxed">
                                              Directly compose message instruction, assign targets or explain mechanical SOP above to start logs.
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Mentor approvals queue */}
                  {activeFeature === 'manager_mentorship' && (
                    <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 animate-fade-in">
                      <h3 className="text-sm font-semibold text-white mb-4 pb-3 border-b border-slate-855 font-display">
                        {t.actionRequired}
                      </h3>

                      <div className="space-y-4">
                        {mentorRequests.map(req => (
                          <div key={req.id} className="bg-[#10121a] border border-slate-850 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4">
                            <div className="space-y-1">
                              <span className="text-[8px] bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-blue-400 font-mono">
                                {req.status}
                              </span>
                              <h4 className="text-xs font-bold text-white">Apprentice: {req.requesterName}</h4>
                              <p className="text-[10px] text-slate-400 italic">"{req.message}"</p>
                              <p className="text-[10px] text-slate-550 font-mono">Target requirement gap: {req.competencyName}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {req.status === 'Approved' ? (
                                <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/5 px-2.5 py-1.5 rounded-xl border border-emerald-500/10 flex items-center gap-1">
                                  ✓ Approved & Linked
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleApproveRequest(req.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-xl uppercase transition-all"
                                >
                                  {t.approveBtn}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. SOP Preservation Hub (MANAGER ONLY) */}
                  {activeFeature === 'capture' && (
                    <div id="knowledge-preservation-anchor" className="space-y-6 animate-fade-in">
                      <KnowledgeCapture onSopCreated={handleSopCreated} lang={lang} />
                    </div>
                  )}

                  {/* 5. Retiree Hall of Honor (MANAGER ONLY) */}
                  {activeFeature === 'legacy' && (
                    <VeteranLegacyHub
                      employees={allEmployees}
                      currentUser={currentUser}
                      lang={lang}
                    />
                  )}
                </div>
              )}

              {/* ==================================================================================================
                  WORKFLOW PERSONA 3: LEADERSHIP STRATEGIC SYSTEM COMMAND
                  ================================================================================================== */}
              {currentPersona === 'Leadership' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Strategic desk view tabs */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-[#0c0d12] border border-slate-800 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setLeadershipSubView('Employees')}
                      className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all ${
                        leadershipSubView === 'Employees' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{t.viewEmployeeReport}</span>
                    </button>
                    <button
                      onClick={() => setLeadershipSubView('Managers')}
                      className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all ${
                        leadershipSubView === 'Managers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Managers ({allEmployees.filter(e => e.role === 'Manager').length})</span>
                    </button>
                    <button
                      onClick={() => setLeadershipSubView('Teams')}
                      className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all ${
                        leadershipSubView === 'Teams' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{t.viewTeamReport}</span>
                    </button>
                    <button
                      onClick={() => setLeadershipSubView('Organization')}
                      className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all ${
                        leadershipSubView === 'Organization' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Governance ({orgWRI.toFixed(1)}%)</span>
                    </button>
                    <button
                      onClick={() => setLeadershipSubView('Retirement')}
                      className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all col-span-2 md:col-span-1 ${
                        leadershipSubView === 'Retirement' ? 'bg-[#92400e] text-white shadow-lg' : 'text-slate-400 hover:text-amber-400 hover:bg-amber-955/20'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Retirement 🛡️</span>
                    </button>
                  </div>

                  {/* SUB-VIEW 1: All individual employee performance lookups with DIRECT CONNECT COMMANDS */}
                  {leadershipSubView === 'Employees' && (
                    <div className="space-y-5">
                      <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
                          <div>
                            <h3 className="text-sm font-semibold text-white font-display">Active Plant Competencies Registry</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">Real-time status tracking and direct command dispatch terminal</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                placeholder="Search employees..."
                                value={leadershipSearchInput}
                                onChange={e => setLeadershipSearchInput(e.target.value)}
                                className="bg-[#10121a] border border-slate-850 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 w-48 sm:w-60"
                              />
                            </div>
                            <span className="text-[10px] bg-slate-900 border border-slate-855 text-blue-400 px-2.5 py-1 rounded font-mono shrink-0">
                              Indexed: {allEmployees.filter(e => e.role === 'Employee').length}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 font-sans">
                          {allEmployees.filter(e => e.role === 'Employee').filter(emp => {
                            if (!leadershipSearchInput) return true;
                            const term = leadershipSearchInput.toLowerCase();
                            return emp.name.toLowerCase().includes(term) || 
                                   emp.designation?.toLowerCase().includes(term) || 
                                   emp.department?.toLowerCase().includes(term);
                          }).map(emp => {
                            const wri = calculateEmployeeWRI(emp.id);
                            const userScores = userCompetencyScores[emp.id] || {};
                            const isConnectActive = activeConnectEmployeeId === emp.id;
                            
                            return (
                              <div key={emp.id} className="bg-[#10121a]/80 p-5 rounded-2xl border border-slate-850 space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">{emp.name}</h4>
                                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                                        Active
                                      </span>
                                    </div>
                                    <p className="text-[11.5px] text-slate-400 mt-1">
                                      {emp.designation} • <span className="text-slate-500 font-mono">ID: {emp.employeeId}</span> • {emp.companyName}
                                    </p>
                                    <p className="text-[10.5px] text-slate-500">
                                      Department: <b className="text-slate-300">{emp.department}</b> • Experience: <b className="text-slate-300">{emp.experienceYears} Years</b>
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-4 justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-850/60 pt-3 sm:pt-0">
                                    <div className="text-left sm:text-right">
                                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Calculated WRI</span>
                                      <span className="text-sm font-mono font-black text-emerald-400">{wri.toFixed(1)}%</span>
                                    </div>
                                    <button
                                      onClick={() => setActiveConnectEmployeeId(isConnectActive ? null : emp.id)}
                                      className={`text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-xl transition-all ${
                                        isConnectActive 
                                          ? 'bg-red-955/45 text-red-400 border border-red-900/40 hover:bg-red-900/20' 
                                          : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-md'
                                      }`}
                                    >
                                      {isConnectActive ? 'Disconnect ✕' : 'Connect Directive 💬'}
                                    </button>
                                  </div>
                                </div>

                                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850/60 flex flex-wrap gap-2">
                                  {competencies.slice(0, 6).map(comp => {
                                    const lvl = userScores[comp.id] || 2;
                                    const isCritical = lvl < comp.targetLevel;
                                    return (
                                      <div key={comp.id} className="text-[10px] bg-[#0d0e12] border border-slate-850 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono">
                                        <span className="text-slate-500">{comp.name.substring(0, 15)}:</span>
                                        <span className={`font-bold ${isCritical ? 'text-red-400' : 'text-blue-400'}`}>
                                          L{lvl} <span className="text-slate-655 font-normal">/L{comp.targetLevel}</span>
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* ACTIVE INLINE DIRECT CONNECT COMMAND CONSOLE */}
                                {isConnectActive && (
                                  <div className="p-4 bg-[#0d0f14] border border-blue-900/35 rounded-2xl space-y-4 animate-fade-in text-xs font-mono">
                                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="font-bold text-white uppercase tracking-wider text-[10.5px]">Strategic Command Terminal ── Active</span>
                                      </div>
                                      <span className="text-[9.5px] text-slate-500 font-mono">Channel Status: TLS Safe</span>
                                    </div>

                                    {/* Command tabs */}
                                    <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
                                      {['direct', 'benchmark', 'sop'].map(tab => (
                                        <button
                                          key={tab}
                                          onClick={() => setConnectTab(prev => ({ ...prev, [emp.id]: tab }))}
                                          className={`py-1.5 rounded-lg text-[10px] uppercase font-bold text-center transition-all ${
                                            (connectTab[emp.id] || 'direct') === tab 
                                              ? 'bg-blue-600 text-white' 
                                              : 'text-slate-400 hover:text-slate-200'
                                          }`}
                                        >
                                          {tab === 'direct' ? '💬 Message' : tab === 'benchmark' ? '🎯 Skill Target' : '📄 SOP Checkoff'}
                                        </button>
                                      ))}
                                    </div>

                                    {/* Action 1: Direct message instruction */}
                                    {(connectTab[emp.id] || 'direct') === 'direct' && (
                                      <div className="space-y-3 font-sans text-xs">
                                        <div>
                                          <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Send Executive Directive</label>
                                          <input
                                            type="text"
                                            value={connectMessage[emp.id] || ''}
                                            onChange={e => setConnectMessage(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                            placeholder="Write customized instruction (e.g. Please verify pressure readings on vacuum line)..."
                                            className="w-full bg-[#10121a] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-600"
                                          />
                                        </div>
                                        <button
                                          onClick={() => handleSendConnectMessage(emp.id, emp.name)}
                                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg uppercase tracking-wider text-[9.5px] transition-colors font-mono"
                                        >
                                          Transmit Status Directive
                                        </button>
                                      </div>
                                    )}

                                    {/* Action 2: Assign Target Benchmarks */}
                                    {(connectTab[emp.id] || 'direct') === 'benchmark' && (
                                      <div className="space-y-3 font-sans">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Target Competency</label>
                                            <select
                                              value={connectCompId[emp.id] || competencies[0]?.id}
                                              onChange={e => setConnectCompId(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                              className="w-full bg-[#10121a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-600"
                                            >
                                              {competencies.map(comp => (
                                                <option key={comp.id} value={comp.id}>{comp.name}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Target Mandatory Level</label>
                                            <select
                                              value={connectTargetLevel[emp.id] || 4}
                                              onChange={e => setConnectTargetLevel(prev => ({ ...prev, [emp.id]: parseInt(e.target.value) }))}
                                              className="w-full bg-[#10121a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-600"
                                            >
                                              <option value="1">Level 1 (लर्निंग स्टेज)</option>
                                              <option value="2">Level 2 (सुपरवाइज्ड)</option>
                                              <option value="3">Level 3 (ऑटोनोमस)</option>
                                              <option value="4">Level 4 (एक्सपर्ट)</option>
                                              <option value="5">Level 5 (मास्टर/मेंटर)</option>
                                            </select>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleAssignCompetencyTarget(emp.id, emp.name)}
                                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg uppercase tracking-wider text-[9.5px] transition-colors font-mono"
                                        >
                                          Authorize Target Assignment
                                        </button>
                                      </div>
                                    )}

                                    {/* Action 3: Share SOP */}
                                    {(connectTab[emp.id] || 'direct') === 'sop' && (
                                      <div className="space-y-3 font-sans">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Preserved SOP Document</label>
                                            <select
                                              value={connectAttachedAsset[emp.id] || knowledgeAssets[0]?.id}
                                              onChange={e => setConnectAttachedAsset(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                              className="w-full bg-[#10121a] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                                            >
                                              {knowledgeAssets.map(asset => (
                                                <option key={asset.id} value={asset.id}>{asset.title}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono">Briefing note</label>
                                            <input
                                              type="text"
                                              value={connectExplanationText[emp.id] || ''}
                                              onChange={e => setConnectExplanationText(prev => ({ ...prev, [emp.id]: e.target.value }))}
                                              placeholder="e.g. Please run through valve purging sequences..."
                                              className="w-full bg-[#10121a] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                                            />
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleShareSopExplanation(emp.id, emp.name)}
                                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg uppercase tracking-wider text-[9.5px] transition-colors font-mono"
                                        >
                                          Share Document Checkoff
                                        </button>
                                      </div>
                                    )}

                                    {/* Logs */}
                                    <div className="space-y-1.5 pt-2 border-t border-slate-850/50">
                                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Live Connections Activity Feed</span>
                                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-sans">
                                        {interactions.filter(int => int.employeeId === emp.id).length === 0 ? (
                                          <p className="text-[10px] text-slate-600 text-center py-2 font-mono">No instructions logged for current worker.</p>
                                        ) : (
                                          interactions.filter(int => int.employeeId === emp.id).map(int => (
                                            <div key={int.id} className="text-[10.5px] border-b border-slate-850/40 pb-1.5 last:border-0 last:pb-0">
                                              <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-0.5">
                                                <span>{int.managerName} ({int.type.toUpperCase()})</span>
                                                <span>{int.timestamp}</span>
                                              </div>
                                              <p className="text-slate-300 font-sans leading-relaxed">{int.content}</p>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 2: Managers details and performance, with CONNECT options */}
                  {leadershipSubView === 'Managers' && (
                    <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
                        <div>
                          <h3 className="text-sm font-semibold text-white font-display">Active Managers & Reliability Supervisors Ledger</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-sans">Line managers, safety advisors, and departmental supervisors</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              placeholder="Search managers..."
                              value={leadershipManagerSearchInput}
                              onChange={e => setLeadershipManagerSearchInput(e.target.value)}
                              className="bg-[#10121a] border border-slate-850 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-605 focus:outline-none focus:border-blue-600 w-48 sm:w-60"
                            />
                          </div>
                          <span className="text-[10px] bg-slate-900 border border-slate-855 text-blue-400 px-2.5 py-1 rounded font-mono shrink-0">
                            Total Managers: {allEmployees.filter(e => e.role === 'Manager').length}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {allEmployees.filter(e => e.role === 'Manager').filter(mgr => {
                          if (!leadershipManagerSearchInput) return true;
                          const term = leadershipManagerSearchInput.toLowerCase();
                          return mgr.name.toLowerCase().includes(term) || 
                                 mgr.designation?.toLowerCase().includes(term) || 
                                 mgr.department?.toLowerCase().includes(term);
                        }).map(mgr => {
                          const deptEmps = allEmployees.filter(e => e.department === mgr.department);
                          const deptWri = deptEmps.length > 0 
                            ? deptEmps.reduce((sum, e) => sum + calculateEmployeeWRI(e.id), 0) / deptEmps.length 
                            : 84.5;
                          const isConnectActive = activeConnectManagerId === mgr.id;
                          
                          return (
                            <div key={mgr.id} className="bg-[#10121a]/80 p-5 rounded-2xl border border-slate-850 space-y-4 font-sans">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-white uppercase">{mgr.name}</h4>
                                    <span className="text-[8px] bg-blue-500/15 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded font-mono">
                                      {mgr.department} Supervisor
                                    </span>
                                  </div>
                                  <p className="text-[11.5px] text-slate-400">
                                    {mgr.designation} • <span className="text-slate-500 font-mono text-[10px]">Staff ID: {mgr.employeeId}</span>
                                  </p>
                                  <p className="text-[10.5px] text-slate-500">
                                    Site Unit: <b className="text-slate-300">{mgr.unit}</b> • Experience: <b className="text-slate-300">{mgr.experienceYears} Years</b> • Education: <b className="text-slate-300">{mgr.education}</b>
                                  </p>
                                </div>

                                <div className="flex items-center gap-4 justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-850 pt-3 sm:pt-0">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[9px] text-slate-500 uppercase block tracking-wide">Managed Dept WRI</span>
                                    <span className="text-sm font-mono font-black text-blue-400">{deptWri.toFixed(1)}%</span>
                                  </div>
                                  <button
                                    onClick={() => setActiveConnectManagerId(isConnectActive ? null : mgr.id)}
                                    className={`text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-xl transition-all ${
                                      isConnectActive 
                                        ? 'bg-red-955/45 text-red-400 border border-red-900/40' 
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                                    }`}
                                  >
                                    {isConnectActive ? 'Disconnect ✕' : 'Direct Connect 💬'}
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                                <div className="bg-slate-950/45 p-2.5 rounded-xl border border-slate-850/50 text-center">
                                  <span className="text-[8.5px] text-slate-500 uppercase block font-sans">Total Managed Crew</span>
                                  <span className="text-xs font-bold text-slate-200">{deptEmps.length} Workers</span>
                                </div>
                                <div className="bg-slate-950/45 p-2.5 rounded-xl border border-slate-850/50 text-center">
                                  <span className="text-[8.5px] text-slate-500 uppercase block font-sans">LOTO Certifications</span>
                                  <span className="text-[9px] font-bold text-slate-300 truncate block">
                                    {mgr.certifications && mgr.certifications[0] ? mgr.certifications[0].substring(0, 18) : 'Certified'}
                                  </span>
                                </div>
                                <div className="bg-slate-950/45 p-2.5 rounded-xl border border-slate-850/50 text-center">
                                  <span className="text-[8.5px] text-slate-500 uppercase block font-sans">Supervisor Engagement</span>
                                  <span className="text-xs font-bold text-emerald-400">{mgr.engagementScore}%</span>
                                </div>
                              </div>

                              {/* ACTIVE COLLAPSIBLE MANAGER CONNECTION PANEL */}
                              {isConnectActive && (
                                <div className="p-4 bg-[#0d0f14] border border-blue-900/35 rounded-2xl space-y-4 animate-fade-in text-xs font-mono">
                                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                                    <span className="font-bold text-white uppercase tracking-wider text-[10.5px] font-sans">Direct Overseer Command Desk ── Dispatch instruction to {mgr.name}</span>
                                    <span className="text-[9px] text-slate-500 font-mono">TLS Connection Secured</span>
                                  </div>

                                  <div className="space-y-3 font-sans">
                                    <div>
                                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1 font-mono">Issue Executive Directive to Department Supervisor</label>
                                      <textarea
                                        rows={2}
                                        value={connectMessage[mgr.id] || ''}
                                        onChange={e => setConnectMessage(prev => ({ ...prev, [mgr.id]: e.target.value }))}
                                        placeholder="Enter strategic instructions (e.g., Conduct urgent winter boiler pressure calibration audits next shift. Deploy V. Krishnamurthy to support as SOP lead advisor)..."
                                        className="w-full bg-[#10121a] border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-600"
                                      />
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <p className="text-[9.5px] text-slate-500 leading-none">This instruction will log as an executive mandate in the departmental audit trails.</p>
                                      <button
                                        onClick={() => {
                                          const directiveText = connectMessage[mgr.id]?.trim();
                                          if (!directiveText) return;
                                          
                                          // dispatch the directive
                                          const newInt = {
                                            id: `INT-${Date.now()}`,
                                            employeeId: mgr.id,
                                            managerName: currentUser?.name || 'Strategic Directorate',
                                            type: 'message' as const,
                                            content: `[EXECUTIVE DIRECTIVE] ${directiveText}`,
                                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' • Direct Command'
                                          };
                                          
                                          setInteractions(prev => [newInt, ...prev]);
                                          setConnectMessage(prev => ({ ...prev, [mgr.id]: '' }));
                                          
                                          alert("Directive successfully dispatched to Manager " + mgr.name);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg uppercase tracking-wider text-[10px] transition-colors font-mono"
                                      >
                                        Transmit Directive
                                      </button>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 pt-2 border-t border-slate-850/50">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Direct Communications Log</span>
                                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-sans">
                                      {interactions.filter(int => int.employeeId === mgr.id).length === 0 ? (
                                        <p className="text-[10px] text-slate-600 text-center py-2 font-mono">No direct commands dispatched in this shift session.</p>
                                      ) : (
                                        interactions.filter(int => int.employeeId === mgr.id).map(int => (
                                          <div key={int.id} className="text-[10.5px] border-b border-slate-850/40 pb-1.5 last:border-0 last:pb-0">
                                            <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-0.5">
                                              <span>{int.managerName} (DIRECTIVE)</span>
                                              <span>{int.timestamp}</span>
                                            </div>
                                            <p className="text-slate-300 font-mono leading-relaxed">{int.content}</p>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 3: Teamwise and Department Details */}
                  {leadershipSubView === 'Teams' && (
                    <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                      <div>
                        <h3 className="text-sm font-semibold text-white border-b border-slate-850 pb-3 font-display">
                          Plant Operations Readiness heatmaps (Departmental Indexing)
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-sans">Strategic oversight, department-wide benchmarks, and team broad-transmissions</p>
                      </div>

                      <div className="space-y-4">
                        {['Blast Furnace Ops', 'Quality Control', 'Maintenance & Reliability'].map(dept => {
                          const deptEmps = allEmployees.filter(e => e.department === dept);
                          const avgWri = deptEmps.length > 0 
                            ? (deptEmps.reduce((sum, e) => sum + calculateEmployeeWRI(e.id), 0) / deptEmps.length).toFixed(1) 
                            : '85.2';
                          const isConnectActive = activeConnectTeamId === dept;
                          
                          return (
                            <div key={dept} className="bg-[#10121a]/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
                                <div className="space-y-0.5">
                                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{dept}</h4>
                                  <p className="text-[11px] text-slate-400 font-mono">Crew Size: {deptEmps.length} Personnel • Senior Experienced Leaders: {deptEmps.filter(e => e.experienceYears && e.experienceYears >= 15).length}</p>
                                </div>
                                
                                <div className="flex items-center gap-4 justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-850/60 pt-3 sm:pt-0">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[9px] text-slate-500 uppercase block font-sans">Security Index</span>
                                    <span className={`text-base font-black font-mono ${Number(avgWri) > 75 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                      {avgWri}%
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setActiveConnectTeamId(isConnectActive ? null : dept)}
                                    className={`text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-xl transition-all ${
                                      isConnectActive 
                                        ? 'bg-red-955/40 text-red-400 border border-red-900/40' 
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                                    }`}
                                  >
                                    {isConnectActive ? 'Close Console ✕' : 'Direct Broadcast 📡'}
                                  </button>
                                </div>
                              </div>

                              <div className="p-3.5 bg-slate-950/45 rounded-xl border border-slate-850/60 font-mono text-[10px]">
                                <span className="text-slate-500 uppercase block mb-1 font-bold font-sans">Crew Roster:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {deptEmps.map(emp => {
                                    const wScore = calculateEmployeeWRI(emp.id);
                                    return (
                                      <span key={emp.id} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300 flex items-center gap-1">
                                        {emp.name} <b className={wScore > 75 ? 'text-emerald-400' : 'text-orange-400'}>L{wScore.toFixed(0)}</b>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* ACTIVE COLLAPSIBLE DEPARTMENT INTEGRATOR */}
                              {isConnectActive && (
                                <div className="bg-[#0c0e12] p-4 rounded-xl border border-blue-900/30 space-y-4 animate-fade-in text-xs font-mono">
                                  <div className="border-b border-slate-850 pb-2">
                                    <span className="text-[10.5px] font-bold text-blue-400 font-sans">📡 Active Broadcast Transceiver ── {dept} Whole Crew</span>
                                  </div>

                                  <div className="space-y-3.5 font-sans">
                                    <div>
                                      <label className="block text-[9.5px] text-slate-400 uppercase mb-1 font-mono">Send Group Broadcast Announcement</label>
                                      <input
                                        type="text"
                                        value={connectMessage[dept] || ''}
                                        onChange={e => setConnectMessage(prev => ({ ...prev, [dept]: e.target.value }))}
                                        placeholder={`Broadcast directive instructions to all ${deptEmps.length} members of the crew...`}
                                        className="w-full bg-[#10121a] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-600"
                                      />
                                    </div>

                                    <div className="flex justify-between items-center text-[10px]">
                                      <p className="text-slate-500">Dispatches real-time instructions to all indexed personnel simultaneously.</p>
                                      <button
                                        onClick={() => {
                                          const text = connectMessage[dept]?.trim();
                                          if (!text) return;

                                          // loop and add interactions for each
                                          deptEmps.forEach(emp => {
                                            const newBroadcast = {
                                              id: `INT-${Date.now()}-${emp.id}`,
                                              employeeId: emp.id,
                                              managerName: currentUser?.name || 'Strategic Directorate',
                                              type: 'message' as const,
                                              content: `[WHOLE-DEPT COMMAND BROADCAST] ${text}`,
                                              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' • Group Broadcast'
                                            };
                                            setInteractions(prev => [newBroadcast, ...prev]);
                                          });

                                          setConnectMessage(prev => ({ ...prev, [dept]: '' }));
                                          alert(`Strategic department broadcast has been safely dispatched to all ${deptEmps.length} workers in ${dept}!`);
                                        }}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3.5 rounded-lg uppercase tracking-wider text-[9.5px] font-mono"
                                      >
                                        Transmit Broadcast
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 4: Organizational WRI indicators & Config setting controllers */}
                  {leadershipSubView === 'Organization' && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* Succession planning matrix pipelines */}
                      <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-850 pb-3">
                          <h3 className="text-sm font-semibold text-white tracking-tight font-display">
                            {t.successionPipelineTitle}
                          </h3>
                          <span className="text-[10px] bg-red-955/25 border border-red-900/30 text-red-400 px-2 py-0.5 rounded font-mono font-bold">
                            RETIREMENT PROTECTORS ACTIVE
                          </span>
                        </div>

                        <div className="space-y-3.5 font-sans">
                          {successionPlans.map(plan => (
                            <div key={plan.id} className="bg-[#10121a]/70 border border-[#1e293b] p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                              <div className="space-y-1">
                                <span className="text-[8px] uppercase tracking-widest bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-blue-400 font-mono">
                                  {plan.department}
                                </span>
                                <h4 className="text-xs font-bold text-white uppercase mt-1">{plan.roleName}</h4>
                                <p className="text-[10px] text-slate-500 font-mono">Designated Successor: <b>{plan.successorName}</b></p>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span className="text-[10px] uppercase font-mono tracking-wider block text-blue-400 font-bold">
                                    {plan.readyTimeline}
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-mono font-medium">Fitness Index: {plan.fitnessScore}%</span>
                                </div>
                                <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Active Gaps severe alerts registry */}
                      <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4 pb-3 border-b border-slate-850/80 font-display">
                          {t.gapsSeverity}
                        </h3>

                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 font-sans">
                          {activeGaps.slice(0, 6).map((gap, gIdx) => {
                            const emp = allEmployees.find(e => e.id === gap.userId);
                            const comp = competencies.find(c => c.id === gap.competencyId);
                            if (!emp || !comp) return null;
                            
                            return (
                              <div key={gIdx} className="bg-slate-900/40 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center text-xs">
                                <div>
                                  <h4 className="font-bold text-white uppercase">{emp.name}</h4>
                                  <p className="text-[10px] text-slate-500 capitalize font-mono">Gap: {comp.name} (L{gap.currentLevel} vs Needed L{gap.requiredLevel})</p>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                  gap.severity === 'Critical' 
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' 
                                    : 'bg-orange-500/5 text-orange-400 border border-orange-500/15'
                                }`}>
                                  {gap.severity}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dynamic Competency framework configurator form */}
                      <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 relative">
                        <h3 className="text-sm font-semibold text-white mb-4 pb-3 border-b border-slate-850/80 font-display">
                          {t.configTitle}
                        </h3>

                        <form onSubmit={handleAddCompetency} className="space-y-3.5 font-sans">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono">Category Group</label>
                              <select
                                value={competencyCategoryInput}
                                onChange={e => setCompetencyCategoryInput(e.target.value as any)}
                                className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-600"
                              >
                                <option value="Functional">Functional (कार्यात्मक)</option>
                                <option value="Technical">Technical (तकनीकी)</option>
                                <option value="Digital">Digital (डिजिटल)</option>
                                <option value="Behavioral">Behavioral (व्यवहारिक)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono">Goal Requirement Name</label>
                              <input
                                type="text"
                                value={competencyNameInput}
                                onChange={e => setCompetencyNameInput(e.target.value)}
                                placeholder="e.g. Vacuum Purging Mastery"
                                className="w-full bg-[#10121a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono">Technical Criteria Description</label>
                            <input
                              type="text"
                              value={competencyDescInput}
                              onChange={e => setCompetencyDescInput(e.target.value)}
                              placeholder="Describe exact operational and safety protocols for calibration..."
                              className="w-full bg-[#10121a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-600"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-5 rounded-xl uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 font-mono"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{t.addCompBtn}</span>
                          </button>
                        </form>
                      </div>

                    </div>
                  )}

                  {/* SUB-VIEW 5: Retirement Repository & Expert Knowledge Assessment */}
                  {leadershipSubView === 'Retirement' && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* Strategic overview header */}
                      <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-3 font-sans">
                          <div>
                            <h3 className="text-sm font-semibold text-white font-display">Workforce Retirement Preservation Center</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wider font-mono">retirement repository & knowledge extraction center</p>
                          </div>
                          <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded font-mono font-bold animate-pulse">
                            SHIELD INDEX ACTIVE
                          </span>
                        </div>
                        
                        <p className="text-[11.5px] text-slate-400 leading-normal font-sans">
                          Identify senior engineers approaching retirement within the next 12 months. Conduct structured AI scenario assessments to capture, map, and output their tacit operational wisdom into standard approved SOP assets before handover.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono">
                          <div className="bg-[#10121a]/60 border border-slate-850 p-3.5 rounded-2xl">
                            <span className="text-[9.5px] text-slate-500 uppercase block tracking-wide font-sans">Upcoming 12M Retirees</span>
                            <span className="text-xl font-bold text-slate-200">
                              {allEmployees.filter(e => e.isRetiringNext12Months).length} Experts
                            </span>
                          </div>
                          <div className="bg-[#10121a]/60 border border-slate-850 p-3.5 rounded-2xl">
                            <span className="text-[9.5px] text-slate-500 uppercase block tracking-wide font-sans">Secured Legacy SOPs</span>
                            <span className="text-xl font-bold text-emerald-400">
                              {knowledgeAssets.length} Documents
                            </span>
                          </div>
                          <div className="bg-[#10121a]/60 border border-slate-855 p-3.5 rounded-2xl">
                            <span className="text-[9.5px] text-slate-500 uppercase block tracking-wide font-sans">Average Experience Pool</span>
                            <span className="text-xl font-bold text-blue-400">
                              30.5 Years
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* List of Senior Retirees */}
                      <div className="bg-[#0e1015] border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2 font-display">Veterans Needing Active Assessment & SOP Synthesis:</h4>
                        
                        <div className="grid grid-cols-1 gap-4 font-sans">
                          {allEmployees.filter(e => e.isRetiringNext12Months || (e.experienceYears && e.experienceYears >= 20)).map(emp => {
                            const isSelected = selectedRetiree?.id === emp.id;
                            return (
                              <div key={emp.id} className="bg-[#10121a]/80 p-5 rounded-2xl border border-slate-850 space-y-4 hover:border-slate-800 transition-all">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-xs font-bold uppercase text-white font-sans">{emp.name}</h5>
                                      <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono font-bold">
                                        Retirement Impending
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{emp.designation} • experience: <b className="text-blue-400 font-mono">{emp.experienceYears} Years</b></p>
                                    <p className="text-[10px] text-slate-500">{emp.department} • Education: {emp.education}</p>
                                    <p className="text-[10px] text-slate-500 font-sans">Structured contributions secured: <b className="text-emerald-400 font-mono">{emp.contributionsCount} assets</b></p>
                                  </div>

                                  <button
                                    onClick={() => {
                                      setSelectedRetiree(emp);
                                      setRetirementStep('idle');
                                      setRetirementPromptIdx(0);
                                      setRetirementSynthesizedSop(null);
                                    }}
                                    className={`text-[10px] uppercase font-bold tracking-wider py-1.5 px-4 rounded-xl transition-all font-mono ${
                                      isSelected 
                                        ? 'bg-amber-600 border border-amber-500 hover:bg-amber-550 text-white shadow-md' 
                                        : 'bg-[#10121a] hover:bg-slate-900 text-amber-400 border border-amber-500/30'
                                    }`}
                                  >
                                    {isSelected ? 'Assessment Selected ✓' : 'Conduct Knowledge Assessment 🩺'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ACTIVE KNOWLEDGE ASSESSMENT & INTERVIEW CONSOLE */}
                      {selectedRetiree && (
                        <div className="bg-[#0e1015] border border-amber-500/20 rounded-3xl p-6 space-y-5 animate-fade-in relative overflow-hidden font-sans">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full"></div>
                          
                          <div className="flex justify-between items-center border-b border-slate-850 pb-3 font-sans">
                            <div className="flex items-center gap-2 font-sans">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                              <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-display">AI Wisdom Extraction Task: {selectedRetiree.name}</h4>
                            </div>
                            <button 
                              onClick={() => setSelectedRetiree(null)}
                              className="text-slate-500 hover:text-slate-350 text-xs font-mono font-bold"
                            >
                              Dismiss x
                            </button>
                          </div>

                          {/* STEP 1: IDLE CONFIGURATION */}
                          {retirementStep === 'idle' && (
                            <div className="space-y-4">
                              <p className="text-[11.5px] text-slate-400 font-sans">
                                Configure the AI simulation focus. Based on the veteran's metallurgy and machinery certifications, choose the silent SOP task to target for automated structured extraction:
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                                <div>
                                  <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-2 font-mono">Operational Focus Area</label>
                                  <select
                                    value={retirementFocus}
                                    onChange={e => setRetirementFocus(e.target.value)}
                                    className="w-full bg-[#10121a] border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-600"
                                  >
                                    <option value="SOP-BF-302: Emergency Blast Furnace Purging & Valve isolation sequence">1. Emergency Blast Furnace Gas Purging Sequences</option>
                                    <option value="SOP-QC-205: Cooling Loop Thermal Stress Calibration sequences">2. QC Cooling Loop Thermal Stress Calibration</option>
                                    <option value="SOP-REL-882: Heavy Centrifugal Blowers Acoustic Fault vibration sequences">3. Blowers Acoustic Diagnostics & Vibration Faults</option>
                                    <option value="SOP-SF-104: Sinter Feed Grate High-Pressure LOTO isolating procedures">4. Sinter Feed Grate Pneumatics & Isolation</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-2 font-mono">Method of Extraction</label>
                                  <div className="bg-[#10121a] border border-slate-855 rounded-xl px-3.5 py-2 text-xs text-slate-305 flex items-center gap-2 font-mono">
                                    <span className="text-[#a16207]">💡 AI-Iterative Interactive Scenario</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setRetirementStep('interview');
                                  setRetirementPromptIdx(0);
                                  setRetirementSynthesizedSop(null);
                                }}
                                className="bg-[#92400e] hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-xl uppercase tracking-wider text-xs transition-colors flex items-center gap-2 font-mono"
                              >
                                <span>Initiate Deep Assessment Interview</span>
                              </button>
                            </div>
                          )}

                          {/* STEP 2: INTERVIEW SIMULATION */}
                          {retirementStep === 'interview' && (
                            <div className="space-y-4 animate-fade-in font-mono text-[11px]">
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 overflow-y-auto max-h-[300px] space-y-4 leading-relaxed">
                                <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded-xl font-sans text-xs">
                                  <span className="text-[10px] text-blue-400 block font-bold font-mono">🤖 LEADERSHIP COGNITIVE AI HARVESTER</span>
                                  <p className="text-slate-300 mt-1">
                                    Active context loaded for {selectedRetiree.name}. Chosen focus: "{retirementFocus}".
                                    Starting interactive technical assessment sequence of 4 critical metallurgical questions to map silent knowledge...
                                  </p>
                                </div>

                                {/* Simulated Q&A dialogue based on idx */}
                                {retirementPromptIdx >= 0 && (
                                  <div className="space-y-3 pt-2 font-sans text-xs">
                                    <div>
                                      <p className="text-[#e2e8f0] font-bold">Q1: What are the absolute first mechanical indications that safety locks are failing on the auxiliary line seal valves?</p>
                                      <p className="text-amber-305 italic pl-3 border-l-2 border-amber-600/65 mt-1 leading-relaxed">
                                        "{selectedRetiree.name}: auxiliary pressure drops immediately below 1.4 bar before the dial registers. You must hear the high-pitched whistling on seal 04—that is the main acoustic indicator."
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {retirementPromptIdx >= 1 && (
                                  <div className="space-y-3 pt-2 border-t border-slate-850/60 font-sans text-xs">
                                    <div>
                                      <p className="text-[#e2e8f0] font-bold">Q2: When doing cold isolations, what is the exact pneumatic depressurization step sequence needed to bypass standard relay regulators?</p>
                                      <p className="text-amber-305 italic pl-3 border-l-2 border-amber-600/65 mt-1 leading-relaxed">
                                        "{selectedRetiree.name}: You manually pull physical latch 2C. Doing this overrides the computerized control solenoid and bleeds pressure directly down header 02 in 15 seconds."
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {retirementPromptIdx >= 2 && (
                                  <div className="space-y-3 pt-2 border-t border-slate-850/60 font-sans text-xs">
                                    <div>
                                      <p className="text-[#e2e8f0] font-bold">Q3: How do we prevent severe acoustic back-drafts if auxiliary blowback occurs on vacuum blower lines?</p>
                                      <p className="text-amber-305 italic pl-3 border-l-2 border-amber-600/65 mt-1 leading-relaxed">
                                        "{selectedRetiree.name}: Always double-check block valve 1B has standard heat-treated neoprene seals. If the seals are synthetic rubber, high heat during backdraft melts them in 4 seconds flat, fusing the primary piston."
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {retirementPromptIdx >= 3 && (
                                  <div className="space-y-3 pt-2 border-t border-slate-850/60 font-sans text-xs">
                                    <div>
                                      <p className="text-emerald-400 font-bold font-mono uppercase text-[10px]">✓ ASSESSMENT DATA PACKS RECOVERED</p>
                                      <p className="text-slate-400 leading-relaxed mt-1">
                                        Completed technical interview. We have successfully recorded {selectedRetiree.name}'s deep lesson configurations. Ready to process into an approved corporate Standard Operating Procedure document.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-850 font-mono">
                                <span className="text-[10px] text-slate-500 font-sans">Interview Completion Phase: {retirementPromptIdx + 1} / 4</span>
                                {retirementPromptIdx < 3 ? (
                                  <button
                                    onClick={() => setRetirementPromptIdx(prev => prev + 1)}
                                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3.5 rounded-lg uppercase text-[10px]"
                                  >
                                    Decompress Next Response ➔
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setRetirementStep('synthesizing');
                                      setTimeout(() => {
                                        setRetirementStep('completed');
                                        setRetirementSynthesizedSop({
                                          id: `KNOW-${Date.now()}`,
                                          title: `SOP-${selectedRetiree.employeeId.replace('STEEL-', '').replace('SF-', '')}: Emergency ${retirementFocus.split(':')[1]?.trim() || 'Valve Maintenance Sequence'}`,
                                          category: 'Operational Guides',
                                          lastUpdated: 'Live • Compiled Just Now',
                                          isVerified: true,
                                          downloadsCount: 0,
                                          author: selectedRetiree.name,
                                          sourceUnit: selectedRetiree.unit || "Primary Site",
                                          contentHtml: `### HIGH FIDELITY COMPILED SOP\n\n**REFERENCE DESIGNATION: SOP-${selectedRetiree.employeeId.replace('STEEL-', '').replace('SF-', '')}**\n**TITLE: Silent Knowledge Legacy Document for ${retirementFocus.replace('SOP-', '')}**\n**COMPILED AUTHOR: ${selectedRetiree.name} (${selectedRetiree.experienceYears} Yrs Experience)**\n\n---\n\n#### 1. PRIMARY SYSTEM RISK INDICATIONS\n- auxiliary pressure drops immediately below 1.4 bar before dialing. Take high whistling on auxiliary seal 04 as critical threshold.\n- Check auxiliary gas valves and manual isolators within 45 seconds of first pressure warning.\n\n#### 2. COLD ISOLATION & DEPRESSURIZATION PROTOCOL\n- Manually pull line physical latch 2C. \n- Doing this bypasses computer control solenoid bypasses. Refrain from waiting for automated panel relays, bleed down header 02 sequence directly.\n\n#### 3. PREVENTATIVE ACCOUSTIC BACK-DRAFT MEASURES\n- Always secure block valve 1B using standard thick heat-treated neoprene seals. \n- DO NOT deploy synthetic rubber seals. High temperature during backdraft melts rubber in 4 seconds, causing disastrous piston fusion.`
                                        });
                                      }, 2200);
                                    }}
                                    className="bg-[#92400e] hover:bg-amber-600 text-white font-bold py-1.5 px-4 rounded-lg uppercase text-[10px] animate-pulse"
                                  >
                                    Synthesize SOP Document
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* STEP 3: SYNTHESIZING STATE PROGRESS LOADING */}
                          {retirementStep === 'synthesizing' && (
                            <div className="space-y-4 py-8 text-center animate-fade-in font-mono text-[11px]">
                              <div className="w-10 h-10 border-[#92400e]/30 border-t-amber-500 border-4 rounded-full animate-spin mx-auto mb-4" />
                              <h5 className="text-white font-bold uppercase tracking-wide">Executing Cognitive SOP Compiler Services...</h5>
                              <div className="max-w-xs mx-auto space-y-1.5 text-left text-slate-500 font-mono text-[10px]">
                                <p className="text-emerald-450 font-bold">❖ Decompressing spoken responses: DONE</p>
                                <p className="text-emerald-450 font-bold">❖ Translating physical calibration ratios: DONE</p>
                                <p className="text-amber-500 animate-pulse font-bold font-mono">❖ Structuring mechanical checklists into ISO layout...</p>
                                <p className="text-slate-650 font-bold font-mono">❖ Saving audit hash codes to legacy repository...</p>
                              </div>
                            </div>
                          )}

                          {/* STEP 4: SYNTHESIS COMPLETED SUCCESS */}
                          {retirementStep === 'completed' && retirementSynthesizedSop && (
                            <div className="space-y-4 animate-fade-in text-xs">
                              <div className="bg-emerald-950/25 border border-emerald-500/20 p-4 rounded-2xl">
                                <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">✓ Technical Wisdom Compiled Successfully</span>
                                <p className="text-slate-300 leading-normal font-sans">
                                  Expert knowledge captured from {selectedRetiree.name} has been processed. A highly structured SOP document has been synthesized complete with core diagrams, danger zones, warning acoustics, and mechanical checklists.
                                </p>
                              </div>

                              <div className="bg-slate-950/95 border border-slate-850 rounded-2xl p-5 font-mono text-[10.5px] max-h-[250px] overflow-y-auto space-y-3 leading-relaxed">
                                <h5 className="font-bold text-emerald-400 border-b border-slate-850 pb-2 uppercase tracking-wide text-[9.5px]">
                                  {retirementSynthesizedSop.title}
                                </h5>
                                <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                                  {retirementSynthesizedSop.contentHtml}
                                </div>
                              </div>

                              <div className="flex gap-2 justify-end font-mono text-[10px]">
                                <button
                                  onClick={() => {
                                    setRetirementStep('idle');
                                    setRetirementSynthesizedSop(null);
                                  }}
                                  className="border border-slate-800 text-[#cbd5e1] font-bold py-1.5 px-4 rounded-xl uppercase hover:bg-slate-900"
                                >
                                  Re-assess
                                </button>
                                <button
                                  onClick={() => {
                                    // add newly compiled SOP to assets
                                    setKnowledgeAssets(prev => [retirementSynthesizedSop, ...prev]);
                                    
                                    // update employee profile contributions
                                    setAllEmployees(prev => prev.map(emp => {
                                      if (emp.id === selectedRetiree.id) {
                                        return { ...emp, contributionsCount: emp.contributionsCount + 1 };
                                      }
                                      return emp;
                                    }));

                                    alert(`Approval Complete! New SOP asset has been saved to the SOP Preservation Hub.`);
                                    
                                    // terminate flow
                                    setSelectedRetiree(null);
                                    setRetirementStep('idle');
                                    setRetirementSynthesizedSop(null);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-5 rounded-xl uppercase shadow-md"
                                >
                                  Approve & Append to SOP Preservation Hub
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* Veteran Legacy Portal Integration inside Leadership Retirement center */}
                      <div className="pt-6 border-t border-slate-900">
                        <h4 className="text-xs font-mono font-bold uppercase text-amber-500 tracking-wider mb-4 flex items-center gap-1.5 animate-pulse">
                          <span>🌟 INTERACTIVE PUBLIC RETIREE WALL OF HONOR</span>
                        </h4>
                        <VeteranLegacyHub
                          employees={allEmployees}
                          currentUser={currentUser}
                          lang={lang}
                        />
                      </div>

                    </div>
                  )}

                </div>
              )}



            </div>

          </div>
        )}
      </main>

      {/* --------------------------------------------------------------------------------------------------
          COMMAND CENTER LOWER INDUSTRIAL DEBRIEF METRICS FOOTEER
          -------------------------------------------------------------------------------------------------- */}
      <footer className="h-14 bg-[#0c0d12] border-t border-slate-800 flex items-center px-6 text-[10px] gap-8 mt-auto flex-wrap justify-between pr-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-tighter">Total Employees Managed:</span>
            <span className="text-white font-mono font-bold">4,821</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-tighter">Documentation coverage:</span>
            <span className="text-white font-mono font-bold">{knowledgeAssets.length} Structured Assets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 uppercase tracking-tighter">Plant WRI:</span>
            <span className="text-emerald-400 font-mono font-bold">{orgWRI.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-mono uppercase">
          <span>AI Engine: gemini-2.5-flash</span>
          <span>Workspace Environment: {currentUser ? currentUser.unit : "Primary Site"} • v4.2.1</span>
        </div>
      </footer>

    </div>
  );
}
