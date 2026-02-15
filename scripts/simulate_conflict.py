"""
Simulate a live relationship conflict using the upgraded Relationship Engine.
Scenario:
- User A: Projector, open Solar Plexus, 'Wait for Invitation' strategy
- User B: Generator, defined Solar Plexus, Channel 35-36 (Transitoriness)
"""
from core_logic.CalculationEngine import ChartData, PlanetPosition
from core_logic.RelationshipDebugger import ChartComparator
from core_logic.InteractionSequencer import InteractionSequencer

# Helper to create a dummy planet
ZODIAC = "Gemini"
def dummy_planet(name, gate, line):
    return PlanetPosition(
        name=name,
        longitude=0.0,
        gate=gate,
        line=line,
        zodiac_sign=ZODIAC
    )

# User A: Projector, open Solar Plexus (no gates 35 or 36)
user_a_chart = ChartData(
    sun=dummy_planet("Sun", 20, 2),
    earth=dummy_planet("Earth", 48, 3),
    moon=dummy_planet("Moon", 16, 1),
    north_node=dummy_planet("North Node", 2, 4),
    south_node=dummy_planet("South Node", 34, 5),
    mercury=dummy_planet("Mercury", 10, 6),
    venus=dummy_planet("Venus", 5, 2),
    mars=dummy_planet("Mars", 23, 1),
    jupiter=dummy_planet("Jupiter", 8, 3),
    saturn=dummy_planet("Saturn", 18, 2),
    uranus=dummy_planet("Uranus", 1, 1),
    neptune=dummy_planet("Neptune", 7, 2),
    pluto=dummy_planet("Pluto", 9, 4)
)

# User B: Generator, defined Solar Plexus (gates 35 and 36)
user_b_chart = ChartData(
    sun=dummy_planet("Sun", 35, 2),
    earth=dummy_planet("Earth", 36, 3),
    moon=dummy_planet("Moon", 15, 1),
    north_node=dummy_planet("North Node", 46, 4),
    south_node=dummy_planet("South Node", 29, 5),
    mercury=dummy_planet("Mercury", 5, 2),
    venus=dummy_planet("Venus", 10, 6),
    mars=dummy_planet("Mars", 23, 1),
    jupiter=dummy_planet("Jupiter", 8, 3),
    saturn=dummy_planet("Saturn", 18, 2),
    uranus=dummy_planet("Uranus", 1, 1),
    neptune=dummy_planet("Neptune", 7, 2),
    pluto=dummy_planet("Pluto", 9, 4)
)

comparator = ChartComparator()
interaction_sequencer = InteractionSequencer()

# Analyze relationship
events = comparator.analyze_connection(user_a_chart, user_b_chart)

print("Detected Interactions:")
for event in events:
    print(f"- {event.type.upper()} | Channel: {event.channel} | Gates: {event.gate_a}, {event.gate_b} | Severity: {event.severity}")

print("\nFriction Points and Protocols:")
for event in events:
    if event.severity in ["HIGH", "MEDIUM"] or event.type == "electromagnetic":
        # Determine user role
        user_role = "Receiver"
        if event.type == "compromise":
            user_role = "Receiver" if "Reverse" not in event.description else "Transmitter"
        elif event.type == "dominance":
            user_role = "Receiver"
        patch = interaction_sequencer.generate_interaction_protocol(
            event.type,
            user_role,
            event.gate_a or (event.channel[0] if event.channel else 0)
        )
        print(f"Type: {event.type.upper()} | My Protocol: {patch.your_strategy}\nPartner Protocol: {patch.partner_strategy}\nNarrative: {patch.relational_narrative}\n")
