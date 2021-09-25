import * as _ from 'lodash';

const initState = {
    quotes: [],
    quotesView:[],
    filterList: {
        searchText:"",
        quoteList:[]
    }
}

const quoteListReducer = (state = initState, action) => {
    switch (action.type) {
        //Change character name
        case 'UPDATE_QUOTE_LIST':{
            const newQuoteView = state.quotesView.length===0? [...action.payload]: state.quotesView;
            return {
                ...state,
                quotes: action.payload,
                quotesView: newQuoteView
            }
        }
        case 'UPDATE_FILTER':{
            const filterQriteria =action.payload;
            const newFilter = {...state.filterList,...filterQriteria};
            const newQuoteView = performFilter(state,newFilter);
            return {
                ...state,
                quotesView:[...newQuoteView],
                filterList: newFilter
            }
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

const performFilter =(state,newFilter)=> {
    let firstFilterQuoteIteration ;
    if (newFilter.searchText.length>0) {
        firstFilterQuoteIteration =filterByText(state,newFilter);
        return firstFilterQuoteIteration;
    }
    if (newFilter.quoteList.length>0) {
        firstFilterQuoteIteration = filterByQuoteList(state,newFilter);
        return firstFilterQuoteIteration;
    }
    return [...state.quotes];
    
}

const filterByText = (state,newFilter) =>{
    let newQuoteView = [];
    if (newFilter.searchText!=="") {
        newQuoteView =_.filter(state.quotes,quote=>quote.quoteName.startsWith(newFilter.searchText.toUpperCase()));
    }
    else {
        newQuoteView = [...state.quotes];
    }
    return newQuoteView;
}

const filterByQuoteList = (state,newFilter) => {
        if (newFilter.quoteList.length>0) {
            return  _.intersectionBy(state.quotes, newFilter.quoteList.map(item=>({quoteName:item})), 'quoteName');
        } else {
            return [...state.quotes];
        }
}



export default quoteListReducer;