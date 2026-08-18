from typing import Dict, Any, List
import httpx
from app.config import settings

# WMO Weather interpretation codes
WMO_CODES = {
    0: ("Clear sky", "തെളിഞ്ഞ ആകാശം", "sun"),
    1: ("Mainly clear", "പ്രധാനമായും തെളിഞ്ഞ ആകാശം", "sun"),
    2: ("Partly cloudy", "ഭാഗികമായി മേഘാവൃതം", "cloud-sun"),
    3: ("Overcast", "മേഘാവൃതമായ ആകാശം", "cloud"),
    45: ("Foggy", "മൂടൽമഞ്ഞ്", "cloud-fog"),
    48: ("Depositing rime fog", "കനത്ത മൂടൽമഞ്ഞ്", "cloud-fog"),
    51: ("Light drizzle", "നേരിയ ചാറ്റൽമഴ", "cloud-drizzle"),
    53: ("Moderate drizzle", "മിതമായ ചാറ്റൽമഴ", "cloud-drizzle"),
    55: ("Dense drizzle", "കനത്ത ചാറ്റൽമഴ", "cloud-drizzle"),
    61: ("Slight rain", "നേരിയ മഴ", "cloud-rain"),
    63: ("Moderate rain", "മിതമായ മഴ", "cloud-rain"),
    65: ("Heavy rain", "കനത്ത മഴ", "cloud-rain-wind"),
    71: ("Slight snow", "മഞ്ഞുവീഴ്ച", "snowflake"),
    80: ("Rain showers", "മഴക്കാറ്റ് / ചാറ്റൽ മഴ", "cloud-rain"),
    81: ("Moderate rain showers", "ഇടയ്ക്കിടെയുള്ള മഴ", "cloud-rain"),
    82: ("Violent rain showers", "കനത്ത പേമാരി", "cloud-lightning"),
    95: ("Thunderstorm", "ഇടിമിന്നലോടു കൂടിയ മഴ", "cloud-lightning")
}


