import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {useSelector, useDispatch} from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';  

import QuoteTabs from './QuoteTabs/QuoteTabs';
// import QuoteMenu from './QuoteMenu/QuoteMenu';
//import { createTheme } from '@mui/material/styles';
import {css} from '@emotion/react';

//const theme = createTheme();

const Search = styled('div')(({ theme }) => ({
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
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const StyledTitle =  styled(Typography)(({ theme }) => ({
  display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
}));


export default function SignalsAppBar() {
  // const classes = useStyles();
  

  const dispatch = useDispatch();
  const signalsAppBar = useSelector(state => state.signalsAppBar);


  const handleSearchTextChange = (event) => {
    dispatch({type: 'CHANGE_SEARCH_TEXT', payload: event.target.value});
    dispatch({type: 'UPDATE_FILTER', payload: {searchText:event.target.value}});
    
  }
  
  return (
    <div>
      <AppBar  position="sticky">
        <Toolbar >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <StyledTitle
            variant="h6"
            noWrap
            component="div"
           
          >
            Signals
          </StyledTitle>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              alue={signalsAppBar.searchText}
              onChange={handleSearchTextChange}
            />
          </Search>
          <div css={css`flexGrow: 1`} /> 
           {/* <QuoteMenu />  */}
        </Toolbar>
        <QuoteTabs />
      </AppBar>
    
    </div>
  );
}
