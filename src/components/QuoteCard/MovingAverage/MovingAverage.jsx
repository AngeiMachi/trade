import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material'



const useMyStyles = props => {
  const useStyles = makeStyles(theme => ({
    avatar: {
      width: '4px',
      height: '4px',
      position: 'relative',
      "box-shadow":"0px 0px 2px 1px "+props.maColor,
      '& svg':{
        zIndex:'10',
        color:props.maColor,
        fontSize: '3px',
        position: 'absolute',
        top:'-2px'  
      },
      '& span': {
        fontSize: '2px',
        color:props.maColor,
        
        position: 'absolute',
        top: '15px',
        left:'5px'
      },
    },
    glow: {
      "box-shadow":"0px 0px 6px 4px "+props.signalColor,
      "animation": "$pulse  2s linear 1s infinite"
    },
    "@keyframes pulse" : {
      "0%": { "box-shadow":"0px 0px 6px 4px "+props.signalColor},
      "50%": { "box-shadow":"0px 0px 6px 7px "+props.signalColor},
      "100%": { "box-shadow":"0px 0px 6px 4px "+props.signalColor }
    },
  }))
  return useStyles(props); 
} 

export const  MovingAverage = ({type,isAbove,isGlowing,isTrendingUp,quoteName}) => {
  const [maColor,setMaColor] = useState('black');
  const [signalColor,setSignalColor] = useState('black');
  const props = {
    maColor,
    signalColor
  }
  const classes = useMyStyles(props); 
  const menuStyle = clsx(
                      classes.avatar,
                      isGlowing && classes.glow
                      );

  useEffect(() =>{
    switch(type) {
      case movingAverageTypeEnum.sma10:
        isAbove && setMaColor('red');
        setSignalColor('red');
        break;
      case movingAverageTypeEnum.sma20:
        isAbove && setMaColor('#fbfb31');
        setSignalColor('#fbfb31');
        break;
      case movingAverageTypeEnum.sma50:
        isAbove && setMaColor('deepskyblue');
        setSignalColor('deepskyblue');
        break;
      case movingAverageTypeEnum.sma100:
        isAbove && setMaColor('#327ae7');
        setSignalColor('#327ae7');
        break;
      case movingAverageTypeEnum.sma200:
        isAbove && setMaColor('orange');
        setSignalColor('orange');
        break;
      default:
        setMaColor('black');  
    }
    

  },[isAbove,type]);

    return (
      <CssBaseline>
          <Avatar className={menuStyle}  sx={{ width: 24, height: 24 }}>
            {isTrendingUp?<TrendingUpIcon />:<TrendingDownIcon/>}
            <span>{type}</span>
          </Avatar>
      </CssBaseline> 
    )
}
export default MovingAverage;

export const movingAverageTypeEnum = Object.freeze({
  sma5:5,
  sma10: 10,
  sma20: 20,
  sma50: 50,
  sma100: 100,
  sma200: 200
});

