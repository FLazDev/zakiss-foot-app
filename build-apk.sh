#!/bin/bash

cd android || { echo "❌ Dossier android introuvable"; exit 1; }

while true; do
  echo ""
  echo "🔧 Choisis le type de build :"
  echo "1. 🐞 Debug"
  echo "2. 🔐 Release"
  echo "q. ❌ Quitter"
  echo ""

  read -p "Ton choix : " CHOICE

  case "$CHOICE" in
    1)
      echo "📦 Compilation Debug..."
      ./gradlew assembleDebug
      APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
      break
      ;;
    2)
      echo "📦 Compilation Release..."
      ./gradlew assembleRelease
      APK_PATH="app/build/outputs/apk/release/app-release.apk"
      break
      ;;
    q)
      echo "👋 Bye !"
      exit 0
      ;;
    *)
      echo "❗ Choix invalide. Essaie encore."
      ;;
  esac
done

if [ -f "$APK_PATH" ]; then
  echo ""
  echo "✅ APK généré avec succès à : $APK_PATH"
  
  read -p "🔌 Souhaites-tu l'installer sur ton appareil connecté ? (y/n) : " INSTALL

  if [[ "$INSTALL" == "y" || "$INSTALL" == "Y" ]]; then
    echo "📲 Installation..."
    adb install -r "$APK_PATH"
    echo "✅ Installation terminée."
  else
    echo "🚫 Installation annulée."
  fi
else
  echo "❌ APK non trouvé. Quelque chose a échoué."
fi
