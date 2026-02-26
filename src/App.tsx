/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Flame, Skull } from 'lucide-react';

type Joke = {
  type: string;
  setup: string;
  punchline: string;
  id: number;
};

type AppState = 'IDLE' | 'FETCHING' | 'SETUP_REVEAL' | 'SUSPENSE' | 'PUNCHLINE_REVEAL';

export default function App() {
  const [state, setState] = useState<AppState>('IDLE');
  const [joke, setJoke] = useState<Joke | null>(null);

  const fetchJoke = async () => {
    setState('FETCHING');
    try {
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      const data = await res.json();
      setJoke(data);
      
      // Wait a bit for dramatic effect
      setTimeout(() => {
        setState('SETUP_REVEAL');
      }, 2000);
    } catch (err) {
      console.error(err);
      setState('IDLE');
      alert('THE COMEDY GODS ARE ANGRY! TRY AGAIN!');
    }
  };

  useEffect(() => {
    if (state === 'SETUP_REVEAL') {
      const timer = setTimeout(() => {
        setState('SUSPENSE');
      }, 3000); // Show setup for 3 seconds
      return () => clearTimeout(timer);
    }
    
    if (state === 'SUSPENSE') {
      const timer = setTimeout(() => {
        setState('PUNCHLINE_REVEAL');
      }, 2500); // Suspense for 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {state === 'IDLE' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.1, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(20px)', rotate: 180 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="flex flex-col items-center z-10"
          >
            <motion.h1 
              animate={{ 
                textShadow: ["0px 0px 10px #ef4444", "0px 0px 50px #eab308", "0px 0px 10px #ef4444"],
                scale: [1, 1.05, 1]
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-5xl md:text-8xl font-black mb-12 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-center"
            >
              ARE YOU READY?
            </motion.h1>
            <button
              onClick={fetchJoke}
              className="group relative px-8 py-6 md:px-12 md:py-8 bg-red-600 hover:bg-red-500 text-white font-black text-3xl md:text-6xl rounded-full uppercase tracking-widest overflow-hidden transition-all hover:scale-125 hover:rotate-3 hover:shadow-[0_0_100px_rgba(220,38,38,1)] active:scale-90 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2 md:gap-4">
                <Flame className="w-10 h-10 md:w-16 md:h-16 group-hover:animate-bounce text-yellow-300" />
                Tell Me A Joke
                <Flame className="w-10 h-10 md:w-16 md:h-16 group-hover:animate-bounce text-yellow-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_0.5s_infinite]" />
            </button>
          </motion.div>
        )}

        {state === 'FETCHING' && (
          <motion.div
            key="fetching"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, rotate: 720 }}
            className="flex flex-col items-center z-10"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.5, 1],
                filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
              }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            >
              <Zap className="w-40 h-40 md:w-64 md:h-64 text-yellow-400 drop-shadow-[0_0_50px_rgba(250,204,21,1)]" />
            </motion.div>
            <motion.h2
              animate={{ 
                scale: [1, 1.2, 1],
                x: [-10, 10, -10],
                y: [-10, 10, -10]
              }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="text-4xl md:text-7xl font-black mt-12 text-yellow-400 tracking-widest text-center drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] px-4"
            >
              SUMMONING...
            </motion.h2>
          </motion.div>
        )}

        {state === 'SETUP_REVEAL' && joke && (
          <motion.div
            key="setup"
            initial={{ scale: 5, opacity: 0, rotateZ: 45 }}
            animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
            exit={{ scale: 0, opacity: 0, filter: 'blur(50px)' }}
            transition={{ type: "spring", damping: 8, stiffness: 150 }}
            className="max-w-6xl text-center px-4 md:px-8 z-10"
          >
            <motion.h2 
              animate={{
                x: [-5, 5, -5],
                y: [-5, 5, -5]
              }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
            >
              {joke.setup}
            </motion.h2>
          </motion.div>
        )}

        {state === 'SUSPENSE' && (
          <motion.div
            key="suspense"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [1, 2, 4, 10, 30], 
              opacity: [1, 1, 1, 0.8, 0],
              rotate: [0, -10, 20, -30, 50]
            }}
            transition={{ duration: 2.5, ease: "easeIn" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <h2 className="text-7xl md:text-9xl lg:text-[15rem] font-black text-red-600 tracking-tighter drop-shadow-[0_0_100px_rgba(220,38,38,1)] whitespace-nowrap">
              WAIT FOR IT...
            </h2>
          </motion.div>
        )}

        {state === 'PUNCHLINE_REVEAL' && joke && (
          <motion.div
            key="punchline"
            initial={{ scale: 0, rotate: 720 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="flex flex-col items-center justify-center text-center px-4 z-30 w-full h-full"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 0.9, 1.1, 1],
                rotate: [-5, 5, -5, 5, 0],
                x: [-20, 20, -20, 20, 0],
                y: [-20, 20, -20, 20, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.15 }}
              className="w-full max-w-7xl"
            >
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-red-500 to-purple-600 drop-shadow-[0_0_50px_rgba(255,255,255,1)] uppercase leading-none mb-16 mix-blend-hard-light">
                {joke.punchline}
              </h1>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, type: "spring", bounce: 0.8 }}
              onClick={() => setState('IDLE')}
              className="px-8 py-4 md:px-12 md:py-6 bg-white text-black font-black text-3xl md:text-5xl rounded-full hover:bg-yellow-300 transition-colors uppercase tracking-widest cursor-pointer shadow-[0_0_50px_rgba(255,255,255,0.8)] hover:scale-110 active:scale-95 flex items-center gap-4"
            >
              <Skull className="w-8 h-8 md:w-12 md:h-12 animate-pulse" />
              ANOTHER ONE!
              <Skull className="w-8 h-8 md:w-12 md:h-12 animate-pulse" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extreme background effects for punchline */}
      {state === 'PUNCHLINE_REVEAL' && (
        <motion.div
          animate={{ 
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#000000'],
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute inset-0 pointer-events-none z-0 opacity-50 mix-blend-overlay"
        />
      )}
      
      {/* Strobe effect */}
      {state === 'PUNCHLINE_REVEAL' && (
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.05 }}
          className="absolute inset-0 bg-white pointer-events-none z-10 mix-blend-difference"
        />
      )}

      {/* Flashing Lights Warning */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-50 pointer-events-none px-4">
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="text-red-500 font-black text-xs md:text-xl uppercase tracking-[0.1em] md:tracking-[0.5em] drop-shadow-[0_0_10px_rgba(255,0,0,1)] bg-black/50 py-2 px-4 rounded-lg inline-block backdrop-blur-sm"
        >
          ⚠️ WARNING: FLASHING LIGHTS AND EXTREME EFFECTS ⚠️
        </motion.p>
      </div>
    </div>
  );
}
