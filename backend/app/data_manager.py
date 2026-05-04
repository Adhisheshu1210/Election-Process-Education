# Data Manager: Connects to external election data APIs
import os
import requests

def fetch_election_data(location):
    # Simulate live data fetch (replace with real API in production)
    if location is None:
        location = {}
    country = location.get("country", "US")
    # Example: fetch from a Google Sheet or API
    # api_url = os.getenv("ELECTION_DATA_API")
    # if api_url:
    #     resp = requests.get(f"{api_url}?country={country}")
    #     if resp.ok:
    #         return {"status": "success", "data": resp.json()}
    # Demo: return mock data for US
    if country.upper() == "US":
        return {
            "status": "success",
            "data": {
                "registration_deadline": "2026-10-01",
                "election_day": "2026-11-03",
                "official_site": "https://www.usa.gov/election-office"
            }
        }
    return {"status": "success", "data": {}}
