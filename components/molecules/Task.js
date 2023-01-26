import { useContext } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';

import { FlowContext } from './Flow';

export default function Task(props) {
  const { selectedTask, setSelectedTask } = useContext(FlowContext);

  return (
    <Pressable
      style={[
        styles.block,
        props.id === selectedTask?.id && styles.block.active,
      ]}
      onPress={() => setSelectedTask(props)}
    >
      <Text style={[styles.block.title]}>{props.title || 'Untitled'}</Text>
      <Text style={styles.block.description}>
        {props.description || 'Add a Description'}
      </Text>
    </Pressable>
  );
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
