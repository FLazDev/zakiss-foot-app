import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SettingsVarObject } from './ContextComponent'; // Import du contexte
import DateTimePicker from '@react-native-community/datetimepicker';
import { Meeting } from "../components/FootComponents";
import { Logo } from "../components/SvgComponents";
import { getDeviceInfo } from '../utils/deviceInfo'; // Import de la fonction getDeviceInfo
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get("window");

export default function HomePage() {

  const navigation = useNavigation();// Pour naviguer vers des écran
  const route = useRoute();
  const [matchsData, setMatchsData] = useState({}); // in API: Pour stocker les données des matchs
  const [currentID, setCurrentID] = useState([39, 135, 140, 78, 61, 88, 94, 144, 345, 203, 13, 71, 253, 307, 1, 29, 490, 15, 480, 4, 2, 3, 531, 21, 6, 36, 19, 973, 19, 1015, 9, 45, 143, 81, 137, 66, 96, 90, 147, 206, 347]);
  const [selectedMatches, setSelectedMatches] = useState({}); // in toggleMatchSelection(): Stocker les IDs selectionnés
  const selectedMatchsIdsList = Object.keys(selectedMatches);// Liste des IDs des matchs selectionnés
  const [programDate, setProgramDate] = useState("");
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);// Pour recuperer la date actuelle
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);// Pour gerer l'état de chargement
  const { apiChoice, apiKey } = useContext(SettingsVarObject);
  const [isConnected, setIsConnected] = useState(true);// Pour gerer la connexion internet
  const [isApiStatusOk, setIsApiStatusOk] = useState(false);// Pour gerer l'état de l'API
  let content = null;

  // Vérifier la connexion internet
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }
    , []
  );

  // Gérer le clic sur une carte de compétition
  function handleMatchesProgram(idList, apiData) {
    const program = [];

    // 1️⃣ Parcourir les compétitions et les matchs
    // Vérifier si l'ID du match est sélectionné
    // Si oui, le pousser dans le tableau `program`
    Object.values(apiData).forEach((competition) => {
      competition.matches.forEach((match) => {
        if (idList.includes(match.match_id.toString())) {
          program.push({ ...match });
        }
      });
    });

    // 2️⃣ Découpage en pages de 10 matchs
    const pagesArray = [];
    for (let i = 0; i < program.length; i += 6) {
      pagesArray.push(program.slice(i, i + 6));
    }

    // 3️⃣ Navigation vers la page Competition avec les données
    navigation.navigate('Competition', {
      matchsList: pagesArray,   // liste de pages contenant les matchs
      date: programDate,    // la date passée en paramètre
    });
  }

  // Gérer la sélection des matchs
  const toggleMatchSelection = (matchId) => {
    setSelectedMatches(prev => {
      const updated = { ...prev };
      if (updated[matchId]) {
        delete updated[matchId]; // décocher
      } else {
        updated[matchId] = true; // cocher
      }
      return updated;
    });
  };

  // Gérer l'affichage automatique du calendrier si le clic est fait dans le Header
  useEffect(() => {
    if (route.params?.openCalendar) {
      setShowPicker(true);
      navigation.setParams({ openCalendar: false });
    }
  }, [route.params?.openCalendar]);

  // Gerer les Requettes API
  useEffect(() => {
    // Condition pour éviter les appels d'API inutiles
    const controller = new AbortController(); // sécurité au démontage
    const signal = controller.signal;

    const fetchMatches = async () => {
      if (!isConnected) return;
      try {
        if (apiChoice === 'api-sports') {
          const res = await fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
            headers: {
              "x-rapidapi-key": apiKey ? apiKey : "50b41262bf939cca05ed69c58174d618",
              "x-rapidapi-host": "v3.football.api-sports.io"
            },
            signal: signal,
          });
          if (!res.ok) {
            setIsApiStatusOk(false);
          } else {
            const data = await res.json();
            setProgramDate(new Date(data.parameters.date).toLocaleDateString());
            setMatchsData(data.response.reduce((acc, match) => {
              const compId = match.league.id;
              if (currentID.includes(compId)) {
                if (!acc[compId]) {
                  acc[compId] = {
                    league_id: match.league.id,
                    name: match.league.name,
                    flag: match.league.logo,
                    matches: [],
                  };
                }
                acc[compId].matches.push({
                  league_id: match.league.id,
                  match_id: match.fixture.id,
                  home_team: {
                    name: match.teams.home.name,
                    logo: match.teams.home.logo,
                  },
                  away_team: {
                    name: match.teams.away.name,
                    logo: match.teams.away.logo,
                  },
                  time: match.fixture.date.substring(11, 16),
                });
              }
              return acc;
            }, {})
            );
            setIsApiStatusOk(true);
          }
        } else if (apiChoice === 'football-data') {
          const res = await fetch(`https://api.football-data.org/v4/matches?date=${today}`, {
            headers: {
              "X-Auth-Token": apiKey ? apiKey : "9a9618cbf361494e8f6f235d27bdce41",
              "Accept": "application/json"
            },
            signal: signal,
          });
          if (!res.ok) {
            setIsApiStatusOk(false);
          } else {
          const data = await res.json();
          setProgramDate(new Date(data.resultSet.first).toLocaleDateString());
          setMatchsData(data.matches.reduce((acc, match) => {
            const compId = match.competition.id;
            if (!acc[compId]) {
              acc[compId] = {
                league_id: match.competition.id,
                name: match.competition.name,
                flag: match.competition.emblem,
                matches: [],
              };
            }
            acc[compId].matches.push({
              league_id: match.competition.id,
              match_id: match.id,
              home_team: {
                name: match.homeTeam.shortName,
                logo: match.homeTeam.crest,
              },
              away_team: {
                name: match.awayTeam.shortName,
                logo: match.awayTeam.crest,
              },
              time: match.utcDate.substring(11, 16),
            });
            return acc;
          }, {})
          );
          setIsApiStatusOk(true);
          }
        }
      } catch (error) {
        setIsApiStatusOk(false);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
    return () => controller.abort(); // nettoie si HomePage est démontée
  }, [isConnected, apiChoice, apiKey, today]);

  // Send user device info to Google Sheets
  useEffect(() => {
    const sendToGoogleSheet = async () => {
      const info = await getDeviceInfo();
      const webhookURL = "https://script.google.com/macros/s/AKfycbxWkvROGMjN0bSXduV2ExNss-wvBrx9_2MR8FrcLoPMGaF6x4uZePFwGZAnh5DAmDNMaQ/exec";

      await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
    };
    sendToGoogleSheet();
  }
    , []
  );

  
  // Affichage conditionnel du contenu
  if (!isConnected) {
    content = (
        Alert.alert("🛜Internet:", "Activer ou Vérifiez votre connexion internet 🛜")
    );
  } else if (loading) {
    content = (
      <View style={styles.noData}>
        <ActivityIndicator size={300} color='papayawhip' />
      </View>
    );
  } else if (!isApiStatusOk) {
    content = (
      <View style={styles.centered}>
        <Text style={styles.alertText}>❌ Veuillez changer de Provider dans les paramètres</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.button}>
          <Text style={styles.buttonText}>Aller aux paramètres</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (Object.keys(matchsData).length === 0) {
    content = (
      <View style={styles.centered}>
        <View style={styles.alertContainer}>
        <Text style={styles.alertText}>⚠️: Aucune compétition disponnible à cette Date pour ce Provider.</Text>
        <Text style={{ color: 'papayawhip', marginTop: 10, fontSize: 15, textAlign: 'center' }}>
          Veuillez changer de 📅 Date ou de Provider dans les ⚙️ Paramètres.
        </Text>
        </View>
      </View>
    );
  } else {
    content = (
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={styles.compDate}>
            Date: {new Date(today).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', }).replace(/\//g, '-')}
          </Text>
          <TouchableOpacity
            onPress={() => handleMatchesProgram(selectedMatchsIdsList, matchsData)}
            style={{
              padding: 10,
              backgroundColor: 'rgb(255, 209, 234)',
              borderWidth: 1,
              borderColor: 'rgb(230, 10, 101)',
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'rgb(187, 0, 78)', fontWeight: '900' }}>AFFICHER</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: width,
            padding: 5,
          }}
        >
            {
              Object.values(matchsData).map((comp, index) => (
                <View styles={{ width: '95%', padding: 5 }} key={index}>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      borderColor: 'rgba(80, 79, 79, 0.5)',
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left', padding: 6 }}>{comp.name}</Text>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 35,
                        height: 35,
                        borderRadius: 5,
                        marginRight: 10,
                        backgroundColor: 'rgb(255, 255, 255)'
                      }}
                    >
                      {
                        (comp.flag === null || comp.flag === undefined || comp.flag === "" || comp.flag === "null" || comp.flag === "undefined")
                          ? <Logo height="30" width="30" />
                          : <Image
                            source={{ uri: comp.flag }}
                            style={{
                              width: 30,
                              height: 30,
                            }}
                            resizeMode="contain"
                          />
                      }
                    </View>
                  </View>

                  {comp.matches.map((match) => (
                    <View
                      key={match.match_id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 8,
                        padding: 6,
                        marginVertical: 5,
                      }}
                    >
                      <Meeting match={match} />
                      <TouchableOpacity
                        onPress={() => toggleMatchSelection(match.match_id)}
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: 'white',
                          backgroundColor: selectedMatches[match.match_id] ? 'limegreen' : 'transparent',
                        }}
                      />
                    </View>
                  ))}
                </View>
              ))
            }
        </ScrollView>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={['rgb(255, 0, 149)', 'rgb(0, 26, 255)']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Affichage du Contenu */
          content
        }
        {/* Affichage du calendrier */
          showPicker && (
            <DateTimePicker
              value={new Date(today)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  const newDate = selectedDate.toISOString().split('T')[0];
                  setToday(newDate);
                }
              }}
            />
          )
        }
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  compDate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginLeft: 10,
  },
  noData: {
    flex: 1,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "rgb(255, 212, 23)",
    textAlign: "center",
    marginTop: "50%",
    fontSize: 15,
  },



  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(128, 6, 243)',
  },
  alertContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.38)', 
    borderRadius: 10, 
    borderWidth: 1,
    borderColor: 'rgb(92, 92, 92)', 
    padding: 20,
    margin: 20,
  },
  alertText: {
    color: 'papayawhip',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgb(230, 10, 101)',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
