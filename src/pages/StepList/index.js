import React, { Component } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Animated,
  BackHandler
} from 'react-native';
import styles from './styles';
import StepBox from './components/StepBox';
import { Load } from '../../components';
import { Header } from '../../globalComponents';
import { connect } from 'react-redux';
import axios from 'axios';
import Api from '../../services/api';

import { bindActionCreators } from 'redux';
import { Creators as FormAction } from '../../store/ducks/form';
import { Creators as HistActions } from '../../store/ducks/hist';
import { SnackBar } from '../../globalComponents';


class StepList extends Component {
  state = {
    modalVisible: false,
    load: false,
    form: '',
    teste: 10,
    showAlert: false,
    formRedux: true,
    viewError: false,
    matriculaAsync: '',
    saved: false,
    error: false,
  }

  componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.saveForm);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.saveForm);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.saveForm);
  }

  cancel() {
    this.props.navigation.goBack();
  }

  saved() {
    this.setState({ saved: true })
    let that = this;
    setTimeout(function () { that.setState({ saved: false }); }, 4000);

  }

  saveForm = () => {
    const { reference, saveForm, setSaveContentForm, form } = this.props;
    saveForm(reference);
    this.saved();
    this.props.navigation.goBack();
    return true;
  }

  saveForm2 = () => {
    const { reference, saveForm, setSaveContentForm, form } = this.props;
    saveForm(reference);
    this.saved();
  }

  resetAsync = () => {
    AsyncStorage.clear();
  }

  errorMessage = () => {
    this.setState({ viewError: true });
    let that = this;
    setTimeout(function () { that.setState({ viewError: false }) }, 4000);
  }

  error = () => {
    this.setState({ error: true });
    let that = this;
    setTimeout(function () { that.setState({ error: false }) }, 4000);
  }


  enviaForm = async () => {
    const { matriculaAsync } = this.state;
    const { reference, formulario, setUpdateHistory, login, group } = this.props;
    const { dataGroup } = group;

    this.setState({ sending: true, original: false });
    console.log(['group', group])
    const matriculaProv = await AsyncStorage.getItem('@AppInc:matricula');
    const matricula = JSON.stringify(matriculaProv);

    const arrayRef = await AsyncStorage.getItem("arrayRef");
    const array = JSON.parse(arrayRef);
    
    let contentGroup = false;
    let count = 0;
    console.log(dataGroup.length);
    if(dataGroup.length > 0) {
      contentGroup = true;
    }

    array.map(item => {
      if (item === formulario.ref) {
        array.splice(count, 1);
      }
      count += 1;
    });

    await AsyncStorage.setItem('arrayRef', JSON.stringify(array));

    const dataForm = new FormData();   
   
    dataForm.append('form_name', formulario.form.form_name);

    for (var key in formulario.step) { 
      if(formulario.step[key].type === 'camera') {
        formulario.step[key].value.map(item => {
          dataForm.append(`${key}[]`, item);
        })       
      } else {
        dataForm.append(formulario.step[key].key, formulario.step[key].value)
      }      
    }

    setUpdateHistory();
    this.setState({ matriculaAsync: matricula });

    this.onSendForm({
      dataForm, 
      userId: login.userID, 
      token: login.token, 
      reference, 
      contentGroup,
      dataGroup,
    });

   
  }
  
  onSendForm = (data) => {
    const { 
      dataForm, 
      userId, 
      token, 
      reference, 
      contentGroup,
      dataGroup,
    } = data;
    console.log('onSendForm', contentGroup);    
    
    axios({
      method: 'post',
      url: 'http://35.198.17.69/api/pericia/formulario/envio',
      data: dataForm,
      headers: {
        'Content-Type': 'multipart/form-data',
        'matricula': userId,
        'referencia': '',
        'x-Token': token,
      }
    })
      .then(response => {
        console.log(response);
        AsyncStorage.setItem('@IDlaudo', response.data.number);
        Alert.alert('ID do laudo', 'O número do seu laudo é ' + response.data.number);
        this.onSendGroup({ 
          userId, 
          token, 
          reference,       
          dataGroup,
          idForm: response.data.number,
        });
      })
      .catch(error => {
        console.log(error); 
        this.errorMessage();
      });
  }

  onSendGroup = (data) => {
    const { 
      userId, 
      token, 
      reference,       
      dataGroup,
      idForm,
    } = data
    console.log('onSendGroup');
    

    dataGroup.map(group => {
      console.log(['one group map', group])
      const formGroup = new FormData();
      let count = 1;
      group.value.map(item => {
        console.log(['item', item])
        Object.keys(item).map(key => {
          console.log(['keys', key])
          if(key !== 'index') {
            formGroup.append(`${group.key}[${count}][${key}]`, item[key].value)
          }          
        })
        count += 1;
      }) 

      console.log({ RESULTADO_GROUP_DATA: formGroup})
      axios({
        method: 'post',
        url: 'http://35.198.17.69/api/pericia/formularios/envio/teste',
        data: formGroup,
        headers: {
          'Content-Type': 'multipart/form-data',
          'matricula': userId,
          'referencia': '',
          'x-Token': token,
          'id-form:': idForm,
        }
      })
        .then(function (response) {
          console.log(response)          
        })
        .catch(error => {
          console.log(['error group', error])
          this.errorMessage();
        });
      
    });

    
  }

  sendGroup = (dataGroup, userId, token, groupName) => {
    
    console.log(['api envia group', dataGroup, userId, token, groupName])
  }

  render() {
    const { formRedux } = this.state;
    const form = this.props.form;
    if (formRedux) {
      this.props.setSaveContentForm(form);
      this.setState({ formRedux: false });
    }
    const { navigation } = this.props;
    const { viewError, load, saved } = this.state;
    let i = 0;

    return (
      <View style={styles.container}>
        <Header
          title={form.area}
          showArrow
          showInfo
          info={form.info_form}
          goBack={this.saveForm}
        />
        {
          viewError && (
            <SnackBar outside content="Sem conexão!" color='#3C3C46' fontcolor="white" />
          )
        }

        {
          saved && (
            <SnackBar outside content="Progresso Salvo!" color='#3C3C46' fontcolor="white" />

          )
        }
        <ScrollView>
          <FlatList
            data={form.steps}
            renderItem={item => { i = i + 1; return <StepBox steps={item} form={form} index={i} /> }}
          />
          <View style={styles.container}>

            <TouchableOpacity style={styles.enviarbutton} onPress={() => this.enviaForm()}>
              <Text style={styles.buttonText}>
                ENVIAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.salvarbutton} onPress={() => this.saveForm2()}>
              <Text style={styles.buttonTextsalvar}>
                SALVAR
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  form: state.newState.data,
  reference: state.newState.reference,
  formulario: state.formState,
  login: state.loginState,
  group: state.groupState,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    ...FormAction,
    ...HistActions,
  }, dispatch);

StepList.navigationOptions = {
  title: 'Perícia',
};

export default connect(mapStateToProps, mapDispatchToProps)(StepList);
