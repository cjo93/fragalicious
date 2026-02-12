DEFRAG | API Specification (v9.0)

Base URL: https://defrag.app/apiProtocol: REST + Server-Sent Events (SSE) for AI StreamingAuthentication: Bearer Token via Supabase Auth HeadersGlobal Response Headers:



X-RateLimit-Limit: The maximum number of requests allowed per window.

X-RateLimit-Remaining: The number of requests remaining in the current window.

X-RateLimit-Reset: Unix timestamp when the window resets.

1. Intelligence Stream (The Generative Engine)

Endpoint: POST /chat

Description:

This is the primary input vector and the core of the "Single Stream" architecture. Unlike standard REST endpoints that return a static JSON blob, this endpoint establishes a persistent connection using Server-Sent Events (SSE). It accepts the user's raw text input combined with their calculated biological context and streams back "Generative UI Tokens."

Stream Structure:

The stream emits named events to differentiate between text generation and UI logic.



event: delta -> Contains text fragments for the chat bubble.

event: tool_call -> Contains JSON instructions to mount a React Component.

event: error -> Contains system alerts or logic failures.

event: done -> Signals the closure of the stream.

Request Payload:

The payload must aggregate the user's immediate input with their pre-calculated "Nature" (Astrology/HD) and "Nurture" (Family Systems) context. The AI does not re-calculate the birth chart on every message; it receives the cached mechanical state.



{

"message": "My mom is criticizing my career choices.",

"context": {

"user_id": "uuid-v4",

"session_id": "chat_session_12345",

"current_transits": {

// Pre-calculated client-side or cached from /transits/check

// Represents the "External Weather"

"saturn": { "sign": "pisces", "house": 10, "retrograde": true },

"mars": { "sign": "aries", "house": 1 }

},

"family_context": [

// Extracted from previous chat history or the 'family_nodes' table

// Represents "Nurture/Legacy Code"

{ "relation": "Mother", "tag": "Critical", "line_mechanic": "Line 1" },

{ "relation": "Grandmother", "tag": "Perfectionist", "pattern": "Control Loop" }

],

"user_mechanics": {

// The User's "Hardware" specs

"type": "Projector",

"authority": "Splenic",

"profile": "5/1"

}

}

}

Response (Streamed):

The stream returns a sequence of JSON objects. The frontend must parse these chunks to determine whether to append text to the chat bubble or mount a React Component.



Text Delta: Standard conversational output.

Tool Call: A directive to render a specific UI component. The props object contains the data necessary to hydrate the component immediately.

<!-- end list -->



// Chunk 1: The AI identifies a structural mismatch and calls the Insight Card tool

{

"type": "tool_call",

"tool": "generate_insight_card",

"props": {

"type": "friction",

"status": "active",

"mechanic": "Line 1 (Investigator) vs Line 5 (Heretic)",

"analysis": "Your Mother (Line 1) requires foundational proof to feel safe. You (Line 5) operate on projection and generalisation. She perceives your lack of detail as danger; you perceive her questions as interrogation."

}

}



// Chunk 2: The AI identifies a recursive pattern and calls the Map tool

{

"type": "tool_call",

"tool": "generate_family_map",

"props": {

"nodes": [

{ "id": "1", "label": "User", "type": "self" },

{ "id": "2", "label": "Mother", "type": "ancestor", "trait": "Critical" }

],

"edges": [

{ "source": "2", "target": "1", "label": "Judgment Loop", "color": "red", "animated": true }

]

}

}



// Chunk 3: The AI synthesizes the data into a text summary

{

"type": "text",

"content": "The map shows a recursive judgment loop. This anxiety didn't start with her; she is repeating a script."

}

2. High-Fidelity Logic (The Physics Engine)

Endpoint: GET /transits/check

Description:

This endpoint routes directly to the Python Microservice layer. It bypasses standard JavaScript date libraries to utilize the Swiss Ephemeris (C-library bindings via pyswiss). This is required to achieve sub-degree accuracy for planetary positions.

It calculates the "Psychological Weather" affecting the user. It is not generating text; it is generating raw physics data (vectors, velocities, and geometric angles) which the Frontend or Chat Agent then interprets.

Query Params:



birth_date: ISO 8601 String (e.g., 1990-05-20T14:30:00Z). Crucial for House Cusp calculation.

birth_location: "Latitude,Longitude" (e.g., 40.7128,-74.0060). Required to calculate the Ascendant and Moon position correctly.

Response:

The response provides a "State of the Union" on the user's current structural pressure.



Status: A high-level flag (High/Neutral/Flow) used to determine the UI color theme (Red/Grey/Green).

Mechanic: The specific geometric aspect causing the pressure.

Orb: The distance from exactitude. An orb < 1° indicates a "Critical Peak" event; > 3° indicates "Background Noise."

Velocity: Indicates if the planet is Direct (Forward), Retrograde (Internalizing), or Stationary (Intensifying).

<!-- end list -->



{

"status": "high_pressure",

"mechanic": "Mars (Transiting) Square Natal Sun",

"orb": "1.2 degrees",

"velocity": "Direct",

"intensity_score": 85, // 0-100 scale

"guidance": "Wait 48 hours before engagement. Your system is currently overloaded with external aggression metrics.",

"technical_data": {

"mars_position": 14.5,

"sun_position": 14.2,

"aspect_angle": 90

}

}

3. Monetization Gates (The Value Layer)

Endpoint: POST /stripe/portal

Description:

This endpoint manages the commercial relationship between the user and the platform. It handles the generation of Stripe Checkout Sessions (for new subscriptions) and Customer Portals (for managing existing subscriptions, cancellations, or payment method updates).

It explicitly connects the internal UUID of the Supabase user with the Stripe Customer ID to ensure license continuity.

Request:



price_id: The Stripe Price ID for the desired tier (e.g., price_pro_monthly, price_architect_annual).

return_url: (Optional) Where to redirect the user after success/cancel. Defaults to the chat console.

<!-- end list -->



{

"price_id": "price_pro_monthly",

"mode": "subscription" // or "payment" for one-time reports

}

Response:

Returns a secure, short-lived URL to redirect the client.



{

"url": "[https://checkout.stripe.com/c/pay/cs_live_a1b2c3d4](https://checkout.stripe.com/c/pay/cs_live_a1b2c3d4)...",

"session_id": "cs_live_a1b2c3d4..."

}

Webhook Logic (Server-Side):



checkout.session.completed: Updates the profiles table in Supabase. Sets subscription_status to 'pro' and logs the stripe_customer_id.

customer.subscription.deleted: Updates profiles. Sets subscription_status to 'free'.

Security Note: The frontend PaywallGate component is visual only. The backend API enforces RLS (Row Level Security) policies that prevent the Logic Engine from returning high-fidelity "Pro" data (like deep Genograms) to users with a subscription_status of 'free'.