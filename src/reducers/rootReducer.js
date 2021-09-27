
import signalsAppBarReducer from './ignalsAppBarReducer';
import quoteListReducer from './quoteListReducer'
import {combineReducers} from 'redux';

//Combine all the sub reducers
const rootReducer = combineReducers({
    signalsAppBar: signalsAppBarReducer,
    quoteList:quoteListReducer
})

export default rootReducer