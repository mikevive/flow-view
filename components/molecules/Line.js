import { useRef, useContext } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useHover } from 'react-native-web-hooks';
import { DraxView, DraxViewDragStatus } from 'react-native-drax';

import { FlowContext } from './Flow';
import Task from './Task';

export default function Line(props) {
  const hoverAreaRef = useRef(null);
  const isHoverAreaHovered = useHover(hoverAreaRef);
  const plusIconRef = useRef(null);
  const isPlusIconHovered = useHover(plusIconRef);

  const { addTaskDown } = useContext(FlowContext);

  return (
    <View
      ref={hoverAreaRef}
      style={[styles.line, isHoverAreaHovered && styles.line.hover]}
    >
      <View style={styles.line.trunk}></View>
      <View style={[styles.line.circle, styles.line.circle.top]}></View>
      <View style={[styles.line.circle, styles.line.circle.bottom]}></View>
      <DraxView
        longPressDelay={100}
        dragPayload={{ blockId: props.block.id }}
        renderHoverContent={({ viewState }) => {
          let combinedStyles = [
            {
              opacity: 0.5,
              transform: [
                { translateX: -110 },
                { translateY: props.block.id === 0 ? 10 : -40 },
              ],
            },
          ];

          if (viewState.dragStatus === DraxViewDragStatus.Released) {
            combinedStyles.push({ opacity: 0 });
          }

          return (
            <View style={combinedStyles}>
              <Task id={null} />
            </View>
          );
        }}
      >
        <Pressable
          ref={plusIconRef}
          style={[
            styles.line.add,
            isHoverAreaHovered && styles.line.add.visible,
            isPlusIconHovered && styles.line.add.hover,
          ]}
          onPress={() => addTaskDown(props.block.id)}
        >
          <Entypo
            name={'plus'}
            style={[
              styles.line.add.icon,
              isPlusIconHovered && styles.line.add.icon.hover,
            ]}
          />
        </Pressable>
      </DraxView>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    width: '80%',
    transitionProperty: 'height',
    transitionDuration: '250ms',
    transitionTimingFunction: 'ease',
    hover: {
      height: 100,
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
      visible: {
        opacity: 1,
      },
      hover: {
        backgroundColor: '#2D26B4',
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
});
