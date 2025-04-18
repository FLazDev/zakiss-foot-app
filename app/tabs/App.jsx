// Hooks Imports
import 'react-native-reanimated';
import React, { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

// Components Imports
import HomePage from './HomePage';
import Competition from './Competition';
import Settings from './Settings';
import About from './About';
import { SettingsProviderComponent } from './ContextComponent'; // <= import du provider
import CustomDrawerContent from './DrawerContent';

// Types de Navigation
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Fonctions Declaration
// 🔹 Stack
function MainPages({ navigation, route }) {
  const competitionRef = useRef(null); // Référence pour le composant Competition
  return (
    <Stack.Navigator
      initialRouteName="Home"// Ecran par defaut
      screenOptions={{
        headerShown:true,
        headerBackground: () => (
          <LinearGradient
            colors={['rgb(255, 255, 255)', 'rgb(255, 0, 149)']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
      }}
    >
      {/*Ecrans*/}
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={({ navigation }) => ({
          title: 'Liste des Competitions',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="menu" size={37} color="rgb(128, 0, 145)" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.setParams({ openCalendar: true })}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="calendar-number-outline" size={35} color="rgb(251, 221, 255)" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'left',
          headerTintColor: "rgb(66, 64, 64)",
          animation: 'slide_from_right',
          statusBarBackgroundColor: 'rgb(128, 6, 243)',
        })}
      />
      <Stack.Screen
        name="Competition"
        options={{
          title: "Matches",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                competitionRef.current?.captureAndShare()
              }}
              style={{ marginRight: 0 }}
            >
              <Ionicons name="logo-whatsapp" size={30} color="#fff" />
            </TouchableOpacity>
          ),
          statusBarBackgroundColor: 'rgb(128, 6, 243)',
          headerTitleAlign: 'left',
          headerBlurEffect: 'systemUltraThinMaterialLight',
          headerTintColor: "rgba(168, 3, 146, 1)",
          animation: 'slide_from_right',
          //headerShown: true,
        }}
      >
        {(props) => <Competition {...props} ref={competitionRef} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// 🔹 Drawer + Navigation principal
export default function App() {
  return (
    <SettingsProviderComponent>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Accueil"
          screenOptions={({ route }) => ({
            headerShown: false, // Le header est géré dans le stack
            drawerIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Accueil':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'Paramètres':
                  iconName = focused ? 'settings' : 'settings-outline';
                  break;
                case 'À propos':
                  iconName = focused ? 'information-circle' : 'information-circle-outline';
                  break;
                default:
                  iconName = 'apps';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            drawerActiveTintColor: '#e91e63',
            drawerInactiveTintColor: '#777',
            drawerLabelStyle: { marginLeft: 10, fontSize: 20 },
          })}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Accueil" component={MainPages} />
          <Drawer.Screen name="Paramètres" component={Settings} />
          <Drawer.Screen name="À propos" component={About} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SettingsProviderComponent>
  );
}

