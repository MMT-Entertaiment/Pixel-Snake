import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Animated, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/constants';

export default function MenuScreen({ onJoin, onCreate, error }) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState(null); // 'join' | 'create'
  const { width } = useWindowDimensions();

  const handleJoin = () => {
    if (!name.trim()) return;
    onJoin(name.trim(), roomCode.trim() || null);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
  };

  return (
    <LinearGradient colors={['#0a0a0f', '#0d0d18', '#0a0a0f']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🐍</Text>
          <Text style={styles.title}>SNAKE</Text>
          <Text style={styles.subtitle}>MULTIPLAYER</Text>
          <Text style={styles.tagline}>Jusqu'à 20 joueurs en ligne</Text>
        </View>

        {/* Input pseudo */}
        <View style={styles.form}>
          <Text style={styles.label}>TON PSEUDO</Text>
          <TextInput
            style={styles.input}
            placeholder="Entre ton nom..."
            placeholderTextColor={COLORS.textDim}
            value={name}
            onChangeText={setName}
            maxLength={16}
            autoCapitalize="none"
          />

          {/* Mode selection */}
          {!mode && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => setMode('create')}
              >
                <Text style={styles.btnText}>➕ CRÉER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary]}
                onPress={() => setMode('join')}
              >
                <Text style={[styles.btnText, { color: COLORS.primary }]}>🔗 REJOINDRE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Créer une salle */}
          {mode === 'create' && (
            <View>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, { marginTop: 12 }]}
                onPress={handleCreate}
              >
                <Text style={styles.btnText}>🚀 CRÉER LA SALLE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode(null)} style={styles.backBtn}>
                <Text style={styles.backText}>← Retour</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Rejoindre une salle */}
          {mode === 'join' && (
            <View>
              <Text style={[styles.label, { marginTop: 16 }]}>CODE DE SALLE</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: ABCD"
                placeholderTextColor={COLORS.textDim}
                value={roomCode}
                onChangeText={setRoomCode}
                maxLength={6}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, { marginTop: 12 }]}
                onPress={handleJoin}
              >
                <Text style={styles.btnText}>🎮 REJOINDRE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode(null)} style={styles.backBtn}>
                <Text style={styles.backText}>← Retour</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Erreur */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>v1.0.0 — Made with 🐍</Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 8,
    marginTop: -4,
  },
  tagline: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
    maxWidth: 360,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnText: {
    color: COLORS.background,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  backBtn: {
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
  },
  backText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  errorBox: {
    marginTop: 12,
    backgroundColor: '#ff336622',
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    color: COLORS.textDim,
    fontSize: 12,
  },
});
