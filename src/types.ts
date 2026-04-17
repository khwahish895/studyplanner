export type SubjectLevel = 'weak' | 'medium' | 'strong';
export type PreferredTime = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Subject {
  id: string;
  name: string;
  level: SubjectLevel;
  color: string;
}

export interface UserProfile {
  subjects: Subject[];
  examDate: string; // ISO string
  availableHours: number;
  preferredTime: PreferredTime;
  onboarded: boolean;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  startTime: string; // ISO string
  durationMinutes: number;
  category: 'study' | 'revision' | 'break';
  status: 'pending' | 'completed' | 'skipped';
  title: string;
  description?: string;
}

export interface DailySchedule {
  date: string; // format YYYY-MM-DD
  tasks: StudyTask[];
}

export interface AIInsight {
  id: string;
  type: 'tip' | 'warning' | 'encouragement';
  message: string;
  timestamp: string;
}
