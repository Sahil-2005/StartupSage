const KNOWLEDGE_BASE = {
  "Registration & Incorporation": {
    icon: '🏛️',
    color: 'bg-[#ff8c00]',
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
    color: 'bg-[#a3e635]',
    docs: [
      { name: "FAQs on GST", source: "CBIC" },
      { name: "New FAQs on GST (Second Edition)", source: "CBIC" },
      { name: "Welcome Kit for New GST Taxpayers", source: "GSTN" },
      { name: "Tax Incentives for Startups (80-IAC, Angel Tax)", source: "ICAI - WIRC" },
    ]
  },
  "MSME / Udyam": {
    icon: '🏭',
    color: 'bg-[#3b82f6]',
    docs: [
      { name: "Udyam Registration - Gazette Notification", source: "Ministry of MSME" },
      { name: "Clarification on EM Part-II / UAM and Udyam", source: "Ministry of MSME" },
      { name: "Udyam Registration Application Form", source: "DIC, Daman & Diu" },
    ]
  },
  "Funding & Investment": {
    icon: '💰',
    color: 'bg-[#fbbf24]',
    docs: [
      { name: "Startup India Seed Fund Scheme Guidelines", source: "DPIIT" },
      { name: "Consolidated FDI Policy Circular, 2020", source: "DPIIT" },
      { name: "FAQs on FDI Policy", source: "FIFP, DPIIT" },
      { name: "India Investment Policy and Regulatory Review 2022", source: "World Bank" },
    ]
  },
  "IP & Contracts": {
    icon: '⚖️',
    color: 'bg-white',
    docs: [
      { name: "Founder Employment Agreement Template", source: "Startup India" },
      { name: "Non-Disclosure Agreement Template", source: "Startup India" },
      { name: "Scheme for Facilitating Startups IP Protection (SIPP)", source: "IP India" },
      { name: "Draft Manual of Trade Marks Practice", source: "CGPDTM / JETRO" },
    ]
  },
  "Labour & HR Compliance": {
    icon: '👥',
    color: 'bg-[#ff8c00]',
    docs: [
      { name: "Self-Certification for Startups (9 Labour Laws)", source: "V.V. Giri National Labour Institute" },
      { name: "POSH Act Handbook", source: "Ministry of Women & Child Development" },
    ]
  },
  "Data Protection": {
    icon: '🔐',
    color: 'bg-white',
    docs: [
      { name: "Digital Personal Data Protection Act, 2023", source: "MeitY" },
      { name: "Consumer Protection (E-Commerce) Rules, 2020", source: "Ministry of Consumer Affairs" },
    ]
  },
  "Public Procurement (GeM)": {
    icon: '🛒',
    color: 'bg-[#a3e635]',
    docs: [
      { name: "Startup Guide to Public Procurement (GeM Runway)", source: "Startup India / DPIIT" },
      { name: "GeM Webinar - Public Procurement Policy for MSEs", source: "GeM SPV" },
      { name: "PIB Backgrounder - GeM Features", source: "Press Information Bureau" },
    ]
  },
};

export default function KnowledgePage() {
  const totalDocs = Object.values(KNOWLEDGE_BASE).reduce((acc, cat) => acc + cat.docs.length, 0);
  const totalCats = Object.keys(KNOWLEDGE_BASE).length;

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-12 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black mb-4">Knowledge Base</h1>
        <p className="text-xl font-bold text-black border-l-[4px] border-[#3b82f6] pl-4">
          StartupSage is powered by <span className="text-[#3b82f6] underline decoration-4 underline-offset-4">{totalDocs}+ documents</span> across <span className="text-[#3b82f6] underline decoration-4 underline-offset-4">{totalCats} domains</span> from official government portals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Documents', value: `${totalDocs}+`, color: 'bg-white' },
          { label: 'Knowledge Domains', value: totalCats, color: 'bg-[#a3e635]' },
          { label: 'Govt. Ministries', value: '10+', color: 'bg-[#3b82f6]' },
          { label: 'Embedding Model', value: 'MiniLM', color: 'bg-[#ff8c00]' },
        ].map(s => (
          <div key={s.label} className={`border-[3px] border-black shadow-[4px_4px_0px_#000] p-6 ${s.color} ${s.color === 'bg-[#3b82f6]' ? 'text-white' : 'text-black'}`}>
            <div className="font-black text-4xl mb-2">{s.value}</div>
            <div className="font-bold text-sm uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(KNOWLEDGE_BASE).map(([category, data]) => (
          <div key={category} className={`border-[3px] border-black shadow-[6px_6px_0px_#000] p-8 ${data.color}`}>
            <div className="flex items-center gap-4 mb-6 border-b-[3px] border-black pb-4">
              <div className="text-4xl bg-white border-[3px] border-black p-2 shadow-[2px_2px_0px_#000]">
                {data.icon}
              </div>
              <div>
                <h3 className="font-black text-2xl uppercase text-black leading-none mb-2">{category}</h3>
                <span className="font-black text-xs uppercase bg-black text-white px-3 py-1 border-[2px] border-black">
                  {data.docs.length} DOCUMENTS
                </span>
              </div>
            </div>
            
            <ul className="flex flex-col gap-4">
              {data.docs.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/60 p-3 border-[2px] border-black">
                  <div className="w-3 h-3 bg-black mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="font-black text-sm text-black leading-tight mb-1">{doc.name}</p>
                    <p className="font-bold text-[10px] uppercase text-[#444]">{doc.source}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 bg-[#111] text-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-6">
        <strong className="font-black text-[#ff8c00] text-xl uppercase block mb-2">Disclaimer</strong>
        <p className="font-bold text-sm">
          This knowledge base is for informational purposes only. All sources are from official government portals. Always verify critical legal or financial decisions with a qualified professional.
        </p>
      </div>

    </div>
  );
}
