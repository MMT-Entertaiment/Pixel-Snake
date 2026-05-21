
const { Server } = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 3000;
const GRID_SIZE = 20;
const GAME_SPEED = 150;
const MAX_PLAYERS = 20;
const FOOD_COUNT = 5;

function randomPos() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

function generateId(len = 4) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

const SNAKE_COLORS = [
  '#00ff88', '#ff3366', '#00aaff', '#ffaa00', '#aa00ff',
  '#ff6600', '#00ffff', '#ff00aa', '#88ff00', '#ff0044',
  '#0044ff', '#ffff00', '#ff44ff', '#00ff44', '#ff8800',
  '#4400ff', '#ff4400', '#00ffbb', '#bb00ff', '#ffbb00',
];

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const rooms = new Map();

class Room {
  constructor(id) {
    this.id = id;
    this.players = new Map();
    this.gameInterval = null;
    this.food = [];
    this.scores = {};
    this.state = 'lobby';
    this.colorIndex = 0;
  }

  addPlayer(socket, name) {
    const color = SNAKE_COLORS[this.colorIndex % SNAKE_COLORS.length];
    this.colorIndex++;
    this.players.set(socket.id, {
      id: socket.id, name, color, socket,
      body: [], direction: 'RIGHT', nextDirection: 'RIGHT',
      alive: true, score: 0,
    });
    this.scores[socket.id] = 0;
  }

  removePlayer(socketId) {
    this.players.delete(socketId);
    delete this.scores[socketId];
  }

  getPublicPlayers() {
    return Array.from(this.players.values()).map(p => ({
      id: p.id, name: p.name, color: p.color,
      alive: p.alive, score: p.score,
    }));
  }

  startGame() {
    this.state = 'playing';
    this.food = Array.from({ length: FOOD_COUNT }, randomPos);
    const playerList = Array.from(this.players.values());
    playerList.forEach((player, i) => {
      const startX = 2 + (i % 5) * 3;
      const startY = 2 + Math.floor(i / 5) * 4;
      player.body = [{ x: startX, y: startY }, { x: startX - 1, y: startY }];
      player.direction = 'RIGHT';
      player.nextDirection = 'RIGHT';
      player.alive = true;
      player.score = 0;
    });
    this.scores = {};
    playerList.forEach(p => { this.scores[p.id] = 0; });
    playerList.forEach(p => p.socket.emit('game:start', this.getGameData()));
    this.gameInterval = setInterval(() => this.tick(), GAME_SPEED);
  }

  tick() {
    const players = Array.from(this.players.values());
    const alivePlayers = players.filter(p => p.alive);
    if (alivePlayers.length <= 1) { this.endGame(); return; }

    alivePlayers.forEach(player => { player.direction = player.nextDirection; });

    alivePlayers.forEach(player => {
      const head = player.body[0];
      const dir = DIRECTIONS[player.direction];
      const newHead = {
        x: (head.x + dir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + dir.y + GRID_SIZE) % GRID_SIZE,
      };

      const selfCollide = player.body.some(s => s.x === newHead.x && s.y === newHead.y);
      if (selfCollide) {
        player.alive = false;
        player.socket.emit('game:player_died', { rank: alivePlayers.filter(p => p.alive).length + 1 });
        return;
      }

      for (const other of players) {
        if (other.id === player.id) continue;
        for (const seg of other.body) {
          if (seg.x === newHead.x && seg.y === newHead.y) {
            player.alive = false;
            player.socket.emit('game:player_died', { rank: alivePlayers.filter(p => p.alive).length + 1 });
            return;
          }
        }
      }

      player.body.unshift(newHead);
      const foodIndex = this.food.findIndex(f => f.x === newHead.x && f.y === newHead.y);
      if (foodIndex !== -1) {
        player.score += 10;
        this.scores[player.id] = player.score;
        this.food.splice(foodIndex, 1);
        this.food.push(randomPos());
      } else {
        player.body.pop();
      }
    });

    players.forEach(p => p.socket.emit('game:tick', this.getGameData()));
  }

  getGameData() {
    return {
      snakes: Array.from(this.players.values()).map(p => ({
        id: p.id, color: p.color, body: p.body, alive: p.alive,
      })),
      food: this.food,
      scores: this.scores,
    };
  }

  endGame() {
    clearInterval(this.gameInterval);
    this.gameInterval = null;
    this.state = 'lobby';
    Array.from(this.players.values()).forEach(p => p.socket.emit('game:over', { scores: this.scores }));
  }

  isEmpty() { return this.players.size === 0; }
}

const httpServer = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Snake Multiplayer Server 🐍');
});

const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  let currentRoom = null;

  socket.on('room:create', ({ name }) => {
    const roomId = generateId(4);
    const room = new Room(roomId);
    rooms.set(roomId, room);
    room.addPlayer(socket, name);
    socket.join(roomId);
    currentRoom = room;
    socket.emit('room:joined', { roomId, playerId: socket.id, players: room.getPublicPlayers() });
  });

  socket.on('room:join', ({ name, roomCode }) => {
    let room = roomCode ? rooms.get(roomCode) : null;
    if (!room) {
      for (const [, r] of rooms) {
        if (r.state === 'lobby' && r.players.size < MAX_PLAYERS) { room = r; break; }
      }
    }
    if (!room) { const roomId = generateId(4); room = new Room(roomId); rooms.set(roomId, room); }
    if (room.players.size >= MAX_PLAYERS) { socket.emit('error', { message: 'Salle pleine !' }); return; }
    room.addPlayer(socket, name);
    socket.join(room.id);
    currentRoom = room;
    socket.emit('room:joined', { roomId: room.id, playerId: socket.id, players: room.getPublicPlayers() });
    socket.to(room.id).emit('room:players_updated', { players: room.getPublicPlayers() });
  });

  socket.on('room:leave', () => {
    if (!currentRoom) return;
    currentRoom.removePlayer(socket.id);
    socket.leave(currentRoom.id);
    socket.to(currentRoom.id).emit('room:players_updated', { players: currentRoom.getPublicPlayers() });
    if (currentRoom.isEmpty()) rooms.delete(currentRoom.id);
    currentRoom = null;
  });

  socket.on('game:start_request', () => {
    if (!currentRoom || currentRoom.state !== 'lobby') return;
    const host = Array.from(currentRoom.players.values())[0];
    if (host.id !== socket.id) return;
    let count = 3;
    io.to(currentRoom.id).emit('game:countdown', { count });
    const cd = setInterval(() => {
      count--;
      if (count <= 0) { clearInterval(cd); currentRoom.startGame(); }
      else io.to(currentRoom.id).emit('game:countdown', { count });
    }, 1000);
  });

  socket.on('game:direction', ({ direction }) => {
    if (!currentRoom) return;
    const player = currentRoom.players.get(socket.id);
    if (!player || !player.alive) return;
    const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (opposites[direction] !== player.direction) player.nextDirection = direction;
  });

  socket.on('disconnect', () => {
    if (currentRoom) {
      currentRoom.removePlayer(socket.id);
      socket.to(currentRoom.id).emit('room:players_updated', { players: currentRoom.getPublicPlayers() });
      if (currentRoom.isEmpty()) rooms.delete(currentRoom.id);
    }
  });
});

httpServer.listen(PORT, () => console.log(`🐍 Serveur Snake démarré sur le port ${PORT}`));
