import React, { createContext, useState } from 'react';

// 1. Initialisation de Context SettingsVarObject
export const SettingsVarObject = createContext();
// SettingsVarObject = { Provider:"", Consumer:""} // "Provider" fournit les données et "Consumer" consomme les données

// 2. Definition du Composant Provider de SettingsVarObject
export function SettingsProviderComponent({ children }) {
  // Valeurs
  const [apiChoice, setApiChoice] = useState('api-sports'); // 'api-sports' ou 'football-data'
  const [apiKey, setApiKey] = useState(''); // valeur vide par défaut
  const [backgroundImage, setBackgroundImage] = useState("bg1");
    const imageMap = {
      bg1: require("../../assets/images/BG/BG1.jpg"),
      bg2: require("../../assets/images/BG/BG2.jpg"),
      bg3: require("../../assets/images/BG/BG3.jpg"),
      bg4: require("../../assets/images/BG/BG4.jpg"),
      bg5: require("../../assets/images/BG/BG5.jpg"),
      bg6: require("../../assets/images/BG/BG6.jpg"),
      bg7: require("../../assets/images/BG/BG7.jpg"),
    };

  return (
    <SettingsVarObject.Provider
      value={{
        apiChoice,
        setApiChoice,
        apiKey,
        setApiKey,
        backgroundImage,
        setBackgroundImage,
        imageMap,
      }}
    >
      {children}
    </SettingsVarObject.Provider>
  );
}
