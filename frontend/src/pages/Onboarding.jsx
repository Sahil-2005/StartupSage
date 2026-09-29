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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Progress Bar */}
      <div style={{ height: '3px', background: 'var(--bg-tertiary)', width: '100%' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #d97706)', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)', width: `${progress}%`, borderRadius: '0 3px 3px 0', boxShadow: '0 0 12px rgba(245, 158, 11, 0.3)' }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: '32px' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="animate-pulse-glow" style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#09090b', fontWeight: 800, fontSize: '14px' }}>S</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>StartupSage</span>
            </div>
            <button onClick={handleSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Skip setup →
            </button>
          </div>

          {/* Step counter */}
          <div className="font-mono" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginBottom: '12px' }}>{step + 1} / {steps.length}</div>

          {/* Question */}
          <h1 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '32px', lineHeight: 1.2 }}>{currentStep.title}</h1>

          {/* Input */}
          <div style={{ marginBottom: '32px' }}>
            {currentStep.type === 'text' && (
              <input
                autoFocus type="text"
                value={form[currentStep.field]}
                onChange={e => setForm(p => ({ ...p, [currentStep.field]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder={currentStep.placeholder}
                className="input-field" style={{ padding: '20px 24px', fontSize: '18px', borderRadius: 'var(--radius-xl)' }}
              />
            )}
            {currentStep.type === 'textarea' && (
              <textarea
                autoFocus rows={4}
                value={form[currentStep.field]}
                onChange={e => setForm(p => ({ ...p, [currentStep.field]: e.target.value }))}
                placeholder={currentStep.placeholder}
                className="input-field" style={{ padding: '20px 24px', fontSize: '16px', borderRadius: 'var(--radius-xl)', resize: 'none' }}
              />
            )}
            {currentStep.type === 'choice' && (
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options.map(opt => (
                  <button key={opt} onClick={() => setForm(p => ({ ...p, [currentStep.field]: opt }))}
                    style={{
                      padding: '16px 18px', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      ...(form[currentStep.field] === opt ? {
                        background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent-light)',
                      } : {
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                      }),
                    }}
                    onMouseOver={e => { if (form[currentStep.field] !== opt) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                    onMouseOut={e => { if (form[currentStep.field] !== opt) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary" style={{ padding: '14px 24px' }}>← Back</button>
            )}
            <button onClick={handleNext} disabled={saving} className="btn-primary" style={{ flex: 1, padding: '14px', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#09090b', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div> Saving...</>
              ) : (
                <span>{step === steps.length - 1 ? 'Launch Dashboard →' : 'Continue →'}</span>
              )}
            </button>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}
