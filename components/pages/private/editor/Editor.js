import { useState, useRef, createContext, Fragment, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useHover } from 'react-native-web-hooks';

const PROJECT_KEY = 'FLOW';

const Context = createContext();

export default function Editor() {
  const [taskList, setTaskList] = useState([]);
  const [taskCounter, setTaskCounter] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTaskToList = (parentTaskId) => {
    const id = increaseTaskCounter();
    const newTask = {
      id: id,
      title: '',
      description: '',
    };
    if (!parentTaskId) {
      const newList = [newTask, ...taskList];
      setTaskList(newList);
    } else {
      const parentTaskIndex = taskList.findIndex(
        (task) => task.id === parentTaskId
      );
      const newTaskIndex = parentTaskIndex + 1;
      const newList = [...taskList];
      newList.splice(newTaskIndex, 0, newTask);
      setTaskList(newList);
    }
    setSelectedTask(newTask);
  };

  const increaseTaskCounter = () => {
    const newTaskCounter = taskCounter + 1;
    setTaskCounter(newTaskCounter);
    return newTaskCounter;
  };

  const updateTask = (id, task) => {
    const newTask = { ...selectedTask, ...task };
    const taskIndex = taskList.findIndex((task) => task.id === id);
    const newList = [...taskList];
    newList.splice(taskIndex, 1, newTask);
    setTaskList(newList);
    setSelectedTask(newTask);
  };

  const initialContextValue = {
    taskList: taskList,
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
        <HorizontalLine></HorizontalLine>
        {selectedTask && <AsideInput></AsideInput>}
      </View>
      <ScrollView
        contentContainerStyle={styles.workspace}
        activeOpacity={1}
        onPress={() => setSelectedTask(null)}
      >
        <View style={[styles.task, styles.task.main]}>
          <Text style={[styles.task.title]}>Start</Text>
        </View>
        <Line />

        <Flow />

        <View style={[styles.task, styles.task.main]}>
          <Text style={[styles.task.title]}>End</Text>
        </View>
      </ScrollView>
    </Context.Provider>
  );
}

function Flow() {
  const { taskList } = useContext(Context);

  return taskList.map((task) => (
    <Fragment key={task.id}>
      <Task {...task} />
      <Line id={task.id} />
    </Fragment>
  ));
}

function Task(props) {
  const { selectedTask, setSelectedTask } = useContext(Context);

  return (
    <TouchableOpacity
      style={[styles.task, props.id === selectedTask.id && styles.task.active]}
      onPress={() => setSelectedTask(props)}
    >
      <Text style={[styles.task.title]}>{props.title || 'Untitled'}</Text>
      <Text style={styles.task.description}>
        {props.description || 'Add a Description'}
      </Text>
    </TouchableOpacity>
  );
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
          onPress={() => addTaskToList(props.id)}
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
  return (
    <Context.Consumer>
      {({ selectedTask, updateTask }) => (
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
      )}
    </Context.Consumer>
  );
}

const styles = StyleSheet.create({
  workspace: {
    display: 'flex',
    width: 'calc(100vw - 350px)',
    marginLeft: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#0D0E10',
    padding: 100,
    cursor: 'default',
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
  task: {
    padding: 10,
    borderRadius: 5,
    fontSize: 12,
    backgroundColor: '#868B9B',
    cursor: 'pointer',
    color: '#000',
    active: {
      outline: 'solid 3px #2D26B4',
      outlineOffset: '-3px',
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
    },
  },
  line: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    zIndex: 1000,
    transitionProperty: 'height',
    transitionDuration: '250ms',
    hover: {
      height: 100,
    },
    trunk: {
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
        top: 'calc(100% - 5px)',
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
