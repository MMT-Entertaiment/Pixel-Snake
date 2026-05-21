import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Share, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, MAX_PLAYERS, MIN_PLAYERS_TO_START } from '../utils/constants';

export default function LobbyScreen({
  roomId,
  players,
  playerId,
  onStart,
  onLeave,
  countdown,
}) {
  const isHost = players[0]?.id === playerId;
  const canStart = players.length >= MIN_PLAYERS_TO_START;

  const shareRoom = async () => {
    try {
      await Share.share({
        message: `Rejoins ma partie Snake ! Code : ${roomId}`,
        title: 'Snake Multiplayer',
      });
    } catch (e) {}
  };

  const renderPlayer = ({ item, index }) => (
    <View style={[styles.playerRow, index === 0 && styles.hostRow]}>
      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
      <Text style={styles.playerName}>
        {item.name}
        {item.id === playerId ? ' (toi)' : ''}
      </Text>
      {index === 0 && <Text style={styles.hostBadge}>👑 Hôte</Text>}
    </View>
  );

  return (
    <LinearGradient colors={['#0a0a0f', '#0d0d18']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onLeave} style={styles.backBtn}>
          <Text style={styles.backText}>← Quitter</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LOBBY</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Room code */}
      <TouchableOpacity style={styles.codeBox} onPress={shareRoom}>
        <Text style={styles.codeLabel}>CODE DE SALLE</Text>
        <Text style={styles.roomCode}>{roomId}</Text>
        <Text style={styles.codeHint}>Appuie pour partager 📤</Text>
      </TouchableOpacity>

      {/* Player count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {players.length}/{MAX_PLAYERS} joueurs
        </Text>
        <View style={styles.countBar}>
          <View
            style={[
              styles.countFill,
              { width: `${(players.length / MAX_PLAYERS) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Players list */}
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayer}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      {/* Countdown */}
      {countdown !== null && (
        <View style={styles.countdownBox}>
          <Text style={styles.countdownText}>
            Démarrage dans {countdown}...
          </Text>
        </View>
      )}

      {/* Start button (host only) */}
      {isHost && countdown === null && (
        <TouchableOpacity
          style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
          onPress={canStart ? onStart : null}
          activeOpacity={canStart ? 0.8 : 1}
        >
          <Text style={styles.startText}>
            {canStart
              ? '🚀 LANCER LA PARTIE'
              : `⏳ En attente (min ${MIN_PLAYERS_TO_START} joueurs)`}
          </Text>
        </TouchableOpacity>
      )}

      {!isHost && countdown === null && (
        <View style={styles.waitingBox}>
          <Text style={styles.waitingText}>
            ⏳ En attente que l'hôte lance la partie...
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backBtn: { padding: 8 },
  backText: { color: COLORS.textMuted, fontSize: 14 },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 4,
  },
  codeBox: {
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: 6,
  },
  roomCode: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 8,
  },
  codeHint: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textDim,
  },
  countRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  countText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  countBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  countFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  list: { flex: 1, paddingHorizontal: 20 },
  listContent: { gap: 8 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  hostRow: {
    borderColor: COLORS.gold,
    backgroundColor: '#1a1800',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  playerName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  hostBadge: {
    fontSize: 12,
    color: COLORS.gold,
  },
  countdownBox: {
    margin: 20,
    backgroundColor: COLORS.primaryDim,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  countdownText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  startBtn: {
    margin: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  startBtnDisabled: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  startText: {
    color: COLORS.background,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  waitingBox: {
    margin: 20,
    padding: 16,
    alignItems: 'center',
  },
  waitingText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
