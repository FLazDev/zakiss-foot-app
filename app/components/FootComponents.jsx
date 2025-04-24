import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Tableau Match
export const Meeting = ({ match }) => (
  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "87%", height: 72, backgroundColor: "rgba(8, 4, 250, 0.5)", borderWidth: 1, borderColor: "rgb(46, 219, 250)", borderRadius: 8, marginVertical: 2}}>
    <View style={{ alignItems: "center",width: 125 }}>
      <View style={{width: 50,height: 50,backgroundColor: "rgba(255, 255, 255, 1)",borderRadius: 4,padding: 4,}}>
        <Image
          source={{ uri: match.home_team.logo }}
          resizeMode="contain"
          style={{
            width: 42,
            height: 42,
          }}
        />
      </View>
      <Text style={{fontSize: 10,fontWeight:"bold",color: "white"}}>
        {match.home_team.name}
      </Text>
    </View>
    <View style={{padding: 4,backgroundColor: "white",borderRadius: 4}}>
      <Text style={{fontSize: 12,fontWeight: "bold",}}>{match.time}</Text>
    </View>
    <View style={{ alignItems: "center",width: 125 }}>
      <View style={{width: 50,height: 50,backgroundColor: "rgba(255, 255, 255, 1)",borderRadius: 4,padding: 4,}}>
        <Image
          source={{ uri: match.away_team.logo }}
          resizeMode="contain"
          style={{
            width: 42,
            height: 42,
          }}
        />
      </View>
      <Text style={{fontSize: 10,fontWeight:"bold",color: "white"}}>
        {match.away_team.name}
      </Text>
    </View>
  </View>
);

export const MeetingInProg = ({ match }) => (
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

const styles = StyleSheet.create({
  meeting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    //width: "87%",
    maxWidth: width * 0.87,
    maxHeight:height * 0.10,
    //height: {height} * 0.10,
    backgroundColor: "rgba(8, 4, 250, 0.5)",
    borderWidth: 1,
    borderColor: "rgb(46, 219, 250)",
    borderRadius: 8,
    marginVertical: 2,
  },
  equip: {
    alignItems: "center",
    minWidth: width * 0.347,
  },
  equipLogoBG: {
    width: width * 0.1389,
    height: height * 0.0641,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 4,
    padding: 4,
    marginTop: 2,
  },
  equipLogo: {
    width: width * 0.1166,
    height: height * 0.0538,
  },
  equipName: {
    fontSize: width * 0.023,
    fontWeight:"bold",
    color: "white",
  },
  meetingHourCont: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 2,
  },
  meetingHourVal: {
    fontSize: width * 0.033,//12,
    fontWeight: "bold",
  },
});