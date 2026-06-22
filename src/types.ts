/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RegistrationStatus = 'registered' | 'onboarding' | 'active';

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  password?: string;
  language: 'en' | 'hi';
  role: 'Employee' | 'Manager' | 'Leadership';
  registrationStatus: RegistrationStatus;
  
  // Onboarding Info
  companyName?: string;
  unit?: string;
  department?: string;
  designation?: string;
  roleType?: string; // pre-populated roles or "others"
  customRoleType?: string; // manual roll entry
  
  // Professional Info
  experienceYears?: number;
  education?: string;
  certifications?: string[];
  
  // Survey info
  isRetiringNext12Months?: boolean;
  hasTakenBaselineAssessment?: boolean;
  
  // Activity metric counts
  contributionsCount: number;
  engagementScore: number; // calculated engagement (0 - 100)
}

export type CompetencyCategory = 'Functional' | 'Technical' | 'Digital' | 'Behavioral' | 'Leadership' | 'Knowledge';

export interface Competency {
  id: string;
  category: CompetencyCategory;
  name: string;
  description: string;
  levelDescriptions: { [level: number]: string };
  targetLevel: number;
}

export interface RoleCompetencyMapping {
  roleName: string;
  competencyId: string;
  targetLevel: number;
}

export interface SkillPassport {
  userId: string;
  readinessLevel: 'Critical' | 'Developing' | 'Ready' | 'Advanced' | 'Future Ready';
  wriScore: number;
  lastUpdated: string;
}

export interface Question {
  id: string;
  category: 'technical' | 'soft skill' | 'digital literacy' | 'scenario based' | 'leadership';
  competencyId: string; // references Competency's primary key
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  type: 'mcq' | 'scenario' | 'problem' | 'safety' | 'technical';
  level: number; // difficulty level 1-5
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  title: string;
  category: 'Baseline' | 'Re-assessment' | 'Micro-Assessment';
  score: number; // total mark percentage (0-100)
  categoryScores: Record<string, number>;
  timeSpentSec: number;
  completedAt: string;
  answeredQuestions: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}

export interface CompetencyScore {
  userId: string;
  competencyId: string;
  currentLevel: number; // calculated level 1-5
  pointsScore: number; // percentage of points mapped to competency (0-100)
  updatedAt: string;
  history: { date: string; level: number; score: number }[];
}

export interface CompetencyGap {
  userId: string;
  competencyId: string;
  currentLevel: number;
  requiredLevel: number;
  gapPercentage: number; // e.g. 40% gap
  severity: 'Strong' | 'Moderate' | 'Needs Improvement' | 'Critical';
}

export interface LearningResource {
  id: string;
  title: string;
  category: string; // Module: e.g. 'Safety Regulations', 'SOP blast, PLC'
  type: 'SOP Document' | 'Video Tutorial' | 'Manual' | 'Interactive Simulator';
  durationMin: number;
  link: string; // real active documentation links (or embedded paths)
  competencyId: string; // mapped competency
}

export interface LearningPath {
  id: string;
  userId: string;
  competencyId: string;
  resourceId: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  assignedAt: string;
  completedAt?: string;
  preAssessmentScore?: number;
  postAssessmentScore?: number; // shows improvement (effectiveness)
  reAssessmentCompleted: boolean;
}

export interface KnowledgeAsset {
  id: string;
  title: string;
  category: 'SOPs' | 'Lessons Learned' | 'Troubleshooting Guides' | 'Expert Articles';
  summary: string;
  steps: string[];
  bestPractices: string[];
  failureLearnings: string[];
  authorId: string;
  authorName: string;
  rating: number; // 1-5
  ratingsCount: number;
  bookmarksCount: number;
  createdAt: string;
  tags: string[];
}

export interface Mentor {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  expertiseScore: number; // 0-100 based on competencies, contributions, learning
  department: string;
  experienceYrs: number;
  skillsExpert: string[]; // mapped competency names
  activeSlots: number;
  maxSlots: number;
}

export interface MentorRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  mentorId: string;
  mentorName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedCompetencyId: string;
  competencyName: string;
  message: string;
  createdAt: string;
}

export interface KnowledgeInterview {
  id: string;
  expertName: string;
  expertId: string;
  domain: string;
  dialogueScript: string;
  generatedAssetId?: string;
  status: 'Pending AI Analysis' | 'Structured Asset Created';
  date: string;
}

export interface SuccessionPlan {
  id: string;
  roleName: string;
  department: string;
  criticalSuccessorId: string;
  successorName: string;
  readyTimeline: 'Ready Now' | 'Ready in 6 Months' | 'Ready in 12 Months';
  fitnessScore: number; // WRI + Target Competency Match
  status: 'Active' | 'Approved' | 'Draft';
}

export interface WRIHistory {
  userId: string;
  score: number; // total WRI (0-100)
  date: string;
  competencyReadiness: number; // 35%
  assessmentPerformance: number; // 25%
  learningEffectiveness: number; // 20%
  knowledgeContribution: number; // 10%
  engagement: number; // 10%
}

export interface KRIHistory {
  id: string;
  department: string;
  score: number; // (0-100) higher means more risk
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  retirementRisk: number;
  concentrationRisk: number;
  resignationRisk: number;
  documentationCoverage: number;
  successorAvailability: number;
}
