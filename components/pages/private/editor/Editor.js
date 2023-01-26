import { Fragment } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

import AsideInput from '../../../molecules/AsideInput';
import Flow from '../../../molecules/Flow';
import HorizontalLine from '../../../molecules/HorizontalLine';

export default function Editor() {
  return (
    <Fragment>
      <View style={styles.header}></View>
      <View style={styles.navigation}></View>
      <View style={styles.aside}>
        {false && (
          <Fragment>
            <HorizontalLine></HorizontalLine>
            <AsideInput></AsideInput>
          </Fragment>
        )}
      </View>
      <Pressable
        style={styles.workspace}
        activeOpacity={1}
        onPress={() => console.log('click outside')}
      >
        <Flow />
      </Pressable>
    </Fragment>
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
});
