import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, ScrollView, Pressable, Button } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function Monitoramento() {

  return (
    <ImageBackground
        source={require("../../assets/fundo.png")}
        style={styles.fundo}
        resizeMode="cover"
    >

    <ScrollView style={styles.container}>

      <Text style={styles.titulo}>Monitoramento</Text>

      <View style={styles.card}>

        <Text style={styles.subtitulo}>Sensores</Text>

        <View style={styles.linha}>
          <Text style={styles.info}>Sensor Externo</Text>
          <Text style={styles.status}>85.000 lux</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Sensor Interno</Text>
          <Text style={styles.status}>77.500 lux</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Diferença</Text>
          <Text style={styles.status}>7.500 lux</Text>
        </View>

      </View>

      <View style={styles.card}>

        <Text style={styles.subtitulo}>Painel Solar</Text>

        <View style={styles.linha}>
          <Text style={styles.info}>Tensão</Text>
          <Text style={styles.status}>18,2 A</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Corrente</Text>
          <Text style={styles.status}>1,02 A</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Potência</Text>
          <Text style={styles.status}>18,6 W</Text>
        </View>

      </View>

    </ScrollView>


    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
  },

  subtitulo: {
    marginTop: 1,
    marginBottom: 10,
    marginLeft: 65,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C5C91",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    elevation: 4,
    marginBottom: 20,
  },

  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  info: {
    fontSize: 16,
    color: "#333",
  },

  valor: {
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    color: "#0F8A3A",
    fontWeight: "bold",
  },

  botao: {
    marginTop: 100,
  },


  fundo: {
    flex: 1,
    padding: 15,
  },

  areaControle: {
  marginTop: 15,
  gap: 35,
},
});