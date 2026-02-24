let games = [];
let searchQuery = '';
let selectedGame = null;

const mainContent = document.getElementById('main-content');
const searchInput = document.getElementById('search-input');
const logo = document.getElementById('logo');

// Fetch games from JSON
async function fetchGames() {
  try {
    const response = await fetch('src/games.json');
    games = await response.json();
    render();
  } catch (error) {
    console.error('Error fetching games:', error);
    mainContent.innerHTML = `<p class="text-center text-red-500">Error loading games. Please check if src/games.json exists.</p>`;
  }
}

function render() {
  if (selectedGame) {
    renderPlayer();
  } else {
    renderGrid();
  }
  // Re-initialize Lucide icons
  lucide.createIcons();
}

function renderGrid() {
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let html = '';

  // Hero Section
  if (!searchQuery && games.length > 0) {
    html += `
      <div class="relative rounded-3xl overflow-hidden bg-zinc-900 border border-emerald-500/20 p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.05)] mb-8">
        <div class="absolute inset-0 bg-[url('https://picsum.photos/seed/space/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div class="relative z-10 max-w-2xl">
          <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest mb-4">
            <i data-lucide="flame" class="w-4 h-4"></i>
            Supernova Hits
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight font-display">
            Explore the Universe of Unblocked Games
          </h2>
          <p class="text-zinc-400 text-lg mb-8">
            Infinite fun across the galaxy. No downloads, no limits, just pure cosmic entertainment.
          </p>
          <button 
            onclick="selectGameById('${games[0].id}')"
            class="bg-emerald-500 text-zinc-950 px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Launch ${games[0].title}
          </button>
        </div>
      </div>
    `;
  }

  html += `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold font-display">
          ${searchQuery ? `Search results for "${searchQuery}"` : 'All Games'}
        </h3>
        <span class="text-sm text-zinc-500">${filteredGames.length} games available</span>
      </div>

      <div class="game-grid">
        ${filteredGames.map(game => `
          <div onclick="selectGameById('${game.id}')" class="group cursor-pointer">
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-emerald-500/50 transition-colors">
              <img
                src="${game.thumbnail}"
                alt="${game.title}"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerpolicy="no-referrer"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span class="bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full">
                  PLAY NOW
                </span>
              </div>
            </div>
            <h4 class="font-bold group-hover:text-emerald-400 transition-colors">${game.title}</h4>
            <p class="text-xs text-zinc-500 uppercase tracking-wider font-semibold">${game.category}</p>
          </div>
        `).join('')}
      </div>

      ${filteredGames.length === 0 ? `
        <div class="text-center py-20">
          <p class="text-zinc-500 text-lg">No games found matching your search.</p>
        </div>
      ` : ''}
    </div>
  `;

  mainContent.innerHTML = html;
}

function renderPlayer() {
  mainContent.innerHTML = `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            onclick="closeGame()"
            class="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
          <div>
            <h2 class="text-2xl font-bold font-display">${selectedGame.title}</h2>
            <span class="text-sm text-zinc-500 uppercase tracking-wider font-semibold">${selectedGame.category}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            onclick="toggleFullScreen()"
            class="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm font-medium"
          >
            <i data-lucide="maximize-2" class="w-4 h-4"></i>
            Fullscreen
          </button>
          <a
            href="${selectedGame.iframeUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg transition-colors text-sm font-bold"
          >
            <i data-lucide="external-link" class="w-4 h-4"></i>
            Open Original
          </a>
        </div>
      </div>

      <div class="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
        <iframe
          id="game-iframe"
          src="${selectedGame.iframeUrl}"
          class="absolute inset-0 w-full h-full border-0"
          allow="fullscreen; autoplay; encrypted-media"
          title="${selectedGame.title}"
        ></iframe>
      </div>

      <div class="bg-zinc-900/50 border border-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h3 class="text-lg font-bold mb-2">How to Play</h3>
        <p class="text-zinc-400">
          Use your keyboard or mouse to control the game. Most games use WASD or Arrow keys for movement. 
          If the game doesn't respond, click inside the game area to focus it.
        </p>
      </div>
    </div>
  `;
}

// Global functions for event listeners
window.selectGameById = (id) => {
  selectedGame = games.find(g => g.id === id);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.closeGame = () => {
  selectedGame = null;
  render();
};

window.toggleFullScreen = () => {
  const iframe = document.getElementById('game-iframe');
  if (iframe) {
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
};

// Event Listeners
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  selectedGame = null;
  render();
});

logo.addEventListener('click', () => {
  selectedGame = null;
  searchQuery = '';
  searchInput.value = '';
  render();
});

// Initial load
fetchGames();
