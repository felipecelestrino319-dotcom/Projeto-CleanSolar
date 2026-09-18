// Importação dos componentes do React Native necessários para construir a interface
import { View, Text, StyleSheet, ScrollView, ImageBackground } from "react-native";

export default function Home() {
  return (
    // Componente de fundo para aplicar a imagem de background em toda a tela
    <ImageBackground
      source={require("../../assets/fundo.png")}
      style={styles.fundo}
      resizeMode="cover"
    >
      {/* ScrollView permite rolar a tela quando o conteúdo excede o tamanho visível */}
      <ScrollView style={styles.container}>

        {/* Título e subtítulo principal do aplicativo */}
        <Text style={styles.titulo}>☀ CleanSolar</Text>
        <Text style={styles.subtitulo}>
          Monitoramento Inteligente de Placas Solares
        </Text>

        {/* Card 1: Exibe o status atual de limpeza da placa */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>🟢 Status da Placa</Text>
          <Text style={styles.valor}>Limpa</Text>
        </View>

        {/* Card 2: Exibe os dados de geração de energia (Potência, Tensão e Corrente) */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>⚡ Produção Atual</Text>
          <Text style={styles.valor}>18,6 W</Text>

          <View style={styles.linha}>
            <Text style={styles.info}>Tensão</Text>
            <Text style={styles.info}>18,2 V</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.info}>Corrente</Text>
            <Text style={styles.info}>1,02 A</Text>
          </View>
        </View>

        {/* Card 3: Exibe as medições dos sensores de luminosidade e índice de sujeira */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>☀ Sensores de Luminosidade</Text>

          <View style={styles.linha}>
            <Text style={styles.info}>Sensor Externo</Text>
            <Text style={styles.info}>92%</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.info}>Sensor Interno</Text>
            <Text style={styles.info}>86%</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.info}>Índice de Sujeira</Text>
            <Text style={styles.info}>6%</Text>
          </View>
        </View>

        {/* Card 4: Informações sobre o robô/mecanismo de limpeza */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>🤖 Sistema de Limpeza</Text>

          <View style={styles.linha}>
            <Text style={styles.info}>Status</Text>
            <Text style={styles.info}>Em espera</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.info}>Última limpeza</Text>
            <Text style={styles.info}>08/07/2026</Text>
          </View>
        </View>

        {/* Card 5: Métricas acumuladas do sistema */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>📊 Estatísticas</Text>

          <View style={styles.linha}>
            <Text style={styles.info}>Limpezas realizadas</Text>
            <Text style={styles.info}>14</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.info}>Dias em bom estado</Text>
            <Text style={styles.info}>21</Text>
          </View>

        </View>

      </ScrollView>

    </ImageBackground>
  );
}

// Objeto de estilização com as regras visuais dos componentes
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
    padding: 15,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F5E2E",
    textAlign: "center",
    marginTop: 15,
  },

  subtitulo: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C5C91",
    marginBottom: 10,
  },

  valor: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F5E2E",
    textAlign: "center",
    marginBottom: 10,
  },

  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  info: {
    fontSize: 16,
    color: "#333",
  },

  fundo: {
    flex: 1,
    padding: 15,
  },

});