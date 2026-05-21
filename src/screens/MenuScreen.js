import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, KeyboardAvoidingView,
  Platform, Dimensions, ActivityIndicator,
} from 'react-native';
import * as Font from 'expo-font';

const { width } = Dimensions.get('window');
const BG_COLOR = '#3a3a3a';

export default function MenuScreen({ onMultiplayer, onSolo, onSkins, error }) {
  const [name, setName] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Grapesoda': require('../../assets/fonts/Grapesoda.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#cc44ff" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Engrenage settings */}
      <TouchableOpacity style={styles.settingsBtn}>
        <Image
          source={require('../../assets/images/settings.png')}
          style={styles.settingsIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Logo suspendu */}
      <View style={styles.logoContainer}>
        <View style={styles.ropesRow}>
          <View style={styles.rope} />
          <View style={styles.rope} />
        </View>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={{ flex: 1 }} />

      {/* Input pseudo */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="enter your Player name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          maxLength={16}
          autoCapitalize="none"
        />
        <View style={styles.inputUnderline} />
      </View>

      {/* Bouton Multijoueur */}
      <TouchableOpacity
        style={[styles.btn, styles.btnMulti]}
        onPress={() => onMultiplayer(name.trim())}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Multijoueur</Text>
      </TouchableOpacity>

      {/* Bouton Solo vs IA */}
      <TouchableOpacity
        style={[styles.btn, styles.btnSolo]}
        onPress={() => onSolo(name.trim())}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Solo vs IA</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <View style={{ flex: 1 }} />

      {/* Bouton Skins */}
      <TouchableOpacity style={styles.skinsBtn} onPress={onSkins} activeOpacity={0.85}>
        <Text style={styles.skinsBtnText}>Skins</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  settingsBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
  },
  settingsIcon: {
    width: 44,
    height: 44,
    tintColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  ropesRow: {
    flexDirection: 'row',
    gap: 60,
    marginBottom: -4,
  },
  rope: {
    width: 8,
    height: 60,
    backgroundColor: '#7a4a2a',
    borderRadius: 4,
  },
  logo: {
    width: width * 0.75,
    height: 120,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#555555',
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Grapesoda',
    padding: 14,
    borderRadius: 4,
  },
  inputUnderline: {
    height: 3,
    backgroundColor: '#44cc44',
    borderRadius: 2,
    marginTop: 2,
  },
  btn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnMulti: { backgroundColor: '#ff6600' },
  btnSolo: { backgroundColor: '#cc44ff' },
  btnText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Grapesoda',
    letterSpacing: 1,
  },
  errorBox: {
    backgroundColor: '#ff336622',
    borderWidth: 1,
    borderColor: '#ff3366',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 12,
  },
  errorText: {
    color: '#ff3366',
    fontSize: 13,
    textAlign: 'center',
  },
  skinsBtn: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#44aaff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  skinsBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Grapesoda',
  },
});
