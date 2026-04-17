import { useState, useEffect, ReactNode } from 'react';
import { UserProfile, DailySchedule, AIInsight } from './types';
import { loadProfile, saveProfile, loadSchedule, saveSchedule, loadInsights, saveInsights } from './lib/storage';
import { generatePlanAction, getAIInsightsAction } from './lib/gemini';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';
import Progress from './views/Progress';
import { LayoutDashboard, ChartBar, Sparkles, LogOut, Loader2, Calendar, Target } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { differenceInDays, parseISO } from 'date-fns';

type View = 'dashboard' | 'progress' | 'insights';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [schedule, setSchedule] = useState<DailySchedule[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load existing data
  useEffect(() => {
    const p = loadProfile();
    if (p) {
      setProfile(p);
      setSchedule(loadSchedule());
      setInsights(loadInsights());
    }
  }, []);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    setLoading(true);
    setProfile(newProfile);
    saveProfile(newProfile);

    try {
      const newPlan = await generatePlanAction(newProfile);
      setSchedule(newPlan);
      saveSchedule(newPlan);
      
      const newInsights = await getAIInsightsAction(newProfile, newPlan);
      setInsights(newInsights);
      saveInsights(newInsights);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: string, date: string) => {
    const newSchedule = schedule.map(day => {
      if (day.date === date) {
        return {
          ...day,
          tasks: day.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, status: task.status === 'completed' ? 'pending' : 'completed' as any };
            }
            return task;
          })
        };
      }
      return day;
    });
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
  };

  const handleReset = () => {
    if (window.confirm("This will clear all your progress and plan. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI is crafting your plan...</h2>
        <p className="text-gray-500 mt-2 font-medium">Balancing subjects for geometric perfection.</p>
      </div>
    );
  }

  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const daysLeft = profile.examDate ? differenceInDays(parseISO(profile.examDate), new Date()) : 0;

  return (
    <div className="sidebar-layout bg-bg-base font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Navigation */}
      <aside className="sidebar-nav flex flex-col gap-10">
        <div className="flex items-center gap-3 text-primary font-extrabold text-xl tracking-tighter">
          <Sparkles className="w-6 h-6" />
          StudyFlow AI
        </div>

        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            <NavItem 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')}
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
            />
            <NavItem 
              active={currentView === 'insights'} 
              onClick={() => setCurrentView('insights')}
              icon={<Sparkles className="w-5 h-5" />}
              label="AI Insights"
            />
            <NavItem 
              active={currentView === 'progress'} 
              onClick={() => setCurrentView('progress')}
              icon={<ChartBar className="w-5 h-5" />}
              label="Syllabus Stats"
            />
          </ul>
        </nav>

        {/* Exam Countdown Widget */}
        <div className="bg-bg-base p-4 rounded-xl border border-border-subtle mt-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Exam Countdown</p>
          <p className={cn("text-lg font-extrabold leading-none mb-1", daysLeft <= 7 ? "text-rose-500" : "text-gray-900")}>
            {daysLeft > 0 ? `${daysLeft} Days Left` : "Goal Achieved!"}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold truncate leading-none">
            <Target className="w-3 h-3 text-gray-400" />
            Next Goal: Placement SDE
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Dashboard 
                schedule={schedule} 
                user={profile} 
                insights={insights}
                onToggleTask={toggleTask}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </motion.div>
          )}

          {currentView === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Progress user={profile} schedule={schedule} />
            </motion.div>
          )}

          {currentView === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="mb-4">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">AI Suggestions</h1>
                <p className="text-gray-500">Personalized logic for your study journey.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {insights.map((insight) => (
                  <div 
                    key={insight.id}
                    className={cn(
                      "geometric-card border-t-4",
                      insight.type === 'tip' ? "border-t-primary" : 
                      insight.type === 'warning' ? "border-t-rose-500" : "border-t-emerald-500"
                    )}
                  >
                    <div className="space-y-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        insight.type === 'tip' ? "bg-indigo-50 text-indigo-600" : 
                        insight.type === 'warning' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {insight.type === 'tip' && <Sparkles className="w-5 h-5" />}
                        {insight.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                        {insight.type === 'encouragement' && <TrendingUp className="w-5 h-5" />}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 leading-relaxed">{insight.message}</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                        Observed {new Date(insight.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {insights.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-400 font-medium">Complete more blocks to unlock AI suggestions!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left",
          active 
            ? "bg-[#EEF2FF] text-primary font-bold shadow-sm" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <span className={cn(active ? "text-primary" : "text-gray-400")}>{icon}</span>
        {label}
      </button>
    </li>
  );
}

import { AlertCircle, TrendingUp } from 'lucide-react';
