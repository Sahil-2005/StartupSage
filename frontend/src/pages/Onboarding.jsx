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
    { title: "What's your startup called?", field: 'name', type: 'text', placeholder: 'e.g., Acme Technologies' },
    { title: 'Which industry are you in?', field: 'industry', type: 'choice', options: INDUSTRIES },
    { title: 'What stage are you at?', field: 'stage', type: 'choice', options: STAGES },
    { title: 'Where are you based?', field: 'location', type: 'text', placeholder: 'e.g., Bengaluru, Karnataka' },
    { title: 'Anything else we should know?', field: 'notes', type: 'textarea', placeholder: "e.g., 'Bootstrapped, looking to register as MSME and raise seed funding'" },
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
      // Final step — save profile
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
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-white/5 w-full">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white font-semibold">StartupSage</span>
            </div>
            <button onClick={handleSkip} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Skip setup →
            </button>
          </div>

          {/* Step counter */}
          <div className="text-sm text-gray-500 mb-4">{step + 1} of {steps.length}</div>

          {/* Question */}
          <h1 className="text-3xl font-bold text-white mb-8">{currentStep.title}</h1>

          {/* Input */}
          <div className="mb-8">
            {currentStep.type === 'text' && (
              <input
                autoFocus type="text"
                value={form[currentStep.field]}
                onChange={e => setForm(p => ({ ...p, [currentStep.field]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder={currentStep.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            )}
            {currentStep.type === 'textarea' && (
              <textarea
                autoFocus rows={4}
                value={form[currentStep.field]}
                onChange={e => setForm(p => ({ ...p, [currentStep.field]: e.target.value }))}
                placeholder={currentStep.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              />
            )}
            {currentStep.type === 'choice' && (
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setForm(p => ({ ...p, [currentStep.field]: opt }))}
                    className={`px-4 py-4 rounded-xl border text-left font-medium text-sm transition-all ${
                      form[currentStep.field] === opt
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all font-medium"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext} disabled={saving}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Saving...</span></>
              ) : (
                <span>{step === steps.length - 1 ? 'Launch Dashboard →' : 'Continue →'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
