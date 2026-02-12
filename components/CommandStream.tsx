'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { fetchClinicalAnalysis, BirthDataInput, ClinicalAnalysisResponse } from '@/lib/api'
import Pricing from './Pricing'
import InsightCard from './InsightCard'
import FamilyMap from './FamilyMap'

export default function CommandStream() {
  const { messages: aiMessages, input, handleInputChange, handleSubmit, isLoading: aiLoading } = useChat({
    api: '/api/chat',
    body: {
      context: {
        user_id: "user_123",
        session_id: "session_456",
        current_transits: {
          saturn: { sign: "pisces", house: 10, retrograde: true },
          mars: { sign: "aries", house: 1 }
        },
        family_context: [
          { relation: "Mother", tag: "Critical", line_mechanic: "Line 1" }
        ],
        user_mechanics: {
          type: "Projector",
          authority: "Splenic",
          profile: "5/1"
        }
      }
    }
  })

  const handleAiSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      body: {
        message: input,
      }
    })
  }

  const [manualMessages, setManualMessages] = useState<{ role: 'user' | 'system' | 'result', content: any }[]>([
    { role: 'system', content: '[!] SYSTEM: INITIALIZING SINGLE STREAM INTERFACE...' },
    { role: 'system', content: 'TYPE "HELP" FOR AVAILABLE COMMANDS.' }
  ])
  const [isClinicalLoading, setIsClinicalLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [aiMessages, manualMessages])

  const onCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || aiLoading || isClinicalLoading) return

    const userCommand = input.trim()
    const cmdUpper = userCommand.toUpperCase()

    if (cmdUpper === 'HELP') {
      setManualMessages(prev => [...prev, { role: 'user', content: userCommand }, { role: 'system', content: 'AVAILABLE COMMANDS:\n- ANALYZE "NAME" YYYY-MM-DD HH:MM "CITY" "STATE"\n- UPGRADE\n- CLEAR\n- HELP\n- [ANY TEXT] (Sends to AI Kernel)' }])
      const fakeEvent = { target: { value: '' } } as any
      handleInputChange(fakeEvent)
      return
    }

    if (cmdUpper === 'UPGRADE' || cmdUpper === 'PRICING') {
      setManualMessages(prev => [...prev, { role: 'user', content: userCommand }, { role: 'result', content: 'PRICING_TABLE' }])
      const fakeEvent = { target: { value: '' } } as any
      handleInputChange(fakeEvent)
      return
    }

    if (cmdUpper === 'CLEAR') {
      setManualMessages([{ role: 'system', content: '[!] BUFFER CLEARED.' }])
      const fakeEvent = { target: { value: '' } } as any
      handleInputChange(fakeEvent)
      return
    }

    if (cmdUpper.startsWith('ANALYZE')) {
      const regex = /ANALYZE\s+"([^"]+)"\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+"([^"]+)"\s+"([^"]+)"/i
      const match = userCommand.match(regex)

      if (match) {
        const [_, name, date, time, city, state] = match
        const birthData: BirthDataInput = { name, date, time, city, state }
        
        setManualMessages(prev => [...prev, { role: 'user', content: userCommand }])
        setIsClinicalLoading(true)
        setManualMessages(prev => [...prev, { role: 'system', content: `DEFRAGMENTING PROFILE: ${name.toUpperCase()}...` }])
        
        try {
          const result = await fetchClinicalAnalysis(birthData)
          setManualMessages(prev => [...prev, { role: 'result', content: result }])
        } catch (error: any) {
          setManualMessages(prev => [...prev, { role: 'system', content: `[!] ERROR: ${error.message.toUpperCase()}` }])
        } finally {
          setIsClinicalLoading(false)
          const fakeEvent = { target: { value: '' } } as any
          handleInputChange(fakeEvent)
        }
      } else {
        setManualMessages(prev => [...prev, { role: 'user', content: userCommand }, { role: 'system', content: 'INVALID SYNTAX. USE: ANALYZE "NAME" YYYY-MM-DD HH:MM "CITY" "STATE"' }])
        const fakeEvent = { target: { value: '' } } as any
        handleInputChange(fakeEvent)
      }
      return
    }

    // Default: Send to AI Kernel
    handleAiSubmit(e)
  }

  const renderAiMessage = (m: any) => {
    const content = m.content;
    if (content === 'PRICING_TABLE') return <Pricing />;
    
    // If it looks like JSON chunks (common in our new API spec)
    if (content.includes('{"type":') || content.includes('{"tool":')) {
      const lines = content.split('\n').filter((l: string) => l.trim());
      return (
        <div className="flex flex-col gap-y-4">
          {lines.map((line: string, idx: number) => {
            try {
              // Basic check to see if it's a complete JSON object
              if (!line.startsWith('{') || !line.endsWith('}')) {
                return null;
              }
              const data = JSON.parse(line);
              if (data.type === 'text' || data.type === 'delta') {
                return <span key={idx} className="whitespace-pre-wrap inline">{data.content || data.text}</span>;
              }
              if (data.type === 'error') {
                return <div key={idx} className="border-2 border-red-500 p-2 text-red-500 font-bold bg-red-500/10">
                  [!] SYSTEM_ERROR: {data.content || data.message}
                </div>;
              }
              if (data.type === 'tool_call') {
                if (data.tool === 'generate_insight_card') {
                  return <InsightCard key={idx} {...data.props} />;
                }
                if (data.tool === 'generate_family_map') {
                  return <FamilyMap key={idx} {...data.props} />;
                }
              }
              return null;
            } catch (e) {
              // Not valid JSON yet or not JSON at all
              return <div key={idx} className="whitespace-pre-wrap">{line}</div>;
            }
          })}
        </div>
      );
    }

    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  const renderResult = (result: ClinicalAnalysisResponse) => {
    return (
      <div className="border-2 border-white p-4 my-2 bg-white text-black font-mono">
        <div className="font-bold border-b-2 border-black mb-4 pb-2 text-xl tracking-tighter uppercase">
          Protocol Output: Synthesis
        </div>
        <p className="mb-6 text-sm leading-tight border-l-4 border-black pl-3 py-1">{result.synthesis}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="font-bold border-b border-black mb-3 pb-1 text-xs uppercase tracking-widest">
              Hardware Alignment (Planetary)
            </div>
            <div className="text-[10px] space-y-1">
              {Object.entries(result.planets).map(([name, pos]) => (
                <div key={name} className="flex justify-between border-b border-black/20 pb-0.5">
                  <span className="font-bold">{name.toUpperCase()}</span>
                  <span>{pos.sign.toUpperCase()} {pos.gate}.{pos.line} ({pos.longitude.toFixed(2)}°)</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-bold border-b border-black mb-3 pb-1 text-xs uppercase tracking-widest">
              Data Metrics
            </div>
            <div className="text-[10px] space-y-3">
              <div className="flex justify-between border-b border-black pb-1">
                <span>SYSTEM INDEX</span>
                <span className="bg-black text-white px-1 font-bold">{result.numerology.life_path_number}</span>
              </div>
              <div className="flex justify-between border-b border-black pb-1">
                <span>CORE FREQUENCY</span>
                <span className="font-bold">{result.numerology.sun_sign.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white font-mono p-4 md:p-8 overflow-hidden border-[8px] border-white">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end border-b-4 border-white pb-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter leading-none">
            DEFRAG<span className="text-brutalist_slate">_</span>CORE
          </h1>
          <p className="text-[10px] md:text-xs mt-1 text-brutalist_slate font-bold uppercase tracking-[0.2em]">
            Status: Connection_Stable | Protocol: CLI_BRUTAL_V2
          </p>
        </div>
        <div className="text-right text-[10px] md:text-xs font-bold bg-white text-black px-2 py-1">
          {new Date().toISOString().replace('T', ' ').slice(0, 19)}
        </div>
      </div>

      {/* Message Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 scrollbar-hide"
      >
        {manualMessages.map((m, i) => (
          <div key={`manual-${i}`} className="flex flex-col">
            {m.role !== 'result' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 ${
                    m.role === 'user' ? 'bg-white text-black' : 'bg-brutalist_slate text-white'
                  }`}>
                    {m.role === 'user' ? 'USR_INPUT' : 'SYS_LOG'}
                  </span>
                </div>
                <div className={`pl-4 border-l-4 ${
                  m.role === 'user' ? 'border-white' : 'border-brutalist_slate text-brutalist_slate'
                } whitespace-pre-wrap text-sm md:text-base`}>
                  {m.content}
                </div>
              </>
            )}
            {m.role === 'result' && (
              m.content === 'PRICING_TABLE' ? <Pricing /> : renderResult(m.content)
            )}
          </div>
        ))}

        {aiMessages.map((m, i) => (
          <div key={`ai-${i}`} className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-black px-2 py-0.5 ${
                m.role === 'user' ? 'bg-white text-black' : 'bg-brutalist_slate text-white'
              }`}>
                {m.role === 'user' ? 'USR_INPUT' : 'KERNEL_OUT'}
              </span>
            </div>
            <div className={`pl-4 border-l-4 ${
              m.role === 'user' ? 'border-white' : 'border-brutalist_slate text-brutalist_slate'
            } text-sm md:text-base`}>
              {renderAiMessage(m)}
            </div>
          </div>
        ))}
        
        {(aiLoading || isClinicalLoading) && (
          <div className="flex items-center gap-3 pl-4">
            <span className="animate-spin font-black text-lg">/</span>
            <span className="text-xs font-black tracking-widest text-white bg-brutalist_slate px-2">
              PROCESSING FRAGMENTS...
            </span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onCommandSubmit} className="relative mt-auto pt-6 border-t-4 border-white">
        <div className="flex items-center bg-white/5 p-2">
          <span className="text-white font-black text-xl mr-4">{'>'}</span>
          <input
            className="flex-1 bg-transparent outline-none border-none text-white font-mono placeholder-white/20 uppercase text-lg"
            value={input}
            onChange={handleInputChange}
            placeholder="ENTER COMMAND OR DATA FRAGMENT"
            autoFocus
          />
        </div>
      </form>
    </div>
  )
}
