import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS, GRID_SIZE } from '../utils/constants';

export default function GameCanvas({ gameData, playerId }) {
  const { width, height } = useWindowDimensions();

  // Taille de la grille = largeur de l'écran - padding
  const canvasSize = Math.min(width - 16, height * 0.55);
  const cellSize = Math.floor(canvasSize / GRID_SIZE);

  const { snakes = [], food = [] } = gameData || {};

  // Construire une map position → couleur pour un rendu O(1)
  const cellMap = useMemo(() => {
    const map = {};

    snakes.forEach((snake) => {
      if (!snake.alive && snake.id !== playerId) return;
      snake.body.forEach((pos, i) => {
        const key = `${pos.x},${pos.y}`;
        map[key] = {
          color: snake.color,
          isHead: i === 0,
          isDead: !snake.alive,
          isMe: snake.id === playerId,
        };
      });
    });

    return map;
  }, [snakes, playerId]);

  return (
    <View style={[styles.canvas, { width: canvasSize, height: canvasSize }]}>
      {/* Grille de fond */}
      <View style={[StyleSheet.absoluteFill, styles.grid]}>
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <View key={row} style={styles.gridRow}>
            {Array.from({ length: GRID_SIZE }).map((_, col) => (
              <View
                key={col}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  (row + col) % 2 === 0 ? styles.cellEven : styles.cellOdd,
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Nourriture */}
      {food.map((f, i) => (
        <View
          key={i}
          style={[
            styles.food,
            {
              left: f.x * cellSize + 2,
              top: f.y * cellSize + 2,
              width: cellSize - 4,
              height: cellSize - 4,
              borderRadius: (cellSize - 4) / 2,
            },
          ]}
        />
      ))}

      {/* Serpents */}
      {Object.entries(cellMap).map(([key, cell]) => {
        const [x, y] = key.split(',').map(Number);
        return (
          <View
            key={key}
            style={[
              styles.snakeCell,
              {
                left: x * cellSize,
                top: y * cellSize,
                width: cellSize,
                height: cellSize,
                backgroundColor: cell.isDead ? '#333344' : cell.color,
                opacity: cell.isDead ? 0.4 : 1,
                borderRadius: cell.isHead ? cellSize / 3 : 3,
                borderWidth: cell.isMe && cell.isHead ? 2 : 0,
                borderColor: '#ffffff',
                zIndex: cell.isHead ? 2 : 1,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignSelf: 'center',
  },
  grid: {},
  gridRow: {
    flexDirection: 'row',
  },
  cell: {},
  cellEven: { backgroundColor: '#10101a' },
  cellOdd: { backgroundColor: '#0d0d16' },
  food: {
    position: 'absolute',
    backgroundColor: '#ff3366',
    shadowColor: '#ff3366',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  snakeCell: {
    position: 'absolute',
  },
});
