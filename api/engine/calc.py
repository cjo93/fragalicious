import swisseph as swe
import os
from datetime import datetime

ephe_path = os.path.join(os.path.dirname(__file__), 'ephe')
swe.set_ephe_path(ephe_path)

def get_body_position(julian_day, body_id):
    flags = swe.FLG_SWIEPH | swe.FLG_SPEED
    result, flag = swe.calc_ut(julian_day, body_id, flags)
    return {
        "longitude": result[0],
        "gate": int((result[0] / 360) * 64) + 1,
        "line": int(((result[0] / 360) * 64 * 6) % 6) + 1
    }

def calculate_chart(date: str, time_utc: str | None, lat: float, lon: float):
    # Parse date and time
    dt = datetime.strptime(date + (f" {time_utc}" if time_utc else " 12:00"), "%Y-%m-%d %H:%M")
    year, month, day, hour, minute = dt.year, dt.month, dt.day, dt.hour, dt.minute
    jd = swe.julday(year, month, day, hour + minute/60.0)
    is_noon_stable = time_utc is None
    mechanics = {
        "sun": get_body_position(jd, 0),
        "earth": get_body_position(jd, 0),  # Will be overwritten below
        # ... add other planets as needed
    }
    mechanics['earth']['longitude'] = (mechanics['sun']['longitude'] + 180) % 360
    if is_noon_stable:
        mechanics['moon'] = "UNCERTAIN"
        mechanics['ascendant'] = "UNCERTAIN"
        mechanics['profile'] = "PARTIAL"
    else:
        mechanics['moon'] = get_body_position(jd, 1)
        # mechanics['ascendant'] = ... # Add ASC logic if needed
    return mechanics

