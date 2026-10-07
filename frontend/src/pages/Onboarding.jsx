import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STAGES = ['Idea Stage', 'Pre-revenue', 'Early-stage (Revenue generating)', 'Growth Stage', 'Series A+'];
const INDUSTRIES = ['FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'SaaS', 'E-commerce', 'D2C / Consumer', 'DeepTech / AI', 'CleanTech', 'Other'];

export default function Onboarding() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', industry: '', stage: '', location: '', notes: ''
  });

  const steps = [
    { title: "WHAT'S YOUR STARTUP CALLED?", field: 'name', type: 'text', placeholder: 'e.g. Acme Technologies' },
    { title: 'WHICH INDUSTRY ARE YOU IN?', field: 'industry', type: 'choice', options: INDUSTRIES },
    { title: 'WHAT STAGE ARE YOU AT?', field: 'stage', type: 'choice', options: STAGES },
    { title: 'WHERE ARE YOU BASED?', field: 'location', type: 'text', placeholder: 'e.g. Bengaluru, Karnataka' },
    { title: 'ANYTHING ELSE WE SHOULD KNOW?', field: 'notes', type: 'textarea', placeholder: "e.g. Bootstrapped, looking to register as MSME" },
  ];

  const currentStep = steps[step];
  const progress = ((step) / steps.length) * 100;

  const handleNext = async () => {
    if (!form[currentStep.field] && currentStep.type !== 'textarea') {
      toast.error('Please fill this in to continue');
      return;
    }
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      setSaving(true);
      try {
        const res = await authFetch('/api/v1/profiles', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('startup_profile_id', data.profile_id);
          toast.success("Profile saved! Let's get started 🎉");
          navigate('/dashboard');
        } else {
          toast.error(data.detail || 'Failed to save profile');
        }
      } catch {
        toast.error('Network error. Please try again.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSkip = () => navigate('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f0e6] font-sans dot-pattern relative">
      
      {/* Progress Bar Container */}
      <div className="h-6 bg-white border-b-[3px] border-black w-full relative z-20 overflow-hidden">
        <div className="h-full bg-[#3b82f6] border-r-[3px] border-black transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl bg-white border-[3px] border-black shadow-[8px_8px_0px_#000] p-10 transform -rotate-1 relative">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-12 border-b-[3px] border-black pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff8c00] border-[3px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
                <span className="text-black font-black text-xl">S</span>
              </div>
              <span className="font-black text-xl uppercase tracking-widest">StartupSage</span>
            </div>
            <button onClick={handleSkip} className="font-bold text-xs uppercase underline decoration-2 hover:text-[#ff8c00]">
              SKIP SETUP →
            </button>
          </div>

          <div className="absolute top-8 right-8 bg-[#a3e635] border-2 border-black font-black px-3 py-1 text-sm shadow-[2px_2px_0px_#000] transform rotate-3">
            STEP {step + 1} OF {steps.length}
          </div>

          {/* Question */}
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-10 leading-[0.9]">
            {currentStep.title}
          </h1>

          {/* Input */}
          <div className="mb-12 min-h-[160px]">
            {currentStep.type === 'text' && (
              <input
                autoFocus type="text"
                value={form[currentStep.field]}
                onChange={e => setForm(p => ({ ...p, [currentStep.field]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder={currentStep.placeholder}
                className="w-full bg-gray-100 border-[3px] border-black shadow-[4px_4px_0px_#000] p-6 text-2xl font-black uppercase placeholder:text-gray-400 focus:bg-white focus:translate-y-1 focus:translate-x-1 focus:shadow-[2px_2px_0px_#000] transition-all outline-none"
              />
            )}
            {currentStep.type === 'textarea' && (
              <textarea
                autoFocus rows={4}
                value={form[currentStep.field]}
                onChange={e => setForm(p => ({ ...p, [currentStep.field]: e.target.value }))}
                placeholder={currentStep.placeholder}
                className="w-full bg-gray-100 border-[3px] border-black shadow-[4px_4px_0px_#000] p-6 text-lg font-bold placeholder:text-gray-400 focus:bg-white focus:translate-y-1 focus:translate-x-1 focus:shadow-[2px_2px_0px_#000] transition-all outline-none resize-none"
              />
            )}
            {currentStep.type === 'choice' && (
              <div className="grid grid-cols-2 gap-4">
                {currentStep.options.map(opt => (
                  <button key={opt} onClick={() => setForm(p => ({ ...p, [currentStep.field]: opt }))}
                    className={`text-left p-4 border-[3px] border-black font-black uppercase text-sm transition-all ${form[currentStep.field] === opt ? 'bg-[#ff8c00] text-black shadow-[4px_4px_0px_#000] -translate-y-1' : 'bg-gray-100 text-black hover:bg-white hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary py-4 px-8 text-lg">← BACK</button>
            )}
            <button onClick={handleNext} disabled={saving} className="btn-primary flex-1 py-4 text-lg" style={{ opacity: saving ? 0.7 : 1 }}>
              {saving ? 'SAVING...' : (
                <span>{step === steps.length - 1 ? 'LAUNCH DASHBOARD →' : 'CONTINUE →'}</span>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
