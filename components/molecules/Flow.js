import { createContext, useState } from 'react';
import { View } from 'react-native';
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
      type: 'TASK',
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
      type: 'TASK',
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
      type: 'TASK',
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
                zIndex: -index,
              }}
            >
              {row.map((block, index) => (
                <View key={index} style={{ marginLeft: 50, marginRight: 50 }}>
                  {!block && <None />}
                  {block?.type === 'MAIN' && <Main {...block} />}
                  {block?.type === 'TASK' && <Task {...block} />}
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
