import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameCanvas from '../components/GameCanvas';
import Joystick from '../components/Joystick';
import { COLORS } from '../utils/constants';

export default function GameScreen({
  gameData,
  playerId,
  players,
  gameState,
  rank,
  onDirection,
  onReturnToLobby,
}) {
  const isAlive = gameState === 'PLAYING';
  const isDead = gameState === 'DEAD';
  const isGameOver = gameState === 'GAME_OVER';

  const myScore = gameData?.scores?.[playerId] ?? 0;
  const sortedScores = gameData?.scores
    ? Object.entries(gameData.scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  return (
    <View style={styles.container}>
      {/* HUD supérieur */}
      <View style={styles.hud}>
        <View style={styles.hudLeft}>
          <Text style={styles.hudLabel}>SCORE</Text>
          <Text style={styles.hudValue}>{myScore}</Text>
        </View>
        <View style={styles.hudCenter}>
          <Text style={styles.hudPlayers}>
            🐍 {players.filter(p => p.alive).length}/{players.length}
          </Text>
        </View>
        <View style={styles.hudRight}>
          {sortedScores.slice(0, 1).map(([pid, score]) => {
            const player = players.find(p => p.id === pid);
            return (
              <View key={pid}>
                <Text style={styles.hudLabel}>LEADER</Text>
                <Text style={[styles.hudValue, { color: COLORS.gold }]}>
                  {player?.name ?? '?'} {score}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Canvas */}
      <GameCanvas gameData={gameData} playerId={playerId} />

      {/* Overlay mort */}
      {isDead && (
        <View style={styles.overlay}>
          <Text style={styles.overlayEmoji}>💀</Text>
          <Text style={styles.overlayTitle}>MORT</Text>
          <Text style={styles.overlayRank}>#{rank} place</Text>
          <Text style={styles.overlayScore}>{myScore} pts</Text>
          <Text style={styles.overlayHint}>Tu observes la partie...</Text>
        </View>
      )}

      {/* Overlay fin de partie */}
      {isGameOver && (
        <View style={styles.overlay}>
          <Text style={styles.overlayEmoji}>🏆</Text>
          <Text style={styles.overlayTitle}>PARTIE TERMINÉE</Text>
          <View style={styles.scoreList}>
            {sortedScores.map(([pid, score], i) => {
              const player = players.find(p => p.id === pid);
              const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
              return (
                <View key={pid} style={styles.scoreRow}>
                  <Text style={styles.medal}>{medals[i] ?? `${i + 1}.`}</Text>
                  <Text style={[
                    styles.scoreName,
                    pid === playerId && { color: COLORS.primary },
                  ]}>
                    {player?.name ?? '?'}
                  </Text>
                  <Text style={styles.scorePoints}>{score} pts</Text>
                </View>
              );
            })}
          </View>
          <TouchableOpacity style={styles.lobbyBtn} onPress={onReturnToLobby}>
            <Text style={styles.lobbyBtnText}>🔄 RETOUR AU LOBBY</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contrôles joystick */}
      {isAlive && (
        <View style={styles.controls}>
          <Joystick onDirection={onDirection} />
        </View>
      )}

      {!isAlive && !isGameOver && (
        <View style={styles.controls}>
          <Text style={styles.spectating}>👁 Mode spectateur</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 52,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  hud: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hudLeft: {},
  hudCenter: { alignItems: 'center' },
  hudRight: { alignItems: 'flex-end' },
  hudLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textDim,
    letterSpacing: 2,
  },
  hudValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  hudPlayers: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  // Overlay
  overlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#0a0a0fee',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    zIndex: 10,
  },
  overlayEmoji: { fontSize: 48, marginBottom: 8 },
  overlayTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 4,
  },
  overlayRank: {
    fontSize: 18,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  overlayScore: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 8,
  },
  overlayHint: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textDim,
  },
  scoreList: {
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
  },
  medal: { fontSize: 20 },
  scoreName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  scorePoints: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  lobbyBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  lobbyBtnText: {
    color: COLORS.background,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  // Controls
  controls: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spectating: {
    color: COLORS.textDim,
    fontSize: 14,
  },
});
