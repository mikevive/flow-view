import { StyleSheet, View } from 'react-native';

export default function HorizontalLine() {
  return <View style={styles.horizontalLine} />;
}

const styles = StyleSheet.create({
  horizontalLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#A9A9A9',
  },
});
