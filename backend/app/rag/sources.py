from pathlib import Path
from typing import Dict

# Map any legacy filenames or basenames to verified official government URLs
FALLBACK_URL_MAP: Dict[str, str] = {
    "Shares_and_Debentures_Rules.pdf": "https://www.mca.gov.in/Ministry/pdf/NCARules_Chapter4.pdf",
    "Shares_and_Debentures_Rules": "https://www.mca.gov.in/Ministry/pdf/NCARules_Chapter4.pdf",
    "Companies_Act_2013.pdf": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf",
    "Companies_Act_2013": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf",
    "Companies_Share_Capital_and_Debentures_Rules_2014.pdf": "https://www.mca.gov.in/Ministry/pdf/NCARules_Chapter4.pdf",
    "Companies_Share_Capital_and_Debentures_Rules_2014": "https://www.mca.gov.in/Ministry/pdf/NCARules_Chapter4.pdf",
    "Income_Tax_Act_2025.pdf": "https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx",
    "Income_Tax_Act_2025": "https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx",
    "Gazette_060226_Startup_Definition.pdf": "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Revised%20Guidelines%20for%20recognition.pdf",
    "Gazette_060226_Startup_Definition": "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Revised%20Guidelines%20for%20recognition.pdf",
    "FEMA_Act.pdf": "https://www.rbi.org.in/Scripts/BS_FemaNotifications.aspx",
    "FEMA_Act": "https://www.rbi.org.in/Scripts/BS_FemaNotifications.aspx",
    "patents_act.pdf": "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
    "patents_act": "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_31_1_patent-act-1970-11march2015.pdf",
    "SIPP_extension.pdf": "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/SIPP_Scheme.pdf",
    "SIPP_extension": "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/SIPP_Scheme.pdf",
    "SIPP_Scheme_2017.pdf": "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/SIPP_Scheme.pdf",
    "SIPP_Scheme_2017": "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/SIPP_Scheme.pdf",
    "EPF_Act.pdf": "https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/EPFAct1952.pdf",
    "EPF_Act": "https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/EPFAct1952.pdf",
    "Payment_Of_Gratuity_Act.pdf": "https://labour.gov.in/sites/default/files/PaymentofGratuityAct1972.pdf",
    "Payment_Of_Gratuity_Act": "https://labour.gov.in/sites/default/files/PaymentofGratuityAct1972.pdf",
}

def resolve_source_url(url: str) -> str:
    """
    Ensure every citation URL resolves to a live external official resource.
    Never returns localhost or internal file paths.
    """
    if not url:
        return "https://www.startupindia.gov.in"
    if (url.startswith("http://") or url.startswith("https://")) and "localhost" not in url:
        return url
    basename = Path(url).name
    if basename in FALLBACK_URL_MAP:
        return FALLBACK_URL_MAP[basename]
    clean_name = basename.replace(".pdf", "")
    if clean_name in FALLBACK_URL_MAP:
        return FALLBACK_URL_MAP[clean_name]
    return "https://www.startupindia.gov.in"
