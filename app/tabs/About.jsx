// screens/AboutScreen.js
import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';


export default function AboutScreen() {
  const openLink = (url) => Linking.openURL(url);

  return (
    <LinearGradient
      colors={['rgb(37, 37, 37)', 'rgb(124, 119, 124)']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>À propos</Text>
        <LinearGradient
          colors={['rgb(255, 255, 255)','rgb(43, 42, 42)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.container}
        >
          <View style={styles.section}>
            <Text style={styles.text}>
              Développé avec ❤️ pour:
            </Text>
            <Text style={{fontSize: 20,color:'red'}}> Zakis Service Internationale </Text>
            <Image source={require('../../assets/images/zakis-logo.png')} style={styles.logo} />
          </View>

          <View style={styles.section}>
            <Text style={styles.text}>Par:</Text>
            <Text style={{fontSize: 20,color:'white'}}>FLAZPRO</Text>
            <Image source={require('../../assets/images/flazpro-logo.png')} style={styles.logo} />
            <View style={styles.socials}>
              <TouchableOpacity onPress={() => openLink('https://wa.me/+22660314333')}>
                <Ionicons name="logo-whatsapp" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://linkedin.com/in/laze.farouk')}>
                <Ionicons name="logo-linkedin" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://facebook.com/laze.farouk')}>
                <Ionicons name="logo-facebook" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://twitter.com/laze.farouk')}>
                <Ionicons name="logo-twitter" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink('https://github.com/flazpro')}>
                <Ionicons name="logo-github" size={30} color="white" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    borderTopLeftRadius:15,
    borderBottomRightRadius:15,
  },
  section: {
    alignItems: 'center',
    marginBottom: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 10,
  },
});
