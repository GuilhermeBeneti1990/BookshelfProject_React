//Books Action
export const setBook = value => ({
    type: 'SET_BOOK',
    payload: value
})

export const setListOfBook = value => ({
  type: 'SET_LIST_BOOK',
  payload: value
})

export const setListOfBookWithoutCategory = value => ({
  type: 'SET_LIST_BOOK_WITHOUT_CATEGORY',
  payload: value
})

export const setEditing = value => ({
  type: 'SET_EDITING',
  payload: value
})

export const setEditingFomrClass = value => ({
  type: 'SET_EDITING_FORMCLASS',
  payload: value
})

//Categories Action
export const setCategories = value => ({
  type: 'SET_CATEGORIES',
  payload: value
})

//Comments Action
export const setComment = value => ({
  type: 'SET_COMMENT',
  payload: value
})

export const setCommentList = value => ({
  type: 'SET_COMMENT_LIST',
  payload: value
})
