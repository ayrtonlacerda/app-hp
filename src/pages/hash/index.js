import React, { Component } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SnackBar} from './../../globalComponents';

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
  Alert,
  BackHandler
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Axios from 'axios';
import Api from '../../services/api';

const imageCheck = require('../../assents/lottie/warning.json');

import styles from './styles';

const labels = ["ID", "PIN", "Senha"];
const customStyles = {
  stepIndicatorSize: 45,
  currentStepIndicatorSize: 45,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: 'rgb(225, 200, 133)',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: 'rgb(225, 200, 133)',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: 'rgb(225, 200, 133)',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: 'rgb(225, 200, 133)',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: 'rgb(225, 200, 133)',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: 'rgb(225, 200, 133)',
}

class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    progress: new Animated.Value(0),
    currentPosition: 1,
    idRegistro: null,
    inputSave: null,
    viewModal: false,
    messageRequest: '',
  }

  async componentWillMount() {
    const idRegistro = await AsyncStorage.getItem('@IdRegistro');
    this.setState({ idRegistro: idRegistro });
  }

  componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.navigateToLogin);
  }

  navigateToLogin = async () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        // Logged
        NavigationActions.navigate({ routeName: 'Login' }),
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  navigateToPassword = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        // Logged
        NavigationActions.navigate({ routeName: 'Password' }),
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onPressAnimated = async () => {
    this.animation.play(30, 1000);
  }

  conferePIN = async () => {
    const { inputSave, idRegistro } = this.state;

    try {
      const response = await Api.user.postConferePIN({ matricula: idRegistro, pin: inputSave });
      if (response.status === 200) {
        this.navigateToPassword();
      } else {
        this.setState({ viewModal: true, messageRequest: response.data.mensagem });
      }
    } catch {
      this.setState({ viewModal: true, messageRequest: response.data.mensagem });
    }
    /*Axios({
      method: 'post',
      url: 'http://35.198.17.69/api/pericia/usuario/validaPin',
      data: { matricula: idRegistro, pin: inputSave },
    })
      .then((resp) => {
        if (resp.status === 200) {
          this.navigateToPassword();
        } else {
          this.setState({ viewModal: true, messageRequest: resp.data.mensagem });
        }
      }).catch(err => {
        this.setState({ viewModal: true, messageRequest: resp.data.mensagem });
      });*/
    AsyncStorage.setItem('@PinRegistro', inputSave);
  }

  render() {
    const { viewModal, messageRequest } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="rgba(45, 45, 45, 0.8)" />
        <View style={styles.mainContainer}>
          <View style={styles.icon}>
            <Icon name="fiber-pin" size={60} color="#fff" style={styles.icon} />
          </View>

          <Text style={styles.descript}>Verifique seu email!</Text>
          <View style={styles.forms}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              keyboardType='numeric'
              autoCorrect={false}
              placeholder="Código de confirmação"
              underlineColorAndroid="rgba(0,0,0,0)"
              onChangeText={inputSave => this.setState({ inputSave })}
              value={this.state.inputSave}
            />

            <TouchableOpacity style={styles.testebutton} onPress={() => { this.conferePIN(); }}>
              <Text style={styles.buttonText}>
                Continuar
               </Text>
            </TouchableOpacity>
          </View>
        </View>
        <HideWithKeyboard>
          <View style={styles.indicadorContainer}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={this.state.currentPosition}
              labels={labels}
              stepCount={3}
            />
          </View>
        </HideWithKeyboard>
        {
          viewModal && (
            <SnackBar inside content = {this.state.messageRequest} color = "white"/>
          )
        }
      </View>
    );
  }
  onPageChange(position) {
    this.setState({ currentPosition: position });
  }
}


export default Login;

/*
 <Image style={styles.image} source={require('../../assents/imgs/policia-federal-logo.png')} />
*/
