'use client'

import { motion } from 'framer-motion'

export default function ScanLine() {
  return (
    <motion.div
      initial={{ top: '-10%' }}
      animate={{ top: '110%' }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="fixed left-0 right-0 h-[2px] bg-signal_white opacity-40 z-50 pointer-events-none blur-[1px]"
      style={{
        boxShadow: '0 0 15px 2px rgba(255, 255, 255, 0.5)',
      }}
    />
  )
}
