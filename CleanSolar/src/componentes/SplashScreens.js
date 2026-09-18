import { View,Text, Image, StyleSheet, ImageBackground } from 'react-native';

export default function SplashScreen() {
  return (
    <ImageBackground
            source={require("../../assets/fundo.png")}
            style={styles.fundo}
            resizeMode="cover"
        >

    <View style={styles.container}>
      <Image
        source={require("../../assets/logo_projeto1.png")}
        style={styles.logo}
      />
    </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },

  titulo: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#d9d9d9",
    marginTop: 10,
    fontSize: 16,
  },

  fundo: {
    flex: 1,
    padding: 15,
  },
});
