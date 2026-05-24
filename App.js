import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🐍 Pixel Snake</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3a3a3a', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 32 },
});
