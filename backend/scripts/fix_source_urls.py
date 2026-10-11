import os
import sys
import asyncio
from pathlib import Path

# Add backend directory to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.core.config import settings
from app.rag.ingestion.pipeline import get_qdrant_client, COLLECTION_NAME
from qdrant_client.http import models

URL_MAP = {
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

def update_qdrant():
    print("Connecting to Qdrant...")
    client = get_qdrant_client()
    
    offset = None
    total_scanned = 0
    total_updated = 0
    
    while True:
        records, next_offset = client.scroll(
            collection_name=COLLECTION_NAME,
            limit=100,
            offset=offset,
            with_payload=True,
            with_vectors=False
        )
        if not records:
            break
            
        for record in records:
            total_scanned += 1
            payload = record.payload or {}
            source_url = payload.get("source_url", "")
            
            # Check if source_url matches our map or ends with .pdf without http
            new_url = None
            if source_url in URL_MAP:
                new_url = URL_MAP[source_url]
            elif source_url.endswith(".pdf") and not source_url.startswith("http"):
                # Try finding matching key
                basename = Path(source_url).name
                new_url = URL_MAP.get(basename) or URL_MAP.get(basename.replace(".pdf", ""))
                
            if new_url and new_url != source_url:
                print(f"Updating point {record.id}: '{source_url}' -> '{new_url}'")
                client.set_payload(
                    collection_name=COLLECTION_NAME,
                    payload={"source_url": new_url},
                    points=[record.id]
                )
                total_updated += 1
                
        offset = next_offset
        if offset is None:
            break
            
    print(f"\nQdrant scan complete! Scanned {total_scanned} points, updated {total_updated} points.")

async def update_mongo():
    from app.db.mongo import db, connect_db, close_db
    print("\nConnecting to MongoDB...")
    await connect_db()
    if db.db is not None:
        for old_source, new_source in URL_MAP.items():
            result = await db.db.documents.update_many(
                {"source_url": old_source},
                {"$set": {"source_url": new_source}}
            )
            if result.modified_count > 0:
                print(f"MongoDB: Updated {result.modified_count} doc(s) in documents from '{old_source}' to '{new_source}'")

        cursor = db.db.messages.find({"citations": {"$exists": True, "$ne": []}})
        msgs = await cursor.to_list(length=2000)
        updated_msgs = 0
        for m in msgs:
            citations = m.get("citations", [])
            modified = False
            for cit in citations:
                s_url = cit.get("source_url", "")
                basename = Path(s_url).name
                new_s = URL_MAP.get(s_url) or URL_MAP.get(basename) or URL_MAP.get(basename.replace(".pdf", ""))
                if new_s and new_s != s_url:
                    cit["source_url"] = new_s
                    modified = True
            if modified:
                await db.db.messages.update_one(
                    {"_id": m["_id"]},
                    {"$set": {"citations": citations}}
                )
                updated_msgs += 1
        print(f"MongoDB: Updated citations in {updated_msgs} historical messages.")
    await close_db()
    print("MongoDB update complete.")

if __name__ == "__main__":
    update_qdrant()
    asyncio.run(update_mongo())
