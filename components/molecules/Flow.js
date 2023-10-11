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
    console.log(flow);
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
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 80,
          }}
          receptive={true}
          onReceiveDragDrop={({ dragged: { payload } }) => {
            console.log('dragged');
            return DraxSnapbackTargetPreset.None;
          }}
        ></DraxView>
        <View
          style={{
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
        >
          {flow.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                display: 'flex',
                flexDirection: 'row',
                zIndex: -rowIndex,
                justifyContent: 'center',
              }}
            >
              {row.map((block, blockIndex) => (
                <View
                  key={blockIndex}
                  style={{
                    marginLeft: 50,
                    marginRight: 50,
                  }}
                >
                  {!block && <None />}
                  {block?.type === 'MAIN' && <Main {...block} />}
                  {block?.type === 'TASK' && (
                    <View
                      key={blockIndex}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <DraxView
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 50,
                          height: 80,
                          transform: [
                            { translateY: rowIndex === 1 ? -70 : -25 },
                          ],
                        }}
                        receptive={true}
                        onReceiveDragDrop={({ dragged: { payload } }) => {
                          const blockId = payload?.blockId;
                          console.log('dragged:');
                          console.log(blockId);
                          if (blockId) addTaskLeft(blockId);
                          return DraxSnapbackTargetPreset.None;
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: 'blue',
                            width: 10,
                            height: 80,
                            transform: [
                              { translateY: rowIndex === 1 ? 70 : 25 },
                            ],
                          }}
                        ></View>
                      </DraxView>
                      <Task {...block} />
                      <DraxView
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 50,
                          height: 80,

                          transform: [
                            { translateY: rowIndex === 1 ? -70 : -25 },
                          ],
                        }}
                        receptive={true}
                        onReceiveDragDrop={({ dragged: { payload } }) => {
                          const blockId = payload?.blockId;
                          console.log('dragged:');
                          console.log(blockId);
                          if (blockId) addTaskRight(blockId);
                          return DraxSnapbackTargetPreset.None;
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: 'blue',
                            width: 10,
                            height: 80,
                            transform: [
                              { translateY: rowIndex === 1 ? 70 : 25 },
                            ],
                          }}
                        ></View>
                      </DraxView>
                    </View>
                  )}
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
