import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";

// Carte de rencontre
export const Meeting = ({ match }) => (
  <View style={styles.meeting}>
    <View style={styles.equip}>
      <View style={styles.equipLogoBG}>
        <Image
          source={{ uri: match.home_team.logo }}
          style={styles.equipLogo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.equipName}>{match.home_team.name}</Text>
    </View>
    <View style={styles.meetingHourCont}>
      <Text style={styles.meetingHourVal}>{match.time}</Text>
    </View>
    <View style={styles.equip}>
      <View style={styles.equipLogoBG}>
        <Image
          source={{ uri: match.away_team.logo }}
          style={styles.equipLogo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.equipName}>{match.away_team.name}</Text>
    </View>
  </View>
);

// Carte de compétition
export const CompetitionCard = ({ onPress, data }) => {
  return (
    <TouchableOpacity style={styles.compContainer} onPress={onPress}>
      <Text style={styles.compTitle}>{data.name}</Text>
      <Image source={{ uri: data.flag }} style={styles.image} />
      <Text>
        <Text style={styles.subtitle}>Matchs: </Text>
        <Text style={styles.matchesCount}>{data.matches.length}</Text>
      </Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  meeting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    height: 72,
    backgroundColor: "rgba(8, 4, 250, 0.5)",
    borderWidth: 1,
    borderColor: "rgb(46, 219, 250)",
    borderRadius: 8,
    marginVertical: 2,
  },
  equip: {
    alignItems: "center",
    width: 125,
  },
  equipLogoBG: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 4,
    padding: 4,
  },
  equipLogo: {
    width: 42,
    height: 42,
  },
  equipName: {
    fontSize: 10,
    fontWeight:"bold",
    color: "white",
  },
  meetingHourCont: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 4,
  },
  meetingHourVal: {
    fontSize: 12,
    fontWeight: "bold",
  },

  compContainer: {
    width: 160,
    height: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    marginBottom: 10,
  },
  compTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: 'red',
    margin: 0,
    padding: 0,
  },
  image: {
    width: 150,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: 'blue',
    margin: 0,
    padding: 0,
  },
  matchesCount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    margin: 0,
    padding: 0,
  },
});