const initState = {
    searchText: "",
}

const signalsAppBarReducer = (state = initState, action) => {
    switch (action.type) {
            //Change character name
        case 'CHANGE_SEARCH_TEXT':
            return {
                ...state,
                searchText: action.payload
            }

        // case 'CHANGE_OCCUPATION':
        //     return {
        //         ...state,
        //         occupation: action.payload
        //     }
        // case 'CHANGE_AGE':
        //     return {
        //         ...state,
        //         age: action.payload
        //     }
        default:
            return state
    }
}

export default signalsAppBarReducer;