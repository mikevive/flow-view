import { useRef, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useHover } from 'react-native-web-hooks';

import { FlowContext } from './Flow';

export default function Line(props) {
  const hoverAreaRef = useRef(null);
  const isHoverAreaHovered = useHover(hoverAreaRef);
  const plusIconRef = useRef(null);
  const isPlusIconHovered = useHover(plusIconRef);
  const leftIconRef = useRef(null);
  const isLeftIconHovered = useHover(leftIconRef);
  const righIconRef = useRef(null);
  const isRightIconHovered = useHover(righIconRef);

  const { addTaskLeft, addTaskDown, addTaskRight } = useContext(FlowContext);

  const isParentBlock =
    props.block.next.length > 1 || props.block.next[0] !== 1;

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
          ref={leftIconRef}
          style={[
            styles.line.hoverArea.add,
            isHoverAreaHovered && styles.line.hoverArea.add.visible,
            isLeftIconHovered && styles.line.hoverArea.add.hover,
            !isParentBlock && { display: 'none' },
          ]}
          onPress={() => addTaskLeft(props.block.id)}
        >
          <Entypo
            name={'chevron-left'}
            style={[
              styles.line.hoverArea.add.icon,
              isLeftIconHovered && styles.line.hoverArea.add.icon.hover,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          ref={plusIconRef}
          style={[
            styles.line.hoverArea.add,
            isHoverAreaHovered && styles.line.hoverArea.add.visible,
            isPlusIconHovered && styles.line.hoverArea.add.hover,
          ]}
          onPress={() => addTaskDown(props.block.id)}
        >
          <Entypo
            name={'plus'}
            style={[
              styles.line.hoverArea.add.icon,
              isPlusIconHovered && styles.line.hoverArea.add.icon.hover,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          ref={righIconRef}
          style={[
            styles.line.hoverArea.add,
            isHoverAreaHovered && styles.line.hoverArea.add.visible,
            isRightIconHovered && styles.line.hoverArea.add.hover,
            !isParentBlock && { display: 'none' },
          ]}
          onPress={() => addTaskRight(props.block.id)}
        >
          <Entypo
            name={'chevron-right'}
            style={[
              styles.line.hoverArea.add.icon,
              isRightIconHovered && styles.line.hoverArea.add.icon.hover,
            ]}
          />
        </TouchableOpacity>
      </View>
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
      minHeight: 75,
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
