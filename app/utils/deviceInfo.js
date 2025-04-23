import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import { Dimensions } from 'react-native';

export const getDeviceInfo = async () => {
  const { width, height } = Dimensions.get('window');
  const netState = await NetInfo.fetch();

  return {
    date: new Date().toISOString(),                  // Current date in ISO format
    appVersion: DeviceInfo.getVersion(),               // Ex: "1.0.0"
    appBuild: DeviceInfo.getBuildNumber(),            // Ex: "1"
    appName: DeviceInfo.getApplicationName(),         // Ex: "MyApp"
    device: await DeviceInfo.getDeviceName(),
    brand: DeviceInfo.getBrand(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    model: DeviceInfo.getModel(),
    //language: locale[0]?.languageTag || "unknown",
    //country: DeviceInfo.getDeviceCountry(),
    ip: await DeviceInfo.getIpAddress(),
    isEmulator: await DeviceInfo.isEmulator(),
    isTablet: DeviceInfo.isTablet(),
    screenWidth: width,
    screenHeight: height,
    connectionType: netState.type,                       // "wifi", "cellular", etc.
  };
};
