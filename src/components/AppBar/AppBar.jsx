import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import QuoteTabs from './QuoteTabs/QuoteTabs';
import QuoteMenu from './QuoteMenu/QuoteMenu';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width:'12ch',
    '&:focus': {
        width: '20ch',
    },
  }
}));

export default function SignalsAppBar() {
  const classes = useStyles();
  

  const dispatch = useDispatch();
  const signalsAppBar = useSelector(state => state.signalsAppBar);

 

  

  const handleSearchTextChange = (event) => {
    dispatch({type: 'CHANGE_SEARCH_TEXT', payload: event.target.value});
    dispatch({type: 'UPDATE_FILTER', payload: {searchText:event.target.value}});
    
  }
  
  return (
    <div className={classes.grow}>
      <AppBar  position="sticky">
        <Toolbar >
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Signals
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={signalsAppBar.searchText}
              onChange={handleSearchTextChange}
            />
          </div>
          <div className={classes.grow} />
              <QuoteMenu />
        </Toolbar>
        <QuoteTabs />
      </AppBar>
    
    </div>
  );
}
