/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void:'#060709',base:'#0D0F14',surface:'#13161D',panel:'#1A1E28',border:'#252A38',muted:'#2E3447',
        text:{primary:'#E8EAF0',secondary:'#8B92A8',dim:'#4A5068'},
        amber:{DEFAULT:'#F59E0B',dim:'#92600A',glow:'#FCD34D',bg:'#1C1505'},
        ice:{DEFAULT:'#38BDF8',dim:'#1E6A8A',glow:'#7DD3FC',bg:'#041520'},
        danger:{DEFAULT:'#EF4444',dim:'#7F1D1D',glow:'#FCA5A5',bg:'#1C0505'},
        success:{DEFAULT:'#22C55E',dim:'#14532D',glow:'#86EFAC',bg:'#041A0C'},
      },
      fontFamily:{display:['Rajdhani','sans-serif'],mono:['DM Mono','monospace'],body:['DM Sans','sans-serif']},
      fontSize:{'2xs':['0.625rem',{lineHeight:'1rem'}]},
      keyframes:{
        'pulse-danger':{'0%,100%':{boxShadow:'0 0 0 0 rgba(239,68,68,0.7)',backgroundColor:'rgba(239,68,68,1)'},'50%':{boxShadow:'0 0 0 20px rgba(239,68,68,0)',backgroundColor:'rgba(220,38,38,1)'}},
        'flash-alert':{'0%,100%':{opacity:'1'},'50%':{opacity:'0.4'}},
        'slide-up':{'0%':{transform:'translateY(16px)',opacity:'0'},'100%':{transform:'translateY(0)',opacity:'1'}},
        'spin-slow':{from:{transform:'rotate(0deg)'},to:{transform:'rotate(360deg)'}},
        breathe:{'0%,100%':{opacity:'0.6',transform:'scale(1)'},'50%':{opacity:'1',transform:'scale(1.05)'}},
      },
      animation:{
        'pulse-danger':'pulse-danger 1.4s ease-in-out infinite',
        'flash-alert':'flash-alert 0.8s ease-in-out infinite',
        'slide-up':'slide-up 0.4s cubic-bezier(0.16,1,0.3,1)',
        'spin-slow':'spin-slow 8s linear infinite',
        breathe:'breathe 3s ease-in-out infinite',
      },
      boxShadow:{
        'glow-amber':'0 0 20px rgba(245,158,11,0.35)',
        'glow-ice':'0 0 20px rgba(56,189,248,0.35)',
        'glow-danger':'0 0 30px rgba(239,68,68,0.5)',
        'glow-success':'0 0 20px rgba(34,197,94,0.35)',
        panel:'0 4px 24px rgba(0,0,0,0.6)',
        deep:'0 8px 48px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins:[],
}
