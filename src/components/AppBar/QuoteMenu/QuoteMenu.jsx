import React from 'react';
import Badge from '@mui/icons-material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FilterListIcon from '@mui/icons-material/FilterList';
import {useSelector, useDispatch} from 'react-redux';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';


const SectionDesktop = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  }
}));
const SectionMobile = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  }
}));

const QuoteMenu = () => {
    // const classes = useStyles();
    const dispatch = useDispatch();
    const quoteList = useSelector(state => state.quoteList);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const menuId = 'primary-search-account-menu';

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
      };
    
      const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
      };
    
      const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
      };

    const handleFilter = (event) => {
        dispatch({type: 'UPDATE_FILTER', payload: {isHealthy:!quoteList.filterList.isHealthy}});
        handleMenuClose();
      }
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleFilter} >On The Move</MenuItem>
        <MenuItem onClick={handleMenuClose} >Healthy</MenuItem>
      </Menu>
    );
  
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem  onClick={handleProfileMenuOpen}>
          <IconButton aria-label="show 4 new mails" color="inherit" onClick={handleFilter}>
            <Badge overlap="rectangular" badgeContent={4} color="secondary">
              <FilterListIcon />
            </Badge>
          </IconButton>
          <p>Filters</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge overlap="rectangular" badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="show 11 new notifications" color="inherit">
            <Badge overlap="rectangular" badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem >
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );



    return (
        <>
         <SectionDesktop>
            <IconButton aria-label="show 4 new mails" color="inherit" onClick={handleFilter}>
                <Badge overlap="rectangular" badgeContent={0} color="secondary">
                  <FilterListIcon />
                </Badge>
            </IconButton>
              <IconButton aria-label="show 4 new mails" color="inherit" >
                <Badge overlap="rectangular" badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge overlap="rectangular" badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
          </SectionDesktop>
          {/* ellipsis menu on mobile   */}
          <SectionMobile>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
            </IconButton>
          </SectionMobile>
          {renderMobileMenu}
          {renderMenu}
        </>
    )
}

export default QuoteMenu;