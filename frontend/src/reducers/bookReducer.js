const initialState = {
    book: {
        id: '',
        title: '',
        description: '',
        author: '',
        timestamp: '',
        category: '',
        deleted: false
    },
    listOfBooks: [],
    listOfBookWithoutCategory: [],
    editing: false,
    editingForm: ''
  }

  export const bookReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_BOOK':
        return {
          ...state,
          book: action.payload
        }
        case 'SET_LIST_BOOK':
        return {
          ...state,
          listOfBooks: action.payload
        }
        case 'SET_LIST_BOOK_WITHOUT_CATEGORY':
        return {
          ...state,
          listOfBookWithoutCategory: action.payload
        }
        case 'SET_EDITING':
          return {
            ...state,
            editing: action.payload
          }
          case 'SET_EDITING_FORMCLASS':
          return {
            ...state,
            editingForm: action.payload
          }
      default:
        return state
    }
  };