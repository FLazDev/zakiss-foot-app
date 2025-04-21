import React, { useRef, useImperativeHandle, forwardRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";// Pour Initaliser le startValue
import { Shape} from "../components/SvgComponents";
import { MeetingInProg } from "../components/FootComponents";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { SettingsVarObject } from "./ContextComponent";
const { width, height } = Dimensions.get("window");

// utilisation de la fonction forwardRef pour permettre à un composant parent de référencer ce composant
// et d'accéder à ses méthodes ou propriétés
const Competition = forwardRef((props, ref) => {

  const startValue = useRoute();// Initialisation du startValue
  const { matchsList = [], date = "" } = startValue.params || {};// Récupération des données de startValue par destructuration
  const { backgroundImage, imageMap } = useContext(SettingsVarObject);
  const viewShotRef = useRef(null);

  useImperativeHandle(ref, () => ({
    captureAndShare: async () => {
      try {
        const uri = await viewShotRef.current.capture();
        const shareOptions = {
          title: "Partager sur WhatsApp",
          url: `file://${uri}`,
          social: Share.Social.WHATSAPP,
        };
        await Share.shareSingle(shareOptions);
      } catch (error) {
        console.error("Erreur de capture/partage:", error);
      }
    },

  }));

  return (
    <SafeAreaView style={styles.safeAV}>
      {/* Zone à capturer */}
      <ViewShot
        ref={viewShotRef}
        style={{ flex: 1 }}
        options={{
          format: "png",  // PNG = meilleure qualité, pas de compression
          quality: 1,      // Qualité maximale
          width: width * 5, // *2 pour capturer en haute résolution
          height: (height * 0.93) * 5
        }}
      >
        <ImageBackground
          source={imageMap[backgroundImage]}
          style={[styles.pageBackground]}
          resizeMode="cover"
        >
        <Shape
          date={date}
          xbet="72077071"
          betwin="06794747"
          style={{
            position: "absolute",
            zIndex: 0,
          }}
        />
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          justifyContent="space-around"
          style={styles.scrollView}
        >
          {matchsList.map((page, index) => (
            <View 
              style={[styles.carouselPage, { width }]
              }
              key={index}
            >
              {page.map((match, index) => (
                <MeetingInProg
                  key={`${match.home_team.name}-${match.away_team.name}-${index}`}
                  match={match}
                />
              ))}
            </View>
          ))}
        </ScrollView>
        </ImageBackground>
      </ViewShot>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeAV: {
    flex: 1,
  },
  pageBackground: {
    flex: 1,
  },
  main: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 2,
    paddingBottom: 2,
  },
  scrollView: {
    flex: 1,
    position: "absolute", 
    zIndex: 1, 
    width: "100%", 
    height: "73%",
    top: '16%', 
    left: 0, 
    right: 0, 
    bottom: 0,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    margin: 0,
    padding: 0,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  categoTitleCont: {
    width: "80%",
    padding: 4,
    backgroundColor: "rgba(78, 54, 67, 0.5)",
    borderRadius: 4,
  },
  categoryBackground: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    resizeMode: "contain",
    opacity: 0.5,
  },
  carouselPage: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Competition;
