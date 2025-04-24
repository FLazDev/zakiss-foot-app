import React, { useContext } from 'react';
import { ScrollView, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SettingsVarObject } from './ContextComponent';
import LinearGradient from 'react-native-linear-gradient';

export default function Settings() {
  const {
    apiChoice, setApiChoice,
    apiKey, setApiKey,
    backgroundImage, setBackgroundImage,
    imageMap,
  } = useContext(SettingsVarObject);

  return (
    <LinearGradient
      colors={['#00112B', '#5599FF']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1, }}
    >
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.pageTitle}>Paramètres</Text>

        <LinearGradient
          colors={['rgb(255, 255, 255)', 'rgb(223, 36, 198)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.apiContainer}
        >
          {/*Selection API*/}
          <Text style={styles.title}>Provider :</Text>
          <Picker
            selectedValue={apiChoice}
            onValueChange={(value) => setApiChoice(value)}
            style={styles.picker}
          >
            <Picker.Item label="API-SPORTS.IO" value="api-sports" />
            <Picker.Item label="FOOTBALL-DATA.ORG" value="football-data" />
          </Picker>

          {/*Clé API*/}
          <Text style={styles.title}>Modifier la Clé API de :<Text style={{ color: 'red' }}> {apiChoice}</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre clé API"
            value={apiKey}
            onChangeText={setApiKey}
          />
        </LinearGradient>

        {/*// Modifier le Fond d'Ecran*/}
        <LinearGradient
          colors={['rgb(223, 36, 198)', 'rgb(255, 255, 255)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.apiContainer}
        >
          <Text style={styles.title}>Changer le fond d’écran des Matches:</Text>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {[
              "bg1",
              "bg2",
              "bg3",
              "bg4",
              "bg5",
              "bg6",
              "bg7",
            ].map((imgKey) => (
              <TouchableOpacity
                key={imgKey}
                style={{ margin: 5 }}
                onPress={() => setBackgroundImage(imgKey)}
              >
                <Image
                  source={imageMap[imgKey]}
                  style={{
                    width: 70,
                    height: 100,
                    borderRadius: 5,
                    borderWidth: backgroundImage === imgKey ? 2 : 0,
                    borderColor: "#ff0095",
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  apiContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },


  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: 'rgb(161, 0, 140)',
    color: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  fondEcran: {
    width: '100%',
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});