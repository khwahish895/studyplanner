import { UserProfile, DailySchedule, AIInsight } from "../types";

const STORAGE_KEYS = {
  USER_PROFILE: 'studyflow_user_profile',
  SCHEDULE: 'studyflow_daily_schedule',
  INSIGHTS: 'studyflow_ai_insights'
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const loadProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveSchedule = (schedule: DailySchedule[]) => {
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
};

export const loadSchedule = (): DailySchedule[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
  return data ? JSON.parse(data) : [];
};

export const saveInsights = (insights: AIInsight[]) => {
  localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));
};

export const loadInsights = (): AIInsight[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
  return data ? JSON.parse(data) : [];
};

export const clearAll = () => {
  localStorage.clear();
};
