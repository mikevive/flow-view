import { StyleSheet, View } from 'react-native';

export default function None() {
  return <View style={[styles.block, styles.block.none]}></View>;
}

const styles = StyleSheet.create({
  block: {
    padding: 10,
    borderRadius: 5,
    width: 250,
    backgroundColor: '#868B9B',
    cursor: 'pointer',
    color: '#000',
    active: {
      outline: 'solid 3px #2D26B4',
      outlineOffset: -3,
      backgroundColor: '#504BB4',
      color: '#fff',
    },
    title: {
      fontWeight: 'bold',
      color: 'inherit',
    },
    description: {
      color: '#000',
      color: 'inherit',
    },
    main: {
      backgroundColor: '#2D26B4',
      color: '#fff',
      cursor: 'default',
    },
    none: {
      backgroundColor: 'none',
      cursor: 'default',
    },
  },
});
