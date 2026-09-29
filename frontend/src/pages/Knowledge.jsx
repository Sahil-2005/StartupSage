const KNOWLEDGE_BASE = {
  "Registration & Incorporation": {
    icon: '🏛️',
    docs: [
      { name: "Revised Guidelines for Recognition of Startups", source: "Startup India / DPIIT" },
      { name: "FAQs on SPICe+ and Linked Filings", source: "Ministry of Corporate Affairs" },
      { name: "Limited Liability Partnership Act, 2008", source: "Ministry of Corporate Affairs" },
      { name: "One Person Company - A Referencer", source: "ICSI" },
      { name: "Step-by-Step Guide to Company Incorporation", source: "GIFT City / IFSCA" },
      { name: "LLP vs Company - Comparison Note", source: "Patna Women's College" },
    ]
  },
  "Taxation & GST": {
    icon: '📊',
    docs: [
      { name: "FAQs on GST", source: "CBIC" },
      { name: "New FAQs on GST (Second Edition)", source: "CBIC" },
      { name: "Welcome Kit for New GST Taxpayers", source: "GSTN" },
      { name: "Tax Incentives for Startups (80-IAC, Angel Tax)", source: "ICAI - WIRC" },
    ]
  },
  "MSME / Udyam": {
    icon: '🏭',
    docs: [
      { name: "Udyam Registration - Gazette Notification", source: "Ministry of MSME" },
      { name: "Clarification on EM Part-II / UAM and Udyam", source: "Ministry of MSME" },
      { name: "Udyam Registration Application Form", source: "DIC, Daman & Diu" },
    ]
  },
  "Funding & Investment": {
    icon: '💰',
    docs: [
      { name: "Startup India Seed Fund Scheme Guidelines", source: "DPIIT" },
      { name: "Consolidated FDI Policy Circular, 2020", source: "DPIIT" },
      { name: "FAQs on FDI Policy", source: "FIFP, DPIIT" },
      { name: "India Investment Policy and Regulatory Review 2022", source: "World Bank" },
    ]
  },
  "IP & Contracts": {
    icon: '⚖️',
    docs: [
      { name: "Founder Employment Agreement Template", source: "Startup India" },
      { name: "Non-Disclosure Agreement Template", source: "Startup India" },
      { name: "Scheme for Facilitating Startups IP Protection (SIPP)", source: "IP India" },
      { name: "Draft Manual of Trade Marks Practice", source: "CGPDTM / JETRO" },
    ]
  },
  "Labour & HR Compliance": {
    icon: '👥',
    docs: [
      { name: "Self-Certification for Startups (9 Labour Laws)", source: "V.V. Giri National Labour Institute" },
      { name: "POSH Act Handbook", source: "Ministry of Women & Child Development" },
    ]
  },
  "Data Protection": {
    icon: '🔐',
    docs: [
      { name: "Digital Personal Data Protection Act, 2023", source: "MeitY" },
      { name: "Consumer Protection (E-Commerce) Rules, 2020", source: "Ministry of Consumer Affairs" },
    ]
  },
  "Public Procurement (GeM)": {
    icon: '🛒',
    docs: [
      { name: "Startup Guide to Public Procurement (GeM Runway)", source: "Startup India / DPIIT" },
      { name: "GeM Webinar - Public Procurement Policy for MSEs", source: "GeM SPV" },
      { name: "PIB Backgrounder - GeM Features (SWAYATT, Startup Runway 2.0)", source: "Press Information Bureau" },
    ]
  },
};

export default function KnowledgePage() {
  const totalDocs = Object.values(KNOWLEDGE_BASE).reduce((acc, cat) => acc + cat.docs.length, 0);
  const totalCats = Object.keys(KNOWLEDGE_BASE).length;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px' }}>Knowledge Base</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          StartupSage is powered by <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totalDocs}+ documents</span> across <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totalCats} domains</span> from official government portals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
        {[
          { label: 'Total Documents', value: `${totalDocs}+`, color: 'var(--accent-light)' },
          { label: 'Knowledge Domains', value: totalCats, color: '#f43f5e' },
          { label: 'Govt. Ministries', value: '10+', color: '#14b8a6' },
          { label: 'Embedding Model', value: 'MiniLM', color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px', cursor: 'default' }}>
            <div className="font-mono" style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(KNOWLEDGE_BASE).map(([category, data]) => (
          <div key={category} className="card" style={{ padding: '24px', cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ fontSize: '24px' }}>{data.icon}</div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em' }}>{category}</h3>
                <p className="font-mono" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>{data.docs.length} documents</p>
              </div>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0 }}>
              {data.docs.map((doc, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: '6px' }}></div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)' }}>{doc.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{doc.source}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="glass-accent" style={{ marginTop: '32px', padding: '20px 24px', borderRadius: 'var(--radius-xl)', fontSize: '13px', color: 'var(--accent-light)' }}>
        <strong>Disclaimer:</strong> This knowledge base is for informational purposes only. All sources are from official government portals. Always verify critical legal or financial decisions with a qualified professional.
      </div>
    </div>
  );
}
