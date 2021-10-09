import * as _ from 'lodash';

const initState = {
    quotes: [],
    quotesView:[],
    lastInterval:0,
    filterList: {
        searchText:"",
        quoteList:[],
        isHealthy:false
    }
}

const quoteListReducer = (state = initState, action) => {
    switch (action.type) {
        //Change character name
        case 'UPDATE_QUOTE_LIST':{
            const newQuoteView = state.quotesView.length===0? [...action.payload]: performFilter(action.payload,state.filterList);
            return {
                ...state,
                quotes: [...action.payload],
                quotesView: newQuoteView
            }
        }
        case 'UPDATE_FILTER':{
            const filterQriteria =action.payload;
            const newFilter = {...state.filterList,...filterQriteria};
            const newQuoteView = performFilter(state.quotes,newFilter);
            return {
                ...state,
                quotesView:[...newQuoteView],
                filterList: newFilter
            }
        }
        case 'UPDATE_QUOTE':{
            const quotes = [...state.quotes];
             _.remove(quotes, { 'quoteName': action.payload.quoteName });
            let didInsert = false;
            for (let i = 0; i < quotes.length; i++) {
                if (quotes[i].signalsHistory[0]?.interval <= action.payload.signalsHistory[0]?.interval || quotes[i].signalsHistory.length === 0) {
                    quotes.splice(i, 0, action.payload);
                    didInsert = true;
                    break;
                }
            }
            if (!didInsert) {
                quotes.push(action.payload);
            }
            const newQuoteView =  performFilter(quotes,state.filterList);

            return {
                ...state,
                quotes: quotes,
                quotesView: newQuoteView
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

const performFilter =(quotes,newFilter)=> {
    let filteredQuotes  = [...quotes];
    if (newFilter.searchText.length>0) {
        filteredQuotes =filterByText(quotes,newFilter);
    }
    else if (newFilter.quoteList.length>0) {
        filteredQuotes = filterByQuoteList(quotes,newFilter);
    }
    if (newFilter.isHealthy) {
        filteredQuotes = filterHealthy(filteredQuotes);
    }
    return filteredQuotes;
    
}

const filterByText = (quotes,newFilter) =>{
    let newQuoteView = [];
    if (newFilter.searchText!=="") {
        newQuoteView =_.filter(quotes,quote=>quote.quoteName.startsWith(newFilter.searchText.toUpperCase()));
    }
    else {
        newQuoteView = [...quotes];
    }
    return newQuoteView;
}

const filterByQuoteList = (quotes,newFilter) => {
        if (newFilter.quoteList.length>0) {
            return  _.intersectionBy(quotes, newFilter.quoteList.map(item=>({quoteName:item})), 'quoteName');
        } else {
            return [...quotes.quotes];
        }
}

const filterHealthy = (filteredQuotes) => {
    let newQuotes = [];

    for (let quote of filteredQuotes) {
        let countHealthy = 0;
        for (let sma of quote.sma) {
            if ((sma.type===10 || sma.type===20) && sma.isAbove) countHealthy++;
            if (countHealthy===2) {
                newQuotes.push(quote);
                break;
            }
        }
    }

    return newQuotes;
}



export default quoteListReducer;