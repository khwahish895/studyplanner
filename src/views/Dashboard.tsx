import React from 'react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO } from 'date-fns';
import { CheckCircle2, Circle, Clock, Flame, Calendar, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { DailySchedule, StudyTask, UserProfile, AIInsight } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  schedule: DailySchedule[];
  user: UserProfile;
  insights: AIInsight[];
  onToggleTask: (taskId: string, date: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function Dashboard({ 
  schedule, 
  user, 
  insights, 
  onToggleTask, 
  selectedDate, 
  setSelectedDate 
}: DashboardProps) {
  
  const currentSchedule = schedule.find(s => isSameDay(parseISO(s.date), selectedDate));
  
  const totalTasks = currentSchedule?.tasks.length || 0;
  const completedTasks = currentSchedule?.tasks.filter(t => t.status === 'completed').length || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const dates = schedule.map(s => parseISO(s.date));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 animate-in fade-in duration-500">
      {/* Left Column: Schedule */}
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, Alex</h1>
            <p className="text-gray-500 font-medium mt-1">
              You have {totalTasks} tasks scheduled for {format(selectedDate, 'eeee')}.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="stat-pill-theme"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Focus Mode</div>
            <div className="stat-pill-theme">{Math.round(completionRate)}% Daily Goal</div>
          </div>
        </header>

        {/* Date Picker (Horizontal) */}
        <div className="flex gap-2 p-1 bg-white border border-border-subtle rounded-2xl">
          {dates.map((date, idx) => {
            const active = isSameDay(date, selectedDate);
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex-1 flex flex-col items-center py-2 px-3 rounded-xl transition-all",
                  active ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-widest">{format(date, 'eee')}</span>
                <span className="text-lg font-extrabold">{format(date, 'd')}</span>
              </button>
            );
          })}
        </div>

        <div className="geometric-card min-h-[400px]">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6">Today's Adaptive Schedule</p>
          
          <div className="space-y-3">
            {!currentSchedule?.tasks.length && (
              <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No tasks found for this date.</p>
              </div>
            )}
            
            {currentSchedule?.tasks.map((task, idx) => {
              const isActive = task.status === 'pending' && idx === currentSchedule.tasks.findIndex(t => t.status === 'pending');
              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id, currentSchedule.date)}
                  className={cn(
                    "task-card-theme min-h-[80px] cursor-pointer group",
                    isActive && "active"
                  )}
                >
                  <div className="task-time font-mono text-gray-400 font-bold text-xs uppercase">
                    {format(parseISO(task.startTime), 'hh:mm aa')}
                  </div>
                  
                  <div className="task-info">
                    <h4 className={cn(
                      "font-bold text-gray-900",
                      task.status === 'completed' && "text-gray-300 line-through"
                    )}>{task.title}</h4>
                    <p className="text-xs text-gray-400 font-medium">
                      {task.category === 'revision' ? 'Spaced Repetition: ' : ''}{task.description || `${task.durationMinutes} minute session`}
                    </p>
                  </div>

                  <div className="task-status justify-self-end">
                    <div className={cn(
                      "w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center",
                      task.status === 'completed' 
                        ? "bg-primary border-primary text-white" 
                        : "border-gray-200 group-hover:border-indigo-300"
                    )}>
                      {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Widgets */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" /> AI Suggestion
            </h3>
            <p className="text-sm font-medium leading-relaxed opacity-95">
              "{insights[0]?.message || "Analyzing your study patterns to optimize your flow..."}"
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>

        <div className="geometric-card text-center">
          <div className="text-4xl font-extrabold text-gray-900 leading-none">12</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Day Streak</div>
          
          <div className="grid grid-cols-7 gap-1 mt-6">
            {Array.from({ length: 21 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "aspect-square rounded-[3px]",
                  i < 13 ? "bg-primary" : i < 16 ? "bg-primary/20" : "bg-gray-100"
                )} 
              />
            ))}
          </div>
        </div>

        <div className="geometric-card">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Syllabus Mastery</p>
          <div className="space-y-4">
            {user.subjects.slice(0, 3).map((sub, i) => (
              <div key={sub.id} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-extrabold text-gray-700">
                  <span className="truncate max-w-[120px]">{sub.name}</span>
                  <span>{i === 0 ? '82%' : i === 1 ? '45%' : '60%'}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: i === 0 ? '82%' : i === 1 ? '45%' : '60%' }}
                    className="h-full bg-secondary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
