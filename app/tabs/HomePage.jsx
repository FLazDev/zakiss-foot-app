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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CompetitionCard } from '../components/FootComponents'; // Import de la carte de compétition
import LinearGradient from 'react-native-linear-gradient';
import { SettingsVarObject } from './ContextComponent'; // Import du contexte
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get("window");

export default function HomePage() {

  const navigation = useNavigation();// Pour naviguer vers des écran
  const route = useRoute();
  const [leagues, setLeagues] = useState([]); // Pour stocker la liste des ligues
  const [programDate, setProgramDate] = useState("");
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);// Pour recuperer la date actuelle
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);// Pour gerer l'état de chargement
  const { apiChoice, apiKey } = useContext(SettingsVarObject);

  // Gérer le clic sur une carte de compétition
  function handleCompPress(comp) {
    const pagesArray = [];
    for (let i = 0; i < comp.matches.length; i += 6) {
      pagesArray.push({
        competitionName: comp.name,
        flag: comp.flag,
        matches: comp.matches.slice(i, i + 6),
      });
    }
    navigation.navigate('Competition', {
      league: pagesArray,
      date: programDate
    });
  }

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
          const competitions = data.response.reduce((acc, match) => {
            const compId = match.league.id;
            if (!acc[compId]) {
              acc[compId] = {
                name: match.league.name,
                flag: match.league.logo,
                matches: [],
              };
            }
            acc[compId].matches.push({
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
          }, {});
          setLeagues(competitions);
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
          const competitions = data.matches.reduce((acc, match) => {
            const compId = match.competition.id;
            if (!acc[compId]) {
              acc[compId] = {
                name: match.competition.name,
                flag: match.competition.emblem,
                matches: [],
              };
            }
            acc[compId].matches.push({
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
          }, {});
          setLeagues(competitions);
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
  }, [loading, leagues]);


  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={['rgb(255, 0, 149)', 'rgb(0, 26, 255)']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.compDate}>
          Date: {new Date(today).toLocaleDateString('fr-FR', {year: 'numeric',month: '2-digit',day: '2-digit',}).replace(/\//g, '-')}
        </Text>
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
          {leagues && Object.values(leagues).length > 0 ? (
            Object.values(leagues).map((comp, index) => (
              <CompetitionCard
                key={index}
                data={comp}
                onPress={() => handleCompPress(comp)}
              />
            ))
          ) : (
            <View style={styles.noData}>
              {loading
                ? (<ActivityIndicator style={{ flex: 1, marginTop: '50%' }} size={150} color='papayawhip' />)
                : (<>
                  <Text style={styles.noDataText}>Aucune compétition disponible pour le Moment</Text>
                  <Text style={{ color: 'papayawhip', marginTop: 20 }}>Veuillez changer de Provider ou réessayer sous peu !!!</Text>
                </>)
              }
            </View>
          )}
        </ScrollView>
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
    textAlign: 'center',
    margin:0,
    padding:0,
    marginBottom: 5,
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
