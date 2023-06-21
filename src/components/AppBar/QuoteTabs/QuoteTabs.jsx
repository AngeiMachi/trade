import {useSelector, useDispatch} from 'react-redux';
import Collapse from '@mui/material/Collapse';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {getTabs} from '../../../reducers/signalsAppBarReducer';

const QuoteTabs = () => {
    //const [value, setValue] = useState(0);
    //const quoteListView = useSelector(state => state.quoteList.quotesView);
    const signalsAppBar = useSelector(state => state.signalsAppBar);
    const dispatch = useDispatch();
    const tabs = useSelector(getTabs);
    const handleChange =  (event, newValue) => {
        dispatch({type: 'CHANGE_TAB', payload: newValue});
        dispatch({type: 'UPDATE_FILTER', payload: {quoteList:tabs[newValue].quoteList}});
     };
    
    return (
        <Collapse in={signalsAppBar.searchText.length===0}>
            <Tabs   indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    value={signalsAppBar.tabs.currentTab} 
                    onChange={handleChange} >
                {signalsAppBar.tabs.tabList.map((tab, i) => (
                 <Tab label={tab.tabName} key={i}/>
                ))}
            </Tabs>
        </Collapse>
    )
}

export default QuoteTabs;