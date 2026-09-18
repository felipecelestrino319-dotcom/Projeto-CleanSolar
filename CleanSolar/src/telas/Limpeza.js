import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, ScrollView, Pressable, Button } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function Limpeza() {
  const [opcao, setOpcao] = useState("");

  return (
    <ImageBackground
        source={require("../../assets/fundo.png")}
        style={styles.fundo}
        resizeMode="cover"
    >

    <ScrollView style={styles.container}>

      <Text style={styles.titulo}>Controle de Limpeza</Text>

      <View style={styles.card}>

        <View style={styles.linha}>
          <Text style={styles.info}>Status</Text>
          <Text style={styles.status}>Em espera</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Índice de sujeira</Text>
          <Text style={styles.valor}>12%</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Última limpeza</Text>
          <Text style={styles.valor}>29/07/2026</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.info}>Horário</Text>
          <Text style={styles.valor}>09:42</Text>
        </View>

      </View>

      <Text style={styles.subtitulo}>Modo de funcionamento</Text>

      <View>
        <RNPickerSelect
          onValueChange={(value) => setOpcao(value)}
          placeholder={{
            value: null,
          }}
          items={[
            { label: "Automático", value: "automatico" },
            { label: "Manual", value: "manual" },
          ]}
        />
      </View>

      {opcao === "manual" && (
        <View style={styles.areaControle}>
            <Button
                style={{ marginTop: 30, marginBottom: 50 }}
                title="Limpar"
                onPress={"Limpeza Iniciada..."}
                color={'#1C5C91'}
                />
        </View>
      )}

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
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C5C91",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    elevation: 4,
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