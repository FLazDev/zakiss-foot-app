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
import { ShapeTemplate, HeaderV1_1, FooterV1_1, Logo, Firefox } from "../components/SvgComponents";
import { Meeting } from "../components/FootComponents";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { SettingsVarObject } from "./ContextComponent";
import LogoBlanc from "../../assets/images/ZakisLogoBlanc.svg";
const { width, height } = Dimensions.get("window");


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
        <ShapeTemplate />
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {matchsList.map((page) => (
            <View style={[styles.carouselPage, { width }]}>
              {page.map((match) => (
                <Meeting
                  key={match_id}
                  match={match}
                />
              ))}
            </View>
          ))}
        </ScrollView>

        {/*
        <ImageBackground
          source={imageMap[backgroundImage]}//{require("../../assets/images/BG.jpg")}
          style={styles.pageBackground}
        >
          <View style={styles.main}>
            <HeaderV1_1 width="353" height="88" date={date} />
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}
            >
              {matchsList.map((comp, index) => (
                <ImageBackground
                  key={index}
                  source={{ uri: comp.flag }}
                  style={styles.categoryBackground}
                  imageStyle={styles.categoryImage}
                >
                  <View style={[styles.carouselPage, { width }]}>
                    <View style={styles.categoTitleCont}>
                      <Text style={styles.categoryTitle}>{comp.competitionName}</Text>
                    </View>
                    {comp.matches.map((match) => (
                      <Meeting
                        key={`${match.home_team.name}-${match.away_team.name}`}
                        match={match}
                      />
                    ))}
                  </View>
                </ImageBackground>
              ))}
            </ScrollView>
            <FooterV1_1 width="350" height="74" number1="72077071" number2="06794747"/>
          </View>
        </ImageBackground>
        */}
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
