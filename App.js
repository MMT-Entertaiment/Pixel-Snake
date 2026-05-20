import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { useGameState } from './src/hooks/useGameState';
import { GAME_STATES, COLORS } from './src/utils/constants';

import MenuScreen from './src/screens/MenuScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  const {
    gameState,
    roomId,
    playerId,
    playerName,
    players,
    gameData,
    countdown,
    rank,
    error,
    joinRoom,
    createRoom,
    leaveRoom,
    startGame,
    changeDirection,
    returnToLobby,
  } = useGameState();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="light" />

        {gameState === GAME_STATES.MENU && (
          <MenuScreen
            onJoin={joinRoom}
            onCreate={createRoom}
            error={error}
          />
        )}

        {gameState === GAME_STATES.LOBBY && (
          <LobbyScreen
            roomId={roomId}
            players={players}
            playerId={playerId}
            onStart={startGame}
            onLeave={leaveRoom}
            countdown={countdown}
          />
        )}

        {(gameState === GAME_STATES.PLAYING ||
          gameState === GAME_STATES.DEAD ||
          gameState === GAME_STATES.GAME_OVER) && (
          <GameScreen
            gameData={gameData}
            playerId={playerId}
            players={players}
            gameState={gameState}
            rank={rank}
            onDirection={changeDirection}
            onReturnToLobby={returnToLobby}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
