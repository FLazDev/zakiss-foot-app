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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
//import { CompetitionCard } from '../components/FootComponents'; // Import de la carte de compétition
import LinearGradient from 'react-native-linear-gradient';
import { SettingsVarObject } from './ContextComponent'; // Import du contexte
import DateTimePicker from '@react-native-community/datetimepicker';
import { Meeting } from "../components/FootComponents";

const { width } = Dimensions.get("window");

export default function HomePage() {

  const navigation = useNavigation();// Pour naviguer vers des écran
  const route = useRoute();
  const [matchsData, setMatchsData] = useState({}); // in API: Pour stocker les données des matchs
  const [selectedMatches, setSelectedMatches] = useState({}); // in toggleMatchSelection(): Stocker les IDs selectionnés
  const selectedMatchsIdsList = Object.keys(selectedMatches);// Liste des IDs des matchs selectionnés
  const [programDate, setProgramDate] = useState("");
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);// Pour recuperer la date actuelle
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);// Pour gerer l'état de chargement
  const { apiChoice, apiKey } = useContext(SettingsVarObject);

  // Gérer le clic sur une carte de compétition
  function handleMatchesProgram(idList, apiData) {
    const program = [];

    // 1️⃣ Parcourir les compétitions et les matchs
    // Vérifier si l'ID du match est sélectionné
    // Si oui, le pousser dans le tableau `program`
    Object.values(apiData).forEach((competition) => {
      competition.matches.forEach((match) => {
        if (idList.includes(match.match_id.toString())) {
          program.push({...match});
        }
      });
    });

    // 2️⃣ Découpage en pages de 10 matchs
    const pagesArray = [];
    for (let i = 0; i < program.length; i += 10) {
      pagesArray.push(program.slice(i, i + 10));
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
      try {
        if (apiChoice === 'api-sports') {
          const res = await fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
            headers: {
              "x-rapidapi-key": apiKey ? apiKey : "50b41262bf939cca05ed69c58174d618",
              "x-rapidapi-host": "v3.football.api-sports.io"
            },
            signal: signal,
          });
          const data = await res.json();
          setProgramDate(new Date(data.parameters.date).toLocaleDateString());
          setMatchsData(data.response.reduce((acc, match) => {
            const compId = match.league.id;
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
            return acc;
          }, {})
          );
          setLoading(false);
        } else if (apiChoice === 'football-data') {
          const res = await fetch(`https://api.football-data.org/v4/matches?date=${today}`, {
            headers: {
              "X-Auth-Token": apiKey ? apiKey : "9a9618cbf361494e8f6f235d27bdce41",
              "Accept": "application/json"
            },
            signal: signal,
          });
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
          setLoading(false);
        }
      } catch (error) {
        Alert.alert("ALERT:", "Accès impossible aux Données. Vérifiez votre connexion internet et redémarrez.");
      }
    };
    fetchMatches();
    return () => controller.abort(); // nettoie si HomePage est démontée
  }, [apiChoice, apiKey, today]);

  // Gerer un Timer pour le temps du Chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 90000);
    return () => clearTimeout(timer);
  }, [loading, matchsData]);


  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={['rgb(255, 0, 149)', 'rgb(0, 26, 255)']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={styles.compDate}>
            Date: {new Date(today).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', }).replace(/\//g, '-')}
          </Text>
          <TouchableOpacity onPress={() => handleMatchesProgram(selectedMatchsIdsList, matchsData)} style={{ padding: 10 }}>
            <Text style={{ color: 'white' }}>Programmer</Text>
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
          {matchsData && Object.values(matchsData).length > 0
            ? (
              Object.values(matchsData).map((comp, index) => (
                <View styles={{ width: '95%', padding: 5 }} key={index}>

                  <View style={{ borderBottomWidth: 2, width: '100%' }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left' }}>{comp.name}</Text>
                  </View>

                  {comp.matches.map((match) => (
                    <View
                      key={match.match_id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.05)', // un petit fond pour la ligne si tu veux
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
            )
            : (
              <View style={styles.noData}>
                {loading
                  ? (<ActivityIndicator style={{ flex: 1, marginTop: '50%' }} size={150} color='papayawhip' />)
                  : (<>
                    <Text style={styles.noDataText}>Aucune compétition disponible pour le Moment</Text>
                    <Text style={{ color: 'papayawhip', marginTop: 20 }}>Veuillez changer de Provider ou réessayer sous peu !!!</Text>
                  </>)
                }
              </View>
            )
          }
        </ScrollView>
        {/*
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
          {matchsData && Object.values(matchsData).length > 0
            ? (
              Object.values(matchsData).map((comp, index) => (
                <CompetitionCard
                  key={comp.league_id}
                  data={comp}
                //onPress={() => handleCompPress(comp)}
                >
                  <View style={{ borderBottomWidth: 2, width: '100%' }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left' }}>{comp.name}</Text>
                  </View>
                  {comp[matches].map((match) => (
                    <Meeting
                      key={match.match_id}
                      match={match}
                    />
                    // ici: la Case à cocher pour selectioner le match
                  ))}
                </CompetitionCard>
              ))
            )
            : (
              <View style={styles.noData}>
                {loading
                  ? (<ActivityIndicator style={{ flex: 1, marginTop: '50%' }} size={150} color='papayawhip' />)
                  : (<>
                    <Text style={styles.noDataText}>Aucune compétition disponible pour le Moment</Text>
                    <Text style={{ color: 'papayawhip', marginTop: 20 }}>Veuillez changer de Provider ou réessayer sous peu !!!</Text>
                  </>)
                }
              </View>
            )
          }
        </ScrollView>
        */}
        {showPicker && (
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
        )}
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
    alignItems: "center",
  },
  noDataText: {
    color: "rgb(255, 212, 23)",
    textAlign: "center",
    marginTop: "50%",
    fontSize: 15,
  }
});
