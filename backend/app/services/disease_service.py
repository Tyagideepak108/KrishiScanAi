"""
Tera JSON loading logic yahan centralize kiya hai.
Dono JSON files startup pe ek baar load hoti hain.
"""
import json
from pathlib import Path
from app.core.config import settings


class DiseaseInfoService:
    def __init__(self):
        self._sugarcane_info: dict = {}
        self._other_info: dict = {}
        self._load()

    def _load(self):
        try:
            with open(settings.SUGARCANE_INFO_PATH, "r", encoding="utf-8") as f:
                self._sugarcane_info = json.load(f)
            print("Sugarcane disease info loaded.")
        except Exception as e:
            print(f"[ERROR] Could not load sugarcane info: {e}")

        try:
            with open(settings.OTHER_CROPS_INFO_PATH, "r", encoding="utf-8") as f:
                self._other_info = json.load(f)
            print("Other crops disease info loaded.")
        except Exception as e:
            print(f"[ERROR] Could not load other crops info: {e}")

    def get_info(self, disease_key: str, crop_type: str, lang: str = "en") -> dict | None:
        """
        Tera app.py wala disease_info.get(final_pred) - same logic
        lang = "en" or "hi"
        """
        source = self._sugarcane_info if crop_type == "sugarcane" else self._other_info
        info = source.get(disease_key)
        if not info:
            return None

        if lang == "hi":
            return {
                "disease_name": info.get("hindi_name", disease_key),
                "cause": info.get("cause_hindi", info.get("cause", "")),
                "organic_treatment": info.get("organic_treatment", []),
                "chemical_treatment": info.get("chemical_treatment", []),
                "preventive_measures": info.get("preventive_measures", []),
            }
        else:
            return {
                "disease_name": disease_key,
                "cause": info.get("cause", ""),
                "organic_treatment": info.get("organic_treatment_en", []),
                "chemical_treatment": info.get("chemical_treatment_en", []),
                "preventive_measures": info.get("preventive_measures_en", []),
            }

    def get_raw(self, disease_key: str, crop_type: str) -> dict | None:
        """Both languages ka full data - disease info page ke liye"""
        source = self._sugarcane_info if crop_type == "sugarcane" else self._other_info
        return source.get(disease_key)

    def list_diseases(self, crop_type: str) -> list[str]:
        source = self._sugarcane_info if crop_type == "sugarcane" else self._other_info
        return list(source.keys())


# Singleton
disease_service = DiseaseInfoService()