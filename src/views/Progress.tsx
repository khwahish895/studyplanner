import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { UserProfile, DailySchedule } from '../types';
import { motion } from 'motion/react';
import { Brain, Star, Clock, Trophy } from 'lucide-react';

interface ProgressProps {
  user: UserProfile;
  schedule: DailySchedule[];
}

export default function Progress({ user, schedule }: ProgressProps) {
  const allTasks = schedule.flatMap(s => s.tasks);
  
  const subjectData = user.subjects.map(subject => {
    const tasks = allTasks.filter(t => t.title.toLowerCase().includes(subject.name.toLowerCase()));
    const completed = tasks.filter(t => t.status === 'completed').length;
    return {
      name: subject.name,
      total: tasks.length || 1,
      completed,
      score: tasks.length > 0 ? (completed / tasks.length) * 100 : 0
    };
  });

  const categoryData = [
    { name: 'Study', value: allTasks.filter(t => t.category === 'study').length },
    { name: 'Revision', value: allTasks.filter(t => t.category === 'revision').length },
    { name: 'Breaks', value: allTasks.filter(t => t.category === 'break').length },
  ];

  const totalCompleted = allTasks.filter(t => t.status === 'completed').length;
  const totalHours = Math.round(allTasks.reduce((acc, t) => acc + (t.status === 'completed' ? t.durationMinutes : 0), 0) / 60);

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Performance</h1>
          <p className="text-gray-500 font-medium">Tracking your adaptive growth and syllabus mastery.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-primary px-5 py-2.5 rounded-2xl border border-indigo-100">
          <Trophy className="w-5 h-5" />
          <span className="font-extrabold tracking-tight">Mastery Level 4</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subject Performance */}
        <div className="geometric-card">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Subject Mastery Matrix
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={20}>
                  {subjectData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score > 70 ? '#6366f1' : entry.score > 40 ? '#3b82f6' : '#94a3b8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown */}
        <div className="geometric-card flex flex-col items-center">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 w-full flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Time Distribution Pattern
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className={`w-2.5 h-2.5 rounded-sm ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-accent'}`} />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="geometric-card border-l-4 border-l-primary bg-indigo-50/30">
          <div className="text-primary font-black text-3xl mb-1">{totalCompleted}</div>
          <div className="text-[10px] text-primary/70 font-bold uppercase tracking-widest">Blocks Completed</div>
        </div>
        <div className="geometric-card border-l-4 border-l-secondary bg-blue-50/30">
          <div className="text-secondary font-black text-3xl mb-1">{totalHours}h</div>
          <div className="text-[10px] text-secondary/70 font-bold uppercase tracking-widest">Focused Hours</div>
        </div>
        <div className="geometric-card border-l-4 border-l-slate-400">
          <div className="text-slate-600 font-black text-3xl mb-1">{user.subjects.length}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Subjects</div>
        </div>
        <div className="geometric-card border-l-4 border-l-emerald-500 bg-emerald-50/30">
          <div className="text-emerald-600 font-black text-3xl mb-1">94%</div>
          <div className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest">Consistency Score</div>
        </div>
      </div>
    </div>
  );
}
