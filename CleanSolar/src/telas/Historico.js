// Importação de componentes essenciais do React Native para construção da interface
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';

export default function Historico() {
  return (
    // Componente de imagem de fundo que envolve toda a tela
    <ImageBackground
      source={require("../../assets/fundo.png")} // Caminho relativo para a imagem de fundo
      style={styles.fundo}                       // Aplica o estilo de preenchimento e espaçamento interno
      resizeMode="cover"                         // Ajusta a imagem para cobrir toda a área disponível
    >
      {/* Container principal para centralização do conteúdo da tela */}
      <View style={styles.container}>
        {/* Texto exibido no centro da tela */}
        <Text>Graficos</Text>
      </View>
    </ImageBackground>
  );
}

// Objeto de estilização da tela de Histórico
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