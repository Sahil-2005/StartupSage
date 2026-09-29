const KNOWLEDGE_BASE = {
  "Registration & Incorporation": {
    icon: '🏛️',
    color: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-blue-500/20',
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
    color: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
    docs: [
      { name: "FAQs on GST", source: "CBIC" },
      { name: "New FAQs on GST (Second Edition)", source: "CBIC" },
      { name: "Welcome Kit for New GST Taxpayers", source: "GSTN" },
      { name: "Tax Incentives for Startups (80-IAC, Angel Tax)", source: "ICAI - WIRC" },
    ]
  },
  "MSME / Udyam": {
    icon: '🏭',
    color: 'from-yellow-500/10 to-amber-500/10',
    border: 'border-yellow-500/20',
    docs: [
      { name: "Udyam Registration - Gazette Notification", source: "Ministry of MSME" },
      { name: "Clarification on EM Part-II / UAM and Udyam", source: "Ministry of MSME" },
      { name: "Udyam Registration Application Form", source: "DIC, Daman & Diu" },
    ]
  },
  "Funding & Investment": {
    icon: '💰',
    color: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/20',
    docs: [
      { name: "Startup India Seed Fund Scheme Guidelines", source: "DPIIT" },
      { name: "Consolidated FDI Policy Circular, 2020", source: "DPIIT" },
      { name: "FAQs on FDI Policy", source: "FIFP, DPIIT" },
      { name: "India Investment Policy and Regulatory Review 2022", source: "World Bank" },
    ]
  },
  "IP & Contracts": {
    icon: '⚖️',
    color: 'from-pink-500/10 to-rose-500/10',
    border: 'border-pink-500/20',
    docs: [
      { name: "Founder Employment Agreement Template", source: "Startup India" },
      { name: "Non-Disclosure Agreement Template", source: "Startup India" },
      { name: "Scheme for Facilitating Startups IP Protection (SIPP)", source: "IP India" },
      { name: "Draft Manual of Trade Marks Practice", source: "CGPDTM / JETRO" },
    ]
  },
  "Labour & HR Compliance": {
    icon: '👥',
    color: 'from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/20',
    docs: [
      { name: "Self-Certification for Startups (9 Labour Laws)", source: "V.V. Giri National Labour Institute" },
      { name: "POSH Act Handbook", source: "Ministry of Women & Child Development" },
    ]
  },
  "Data Protection": {
    icon: '🔐',
    color: 'from-cyan-500/10 to-teal-500/10',
    border: 'border-cyan-500/20',
    docs: [
      { name: "Digital Personal Data Protection Act, 2023", source: "MeitY" },
      { name: "Consumer Protection (E-Commerce) Rules, 2020", source: "Ministry of Consumer Affairs" },
    ]
  },
  "Public Procurement (GeM)": {
    icon: '🛒',
    color: 'from-indigo-500/10 to-sky-500/10',
    border: 'border-indigo-500/20',
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
        <p className="text-gray-400 mt-1 text-sm">
          StartupSage is powered by <span className="text-white font-medium">{totalDocs}+ documents</span> across <span className="text-white font-medium">{totalCats} domains</span> from official government portals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Documents', value: `${totalDocs}+` },
          { label: 'Knowledge Domains', value: totalCats },
          { label: 'Govt. Ministries', value: '10+' },
          { label: 'Embedding Model', value: 'all-MiniLM' },
        ].map(s => (
          <div key={s.label} className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-5">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-gray-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(KNOWLEDGE_BASE).map(([category, data]) => (
          <div key={category} className={`bg-gradient-to-br ${data.color} border ${data.border} rounded-2xl p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl">{data.icon}</div>
              <div>
                <h3 className="text-white font-semibold">{category}</h3>
                <p className="text-gray-500 text-xs">{data.docs.length} documents</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {data.docs.map((doc, i) => (
                <li key={i} className="flex items-start space-x-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5"></div>
                  <div>
                    <p className="text-gray-200 text-xs font-medium leading-snug">{doc.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{doc.source}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-sm text-amber-400">
        <strong>Disclaimer:</strong> This knowledge base is for informational purposes only. All sources are from official government portals. Always verify critical legal or financial decisions with a qualified professional.
      </div>
    </div>
  );
}
