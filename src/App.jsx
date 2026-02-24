import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [games] = useState(gamesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredGames = useMemo(() => {
    return games.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [games, searchQuery]);

  const toggleFullScreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
        setIsFullScreen(true);
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="asterism-layer"></div>
      <div className="extra-stars"></div>
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-emerald-500/20 px-6 py-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => {
              setSelectedGame(null);
              setSearchQuery('');
            }}
          >
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              GALAXY<span className="text-emerald-400">GAMES</span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-display font-bold">{selectedGame.title}</h2>
                    <span className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">{selectedGame.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullScreen}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Fullscreen
                  </button>
                  <a
                    href={selectedGame.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg transition-colors text-sm font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Original
                  </a>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <iframe
                  id="game-iframe"
                  src={selectedGame.iframeUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>

              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-2">How to Play</h3>
                <p className="text-zinc-400">
                  Use your keyboard or mouse to control the game. Most games use WASD or Arrow keys for movement. 
                  If the game doesn't respond, click inside the game area to focus it.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              {!searchQuery && (
                <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-emerald-500/20 p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                  <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/space/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                  <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest mb-4">
                      <Flame className="w-4 h-4" />
                      Supernova Hits
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
                      Explore the Universe of Unblocked Games
                    </h2>
                    <p className="text-zinc-400 text-lg mb-8">
                      Infinite fun across the galaxy. No downloads, no limits, just pure cosmic entertainment.
                    </p>
                    <button 
                      onClick={() => setSelectedGame(games[0])}
                      className="bg-emerald-500 text-zinc-950 px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                      Launch Slope
                    </button>
                  </div>
                </div>
              )}

              {/* Games Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold">
                    {searchQuery ? `Search results for "${searchQuery}"` : 'All Games'}
                  </h3>
                  <span className="text-sm text-zinc-500">{filteredGames.length} games available</span>
                </div>

                <div className="game-grid">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layout
                      whileHover={{ y: -8 }}
                      onClick={() => setSelectedGame(game)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-emerald-500/50 transition-colors">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full">
                            PLAY NOW
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold group-hover:text-emerald-400 transition-colors">{game.title}</h4>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{game.category}</p>
                    </motion.div>
                  ))}
                </div>

                {filteredGames.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg">No games found matching your search.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
          <p>© 2026 Unblocked Games Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
