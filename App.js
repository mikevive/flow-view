import { StyleSheet, View } from 'react-native';
import Editor from './components/pages/private/editor/Editor';

export default function App() {
  return (
    <View style={styles.container}>
      <Editor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#0D0E10',
  },
});
