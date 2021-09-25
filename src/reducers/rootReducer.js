
import signalsAppBarReducer from './SignalsAppBarReducer';
import {combineReducers} from 'redux';

//Combine all the sub reducers
const rootReducer = combineReducers({
    signalsAppBar: signalsAppBarReducer
})

export default rootReducer