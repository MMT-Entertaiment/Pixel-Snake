import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MenuScreen({ onMultiplayer, onSolo, onSkins, error }) {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={[styles.btn, styles.btnMulti]}
        onPress={() => onMultiplayer(name.trim())}
      >
        <Text style={styles.btnText}>Multijoueur</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnSolo]}
        onPress={() => onSolo(name.trim())}
      >
        <Text style={styles.btnText}>Solo vs IA</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.skinsBtn} onPress={onSkins}>
        <Text style={styles.skinsBtnText}>Skins</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  logoContainer: { alignItems: 'center', marginTop: 20 },
  ropesRow: { flexDirection: 'row', gap: 60, marginBottom: -4 },
  rope: { width: 8, height: 60, backgroundColor: '#7a4a2a', borderRadius: 4 },
  logo: { width: width * 0.75, height: 120 },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: {
    backgroundColor: '#555555',
    color: '#ffffff',
    fontSize: 16,
    padding: 14,
    borderRadius: 4,
  },
  inputUnderline: { height: 3, backgroundColor: '#44cc44', borderRadius: 2, marginTop: 2 },
  btn: { width: '100%', paddingVertical: 18, borderRadius: 32, alignItems: 'center', marginBottom: 16 },
  btnMulti: { backgroundColor: '#ff6600' },
  btnSolo: { backgroundColor: '#cc44ff' },
  btnText: { color: '#ffffff', fontSize: 22 },
  errorBox: { backgroundColor: '#ff336622', borderWidth: 1, borderColor: '#ff3366', borderRadius: 10, padding: 12, width: '100%', marginBottom: 12 },
  errorText: { color: '#ff3366', fontSize: 13, textAlign: 'center' },
  skinsBtn: { position: 'absolute', bottom: 32, right: 24, backgroundColor: '#44aaff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  skinsBtnText: { color: '#ffffff', fontSize: 18 },
});
