import re
from typing import Tuple


MALAYALAM_UNICODE_RANGE = re.compile(r'[\u0D00-\u0D7F]')


class TranslationService:
    """Detects Malayalam vs English text and provides localization helpers."""

    @staticmethod
    def detect_language(text: str) -> str:
        """Return 'ml' if text contains Malayalam characters, else 'en'."""
        if bool(MALAYALAM_UNICODE_RANGE.search(text)):
            return "ml"
        return "en"

    @staticmethod
    def get_agricultural_glossary():
        return {
            "nitrogen": "നൈട്രജൻ (യൂറിയ)",
            "phosphorus": "ഫോസ്ഫറസ് (റോക്ക് ഫോസ്ഫേറ്റ്)",
            "potassium": "പൊട്ടാഷ്",
            "early blight": "ഏർളി ബ്ലൈറ്റ് (ഇല കരിച്ചിൽ)",
            "late blight": "ലേറ്റ് ബ്ലൈറ്റ്",
            "bacterial wilt": "ബാക്ടീരിയൽ വാട്ടം (തൈവാട്ടം)",
            "bud rot": "കൂമ്പുചീയൽ",
            "quick wilt": "ദ്രുതവാട്ടം",
            "rhizome weevil": "മാണവണ്ട്",
            "pseudostem weevil": "പിണ്ടിപ്പുഴു",
            "rhinoceros beetle": "കൊമ്പൻചെല്ലി",
            "red palm weevil": "ചുവന്ന ചെല്ലി",
            "panchagavya": "പഞ്ചഗവ്യം",
            "jeevamrutham": "ജീവാമൃതം",
            "fish amino acid": "ഫിഷ് അമിനോ ആസിഡ്",
            "neem cake": "വേപ്പിൻ പിണ്ണാക്ക്",
            "bordeaux mixture": "ബോർഡോ മിശ്രിതം",
            "pseudomonas": "സ്യൂഡോമോണസ്"
        }
