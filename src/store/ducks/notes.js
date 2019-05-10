const Types = {
  ADD_NOTE: "notes/ADD_NOTES",
  CREATE_ARRAYNOTES: "note/CREATE_ARRAYNOTES",
  RESET_SAVENOTE: 'note/RESET_SAVENOTE',
  SET_SAVENOTE: 'note/SET_SAVENOTE',
};

const InitialState = {
  data: [],
  saveNote: null,
};

export default function noteState(state = InitialState, action) {
  switch (action.type) {
    case Types.ADD_NOTE: {
        const updateArrayData = addNoteData(state, action.payload.note);
        return {
            ...state,
            data: updateArrayData,
        }
    }
      
    case Types.SET_SAVENOTE:
      return {
          ...state,
          saveNote: true,
        };
    case Types.RESET_SAVENOTE:
        return {
           ...state,
           saveNote: false,
        };
    case Types.CREATE_ARRAYNOTES:
      return {
          ...state,
          data: [
              ...state.data,
              action.payload.note
          ],
      };
    default:
      return state;
  }
}

export const Creators = {
  creteArrayNotes: note => ({
    type: Types.CREATE_ARRAYNOTES,
    payload: { note }
  }),
  addNote: note => ({
    type: Types.ADD_NOTE,
    payload: { note }
  }),
  setSaveNote: () => ({
    type: Types.SET_SAVENOTE,
  }),
  resetSaveNote: () => ({
    type: Types.RESET_SAVENOTE,
  }),
};

addNoteData = (state, note) => {
    const { data } = state;
    data.map(item => {
        if (item.key === note.key) {
            item.value = note.value;
        }
    })

    return data;
}