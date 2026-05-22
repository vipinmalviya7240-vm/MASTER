import React, { useState } from 'react';
import { Check, Sparkles, Zap, ShieldAlert, Award } from 'lucide-react';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('Monthly'); // 'Monthly', 'Yearly'

  const plans = [
    {
      name: 'Free Plan',
      price: 0,
      desc: 'Perfect for casual learners wanting a smart, autonomous helper.',
      features: [
        'Basic AI tutor access (50 msgs/day)',
        'Standard dashboard metrics tracking',
        'Standard difficulty practice quizzes',
        'Basic task planner board',
        'Community discussion forum'
      ],
      cta: 'Get Started Free',
      isPro: false
    },
    {
      name: 'Pro AI Plan',
      price: billingPeriod === 'Monthly' ? 19 : 14,
      desc: 'Highly recommended for students wanting fully accelerated mastery.',
      features: [
        'Unlimited AI tutor interactions',
        'High-fidelity Voice AI regional reading',
        'Interactive AI Whiteboard analysis',
        'Expert difficulty quiz generators',
        'Advanced progress skill indices',
        'Pomodoro timers & habit streak trackers',
        'Priority server queueing speeds'
      ],
      cta: 'Upgrade to Pro',
      isPro: true
    },
    {
      name: 'Ultimate SMART_X',
      price: billingPeriod === 'Monthly' ? 49 : 39,
      desc: 'Designed for institutions and power users demanding absolute maximum coverage.',
      features: [
        'All Pro AI Plan inclusions',
        'OCR notes image scanning capability',
        'Multi-language simultaneous inputs',
        'Custom syllabus path creators',
        'Dedicated 1-on-1 AI Mentor rooms',
        'Institutional API workspace integrations',
        'Dedicated SLA support channels'
      ],
      cta: 'Go Ultimate',
      isPro: false
    }
  ];

  return (
    <section className="content-section" style={{ textAlign: 'center' }}>
      {/* Title */}
      <div style={{ marginBottom: '40px' }}>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--accent-primary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px'
        }}>
          Pricing Models
        </span>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          lineHeight: 1.2,
          fontWeight: 800,
          marginBottom: '20px'
        }}>
          Elevate Your Mind with <br />
          <span className="gradient-text neon-text-glow">Flexible Subscription Packages</span>
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          fontSize: '1.05rem',
          lineHeight: 1.6
        }}>
          Select the optimal tier that matches your academic goals. All premium plans come with a 14-day free trial.
        </p>

        {/* Billing period switcher toggle */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          borderRadius: '9999px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          marginTop: '32px'
        }}>
          {['Monthly', 'Yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: billingPeriod === period ? 'var(--btn-primary-bg)' : 'transparent',
                color: billingPeriod === period ? '#fff' : 'var(--text-secondary)',
                boxShadow: billingPeriod === period ? '0 4px 10px var(--neon-glow-primary)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {period} {period === 'Yearly' && <span style={{ fontSize: '0.7rem', color: '#10b981', marginLeft: '2px' }}>-25%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Plans */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '32px',
        maxWidth: '1100px',
        margin: '0 auto'
      }} className="lg:grid-cols-3">
        {plans.map((plan, i) => {
          const cardClass = plan.isPro ? 'pro-card-glow' : '';
          
          return (
            <div
              key={i}
              className={`glass-card ${cardClass}`}
              style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                padding: '36px 24px',
                backgroundColor: plan.isPro ? 'var(--bg-main)' : 'var(--glass-bg)',
                transform: plan.isPro ? 'scale(1.03)' : 'none',
                zIndex: plan.isPro ? 2 : 1
              }}
            >
              {/* Badge for Pro Plan */}
              {plan.isPro && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1.5px solid var(--accent-secondary)',
                  color: 'var(--accent-secondary)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  <Sparkles size={10} /> Popular
                </div>
              )}

              {/* Plan Info */}
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', minHeight: '40px', lineHeight: 1.4 }}>
                  {plan.desc}
                </p>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.8rem', fontWeight: 800 }}>${plan.price}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ month</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => alert(`Upgrading package subscription to: ${plan.name}. Loading payment integration...`)}
                className={`btn-premium ${plan.isPro ? 'primary' : 'secondary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {plan.isPro && <Zap size={14} fill="currentColor" />} {plan.cta}
              </button>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: plan.isPro ? 'rgba(168, 85, 247, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                      color: plan.isPro ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Check size={12} />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
