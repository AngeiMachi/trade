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
            const newQuoteView = performFilter(action.payload,state.filterList);
            const newQuoteViewAfterSort = performSort(newQuoteView);
            
            return {
                ...state,
                quotes: [...action.payload],
                quotesView: newQuoteViewAfterSort,
                lastInterval:newQuoteViewAfterSort[0]?.signalsHistory[0]?.interval || 0
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
            const updatedQuote = _.find(quotes, { 'quoteName': action.payload.quoteName });
            if (updatedQuote) {
                _.remove(quotes, { 'quoteName': action.payload.quoteName });
            }
            quotes.push(action.payload);
            
            const newQuoteView =  performFilter(quotes,state.filterList);
            const newQuoteViewAfterSort = performSort(newQuoteView);

            return {
                ...state,
                quotes: quotes,
                quotesView: newQuoteViewAfterSort,
                lastInterval:newQuoteViewAfterSort[0]?.signalsHistory[0]?.interval || 0
            }
        }

        default:
            return state
    }
}

const performSort = (quotesList) => {
     return _.orderBy(quotesList, ['signalsHistory[0].interval'],['desc']);
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

    filteredQuotes = filterByOnlyDeveloperMode(filteredQuotes);
    
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

const filterByOnlyDeveloperMode = (quotes)=>{
    let newQuotes = [];
    for (let quote of quotes) {
        let newSignalHistory = quote.signalsHistory.filter(signal=>!signal.signalDetails.isDeveloperMode)
        if (newSignalHistory.length>0) {
            const newQuote ={...quote,signalsHistory:newSignalHistory};
            newQuotes = [...newQuotes,newQuote];
            
        }
    }
    return newQuotes;
}



export default quoteListReducer;