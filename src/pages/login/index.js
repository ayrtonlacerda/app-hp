import React, { Component } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { ModalCheck } from '../../globalComponents';
import { SnackBar } from '../../globalComponents';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Animated,
  Easing,
  AsyncStorage,
  Alert
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as LoginActions } from '../../store/ducks/login';

import axios from 'axios';
import { responsividade } from '../../styles';

import styles from './styles';

const imageCheck = require('../../assents/lottie/warning.json');

class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    progress: new Animated.Value(0),
    btt: null,
    inputSave: null,
    password: null,
    nome: null,
    name: null,
    idUser: null,
    currentPosition: 0,
    viewModal: false,
    messageRequest: '',
    call: false,
  }

  async componentWillMount() {
    const id = await AsyncStorage.getItem('@Id');
    this.setState({ btt: id });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login.logged !== this.props.login.logged) {
      this.navigateToLogged();
    }
  }

  navigateToLogged = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        // Logged
        NavigationActions.navigate({ routeName: 'Logged' }),
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  navigateToSignUp = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        // Logged
        NavigationActions.navigate({ routeName: 'SignUp' }),
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  navigateToChangeService = () => {
    this.props.navigation.navigate('ChangeService')
  }
  confereCadastro = () => {
    const data = { inputSave: this.state.inputSave, password: this.state.password };
    this.props.getLoginRequest(data);
  }
  onPressAnimated = async () => {
    this.animation.play(30, 1000);
  }

  render() {
    const { login } = this.props;
    const { btt, viewModal, messageRequest, call } = this.state;
    return (
      <ImageBackground source={require('../../assents/imgs/local_crime.jpg')} style={styles.backgroundImage} >
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          scrollEnabled={false}
        >
          <StatusBar backgroundColor="rgba(45, 45, 45, 0.8)" />
          <Text style={styles.title}>Bem-Vindo</Text>
          <Text style={styles.descript}>Por favor, digite suas credenciais</Text>
          <View style={styles.forms}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="ID"
              underlineColorAndroid="rgba(0,0,0,0)"
              onChangeText={inputSave => this.setState({ inputSave })}
              value={this.state.inputSave}
              defaultValue={btt}
            />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Senha"
              underlineColorAndroid="rgba(0,0,0,0)"
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
            <TouchableOpacity style={styles.testebutton} onPress={() => this.confereCadastro()}>
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cadastrobutton} onPress={() => { this.navigateToSignUp(); }}>
              <Text style={styles.buttonText}>
                Cadastrar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cadastrobutton} onPress={() => { this.navigateToChangeService(); }}>
              <Text style={styles.buttonText}>
                Servidor
              </Text>
            </TouchableOpacity>
          </View>
          </KeyboardAwareScrollView>
        {
          login.error && (
            <SnackBar inside content={login.messageError} color="white" />
          )
        }
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  login: state.loginState,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(LoginActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);

