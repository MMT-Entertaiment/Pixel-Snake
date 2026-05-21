import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, DIRECTIONS } from '../utils/constants';

export default function Joystick({ onDirection }) {
  const btn = (dir, label) => (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => onDirection(dir)}
      activeOpacity={0.6}
    >
      <View style={styles.btnInner}>
        <View style={[styles.arrow, styles[`arrow${label}`]]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Haut */}
      <View style={styles.row}>
        {btn(DIRECTIONS.UP, 'Up')}
      </View>
      {/* Gauche / Droite */}
      <View style={styles.row}>
        {btn(DIRECTIONS.LEFT, 'Left')}
        <View style={styles.centerSpace} />
        {btn(DIRECTIONS.RIGHT, 'Right')}
      </View>
      {/* Bas */}
      <View style={styles.row}>
        {btn(DIRECTIONS.DOWN, 'Down')}
      </View>
    </View>
  );
}

const BTN_SIZE = 64;
const ARROW_SIZE = 14;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSpace: {
    width: BTN_SIZE,
    height: BTN_SIZE,
  },
  // Flèches (triangles CSS-like)
  arrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderBottomWidth: ARROW_SIZE * 1.6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.primary,
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE,
    borderTopWidth: ARROW_SIZE * 1.6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: ARROW_SIZE,
    borderBottomWidth: ARROW_SIZE,
    borderRightWidth: ARROW_SIZE * 1.6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.primary,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: ARROW_SIZE,
    borderBottomWidth: ARROW_SIZE,
    borderLeftWidth: ARROW_SIZE * 1.6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: COLORS.primary,
  },
  arrow: {},
});
