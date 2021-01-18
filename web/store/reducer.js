const initialState = {
    bioRef: {},
    route: {},
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_BIO_REF":
            return {
                ...state,
                bioRef: action.value,
            }
        case "SET_CURRENT_ROUTE":
            return {
                ...state,
                route: action.value,
            }
        default:
            return state
    }
}

export default reducer
