import pytest
from api.engine.calc import calculate_chart

def test_noon_stable_masks_moon():
    # Example: 1985-10-26, no time
    result = calculate_chart("1985-10-26", None, 34.0, -118.0)
    assert result['moon'] == "UNCERTAIN"
    assert result['profile'] == "PARTIAL"
    assert 'sun' in result and 'earth' in result

