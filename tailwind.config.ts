import { fontFamily } from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        panel: '#0A0A0A',
        glass: 'rgba(255,255,255,0.03)',
        border: 'rgba(255,255,255,0.08)',
        primary: '#3b82f6',
        destructive: '#ef4444',
        warning: '#eab308',
        grid_lines: '#1E293B',
        signal_white: '#FFFFFF',
        active_friction: '#EF4444',
        resolved_flow: '#10B981',
        brutalist_slate: '#64748b', // Keeping this for backward compatibility if used
      },
      borderRadius: {
        DEFAULT: '0',
        'sm': '0',
        'md': '0',
        'lg': '0',
        'xl': '0',
        '2xl': '0',
        '3xl': '0',
        'full': '0',
      },
      boxShadow: {
        DEFAULT: 'none',
        'sm': 'none',
        'md': 'none',
        'lg': 'none',
        'xl': 'none',
        '2xl': 'none',
        'inner': 'none',
        'none': 'none',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
