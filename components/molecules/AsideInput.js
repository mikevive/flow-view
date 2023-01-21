import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FlowContext } from './Flow';

export default function AsideInput() {
  const { selectedTask, updateTask } = useContext(FlowContext);

  return (
    <View>
      <Text style={[styles.aside.title]}>TASK TITLE</Text>
      <input
        type="text"
        style={styles.aside.field}
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
  workspace: {
    display: 'flex',
    width: 'calc(100vw - 350px)',
    height: 'calc(100vh - 50px)',
    marginLeft: 50,
    marginTop: 50,
    justifyContent: 'flex-start',
    backgroundColor: '#0D0E10',
    padding: 100,
    cursor: 'default',
    overflow: 'auto',
  },
  header: {
    position: 'fixed',
    backgroundColor: '#141518',
    top: 0,
    height: 50,
    width: '100vw',
    zIndex: 2000,
  },
  navigation: {
    position: 'fixed',
    backgroundColor: '#252A2E',
    top: 50,
    left: 0,
    height: 'calc(100vh - 50px)',
    width: 50,
    zIndex: 2000,
  },
  aside: {
    position: 'fixed',
    padding: 25,
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 25,
    backgroundColor: '#0A0A0A',
    top: 50,
    right: 0,
    height: 'calc(100vh - 50px)',
    width: 300,
    zIndex: 2000,
    color: '#A9A9A9',
    horizontalLine: {
      height: 2,
      width: '100%',
      backgroundColor: '#A9A9A9',
    },
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
  },
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
  line: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    zIndex: 1000,
    transitionProperty: 'min-height',
    transitionDuration: '250ms',
    hover: {
      minHeight: 100,
    },
    trunk: {
      position: 'absolute',
      backgroundColor: '#2D26B4',
      height: '100%',
      width: 2,
      borderBottomLeftRadius: 1,
      borderBottomRightRadius: 1,
    },
    circle: {
      position: 'absolute',
      backgroundColor: '#5753B3',
      height: 10,
      width: 10,
      border: 2,
      borderRadius: 5,
      borderStyle: 'solid',
      borderColor: '#2D26B4',
      bottom: {
        bottom: -5,
      },
      top: {
        top: -5,
      },
    },
    hoverArea: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
      width: 150,
      transitionProperty: 'height',
      transitionDuration: '250ms',
      hover: {
        height: 130,
      },
      add: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#868B9B',
        height: 30,
        width: 30,
        borderRadius: 15,
        cursor: 'pointer',
        opacity: 0,
        transitionProperty: 'opacity',
        transitionDuration: '250ms',
        hover: {
          backgroundColor: '#2D26B4',
        },
        visible: {
          opacity: 1,
        },
        icon: {
          color: '#2D26B4',
          fontSize: 24,
          hover: {
            color: '#fff',
          },
        },
      },
    },
  },
});
