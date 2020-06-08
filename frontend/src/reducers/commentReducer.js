const initialState = {
    comment: {
        id: '',
        author: '',
        body: '',
        parentId: '',
        timestamp: '',
        deleted: false
    },
    list: []
  }

  export const commentReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_COMMENT':
        return {
          ...state,
          comment: action.payload
        }
        case 'SET_COMMENT_LIST':
        return {
          ...state,
          list: action.payload
        }
      default:
        return state
    }
  };