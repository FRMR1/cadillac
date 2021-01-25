const initialState = {
    bioRef: {},
    showsRef: {},
    newsRef: {},
    route: {},
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_BIO_REF":
            return {
                ...state,
                bioRef: action.value,
            }
        case "SET_NEWS_REF":
            return {
                ...state,
                newsRef: action.value,
            }
        case "SET_SHOWS_REF":
            return {
                ...state,
                showsRef: action.value,
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
