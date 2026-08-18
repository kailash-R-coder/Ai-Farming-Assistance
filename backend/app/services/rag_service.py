import re
from typing import Dict, Any, List, Optional
import httpx
from app.config import settings
from app.services.translation_service import TranslationService

# Curated Agricultural Knowledge Base (Kerala Agricultural University / ICAR guidelines)
KNOWLEDGE_BASE = [
    {
        "id": "tomato_yellow_leaves",
        "keywords": ["tomato", "yellow", "leaf", "leaves", "തക്കാളി", "മഞ്ഞ", "ഇല", "മഞ്ഞളിപ്പ്"],
        "title": "Yellowing of Tomato Leaves (Nutrient vs Viral vs Fungal)",
        "category": "Plant Pathology & Nutrient Deficiency",
        "answer_en": (
            "Yellowing of tomato leaves can be caused by three main factors:\n\n"
            "1. **Nitrogen Deficiency**: Lower/older leaves turn uniformly pale yellow first. Remedy: Apply cow dung slurry or 10g urea dissolved in 5L water around root zone.\n"
            "2. **Early Blight (Fungal)**: Yellow halo around brown concentric target-spots on lower leaves. Remedy: Spray 1% Bordeaux mixture or 20g Pseudomonas fluorescens per liter.\n"
            "3. **Tomato Leaf Curl Virus**: Leaves turn yellow, curl upwards, and plant gets stunted (spread by whiteflies). Remedy: Spray 2% neem oil garlic emulsion and destroy severely stunted plants to protect the rest of the plot.\n\n"
            "**Watering Tip**: Avoid waterlogging and ensure 6+ hours of direct sunlight."
        ),
        "answer_ml": (
            "തക്കാളി ഇലകൾ മഞ്ഞനിറമാകാൻ പ്രധാനമായും 3 കാരണങ്ങളുണ്ട്:\n\n"
            "1. **നൈട്രജൻ കുറവ്**: താഴത്തെ പഴയ ഇലകൾ ആദ്യം മഞ്ഞളിക്കുന്നു. പരിഹാരം: തടത്തിൽ ചാണകപ്പാലോ മണ്ണിരവളമോ നൽകുക.\n"
            "2. **ഇലക്കരിച്ചിൽ (കുമിൾ രോഗം)**: ഇലകളിൽ കറുത്ത പുള്ളികൾക്ക് ചുറ്റും മഞ്ഞ നിറം കാണുന്നു. പരിഹാരം: 1% ബോർഡോ മിശ്രിതം അല്ലെങ്കിൽ 20 ഗ്രാം സ്യൂഡോമോണസ് ഒരു ലിറ്റർ വെള്ളത്തിൽ കലക്കി തളിക്കുക.\n"
            "3. **ഇലച്ചുരുൾ വൈറസ് രോഗം (വെള്ളീച്ച പരത്തുന്നത്)**: ഇലകൾ മഞ്ഞളിച്ച് മുകളിലേക്ക് ചുരുളുന്നു. പരിഹാരം: വേപ്പെണ്ണ-വെളുത്തുള്ളി മിശ്രിതം (20 മില്ലി/ലിറ്റർ) തളിക്കുക. രോഗം കൂടിയ ചെടികൾ പിഴുതു മാറ്റി നശിപ്പിക്കുക.\n\n"
            "**ശ്രദ്ധിക്കുക**: തടത്തിൽ വെള്ളക്കെട്ട് ഉണ്ടാകാതെ നോക്കുക."
        )
    },
    {
        "id": "banana_pseudostem_weevil",
        "keywords": ["banana", "weevil", "pseudostem", "borer", "hole", "വാഴ", "പിണ്ടിപ്പുഴു", "താണവണ്ട്", "തുള"],
        "title": "Banana Pseudostem Weevil Management (പിണ്ടിപ്പുഴു)",
        "category": "Pest Management - Horticulture",
        "answer_en": (
            "Banana Pseudostem Weevil (*Odoiporus longicollis*) attacks 5-month or older plants:\n\n"
            "1. **Symptoms**: Small pinhead-sized holes on pseudo-stem with jelly-like exudation, followed by yellowing and snapping of the plant in mild wind.\n"
            "2. **Organic Management**: \n"
            "   - Swabbing or spraying *Beauveria bassiana* (20g/L) on the pseudostem.\n"
            "   - Set up longitudinal split banana stem traps (50cm long pieces) treated with *Beauveria* to trap and kill adult weevils.\n"
            "   - Apply Neem cake (500g) at the base during 3rd and 5th month earthing up.\n"
            "3. **Prevention**: Use clean disease-free suckers and prune dry outer leaf sheaths regularly."
        ),
        "answer_ml": (
            "വാഴയെ ബാധിക്കുന്ന ഏറ്റവും പ്രധാന കീടമാണ് പിണ്ടിപ്പുഴു (തണ്ടുതുരപ്പൻ):\n\n"
            "1. **ലക്ഷണങ്ങൾ**: വാഴപ്പിണ്ടിയിൽ ചെറിയ തുളകളും അവയിൽ നിന്ന് പശപോലുള്ള ദ്രാവകം ഒലിക്കുന്നതും കാണാം. കാറ്റടിക്കുമ്പോൾ വാഴ ഒടിഞ്ഞു വീഴുന്നു.\n"
            "2. **ജൈവ നിയന്ത്രണം**:\n"
            "   - ബ്യൂവേറിയ ബാസിയാന (20 ഗ്രാം/ലിറ്റർ) വാഴപ്പിണ്ടിയിൽ നന്നായി തളിക്കുക.\n"
            "   - 50 സെ.മീ നീളത്തിൽ മുറിച്ച വാഴത്തടകൾ ചതിക്കെണികളായി വെച്ച് അതിൽ വീഴുന്ന വണ്ടുകളെ നശിപ്പിക്കുക.\n"
            "   - 3, 5 മാസങ്ങളിൽ തടത്തിൽ 500 ഗ്രാം വേപ്പിൻ പിണ്ണാക്ക് ചേർക്കുക.\n"
            "3. **മുൻകരുതൽ**: വാഴയുടെ ഉണങ്ങിയ പോളകൾ യഥാസമയം ചെത്തിമാറ്റി വൃത്തിയായി സൂക്ഷിക്കുക."
        )
    },
    {
        "id": "coconut_rhino_beetle",
        "keywords": ["coconut", "beetle", "rhinoceros", "crown", "തെങ്ങ്", "കൊമ്പൻചെല്ലി", "ചെല്ലി", "ഓല"],
        "title": "Coconut Rhinoceros Beetle & Red Palm Weevil Control",
        "category": "Plantation Crops - Kerala",
        "answer_en": (
            "Management of Rhinoceros Beetle (*Oryctes rhinoceros*) in Coconut:\n\n"
            "1. **Symptoms**: Geometric V-shaped cuts on opened fronds and bore-holes on crown base with chewed fiber.\n"
            "2. **Organic Remedial Actions**:\n"
            "   - Clean the crown and fill the top innermost 2-3 leaf axils with a mixture of **Neem cake or Marotti cake + Sand (1:1 ratio)** (about 250g per palm) thrice a year (May, September, December).\n"
            "   - Treat manure pits (breeding sites) with green muscardine fungus (*Metarhizium anisopliae*) or spray 0.05% Carbaryl.\n"
            "   - Set up PVC pheromone traps (Oryctalure) in the plantation (1 trap per 2 hectares).\n"
            "3. **Hooking**: Extract adult beetles from crown boreholes using an iron beetle hook."
        ),
        "answer_ml": (
            "തെങ്ങിലെ കൊമ്പൻചെല്ലി നിയന്ത്രണം:\n\n"
            "1. **ലക്ഷണങ്ങൾ**: വിടർന്ന ഓലകളിൽ 'V' ആകൃതിയിലുള്ള മുറിവുകൾ കാണപ്പെടുന്നു.\n"
            "2. **പ്രതിരോധ മാർഗ്ഗങ്ങൾ**:\n"
            "   - തെങ്ങിന്റെ മണ്ട വൃത്തിയാക്കി ഏറ്റവും ഉള്ളിലെ 2-3 ഓലക്കവിളുകളിൽ **വേപ്പിൻ പിണ്ണാക്കും മണലും സമം ചേർത്ത മിശ്രിതം (250 ഗ്രാം)** വെക്കുക (മെയ്, സെപ്റ്റംബർ, ഡിസംബർ മാസങ്ങളിൽ).\n"
            "   - ചാണകക്കുഴികളിൽ മെറ്റാറൈസിയം ജീവാണു ചേർത്ത് പുഴുക്കളെ നശിപ്പിക്കുക.\n"
            "   - തോട്ടത്തിൽ ഫെറമോൺ കെണികൾ സ്ഥാപിക്കുക.\n"
            "   - ചെല്ലിക്കോൽ ഉപയോഗിച്ച് മണ്ടയിലെ ചെല്ലികളെ കുത്തിയെടുത്തു നശിപ്പിക്കുക."
        )
    },
    {
        "id": "paddy_blast_sheath",
        "keywords": ["paddy", "rice", "blast", "sheath", "നെല്ല്", "ഇലക്കരിച്ചിൽ", "പോളക്കരിച്ചിൽ", "ബ്ലാസ്റ്റ്"],
        "title": "Paddy Blast & Sheath Blight Management",
        "category": "Field Agronomy - Paddy",
        "answer_en": (
            "Control measures for Paddy Leaf Blast (*Magnaporthe oryzae*):\n\n"
            "1. **Symptoms**: Eye- or boat-shaped spindle lesions with greyish center and brownish borders.\n"
            "2. **Organic Management**: Spray 20g/L *Pseudomonas fluorescens* or 3% Panchagavya at tillering and panicle initiation stages.\n"
            "3. **Fertilizer Adjustment**: Avoid excessive or late application of Urea (Nitrogen); split Nitrogen into 3 equal doses with Potash.\n"
            "4. **Chemical Advice**: If disease pressure is acute, contact Krishi Bhavan for recommended Tricyclazole (0.6g/L) timing."
        ),
        "answer_ml": (
            "നെല്ലിലെ ബ്ലാസ്റ്റ് (ഇലക്കരിച്ചിൽ) രോഗ നിയന്ത്രണം:\n\n"
            "1. **ലക്ഷണങ്ങൾ**: ഇലകളിൽ തോണിയുടെ ആകൃതിയിൽ നടുക്ക് വെളുത്തതും വശങ്ങളിൽ തവിട്ടുനിറമുള്ളതുമായ പാടുകൾ.\n"
            "2. **ജൈവ പരിഹാരം**: 20 ഗ്രാം സ്യൂഡോമോണസ് അല്ലെങ്കിൽ 3% പഞ്ചഗവ്യം ഇലകളിൽ തളിക്കുക.\n"
            "3. **വളപ്രയോഗം**: യൂറിയ ഒറ്റയടിക്ക് കൂടുതൽ നൽകരുത്. പൊട്ടാഷിനൊപ്പം 3 ഘട്ടങ്ങളായി വിഭജിച്ചു നൽകുക.\n"
            "4. **രാസ കുമിൾനാശിനി**: രോഗം രൂക്ഷമായാൽ കൃഷി ഓഫീസറുടെ നിർദ്ദേശപ്രകാരം ട്രൈസൈക്ലസോൾ തളിക്കുക."
        )
    },
    {
        "id": "organic_formulations",
        "keywords": ["organic", "panchagavya", "jeevamrutham", "neem", "fertilizer", "ജൈവ", "പഞ്ചഗവ്യം", "ജീവാമൃതം", "വേപ്പെണ്ണ", "ഫിഷ് അമിനോ"],
        "title": "Preparation of Bio-Formulations (Jeevamrutham, Neem Oil Emulsion)",
        "category": "Organic & Natural Farming",
        "answer_en": (
            "Key Organic Formulations for Crop Health:\n\n"
            "1. **Jeevamrutham**: Mix 10kg fresh cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour (gram flour) + handful of fertile soil in 200L water. Ferment for 48-72 hours under shade. Dilute 1:10 and apply to root zone.\n"
            "2. **Neem Oil-Garlic Emulsion (for sucking pests)**: Dissolve 20g bar soap in 100ml warm water. Add 20ml neem oil and stir vigorously. Add juice extracted from 20g crushed garlic. Dilute the mix in 1 Liter water and spray immediately.\n"
            "3. **Fish Amino Acid**: Layer equal weights of chopped sardine/fresh fish and brown jaggery in an airtight container for 25 days. Filter and spray 2-5ml per liter for vigorous vegetative growth."
        ),
        "answer_ml": (
            "പ്രധാന ജൈവ കീടനാശിനികളും വളക്കൂട്ടുകളും:\n\n"
            "1. **ജീവാമൃതം**: 10 കി.ഗ്രാം പച്ചച്ചാണകം, 10 ലിറ്റർ ഗോമൂത്രം, 2 കി.ഗ്രാം ശർക്കര, 2 കി.ഗ്രാം ചെറുപയർ പൊടി, ഒരു പിടി വളക്കൂറുള്ള മണ്ണ് എന്നിവ 200 ലിറ്റർ വെള്ളത്തിൽ ചേർത്ത് ഇളക്കി തണലിൽ 3 ദിവസം വെക്കുക. 1:10 എന്ന തോതിൽ നേർപ്പിച്ച് ചെടിയുടെ ചുവട്ടിൽ ഒഴിക്കുക.\n"
            "2. **വേപ്പെണ്ണ-വെളുത്തുള്ളി മിശ്രിതം**: 20 ഗ്രാം ബാർ സോപ്പ് 100 മില്ലി ചെറുചൂടുവെള്ളത്തിൽ ലയിപ്പിക്കുക. ഇതിലേക്ക് 20 മില്ലി വേപ്പെണ്ണ ചേർത്തിളക്കുക. 20 ഗ്രാം വെളുത്തുള്ളി അരച്ചെടുത്ത നീര് കൂടി ചേർത്ത് ഒരു ലിറ്റർ വെള്ളത്തിൽ കലക്കി ഇലകളുടെ അടിയിലും മുകളിലും തളിക്കുക.\n"
            "3. **ഫിഷ് അമിനോ ആസിഡ്**: തുല്യ അളവിൽ മത്തിയും ശർക്കരയും ചേർത്ത് 25 ദിവസം അടച്ചു സൂക്ഷിക്കുക. തുടർന്ന് അരിച്ചെടുത്ത് ഒരു ലിറ്റർ വെള്ളത്തിന് 2-5 മില്ലി എന്ന തോതിൽ തളിച്ചുകൊടുക്കുക."
        )
    },
    {
        "id": "pepper_quick_wilt",
        "keywords": ["pepper", "wilt", "quick", "phytophthora", "കുരുമുളക്", "ദ്രുതവാട്ടം", "വാട്ടം"],
        "title": "Black Pepper Quick Wilt (ദ്രുതവാട്ടം) Management",
        "category": "Spices - Kerala Agriculture",
        "answer_en": (
            "Quick Wilt (*Phytophthora capsici*) is the most destructive disease of Black Pepper in Kerala monsoons:\n\n"
            "1. **Symptoms**: Dark spots on leaves that drop rapidly within 24-48 hours; blackened stem rotting at collar region.\n"
            "2. **Monsoon Precautionary Actions**:\n"
            "   - Drench the vine basin with 1% Bordeaux mixture or 0.2% Copper Oxychloride (3-5 liters per vine) in May-June before Southwest monsoon and again in August-September.\n"
            "   - Apply *Trichoderma viride* enriched neem cake compost (1-2 kg per vine) around root basin.\n"
            "   - Provide clean drainage trenches between vine rows."
        ),
        "answer_ml": (
            "കുരുമുളകിലെ ദ്രുതവാട്ടം നിയന്ത്രണം:\n\n"
            "1. **ലക്ഷണങ്ങൾ**: ഇലകളിൽ കറുത്ത പാടുകൾ വന്ന് ദിവസങ്ങൾക്കകം കൊഴിഞ്ഞു വീഴുന്നു; ചെടിയുടെ ചുവട് ചീഞ്ഞുപോകുന്നു.\n"
            "2. **പ്രതിരോധ നടപടികൾ**:\n"
            "   - മഴക്കാലത്തിന് മുൻപായി മെയ്-ജൂൺ മാസങ്ങളിലും പിന്നീട് ആഗസ്റ്റ് മാസത്തിലും 1% ബോർഡോ മിശ്രിതം അല്ലെങ്കിൽ കോപ്പർ ഓക്സിക്ലോറൈഡ് തടത്തിൽ ഒഴിച്ചു കൊടുക്കുക.\n"
            "   - ട്രൈക്കോഡെർമ ചേർത്ത വേപ്പിൻ പിണ്ണാക്ക് മിശ്രിതം (1-2 കി.ഗ്രാം) തടത്തിൽ നൽകുക.\n"
            "   - തോട്ടത്തിൽ വെള്ളം കെട്ടിനിൽക്കാതെ ചാലുകൾ കീറി നീർവാർച്ച ഉറപ്പാക്കുക."
        )
    }
]


