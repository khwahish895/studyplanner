import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DailySchedule, AIInsight, Subject } from "../types";
import { format, addDays } from "date-fns";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generatePlanAction = async (user: UserProfile): Promise<DailySchedule[]> => {
  const prompt = `Subjects: ${user.subjects.map(s => `${s.name} (${s.level})`).join(", ")}
  Exam Date: ${user.examDate}
  Daily Available Hours: ${user.availableHours}
  Preferred Study Time: ${user.preferredTime}
  Today's Date: ${format(new Date(), 'yyyy-MM-dd')}

  Generate a realistic, balanced study plan for the next 7 days in JSON format.
  Rules:
  1. Weak subjects MUST get more time slots (approx 40% of time).
  2. Include 1 revision slot per 2-3 study blocks.
  3. Include 5-15 minute short breaks after 1 hour blocks.
  4. Respect preferred study time (allocate main blocks then).
  5. Each task should have a unique ID, subject name as title, start time (ISO string), and duration.
  6. Return an array of daily schedules.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "YYYY-MM-DD" },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  subjectId: { type: Type.STRING },
                  title: { type: Type.STRING },
                  startTime: { type: Type.STRING, description: "ISO string (assuming current date as base)" },
                  durationMinutes: { type: Type.NUMBER },
                  category: { type: Type.STRING, enum: ["study", "revision", "break"] },
                  status: { type: Type.STRING, enum: ["pending"] },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "startTime", "durationMinutes", "category", "status"]
              }
            }
          },
          required: ["date", "tasks"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text.trim());
    return data as DailySchedule[];
  } catch (e) {
    console.error("Failed to parse AI plan", e);
    return [];
  }
};

export const getAIInsightsAction = async (
  profile: UserProfile, 
  schedules: DailySchedule[]
): Promise<AIInsight[]> => {
  const completionStats = schedules.flatMap(s => s.tasks).reduce((acc, task) => {
    if (task.status === 'completed') acc.completed++;
    acc.total++;
    return acc;
  }, { completed: 0, total: 0 });

  const prompt = `Status: ${completionStats.completed}/${completionStats.total} tasks completed.
  Subjects: ${profile.subjects.map(s => s.name).join(", ")}
  Deadline: ${profile.examDate}
  Based on the current progress, give 3 actionable, smart AI insights or tips to help the student.
  Focus on: consistency, weak subject performance, or exam readiness.
  Return JSON array of { message: string, type: 'tip' | 'warning' | 'encouragement' }.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["tip", "warning", "encouragement"] }
          },
          required: ["message", "type"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text.trim());
    return data.map((d: any, idx: number) => ({
      ...d,
      id: `insight-${idx}`,
      timestamp: new Date().toISOString()
    })) as AIInsight[];
  } catch (e) {
    return [];
  }
};
