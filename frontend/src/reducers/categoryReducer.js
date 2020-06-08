const initialState = {
    categories: []
  }

  export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
       case 'SET_CATEGORIES':
        return {
          ...state,
          categories: action.payload
        };
        default:
            return state;
    }
  };