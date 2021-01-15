const initialState = {
    bioRef: {},
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_BIO_REF":
            return {
                ...state,
                bioRef: action.value,
            }
        default:
            return state
    }
}

export default reducer
