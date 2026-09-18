// Importações do React e dos hooks de estado
import { useState } from 'react';

// Importação dos componentes visuais do React Native
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Pressable, Platform } from 'react-native';

// Importação dos ícones do pacote Expo
import { Ionicons } from '@expo/vector-icons';

// Importação da biblioteca para armazenamento seguro (tokens/IDs) no mobile
import * as SecureStore from 'expo-secure-store';

// Importação da instância pré-configurada do Axios para requisições na API
import api from '../Api/api';

export default function Login({ navigation }) {
    // Estados locais para controlar os campos do formulário e feedback do usuário
    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState('');
    const [Erro, setErro] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    // Função responsável pela autenticação do usuário
    async function logar() {
        // Validação básica de campos vazios
        if (!Email.trim() || !Senha.trim()) {
            setErro("Preencha o e-mail e a senha");
            return;
        }

        setCarregando(true);
        setErro("");

        try {
            // Chamada HTTP POST enviando os dados digitados
            const resposta = await api.post("/usuarios/login", {
                email: Email.trim(),
                senha: Senha.trim(),
            });

            console.log("Login bem-sucedido:", resposta.data);

            // Obtém os dados do usuário retornados na resposta do servidor
            const usuarioLogado = resposta.data.usuario;

            // Verifica se o ID do usuário existe para realizar a gravação
            if (usuarioLogado && usuarioLogado.id) {
                const userId = String(usuarioLogado.id);

                // Armazena o ID localmente dependendo da plataforma (Web x Mobile)
                if (Platform.OS === 'web') {
                    localStorage.setItem('user_id', userId);
                } else {
                    await SecureStore.setItemAsync('user_id', userId);
                }

                // Redireciona para o fluxo interno do app substituindo a tela na pilha
                navigation.replace("Drawer");
            } else {
                setErro("Resposta inválida do servidor. Tente novamente.");
            }

        } catch (erro) {
            // Tratamento de erros de requisição
            console.log("Erro ao logar:", erro);
            if (erro.response && erro.response.data && erro.response.data.mensagem) {
                setErro(erro.response.data.mensagem);
            } else if (erro.request) {
                setErro("Não foi possível conectar ao servidor.");
            } else {
                setErro("Erro ao realizar login");
            }
        } finally {
            // Finaliza o estado de carregamento independente do resultado
            setCarregando(false);
        }
    }

    return (
        // Imagem de fundo cobrindo a tela toda
        <ImageBackground
            source={require("../../assets/fundo.png")}
            style={styles.fundo}
            resizeMode="cover"
        >
            {/* Conteúdo central do formulário */}
            <View style={styles.container}>
                {/* Logotipo da aplicação */}
                <Image
                    source={require("../../assets/logo_projeto1.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.titulo}>Login</Text>

                {/* Campo de entrada de e-mail */}
                <TextInput
                    style={styles.input}
                    placeholder='Digite o e-mail:'
                    placeholderTextColor='#0A3057'
                    onChangeText={setEmail}
                    value={Email}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                />

                {/* Container do campo de senha + ícone de visibilidade */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputSenha}
                        placeholder="Digite sua senha:"
                        placeholderTextColor='#0A3057'
                        onChangeText={setSenha}
                        value={Senha}
                        secureTextEntry={!mostrarSenha}
                    />

                    {/* Ícone para alternar entre mostrar/ocultar senha */}
                    <Ionicons
                        style={styles.icone}
                        name={mostrarSenha ? "eye-off" : "eye"}
                        size={24}
                        color='#0A3057'
                        onPress={() => setMostrarSenha(!mostrarSenha)}
                    />
                </View>

                {/* Exibição condicional da mensagem de erro */}
                {Erro ? <Text style={styles.erro}>{Erro}</Text> : null}

                {/* Botão de envio de formulário */}
                <TouchableOpacity 
                    style={[styles.button, carregando && { opacity: 0.7 }]} 
                    onPress={logar}
                    activeOpacity={0.7}
                    disabled={carregando}
                >
                    <Text style={styles.buttonText}>
                        {carregando ? "CARREGANDO..." : "LOGIN"}
                    </Text>
                </TouchableOpacity>

                {/* Botão com link para tela de cadastro */}
                <Pressable onPress={() => navigation.navigate("Cadastro")}>
                    <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

// Estilização dos componentes visuais da tela
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
    },
    logo: {
        width: 220,
        height: 220,
        alignSelf: "center",
        marginBottom: 10,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    inputContainer: {
        width: "100%",
        height: 50,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        marginBottom: 16,
    },
    inputSenha: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    icone: {
        marginLeft: 3,
    },
    erro: {
        color: "#FF4D4D",
        textAlign: "center",
        marginBottom: 15,
        fontWeight: "bold",
    },
    fundo: {
        flex: 1,
        padding: 15,
    },
    link: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 15,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: '#0A3057',
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});