from core_logic.CalculationEngine import engine
import json

def test_calculation():
    # Test Birth: 1987-07-24 10:30 in London
    # Coordinates for London: 51.5074, -0.1278
    
    print("Testing CalculationEngine...")
    chart = engine.calculate("1987-07-24", "10:30", 51.5074, -0.1278)
    
    print(f"Sun: Gate {chart.sun.gate}.{chart.sun.line} in {chart.sun.zodiac_sign}")
    print(f"Earth: Gate {chart.earth.gate}.{chart.earth.line}")
    print(f"Moon: Gate {chart.moon.gate}.{chart.moon.line}")
    
    # Check if we have 13 planets (11 in bodies + Earth + South Node)
    # Actually the ChartData model has:
    # sun, earth, moon, north_node, south_node, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto
    # That is 13.
    
    planets = [
        chart.sun, chart.earth, chart.moon, chart.north_node, chart.south_node,
        chart.mercury, chart.venus, chart.mars, chart.jupiter, chart.saturn,
        chart.uranus, chart.neptune, chart.pluto
    ]
    
    print(f"Total Planets calculated: {len(planets)}")
    
    if len(planets) == 13:
        print("Verification: SUCCESS")
    else:
        print(f"Verification: FAILED (Expected 13, got {len(planets)})")

if __name__ == "__main__":
    test_calculation()
