// Importação de hooks do React para controle de estado e ciclo de vida
import React, { useState, useEffect } from 'react';

// Importação de componentes essenciais da interface do React Native
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';

// Importação do seletor e capturador de imagens do Expo
import * as ImagePicker from 'expo-image-picker';

// Importação do armazenamento seguro nativo do Expo
import * as SecureStore from 'expo-secure-store';

// Importação da instância configurada do Axios para requisições HTTP
import api from '../Api/api';

export default function PerfilScreen({ navigation }) {
  // Estados para gerenciar as informações do perfil e fluxo visual
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [email, setEmail] = useState('Carregando...');
  const [senha, setSenha] = useState('••••••••');
  const [exibirSenha, setExibirSenha] = useState(false);
  const [localizacao, setLocalizacao] = useState('Carregando localização...');
  const [loading, setLoading] = useState(true);

  // Executa o carregamento dos dados do usuário assim que a tela é montada
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  // Busca os dados diretamente da API do MySQL
  async function carregarDadosUsuario() {
    setLoading(true);
    try {
      let userId = null;

      // Obtém o ID do usuário de acordo com a plataforma (Web ou Mobile)
      if (Platform.OS === 'web') {
        userId = localStorage.getItem('user_id');
      } else {
        userId = await SecureStore.getItemAsync('user_id');
      }

      // Se nenhum ID for encontrado, define estados padrão e encerra a execução
      if (!userId) {
        setLocalizacao('Usuário não identificado');
        setEmail('Não identificado');
        return;
      }

      // Realiza a requisição GET na API Node.js/MySQL
      const resposta = await api.get(`/usuarios/${userId}`);
      const usuario = resposta.data;

      // Se encontrar o usuário, atualiza os estados com os dados retornados
      if (usuario) {
        if (usuario.email) setEmail(usuario.email);
        if (usuario.senha) setSenha(usuario.senha);

        // Mapeamento compatível para chave da foto de perfil
        const urlFoto = usuario.foto || usuario.fotos_de_perfil;
        if (urlFoto) setFotoPerfil(urlFoto);

        // Mapeamento compatível para campo de localização
        const endLocal = usuario.localizacao || usuario.localicao;
        if (endLocal) {
          setLocalizacao(endLocal);
        } else {
          setLocalizacao('Localização não cadastrada');
        }
      }
    } catch (error) {
      console.log('Erro ao carregar dados do usuário:', error);
      setLocalizacao('Erro ao carregar dados do servidor');
    } finally {
      setLoading(false);
    }
  }

  // Captura a foto através da câmera do dispositivo
  async function tirarFotoPerfil() {
    // Solicita permissão para acessar a câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      return Alert.alert(
        'Permissão necessária',
        'É preciso permitir o acesso à câmera para tirar a foto de perfil.'
      );
    }

    // Abre a câmera do dispositivo com suporte a edição
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // Retorna os dados em Base64 para salvar no banco
    });

    // Se o usuário não cancelou a captura e tirou a foto
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64Image = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;

      setFotoPerfil(base64Image);
      await salvarFotoNoBanco(base64Image);
    }
  }

  // Escolhe foto diretamente da galeria do dispositivo
  async function escolherFotoGaleria() {
    // Solicita permissão para acessar a biblioteca de mídias
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      return Alert.alert(
        'Permissão necessária',
        'É preciso permitir o acesso à galeria para escolher uma foto.'
      );
    }

    // Abre a galeria de fotos
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    // Se uma imagem for selecionada com sucesso
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64Image = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;

      setFotoPerfil(base64Image);
      await salvarFotoNoBanco(base64Image);
    }
  }

  // Persiste a imagem no banco de dados remoto via API
  async function salvarFotoNoBanco(uriOuBase64) {
    try {
      let userId = null;
      if (Platform.OS === 'web') {
        userId = localStorage.getItem('user_id');
      } else {
        userId = await SecureStore.getItemAsync('user_id');
      }

      if (userId) {
        // Envia a requisição PUT para atualizar a foto do usuário no servidor
        await api.put(`/usuarios/${userId}/foto`, { foto: uriOuBase64 });

        // Atualiza as informações mantidas no cache local
        const dadosAtuais = { email, senha, foto: uriOuBase64, localizacao };
        if (Platform.OS === 'web') {
          localStorage.setItem('usuario_logado', JSON.stringify(dadosAtuais));
        } else {
          await SecureStore.setItemAsync(
            'usuario_logado',
            JSON.stringify(dadosAtuais)
          );
        }

        Alert.alert('Sucesso', 'Foto atualizada e salva no banco de dados!');
      }
    } catch (e) {
      console.log('Erro ao salvar foto no banco:', e);
      Alert.alert('Erro', 'Não foi possível salvar a foto no servidor.');
    }
  }

  // Função para efetuar o logout e limpar a sessão local
  async function fazerLogout() {
    try {
      // Remove o ID e os dados do usuário logado do armazenamento local
      if (Platform.OS === 'web') {
        localStorage.removeItem('user_id');
        localStorage.removeItem('usuario_logado');
      } else {
        await SecureStore.deleteItemAsync('user_id');
        await SecureStore.deleteItemAsync('usuario_logado');
      }

      // Reseta a navegação e envia o usuário de volta para a tela de Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Erro ao sair:', error);
    }
  }

  // Tela de carregamento exibida enquanto os dados do servidor são recuperados
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: '#94a3b8', marginTop: 12 }}>
          Carregando dados do perfil...
        </Text>
      </View>
    );
  }

  return (
    // Container principal com rolagem
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>

      {/* Seção da foto de perfil */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={tirarFotoPerfil} activeOpacity={0.8}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Botão para acionar a câmera */}
        <View style={styles.botoesFotoRow}>
          <TouchableOpacity style={styles.btnFotoUnico} onPress={tirarFotoPerfil}>
            <Text style={styles.btnFotoText}>Câmera</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cartão exibindo o e-mail cadastrado */}
      <View style={styles.cardInfo}>
        <Text style={styles.label}>E-mail Cadastrado:</Text>
        <Text style={styles.valor}>{email}</Text>
      </View>

      {/* Cartão exibindo a senha (com opção de mostrar/ocultar) */}
      <View style={styles.cardInfo}>
        <Text style={styles.label}>Senha:</Text>
        <View style={styles.senhaRow}>
          <Text style={styles.valor}>{exibirSenha ? senha : '••••••••'}</Text>
          <TouchableOpacity onPress={() => setExibirSenha(!exibirSenha)}>
            <Text style={styles.linkMostrar}>
              {exibirSenha ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cartão exibindo a localização do cadastro */}
      <View style={styles.cardInfo}>
        <Text style={styles.label}>📍 Localização do Cadastro (Fixo):</Text>
        <Text style={styles.valorLocal}>{localizacao}</Text>
      </View>

      {/* Botão para encerrar a sessão */}
      <TouchableOpacity style={styles.btnSair} onPress={fazerLogout}>
        <Text style={styles.btnSairText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilização dos componentes visuais
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: 'white',
    flexGrow: 1,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F5E2E',
    marginBottom: 24,
    marginTop: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#0A3057',
  },
  avatarPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#0A3057',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0A3057',
  },
  avatarEmoji: {
    fontSize: 60,
  },
  botoesFotoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  btnFotoUnico: {
    backgroundColor: '#0A3057',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  btnFotoText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnGaleria: {
    backgroundColor: '#0A3057',
  },
  cardInfo: {
    width: '100%',
    backgroundColor: '#0A3057',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  valor: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  valorLocal: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  senhaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkMostrar: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnSair: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  btnSairText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});