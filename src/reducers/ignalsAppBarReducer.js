const initState = {
    searchText: "",
    tabs:{
        currentTab:0,
        tabList: [
            {
                tabName:"ALL",tabId:0,
                quoteList:[]   
            },
            {
                tabName:"ETF",tabId:1,
                quoteList:["SPY",'QQQ',"XLF","IWM","SMH"]
            },
            {
                tabName:"GIANTS",tabId:1,
                quoteList:["AAPL",'AMZN',"GOOGL","FB","TSLA","NVDA","AMD","CAT","BA","MSFT","NFLX"]
            }
        ]
    }
}

const signalsAppBarReducer = (state = initState, action) => {
    switch (action.type) {
            //Change character name
        case 'CHANGE_SEARCH_TEXT':
            return {
                ...state,
                searchText: action.payload
            }

        case "CHANGE_TAB": {
            return {
                ...state,
                tabs:{...state.tabs,
                      currentTab:action.payload
                    }
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

export default signalsAppBarReducer;

export const getTabs =  (state) =>{
    return state.signalsAppBar.tabs.tabList;
} 