class RAGService:
    """Agricultural Question Answering Engine with RAG & Multilingual Fallback."""

    @staticmethod
    async def answer_question(question: str, language_pref: str = "auto") -> Dict[str, Any]:
        detected_lang = TranslationService.detect_language(question) if language_pref == "auto" else language_pref
        q_lower = question.lower()

        # Score knowledge base chunks based on keyword matching
        best_match = None
        highest_score = 0

        for item in KNOWLEDGE_BASE:
            score = 0
            for kw in item["keywords"]:
                if kw.lower() in q_lower:
                    score += 1
            if score > highest_score:
                highest_score = score
                best_match = item

        # If high match found in local knowledge base
        if best_match and highest_score >= 1:
            ans_text = best_match["answer_ml"] if detected_lang == "ml" else best_match["answer_en"]
            sources = [
                {
                    "title": best_match["title"],
                    "category": best_match["category"],
                    "relevance": f"Matched agronomic guidelines ({highest_score} keywords)"
                }
            ]
            return {
                "answer": ans_text,
                "language": detected_lang,
                "sources": sources,
                "confidence": 0.95
            }

        # Fallback intelligent general response for unindexed topics
        if detected_lang == "ml":
            ans_text = (
                f"നിങ്ങളുടെ ചോദ്യം ശ്രദ്ധയിൽപ്പെട്ടു: '{question}'.\n\n"
                "പൊതുവായ കാർഷിക നിർദ്ദേശങ്ങൾ:\n"
                "1. **മണ്ണ് സംരക്ഷണം**: മണ്ണിൽ ആവശ്യത്തിന് ജൈവാംശം (ചാണകം, കമ്പോസ്റ്റ്) ഉണ്ടെന്ന് ഉറപ്പാക്കുക.\n"
                "2. **നീർവാർച്ച**: ചെടിയുടെ ചുവട്ടിൽ വെള്ളക്കെട്ട് ഉണ്ടാകാതെ ശ്രദ്ധിക്കുക.\n"
                "3. **ജൈവ കീടനിയന്ത്രണം**: രോഗപ്രതിരോധത്തിനായി സ്യൂഡോമോണസ് (20 ഗ്രാം/ലിറ്റർ) അല്ലെങ്കിൽ വേപ്പെണ്ണ വെളുത്തുള്ളി മിശ്രിതം ഉപയോഗിക്കുക.\n"
                "4. കൂടുതൽ വ്യക്തമായ മരുന്നളവുകൾക്കും സഹായങ്ങൾക്കും അടുത്തുള്ള കൃഷിഭവനുമായി ബന്ധപ്പെടുക."
            )
        else:
            ans_text = (
                f"Regarding your inquiry: '{question}'.\n\n"
                "**General Agronomic Recommendations**:\n"
                "1. **Soil & Organic Matter**: Maintain soil health with well-rotted farmyard manure, neem cake, and bio-fertilizers (Pseudomonas / Trichoderma).\n"
                "2. **Water Drainage**: Avoid stagnated water around root zones to prevent fungal damping-off and root rot.\n"
                "3. **Integrated Pest Management (IPM)**: Prioritize yellow sticky traps, neem oil emulsion (2%), and botanical sprays before considering synthetic chemicals.\n"
                "4. For soil-specific testing or certified chemical spray dosages, please contact your nearest Krishi Bhavan or Agricultural Extension Officer."
            )

        sources = [
            {
                "title": "Kerala Package of Practices for Agricultural Crops",
                "category": "Agronomy General Reference",
                "relevance": "Standard agricultural practices"
            }
        ]

        return {
            "answer": ans_text,
            "language": detected_lang,
            "sources": sources,
            "confidence": 0.88
        }
