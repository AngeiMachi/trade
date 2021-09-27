import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { yellow } from '@material-ui/core/colors';


const useMyStyles = props => {
  const useStyles = makeStyles(theme => ({
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      position: 'relative',
      "box-shadow":"0px 0px 2px 1px "+props.maColor,
      '& svg':{
        zIndex:'10',
        color:props.maColor,
        fontSize: theme.spacing(3),
        position: 'absolute',
        top:'-2px'  
      },
      '& span': {
        fontSize: theme.spacing(2),
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

export const  MovingAverage = ({type,isAbove,isTrendingUp,quoteName}) => {
  const [maColor,setMaColor] = useState('gery');
  const [signalColor,setSignalColor] = useState('gery');
  const props = {
    maColor,
    signalColor
  }
  const classes = useMyStyles(props); 
  const menuStyle = clsx(classes.avatar);

  useEffect(() =>{
    switch(type) {
      case movingAverageTypeEnum.sma10:
        isAbove && setMaColor('red');
        setSignalColor('red');
        break;
      case movingAverageTypeEnum.sma20:
        isAbove && setMaColor('yellow');
        setSignalColor('yellow');
        break;
      case movingAverageTypeEnum.sma50:
        isAbove && setMaColor('deepskyblue');
        setSignalColor('deepskyblue');
        break;
      case movingAverageTypeEnum.sma100:
        isAbove && setMaColor('darkblue');
        setSignalColor('darkblue');
        break;
      case movingAverageTypeEnum.sma200:
        isAbove && setMaColor('orange');
        setSignalColor('orange');
        break;
      default:
        setMaColor('grey');  
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

