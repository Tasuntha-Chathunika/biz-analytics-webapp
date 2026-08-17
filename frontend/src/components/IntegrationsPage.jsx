import React from 'react';

const integrations = [
  { name: 'Slack', desc: 'Send automated daily reports and alerts to Slack channels.', icon: '💬', status: 'Connected', color: '#10b981' },
  { name: 'Salesforce', desc: 'Sync CRM data automatically with your analytics engine.', icon: '☁️', status: 'Available', color: '#6366f1' },
  { name: 'Google Analytics', desc: 'Combine web traffic metrics with your sales data.', icon: '📊', status: 'Available', color: '#6366f1' },
  { name: 'Stripe', desc: 'Import live transaction data directly from Stripe.', icon: '💳', status: 'Coming Soon', color: '#94a3b8' },
  { name: 'Shopify', desc: 'Sync orders, customers, and product catalogs.', icon: '🛍️', status: 'Coming Soon', color: '#94a3b8' },
  { name: 'Zapier', desc: 'Connect with over 3,000+ other applications.', icon: '⚡', status: 'Available', color: '#6366f1' },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6 pb-6 animate-fade-up">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800">Integrations</h2>
        <p className="text-sm text-slate-500 mt-1">Connect your data sources and favorite tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((int, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 border border-slate-200/60 bg-white/50">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                {int.icon}
              </div>
              <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border`}
                style={{
                  color: int.color,
                  backgroundColor: `${int.color}15`,
                  borderColor: `${int.color}30`
                }}
              >
                {int.status}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">{int.name}</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed min-h-[40px]">{int.desc}</p>
            <button 
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                int.status === 'Connected' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' :
                int.status === 'Coming Soon' ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200/50' :
                'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
              }`}
              disabled={int.status === 'Coming Soon'}
            >
              {int.status === 'Connected' ? 'Manage' : int.status === 'Coming Soon' ? 'Waitlist' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
