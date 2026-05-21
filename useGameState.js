import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { GAME_STATES, DIRECTIONS } from '../utils/constants';

export function useGameState() {
  const { emit, on, off } = useSocket();

  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [roomId, setRoomId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null); // { snakes, food, scores }
  const [countdown, setCountdown] = useState(null);
  const [rank, setRank] = useState(null);
  const [error, setError] = useState(null);

  const lastDirectionRef = useRef(DIRECTIONS.RIGHT);

  // ── Événements serveur ─────────────────────────────────────────────────────

  useEffect(() => {
    const cleanups = [];

    // Rejoindre salle réussie
    cleanups.push(on('room:joined', ({ roomId, playerId, players }) => {
      setRoomId(roomId);
      setPlayerId(playerId);
      setPlayers(players);
      setGameState(GAME_STATES.LOBBY);
      setError(null);
    }));

    // Mise à jour de la liste des joueurs dans le lobby
    cleanups.push(on('room:players_updated', ({ players }) => {
      setPlayers(players);
    }));

    // Compte à rebours avant le début
    cleanups.push(on('game:countdown', ({ count }) => {
      setCountdown(count);
    }));

    // Début de la partie
    cleanups.push(on('game:start', (initialData) => {
      setCountdown(null);
      setGameData(initialData);
      setGameState(GAME_STATES.PLAYING);
    }));

    // Tick du jeu (état mis à jour à chaque tick serveur)
    cleanups.push(on('game:tick', (data) => {
      setGameData(data);
    }));

    // Le joueur est mort
    cleanups.push(on('game:player_died', ({ rank: deathRank }) => {
      setRank(deathRank);
      setGameState(GAME_STATES.DEAD);
    }));

    // Fin de partie
    cleanups.push(on('game:over', ({ winners, scores }) => {
      setGameData(prev => ({ ...prev, scores }));
      setGameState(GAME_STATES.GAME_OVER);
    }));

    // Erreur
    cleanups.push(on('error', ({ message }) => {
      setError(message);
    }));

    return () => cleanups.forEach(fn => typeof fn === 'function' && fn());
  }, [on]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const joinRoom = useCallback((name, roomCode = null) => {
    setPlayerName(name);
    emit('room:join', { name, roomCode });
  }, [emit]);

  const createRoom = useCallback((name) => {
    setPlayerName(name);
    emit('room:create', { name });
  }, [emit]);

  const leaveRoom = useCallback(() => {
    emit('room:leave');
    setGameState(GAME_STATES.MENU);
    setRoomId(null);
    setPlayers([]);
    setGameData(null);
  }, [emit]);

  const startGame = useCallback(() => {
    emit('game:start_request');
  }, [emit]);

  const changeDirection = useCallback((direction) => {
    // Empêcher le demi-tour immédiat
    const opposites = {
      [DIRECTIONS.UP]: DIRECTIONS.DOWN,
      [DIRECTIONS.DOWN]: DIRECTIONS.UP,
      [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
      [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
    };
    if (opposites[direction] === lastDirectionRef.current) return;
    lastDirectionRef.current = direction;
    emit('game:direction', { direction });
  }, [emit]);

  const returnToLobby = useCallback(() => {
    setGameState(GAME_STATES.LOBBY);
    setGameData(null);
    setRank(null);
    emit('game:return_lobby');
  }, [emit]);

  return {
    // État
    gameState,
    roomId,
    playerId,
    playerName,
    players,
    gameData,
    countdown,
    rank,
    error,
    // Actions
    joinRoom,
    createRoom,
    leaveRoom,
    startGame,
    changeDirection,
    returnToLobby,
  };
}
