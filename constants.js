// Thème et constantes globales

export const COLORS = {
  background: '#0a0a0f',
  surface: '#12121a',
  surfaceLight: '#1a1a26',
  border: '#2a2a3d',
  primary: '#00ff88',
  primaryDim: '#00ff8822',
  accent: '#ff3366',
  accentDim: '#ff336622',
  gold: '#ffd700',
  text: '#ffffff',
  textMuted: '#8888aa',
  textDim: '#44445a',

  // Couleurs des serpents joueurs (20 joueurs max)
  snakeColors: [
    '#00ff88', // Vert néon
    '#ff3366', // Rose
    '#00aaff', // Bleu
    '#ffaa00', // Orange
    '#aa00ff', // Violet
    '#ff6600', // Orange foncé
    '#00ffff', // Cyan
    '#ff00aa', // Magenta
    '#88ff00', // Chartreuse
    '#ff0044', // Rouge
    '#0044ff', // Bleu roi
    '#ffff00', // Jaune
    '#ff44ff', // Orchidée
    '#00ff44', // Vert clair
    '#ff8800', // Ambre
    '#4400ff', // Indigo
    '#ff4400', // Rouge-orange
    '#00ffbb', // Turquoise
    '#bb00ff', // Améthyste
    '#ffbb00', // Ambre clair
  ],
};

export const GRID_SIZE = 20; // Taille de la grille (20x20)
export const CELL_SIZE = 16; // Pixels par cellule (calculé dynamiquement)
export const GAME_SPEED = 150; // ms entre chaque tick (côté serveur)

export const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

export const GAME_STATES = {
  MENU: 'MENU',
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  DEAD: 'DEAD',
  GAME_OVER: 'GAME_OVER',
};

export const MAX_PLAYERS = 20;
export const MIN_PLAYERS_TO_START = 2;
