import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Cyberpunk Horizon",
    artist: "Neon Circuit",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo URL
    color: "cyan"
  },
  {
    id: 2,
    title: "Midnight Express",
    artist: "Vapor Weaver",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "pink"
  },
  {
    id: 3,
    title: "Binary Dreams",
    artist: "Synth Echo",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "indigo"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto neon-border bg-zinc-900/50 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group">
      {/* Background glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 transition-colors duration-700 ${
        currentTrack.color === 'cyan' ? 'bg-cyan-500' : 
        currentTrack.color === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'
      }`} />

      <div className="flex items-center gap-6">
        {/* Album Art Placeholder */}
        <div className={`w-24 h-24 rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-500 ${
          isPlaying ? 'scale-105 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'scale-100 shadow-none'
        } ${
          currentTrack.color === 'cyan' ? 'bg-cyan-950/50' : 
          currentTrack.color === 'pink' ? 'bg-pink-950/50' : 'bg-indigo-950/50'
        }`}>
          <div className={`absolute inset-0 opacity-10 bg-grid-white`} />
          <Music className={`w-10 h-10 transition-colors duration-500 ${
            currentTrack.color === 'cyan' ? 'text-cyan-400' : 
            currentTrack.color === 'pink' ? 'text-pink-400' : 'text-indigo-400'
          } ${isPlaying ? 'animate-bounce' : ''}`} />
          
          {/* Visualizer bars */}
          {isPlaying && (
            <div className="absolute bottom-2 flex gap-1 items-end h-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, Math.random() * 24 + 4, 4] }}
                  transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                  className={`w-1 rounded-full ${
                    currentTrack.color === 'cyan' ? 'bg-cyan-400' : 
                    currentTrack.color === 'pink' ? 'bg-pink-400' : 'bg-indigo-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <h3 className="text-xl font-bold truncate tracking-tight">{currentTrack.title}</h3>
              <p className="text-zinc-500 text-sm truncate font-mono uppercase tracking-widest">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-4">
            <button onClick={prevTrack} className="hover:text-cyan-400 transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentTrack.color === 'cyan' ? 'bg-cyan-500' : 
                currentTrack.color === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'
              } text-black shadow-lg hover:scale-105 active:scale-95`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={nextTrack} className="hover:text-cyan-400 transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={false}
            animate={{ width: `${progress}%` }}
            className={`h-full transition-all duration-300 ${
              currentTrack.color === 'cyan' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 
              currentTrack.color === 'pink' ? 'bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'
            }`}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-zinc-600 font-mono">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : "0:00"}</span>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
