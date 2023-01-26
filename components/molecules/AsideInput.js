import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FlowContext } from './Flow';

export default function AsideInput() {
  const { selectedTask, updateTask } = useContext(FlowContext);

  return (
    <View>
      <Text style={[styles.title]}>TASK TITLE</Text>
      <input
        type="text"
        style={styles.field}
        value={selectedTask.title}
        placeholder="Untitled"
        onChange={(event) =>
          updateTask(selectedTask.id, { title: event.target.value })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: 'inherit',
  },
  field: {
    fontWeight: 'bold',
    border: 'none',
    color: '#fff',
    backgroundColor: 'transparent',
  },
});
