import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  avatar: props => ( {
    width: theme.spacing(4),
    height: theme.spacing(4),
    position: 'relative',
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
  }),
}));

export const  MovingAverage = ({type,isAbove,isTrendingUp,quoteName}) => {
  const [maColor,setMaColor] = useState('gery');
  const props = {
    maColor
  }
  const classes = useStyles(props); 

  useEffect(() =>{
    if (isAbove) {
      switch(type) {
        case movingAverageTypeEnum.sma10:
          setMaColor('red');
          break;
        case movingAverageTypeEnum.sma20:
          setMaColor('yellow');
          break;
        case movingAverageTypeEnum.sma50:
          setMaColor('deepskyblue');
          break;
        case movingAverageTypeEnum.sma100:
          setMaColor('darkblue');
          break;
        case movingAverageTypeEnum.sma200:
          setMaColor('orange');
          break;
        default:
          setMaColor('grey');  
      }
    } 

  },[isAbove,type]);

    return (
      <CssBaseline>
          <Avatar className={classes.avatar}   sx={{ width: 24, height: 24 }}>
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

