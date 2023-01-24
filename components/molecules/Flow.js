import { createContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DraxProvider,
  DraxView,
  DraxSnapbackTargetPreset,
} from 'react-native-drax';

import Line from './Line';
import Main from './Main';
import None from './None';
import Task from './Task';

export const FlowContext = createContext();

export default function Flow() {
  const [flow, setFlow] = useState([
    [
      {
        id: 0,
        type: 'MAIN',
        title: 'Start',
        description: '',
        next: [1],
      },
    ],
    [
      {
        id: 1,
        type: 'MAIN',
        title: 'End',
        description: '',
        next: [],
      },
    ],
  ]);
  const [taskCounter, setTaskCounter] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTaskDown = (parentBlockId) => {
    const newTaskId = increaseTaskCounter();

    const { parent, parentRowIndex, parentColumnIndex } = [...flow].reduce(
      (acum, row, parentRowIndex, array) => {
        const parent = row.find((block) => block?.id === parentBlockId);
        const parentColumnIndex = row.findIndex(
          (block) => block?.id === parentBlockId
        );
        if (parentColumnIndex !== -1) {
          array.splice(1); // eject early
          acum = {
            parent: parent,
            parentRowIndex: parentRowIndex,
            parentColumnIndex: parentColumnIndex,
          };
          return acum;
        }
      },
      null
    );

    const newTask = {
      id: newTaskId,
      type: 'DEFAULT',
      title: '',
      description: '',
      next: [...parent.next],
    };

    parent.next = [newTaskId];

    const newTaskRowIndex = parentRowIndex + 1;
    const newFlow = [...flow];
    const newRow = Array.apply(null, Array(flow[0].length)).map(() => null);
    newRow.splice(parentColumnIndex, 1, newTask);
    newFlow.splice(newTaskRowIndex, 0, newRow);
    setFlow(newFlow);
    setSelectedTask(newTask);
  };

  const addTaskLeft = (parentBlockId) => {
    const id = increaseTaskCounter();
    const newTask = {
      id: id,
      type: 'DEFAULT',
      title: '',
      description: '',
      next: [1],
    };

    const { parent, parentRowIndex, parentColumnIndex } = [...flow].reduce(
      (acum, row, parentRowIndex, array) => {
        const parent = row.find((block) => block?.id === parentBlockId);
        const parentColumnIndex = row.findIndex(
          (block) => block?.id === parentBlockId
        );
        if (parentColumnIndex !== -1) {
          array.splice(1); // eject early
          acum = {
            parent: parent,
            parentRowIndex: parentRowIndex,
            parentColumnIndex: parentColumnIndex,
          };
          return acum;
        }
      },
      null
    );

    const newTaskRowIndex = parentRowIndex + 1;
    const newFlow = [...flow];
    newFlow.forEach((row, index) => {
      const task = newTaskRowIndex === index ? newTask : null;
      row.splice(parentColumnIndex, 0, task);
    });

    setFlow(newFlow);
    setSelectedTask(null);
  };

  const addTaskRight = (parentBlockId) => {
    const id = increaseTaskCounter();
    const newTask = {
      id: id,
      type: 'DEFAULT',
      title: '',
      description: '',
      next: [1],
    };

    const { parent, parentRowIndex, parentColumnIndex } = [...flow].reduce(
      (acum, row, parentRowIndex, array) => {
        const parent = row.find((block) => block?.id === parentBlockId);
        const parentColumnIndex = row.findIndex(
          (block) => block?.id === parentBlockId
        );
        if (parentColumnIndex !== -1) {
          array.splice(1); // eject early
          acum = {
            parent: parent,
            parentRowIndex: parentRowIndex,
            parentColumnIndex: parentColumnIndex,
          };
          return acum;
        }
      },
      null
    );

    const newTaskRowIndex = parentRowIndex + 1;
    const newFlow = [...flow];
    newFlow.forEach((row, index) => {
      const task = newTaskRowIndex === index ? newTask : null;
      row.splice(parentColumnIndex + 1, 0, task);
    });

    setFlow(newFlow);
    setSelectedTask(null);
  };

  const increaseTaskCounter = () => {
    const newTaskCounter = taskCounter + 1;
    setTaskCounter(newTaskCounter);
    return newTaskCounter;
  };

  const updateTask = (id, task) => {
    const newTask = { ...selectedTask, ...task };

    const { rowIndex, columnIndex } = [...flow].reduce(
      (acum, row, rowIndex, array) => {
        const columnIndex = row.findIndex((block) => block?.id === id);
        if (columnIndex !== -1) {
          array.splice(1); // eject early
          acum = { rowIndex: rowIndex, columnIndex: columnIndex };
          return acum;
        }
      },
      null
    );

    const newFlow = [...flow];
    newFlow[rowIndex].splice(columnIndex, 1, newTask);
    setFlow(newFlow);
    setSelectedTask(newTask);
  };

  const initialContextValue = {
    flow: flow,
    addTaskLeft: addTaskLeft,
    addTaskDown: addTaskDown,
    addTaskRight: addTaskRight,
    selectedTask: selectedTask,
    setSelectedTask: setSelectedTask,
    updateTask: updateTask,
  };

  return (
    <FlowContext.Provider value={initialContextValue}>
      <DraxProvider>
        <DraxView
          style={{ backgroundColor: 'red', width: 100, height: 100 }}
          receptive={true}
          onReceiveDragDrop={({ dragged: { payload } }) => {
            payload?.test?.();
            return DraxSnapbackTargetPreset.None;
          }}
        />
        <View
          style={{
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
        >
          {flow.map((row, index) => (
            <View
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {row.map((block, index) => (
                <View key={index} style={{ marginLeft: 50, marginRight: 50 }}>
                  {!block && <None />}
                  <DraxView
                    dragPayload={{ test: () => console.log('dragged') }}
                  >
                    {block?.type === 'DEFAULT' && <Task {...block} />}
                  </DraxView>
                  {block?.type === 'MAIN' && <Main {...block} />}
                  {block && block.next.length !== 0 && <Line block={block} />}
                </View>
              ))}
            </View>
          ))}
        </View>
      </DraxProvider>
    </FlowContext.Provider>
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