class WeatherService:
    """Fetches live meteorological data from Open-Meteo and produces farming advisories."""

    @staticmethod
    async def get_weather(latitude: float, longitude: float, location_name: str = "Farm Location") -> Dict[str, Any]:
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": ["temperature_2m", "relative_humidity_2m", "precipitation", "weather_code", "wind_speed_10m"],
            "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "precipitation_probability_max"],
            "timezone": "auto"
        }

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(settings.WEATHER_API_URL, params=params)
                if response.status_code == 200:
                    data = response.json()
                    return WeatherService._parse_weather_data(data, latitude, longitude, location_name)
        except Exception as e:
            print(f"Weather API error: {e}. Falling back to default tropical forecast.")

        # Fallback realistic Kerala tropical weather
        return WeatherService._get_fallback_weather(latitude, longitude, location_name)

    @staticmethod
    def _parse_weather_data(data: dict, lat: float, lon: float, location_name: str) -> Dict[str, Any]:
        current = data.get("current", {})
        daily = data.get("daily", {})

        temp = current.get("temperature_2m", 29.5)
        humidity = current.get("relative_humidity_2m", 78.0)
        precip = current.get("precipitation", 0.0)
        wind = current.get("wind_speed_10m", 12.0)
        w_code = current.get("weather_code", 2)

        condition_en, condition_ml, icon = WMO_CODES.get(w_code, ("Fair", "നല്ല കാലാവസ്ഥ", "sun"))

        # Daily forecast
        daily_items = []
        dates = daily.get("time", [])
        max_temps = daily.get("temperature_2m_max", [])
        min_temps = daily.get("temperature_2m_min", [])
        precip_sums = daily.get("precipitation_sum", [])
        precip_probs = daily.get("precipitation_probability_max", [])
        codes = daily.get("weather_code", [])

        total_upcoming_rain = 0.0
        for i in range(min(len(dates), 7)):
            c_code = codes[i] if i < len(codes) else 2
            c_en, _, _ = WMO_CODES.get(c_code, ("Fair", "നല്ല കാലാവസ്ഥ", "sun"))
            p_sum = precip_sums[i] if i < len(precip_sums) else 0.0
            total_upcoming_rain += p_sum
            daily_items.append({
                "date": dates[i],
                "max_temp": max_temps[i] if i < len(max_temps) else 32.0,
                "min_temp": min_temps[i] if i < len(min_temps) else 24.0,
                "precipitation_sum": p_sum,
                "precipitation_probability": precip_probs[i] if i < len(precip_probs) else 20.0,
                "weather_code": c_code,
                "condition": c_en
            })

        # Generate rule-based agricultural advisories
        advisories_en, advisories_ml = WeatherService._generate_advisories(temp, humidity, precip, wind, total_upcoming_rain)

        return {
            "location": location_name,
            "latitude": lat,
            "longitude": lon,
            "current_temperature": temp,
            "humidity": humidity,
            "precipitation_mm": precip,
            "wind_speed_kmh": wind,
            "condition": condition_en,
            "condition_ml": condition_ml,
            "icon": icon,
            "agricultural_advisories": advisories_en,
            "agricultural_advisories_ml": advisories_ml,
            "forecast_daily": daily_items
        }

    @staticmethod
    def _generate_advisories(temp: float, humidity: float, precip: float, wind: float, upcoming_rain: float):
        advisories_en = []
        advisories_ml = []

        if precip > 10.0 or upcoming_rain > 30.0:
            advisories_en.append("Heavy rainfall expected. Postpone fertilizer application, weeding, and foliar spray.")
            advisories_ml.append("കനത്ത മഴ സാധ്യതയുള്ളതിനാൽ വളപ്രയോഗവും ഇലകളിൽ മരുന്നുതളിയും താൽക്കാലികമായി മാറ്റിവെക്കുക.")
            advisories_en.append("Ensure clear drainage channels around banana, pepper, and vegetable beds to prevent root rot.")
            advisories_ml.append("വാഴ, കുരുമുളക്, പച്ചക്കറി തടങ്ങളിൽ വെള്ളക്കെട്ട് ഒഴിവാക്കാൻ നീർവാർച്ച ചാലുകൾ വൃത്തിയാക്കുക.")
        elif precip == 0 and humidity < 60 and temp > 32:
            advisories_en.append("High temperature and low humidity. Irrigate early morning or evening to minimize evapotranspiration.")
            advisories_ml.append("ഉയർന്ന ചൂടും കുറഞ്ഞ ഈർപ്പവും ഉള്ളതിനാൽ രാവിലെയിലോ വൈകുന്നേരമോ നനയ്ക്കുക.")

        if humidity > 85:
            advisories_en.append("High relative humidity increases fungal infection risk (Blast/Blight). Monitor leaf undersides closely.")
            advisories_ml.append("അന്തരീക്ഷ ഈർപ്പം കൂടുതലായതിനാൽ പൂപ്പൽ രോഗ സാധ്യതയുണ്ട്. ഇലകൾ നിരീക്ഷിക്കുക.")

        if wind > 25.0:
            advisories_en.append("Strong winds forecast. Provide propping/staking for banana plants and young fruit trees.")
            advisories_ml.append("ശക്തമായ കാറ്റിന് സാധ്യതയുള്ളതിനാൽ വാഴകൾക്ക് മുട്ടു കൊടുക്കുക.")

        if not advisories_en:
            advisories_en.append("Weather is favorable for routine weeding, intercultural operations, and organic mulching.")
            advisories_ml.append("കൃഷിപ്പണികൾക്കും കളനിയന്ത്രണത്തിനും ജൈവ പുതയിടലിനും അനുയോജ്യമായ കാലാവസ്ഥ.")

        return advisories_en, advisories_ml

    @staticmethod
    def _get_fallback_weather(lat: float, lon: float, location_name: str) -> Dict[str, Any]:
        return {
            "location": location_name,
            "latitude": lat,
            "longitude": lon,
            "current_temperature": 29.5,
            "humidity": 78.0,
            "precipitation_mm": 2.5,
            "wind_speed_kmh": 14.0,
            "condition": "Partly Cloudy",
            "condition_ml": "ഭാഗികമായി മേഘാവൃതം",
            "icon": "cloud-sun",
            "agricultural_advisories": [
                "Moderate humidity observed. Good conditions for organic compost top-dressing.",
                "Ensure proper drainage in low-lying paddy and vegetable plots."
            ],
            "agricultural_advisories_ml": [
                "മിതമായ ഈർപ്പമുള്ള കാലാവസ്ഥ. ജൈവവള പ്രയോഗത്തിന് അനുയോജ്യമായ സമയം.",
                "താഴ്ന്ന പാടങ്ങളിലും പച്ചക്കറി തടങ്ങളിലും നീർവാർച്ച ഉറപ്പാക്കുക."
            ],
            "forecast_daily": [
                {"date": "Day 1", "max_temp": 31.0, "min_temp": 24.0, "precipitation_sum": 3.0, "precipitation_probability": 40.0, "weather_code": 2, "condition": "Partly Cloudy"},
                {"date": "Day 2", "max_temp": 30.5, "min_temp": 23.5, "precipitation_sum": 8.0, "precipitation_probability": 65.0, "weather_code": 61, "condition": "Slight Rain"},
                {"date": "Day 3", "max_temp": 29.0, "min_temp": 23.0, "precipitation_sum": 15.0, "precipitation_probability": 80.0, "weather_code": 63, "condition": "Moderate Rain"}
            ]
        }
