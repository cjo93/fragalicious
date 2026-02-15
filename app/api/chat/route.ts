
import { StreamingTextResponse } from 'ai';

/**
 * DEFRAG CHAT API
 * Forwards user input + birth data to Python microservice.
 */

// Placeholder URL for the Python microservice
const PYTHON_MICROSERVICE_URL = process.env.PYTHON_MICROSERVICE_URL || 'http://localhost:5000/api/defrag';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // The new structure according to API.md
    const { message, context, messages } = body;
    
    // Fallback for old structure or useChat's default messages array
    const userMessage = message || (messages && messages[messages.length - 1]?.content) || "";

    console.log('Forwarding to Python Microservice:', {
      message: userMessage,
      context: context || 'NOT_PROVIDED'
    });

    // Simulate the stream according to API.md
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Helper to send JSON chunks
        const sendChunk = (obj: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));
        };

        if (userMessage.toUpperCase().includes('MOM') || userMessage.toUpperCase().includes('MOTHER')) {
           // Crisis detection simulation
           if (userMessage.toUpperCase().includes('KILL') || userMessage.toUpperCase().includes('HURT')) {
             sendChunk({
               type: "error",
               content: "CRITICAL ERROR: System capacity exceeded. Human intervention required. Please contact [National Hotline]. Structural analysis ceased."
             });
             controller.close();
             return;
           }

           sendChunk({
             type: "tool_call",
             tool: "generate_insight_card",
             props: {
               type: "friction",
               status: "active",
               mechanic: "Line 1 (Investigator) vs Line 5 (Heretic)",
               analysis: "Your Mother (Line 1) requires foundational proof to feel safe. You (Line 5) operate on projection and generalisation. She perceives your lack of detail as danger; you perceive her questions as interrogation."
             }
           });
           
           await new Promise(r => setTimeout(r, 800));

           sendChunk({
             type: "tool_call",
             tool: "generate_family_map",
             props: {
               nodes: [
                 { id: "1", label: "User", type: "self" },
                 { id: "2", label: "Mother", type: "female", trait: "Critical" }
               ],
               edges: [
                 { source: "2", target: "1", interaction: "conflict", animated: true }
               ]
             }
           });

           await new Promise(r => setTimeout(r, 800));

           sendChunk({
             type: "tool_call",
             tool: "generate_strategy_log",
             props: {
               steps: [
                 { 
                   instruction: "Cease all recursive detail requests.", 
                   timing: "Immediate", 
                   expected_output: "Reduction in Mother's interrogation latency." 
                 },
                 { 
                   instruction: "Provide high-level status summary only.", 
                   timing: "T+2 minutes", 
                   expected_output: "Stabilization of Node communication." 
                 }
               ]
             }
           });

           await new Promise(r => setTimeout(r, 800));

           sendChunk({
             type: "text",
             content: "The map shows a recursive judgment loop. This anxiety didn't start with her; she is repeating a script."
           });
        } else if (userMessage.toUpperCase().includes('PRICING') || userMessage.toUpperCase().includes('UPGRADE')) {
            // Special case for pricing table
            controller.enqueue(encoder.encode('PRICING_TABLE'));
        } else {
            sendChunk({ 
              type: "text", 
              content: `ACKNOWLEDGED. FRAGMENT_RECEIVED: "${userMessage.toUpperCase()}".` 
            });
            await new Promise(r => setTimeout(r, 500));
            sendChunk({
              type: "text",
              content: "SYSTEM STANDBY. CORE_LOGIC_CONNECTED."
            });
        }

        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('CHAT_ERROR:', error);
    return new Response(JSON.stringify({ error: 'FAILED_TO_PROCESS_FRAGMENT' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
