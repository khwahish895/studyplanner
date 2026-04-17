import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Subject, SubjectLevel, PreferredTime } from '../types';
import { Plus, X, ArrowRight, Brain, Clock, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [currentLevel, setCurrentLevel] = useState<SubjectLevel>('medium');
  
  const [examDate, setExamDate] = useState('');
  const [availableHours, setAvailableHours] = useState(4);
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('morning');

  const addSubject = () => {
    if (!newSubject.trim()) return;
    const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-emerald-500', 'bg-violet-500'];
    const subject: Subject = {
      id: crypto.randomUUID(),
      name: newSubject.trim(),
      level: currentLevel,
      color: colors[subjects.length % colors.length]
    };
    setSubjects([...subjects, subject]);
    setNewSubject('');
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleFinish = () => {
    onComplete({
      subjects,
      examDate,
      availableHours,
      preferredTime,
      onboarded: true
    });
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl geometric-card !p-0 overflow-hidden"
      >
        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-6">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Academic Profile</h1>
                  <p className="text-gray-500 mt-2 font-medium">Add your active subjects to begin analysis.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-white border border-border-subtle rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-300 font-medium"
                      placeholder="e.g. Distributed Systems"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                    />
                    <select 
                      className="bg-gray-50 border border-border-subtle rounded-xl px-4 py-3.5 outline-none font-bold text-sm text-gray-600 focus:border-primary transition-colors"
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value as SubjectLevel)}
                    >
                      <option value="weak">Novice</option>
                      <option value="medium">Intermediate</option>
                      <option value="strong">Expert</option>
                    </select>
                    <button 
                      onClick={addSubject}
                      className="bg-primary text-white p-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {subjects.map(s => (
                      <span 
                        key={s.id} 
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-extrabold tracking-tight shadow-sm",
                          s.color
                        )}
                      >
                        {s.name}
                        <button onClick={() => removeSubject(s.id)} className="hover:opacity-75 bg-white/20 rounded-md p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {subjects.length === 0 && (
                      <div className="w-full py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-gray-300 text-sm font-bold uppercase tracking-widest">No subjects added yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  disabled={subjects.length === 0}
                  onClick={() => setStep(2)}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-extrabold tracking-tight flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-30"
                >
                  Continue Configuration <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Temporal Constraints</h1>
                  <p className="text-gray-500 mt-2 font-medium">Fine-tune your availability for the AI engine.</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block ml-1">
                      Target Goal Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full bg-white border border-border-subtle rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-gray-700"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Daily Bandwidth</label>
                      <span className="text-primary font-black text-xl">{availableHours}h</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      className="w-full accent-primary h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
                      value={availableHours}
                      onChange={(e) => setAvailableHours(parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block ml-1">Peak Cognitive Performance</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['morning', 'afternoon', 'evening', 'night'] as PreferredTime[]).map(time => (
                        <button
                          key={time}
                          onClick={() => setPreferredTime(time)}
                          className={cn(
                            "py-4 rounded-xl border text-sm font-extrabold tracking-tight transition-all capitalize shadow-sm",
                            preferredTime === time 
                              ? "bg-indigo-50 border-primary text-primary" 
                              : "bg-white border-border-subtle text-gray-500 hover:bg-gray-50"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 text-gray-600 py-5 rounded-2xl font-extrabold tracking-tight hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!examDate}
                    onClick={handleFinish}
                    className="flex-[2] bg-primary text-white py-5 rounded-2xl font-extrabold tracking-tight flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 shadow-lg shadow-primary/20"
                  >
                    Synthesize Plan <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
