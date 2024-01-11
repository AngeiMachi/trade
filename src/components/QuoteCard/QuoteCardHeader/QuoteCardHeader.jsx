//mport _ from 'lodash';
import React, { useEffect }  from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
//import MovingAverage from '../MovingAverage/MovingAverage';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import {Menu,MenuItem} from '@mui/material';
import Divider from '@mui/material/Divider';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import axios from 'axios';
import { SOCKET_SERVER_URL } from '../../../users/useSignals';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';


export const  QuoteCardHeader = ({quote,hideQuote}) => {
    //const touchedMASignals = _.filter(quote.signalsHistory,(sigHis)=> sigHis.signalDetails.signalGroupType===3);
    //let glowingMAcollection = _.map(touchedMASignals,touchedSig=>touchedSig.signalDetails.payload.type);
    const lastestInterval   =  useSelector(state => state.quoteList.lastInterval);
    const quoteLastInterval = quote.signalsHistory[0]?.interval;
    let  [follow,setFollow] =useState({soft:"nono",hard:"none",absolute: "none"});
  
    const [isUp, setToggleIsUp] = useState(true);
    const handleIsUpChange = () => {
      setToggleIsUp(!isUp); // Directly toggle the checked state without using useState
    };

    const signals = quote.initiatedSignals.tacticalDirectionChangeSignalInput?.filter(signal=>!signal.isTriggered);
    useEffect(() => {
      console.log('quote changed:', quote);
      let newFollow = {...follow};
      for (let signal of signals){
        if (signal.info.includes("SOFT"))  {
          newFollow = {...newFollow,soft:signal.direction};
        }
        else if(signal.info.includes("HARD")) {
          newFollow = {...newFollow,hard:signal.direction};
        }
        else if(signal.info.includes("ABSOLUTE")){
          newFollow = {...newFollow,absolute:signal.direction};
        }
       
      };
      console.log(newFollow);
      setFollow(newFollow);
     
    }, [quote]);
    

    const handleFollow = async  (followType,popupState) => {
      popupState.close();
      await  axios.post(SOCKET_SERVER_URL +'/followQuote', {
          quoteName:quote.quoteName,
          followType,
          direction:isUp?"UP":"DOWN",
          } 
      );
      
   };
    return (
      <CssBaseline >
        <Box display="flex" p={1} bgcolor="background.paper">
          <Box p={1} flexGrow={1} bgcolor={quoteLastInterval===lastestInterval?"info.light":"grey.300"} display="flex">
          <PopupState   variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
          <React.Fragment>
              <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
                {quote.quoteName}
              </Button>
              <Menu {...bindMenu(popupState)}>
                <span>
                &nbsp;&nbsp;Follow Trend Down<Switch defaultChecked onChange={handleIsUpChange}  value={isUp}/>Up&nbsp;&nbsp;
                </span>
                <Divider />
                <MenuItem onClick={()=>handleFollow("SOFT",popupState)}>
                  <span>Soft</span>
                  {(follow.soft==="UP")?(
                    <MovingIcon sx={{color:"green"}}/>
                  ): follow.soft==="DOWN"?(
                    <TrendingDownIcon sx={{color:"red"}}/>
                  ):null}
                </MenuItem>
                <MenuItem onClick={()=>handleFollow("HARD",popupState)}>
                <span>Hard</span>
                  {(follow.hard==="UP")?(
                    <MovingIcon sx={{color:"green"}}/>
                  ): follow.hard==="DOWN"?(
                    <TrendingDownIcon sx={{color:"red"}}/>
                  ):null}
                </MenuItem>
                <MenuItem onClick={()=>handleFollow("ABSOLUTE",popupState)}>
                <span>Absolute</span>
                  {(follow.absolute==="UP")?(
                    <MovingIcon sx={{color:"green"}}/>
                  ): follow.absolute==="DOWN"?(
                    <TrendingDownIcon sx={{color:"red"}}/>
                  ):null}
                </MenuItem>
              </Menu>
              </React.Fragment>
            )}
           </PopupState>
          </Box>
        
          {quote.sma.map((sma)=>(
            <Box p={1} bgcolor={quoteLastInterval===lastestInterval?"info.light":"grey.300"} key={sma.type+quote.quoteName}>
              {/* <MovingAverage isGlowing={_.includes(glowingMAcollection,"SMA"+sma.type)} type={sma.type} isAbove={sma.isAbove} isTrendingUp={sma.isTrendingUp} quoteName={quote.quoteName}/> */}
            </Box>
          ))}
        </Box>
      </CssBaseline> 
    )
}
export default QuoteCardHeader;