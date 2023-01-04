import { useState, useRef, createContext, Fragment, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useHover } from 'react-native-web-hooks';

const PROJECT_KEY = 'FLOW';

const Context = createContext();

export default function Editor() {
  const [flow, setFlow] = useState([
    [
      {
        id: 0,
        type: 'MAIN',
        title: 'Start',
        description: '',
        next: [],
      },
      {
        id: -1,
        type: 'MAIN',
        title: 'Start',
        description: '',
        next: [],
      },
      {
        id: -4,
        type: 'MAIN',
        title: 'Start',
        description: '',
        next: [],
      },
    ],
    [
      {
        id: 1,
        type: 'MAIN',
        title: 'End',
        description: '',
        next: null,
      },
      {
        id: -2,
        type: 'MAIN',
        title: 'End',
        description: '',
        next: null,
      },
      {
        id: -3,
        type: 'MAIN',
        title: 'End',
        description: '',
        next: null,
      },
    ],
  ]);
  const [taskCounter, setTaskCounter] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTaskToList = (parentBlockId) => {
    const id = increaseTaskCounter();
    const newTask = {
      id: id,
      type: 'DEFAULT',
      title: '',
      description: '',
      next: [],
    };

    const { parentRowIndex, parentColumnIndex } = [...flow].reduce(
      (acum, row, rowIndex, array) => {
        const columnIndex = row.findIndex(
          (block) => block?.id === parentBlockId
        );
        if (columnIndex !== -1) {
          array.splice(1); // eject early
          acum = { parentRowIndex: rowIndex, parentColumnIndex: columnIndex };
          return acum;
        }
      },
      null
    );

    const newTaskIndex = parentRowIndex + 1;
    const newFlow = [...flow];
    if (newFlow[parentRowIndex + 1][parentColumnIndex]) {
      const newRow = Array.apply(null, Array(flow[0].length)).map(() => null);
      newRow.splice(parentColumnIndex, 1, newTask);
      newFlow.splice(newTaskIndex, 0, newRow);
    } else {
      newFlow[parentRowIndex + 1][parentColumnIndex] = newTask;
    }
    setFlow(newFlow);
    setSelectedTask(newTask);
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
    addTaskToList: addTaskToList,
    selectedTask: selectedTask,
    setSelectedTask: setSelectedTask,
    updateTask: updateTask,
  };

  return (
    <Context.Provider value={initialContextValue}>
      <View style={styles.header}></View>
      <View style={styles.navigation}></View>
      <View style={styles.aside}>
        {selectedTask && (
          <Fragment>
            <HorizontalLine></HorizontalLine>
            <AsideInput></AsideInput>
          </Fragment>
        )}
      </View>
      <TouchableOpacity
        style={styles.workspace}
        activeOpacity={1}
        onPress={() => setSelectedTask(null)}
      >
        <Flow />
      </TouchableOpacity>
    </Context.Provider>
  );
}

function Flow() {
  const { flow } = useContext(Context);

  return flow.map((row, index) => (
    <View
      key={index}
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginRight: 'auto',
      }}
    >
      {row.map((block, index) => (
        <View key={index} style={{ marginLeft: 50, marginRight: 50 }}>
          {!block && <None />}
          {block?.type === 'DEFAULT' && <Task {...block} />}
          {block?.type === 'MAIN' && <Main {...block} />}
          {block?.next && <Line blockId={block.id} />}
        </View>
      ))}
    </View>
  ));
}

function Main(props) {
  return (
    <View style={[styles.block, , styles.block.main]}>
      <Text style={[styles.block.title]}>{props.title}</Text>
    </View>
  );
}

function Task(props) {
  const { selectedTask, setSelectedTask } = useContext(Context);

  return (
    <TouchableOpacity
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
    </TouchableOpacity>
  );
}

function None() {
  return <View style={[styles.block, styles.block.none]}></View>;
}

function Line(props) {
  const hoverAreaRef = useRef(null);
  const isHoverAreaHovered = useHover(hoverAreaRef);
  const iconRef = useRef(null);
  const isIconHovered = useHover(iconRef);

  const { addTaskToList } = useContext(Context);

  return (
    <View style={[styles.line, isHoverAreaHovered && styles.line.hover]}>
      <View style={styles.line.trunk}></View>
      <View style={[styles.line.circle, styles.line.circle.top]}></View>
      <View style={[styles.line.circle, styles.line.circle.bottom]}></View>
      <View
        ref={hoverAreaRef}
        style={[
          styles.line.hoverArea,
          isHoverAreaHovered && styles.line.hoverArea.hover,
        ]}
      >
        <TouchableOpacity
          ref={iconRef}
          style={[
            styles.line.hoverArea.add,
            isHoverAreaHovered && styles.line.hoverArea.add.visible,
            isIconHovered && styles.line.hoverArea.add.hover,
          ]}
          onPress={() => addTaskToList(props.blockId)}
        >
          <Entypo
            name={'plus'}
            style={[
              styles.line.hoverArea.add.icon,
              isIconHovered && styles.line.hoverArea.add.icon.hover,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HorizontalLine() {
  return <View style={styles.aside.horizontalLine} />;
}

function AsideInput() {
  const { selectedTask, updateTask } = useContext(Context);

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
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
      width: 80,
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
