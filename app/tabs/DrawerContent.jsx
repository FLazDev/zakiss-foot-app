import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import DeviceInfo from 'react-native-device-info';

export default function CustomDrawerContent(props) {
  const version = DeviceInfo.getVersion();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version {version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 10,
  },
  versionContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});
