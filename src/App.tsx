import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Brain, Target, User, ChevronLeft, CheckCircle2 } from 'lucide-react';

type Step = 'landing' | 'input' | 'results';

interface ResultData {
  name: string;
  userSkills: string[];
  strongestCategory: string;
  recommendations: string[];
  insight: string;
}

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [name, setName] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultData | null>(null);

  const handleStart = () => setStep('input');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, skillsInput }),
      });
      const data = await response.json();
      setResults(data);
      setStep('results');
    } catch (error) {
      console.error('Error matching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('landing');
    setName('');
    setSkillsInput('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-accent/20">
      <nav className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-8 h-8 bg-brand-text rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-bg" />
          </div>
          <span className="font-semibold text-xl tracking-tight">SkillBridge</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-20 max-w-2xl"
            >
              <h1 className="text-6xl font-medium tracking-tight leading-[1.1] text-brand-text">
                Discover your path through your <span className="italic text-brand-muted">strengths.</span>
              </h1>
              <p className="mt-8 text-xl text-brand-text/70 leading-relaxed">
                SkillBridge analyzes your unique abilities and interests to suggest career domains where you can truly excel. Start your journey today.
              </p>
              <button
                onClick={handleStart}
                className="mt-10 group flex items-center gap-3 bg-brand-text text-brand-bg px-8 py-4 rounded-full font-medium hover:bg-brand-text/90 transition-all active:scale-95 shadow-lg shadow-brand-text/10"
              >
                Start Skill Assessment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-12 max-w-xl"
            >
              <button 
                onClick={() => setStep('landing')}
                className="flex items-center gap-2 text-brand-muted hover:text-brand-text transition-colors mb-8"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              <h2 className="text-3xl font-medium text-brand-text mb-2">Tell us about yourself</h2>
              <p className="text-brand-muted mb-10">We'll use this information to find your ideal matching domains.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-brand-muted flex items-center gap-2">
                    <User className="w-4 h-4" /> Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all placeholder:text-brand-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-brand-muted flex items-center gap-2">
                    <Brain className="w-4 h-4" /> Your Abilities
                  </label>
                  <p className="text-xs text-brand-muted italic mb-2">Enter a few abilities or strengths that describe you (comma-separated).</p>
                  <textarea
                    required
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. problem solving, creativity, teamwork, writing..."
                    rows={4}
                    className="w-full bg-white/50 border border-brand-accent/20 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all placeholder:text-brand-muted/50 resize-none"
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-brand-text text-brand-bg py-4 rounded-2xl font-medium hover:bg-brand-text/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-text/10"
                >
                  {loading ? 'Analyzing...' : 'Generate My Profile'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 space-y-12"
            >
              <div className="border-b border-brand-accent/10 pb-12">
                <span className="text-brand-muted font-medium">Hello, {results.name}</span>
                <h2 className="text-5xl font-medium text-brand-text mt-2">Your Skill Profile</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-6">Strongest Domain</h3>
                    <div className="bg-brand-text text-brand-bg p-8 rounded-[2rem] relative overflow-hidden group shadow-xl shadow-brand-text/20">
                      <Target className="absolute -right-4 -bottom-4 w-32 h-32 text-brand-bg/5 group-hover:scale-110 transition-transform duration-700" />
                      <p className="text-brand-bg/60 text-sm font-medium mb-1">Detected Match</p>
                      <p className="text-4xl font-medium tracking-tight">{results.strongestCategory}</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-6">SkillBridge Insight</h3>
                    <div className="bg-white/40 p-8 rounded-[2rem] border border-brand-accent/10">
                      <p className="text-brand-text/80 leading-relaxed italic">
                        "{results.insight}"
                      </p>
                    </div>
                  </section>
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-6">Recommended Opportunities</h3>
                    <div className="space-y-4">
                      {results.recommendations.map((rec, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={rec} 
                          className="flex items-center gap-4 bg-white/60 border border-brand-accent/5 p-5 rounded-2xl hover:border-brand-accent/30 transition-colors group cursor-default"
                        >
                          <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center group-hover:bg-brand-text transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-brand-accent/40 group-hover:text-brand-bg transition-colors" />
                          </div>
                          <span className="font-medium text-brand-text/90">{rec}</span>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-6">Your Input</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.userSkills.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-white/40 border border-brand-accent/10 rounded-full text-sm text-brand-muted">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <div className="pt-12 flex justify-center">
                <button
                  onClick={reset}
                  className="text-brand-muted hover:text-brand-text font-medium transition-colors flex items-center gap-2"
                >
                  Start a new assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-brand-accent/10 mt-20">
        <p className="text-brand-muted text-sm">© 2024 SkillBridge – Student Skill and Opportunity Matching Platform</p>
      </footer>
    </div>
  );
}
