import React, { Component } from 'react';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as FormActions } from '../../store/ducks/form';
import { Creators as GroupActions } from '../../store/ducks/group';
import { Creators as NoteActions } from '../../store/ducks/notes';

// styles
import { View, TextInput, Text } from 'react-native';
import styles from './styles';
import stylesGroup from './stylesGroup';
import { colors } from '../../styles';


class InputText extends Component {
  state = {
    inputSave: null,
    savedNote: false,
  }

  componentDidMount() {
    const { form, data, group, index, noteState } = this.props;

    if (data.group === 'true') {
      group.dataGroup.map(item => {
        item.value.map(components => {
          if (components.index === index) {
            Object.keys(components).map(key => {
              if (key === data.data_name) {
                this.setState({ inputSave: components[key].value })
              }
            })
          }
        })
      });
    } else {
      for (var key in form.step) {
        if (key === data.data_name) {
          if (form.step[key].filled === true) {
            this.setState({ inputSave: form.step[key].value });
          }
        }
      }
    }

    console.tron.log('did', data, data.note, data.default_value);
    if (data.note) {
      noteState.data.map(note => {
        if (note.key === data.data_name) {
          this.setState({ inputSave: note.value });
        }
      })
    }
  }

  saved() {
    this.setState({ savedNote: true });
    let that = this;
    setTimeout(function () { that.setState({ savedNote: false }); }, 4000);
  }

  saveNoteInput = () => {
    const { inputSave } = this.state;
    console.tron.log('askjdhga', inputSave);
  }

  saveGroupInput = info => {
    const { inputSave } = this.state;
    const {
      form,
      getSaveStateForm,
      startControlArray,
      data,
      index,
      saveDataGroup,
      group,
      groupMother,
      startControlArrayGroup,
    } = this.props;
    if (inputSave) {
      saveDataGroup({
        index,
        groupMother,
        name: info.data_name,
        data: inputSave,
        extra: null,
        type: data.component_type
      })
    }
    startControlArrayGroup(info.data_name)
  }

  saveFormInput = info => {
    const { inputSave } = this.state;
    const {
      form,
      getSaveStateForm,
      startControlArray,
      data,
      index,
      saveDataGroup,
      group,
      groupMother,
      startControlArrayGroup,
    } = this.props;
    console.tron.log('entreinput', inputSave, data.note);
    if (inputSave) {
      if (data.note === true) {
        console.tron.log('entrei aqui input notes', inputSave);
      } else {
        for (var key in form.step) {
          if (key === info.data_name) {
            const form = {};
            form[info.data_name] = { key: info.data_name, value: inputSave, filled: true };
            getSaveStateForm(form);
          }
        }
      }
    } else {
      for (var key in form.step) {
        if (key === info.data_name) {
          const form = {};
          form[info.data_name] = { key: info.data_name, value: inputSave, filled: false };
          //console.log(form[info.data_name])
          getSaveStateForm(form);
        }
      }
    }
    startControlArray();
    // await startControlArrayGroup();
  }

  render() {
    const { 
      data_name,
      label, hint,
      default_value,
      newState,
      groupFlag,
      note,
    } = this.props.data;
    const { savedNote } = this.state;
    const { group, noteState, resetSaveNote } = this.props
    const { saveStep, step } = this.props.form;
    if (note){
      if (noteState.saveNote) {
        console.tron.log('save input', this.state.inputSave);
        noteState.data.map(note => {
          if (note.key === data_name) {
            this.props.addNote({
              key: data_name,
              value: this.state.inputSave,
            });
          }
        })
        this.saved();        
        resetSaveNote();
      }
      
      console.tron.log('input', note, this.props.data, this.state.inputSave);
    }
    
    if (saveStep) {
      this.saveFormInput({ data_name, default_value });
    }
    if (group.flagGroup) {
      this.saveGroupInput({ data_name, default_value })
    }
    if (noteState.saveNote) {
      console.tron.log('save input', this.state.inputSave);
      
      // this.saveNoteInput();
    }
    return (
      <View style={{ ...styles.container, backgroundColor: (groupFlag === true ? null : null) }}>
        {
          savedNote && (
            <Text style={styles.msgsave}>Nota Salva</Text>
          )
        }
        <Text style={styles.hint}>{hint}</Text>
        <TextInput
          style={{ ...styles.input, backgroundColor: (groupFlag === true ? null : 'white') }}
          autoCapitalize="sentences"
          autoCorrect={false}
          placeholder={"Digite aqui..."}
          maxLength={255}
          underlineColorAndroid="rgba(0,0,0,0)"
          onChangeText={inputSave => this.setState({ inputSave })}
          value={this.state.inputSave}
        />

      </View>
    );
  }
}

const mapStateToProps = state => ({
  form: state.formState,
  group: state.groupState,
  noteState: state.noteState,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ 
    ...FormActions, 
    ...GroupActions,
    ...NoteActions, 
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InputText);