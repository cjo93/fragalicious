# Interaction Logic Matrix for Relationship Engine
# Maps (interaction_type, role) to protocol scripts

INTERACTION_RULES = {
    "COMPROMISE": {
        "Transmitter": {
            "protocol": "Warning: You are mechanically deaf here. You will naturally override your partner. You must consciously pause and invite their input, even if it feels slower.",
            "narrative": "You have the full channel; your partner only has one gate. You will tend to steamroll them in this area. Pause and invite their input."
        },
        "Receiver": {
            "protocol": "Surrender the outcome. You are a passenger in this specific channel. Do not fight for control here; you will lose every time. Observe their energy without identifying with it.",
            "narrative": "You only have one gate; your partner has the full channel. You will feel unheard or overruled. Surrender control and observe."
        }
    },
    "DOMINANCE": {
        "Transmitter": {
            "protocol": "You are the thermostat. If you are chaotic, the relationship is chaotic. Regulate yourself first.",
            "narrative": "You define the weather in this area. Your partner amplifies your state. Regulate yourself."
        },
        "Receiver": {
            "protocol": "This is not your energy. You are the thermometer. If you feel extreme pressure, step away to discharge. Do not make decisions based on this amplified feeling.",
            "narrative": "You are open here and amplify your partner's state. Step away if overwhelmed."
        }
    },
    "ELECTROMAGNETIC": {
        "Both": {
            "protocol": "This is a mechanical spark. It generates heat (conflict) and light (attraction). Do not try to 'fix' the other person; the friction is the fuel. Accept that this area will never be stable.",
            "narrative": "You complete a channel together. High attraction, high friction. Accept the instability."
        }
    },
    "COMPANIONSHIP": {
        "Both": {
            "protocol": "You speak the same language here. Use this as your stable ground when other areas are turbulent.",
            "narrative": "Both have the same channel. This is your shared stable ground."
        }
    }
}

