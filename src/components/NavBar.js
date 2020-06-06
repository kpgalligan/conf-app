import React from 'react'
import AppBar from "@material-ui/core/AppBar";
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Group from '@material-ui/icons/Group';
import Home from '@material-ui/icons/Home';
import Schedule from '@material-ui/icons/Schedule';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const link = {
    width: '150px',
    // padding: '12px',
    // margin: '0 6px 6px',
    color: 'white',
    align: 'left'
}

function NavBar(props) {

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        userName: {
            flexGrow: 0,
        }
    }));
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const showProfile = () => {
        props.setPageInState("profile")
        handleClose()
    }

    const handleLogout = () => {
        props.logout()
        handleClose()
    }

    if (props.currentUser) {
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {props.pageName}
                    </Typography>
                    {props.currentUser && (
                        <>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                onClick={() => props.setPageInState("home")}
                                color="inherit"
                            >
                                <Home/>
                            </IconButton>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                onClick={() => props.setPageInState("game")}
                                color="inherit"
                            >
                                <Group/>
                            </IconButton>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                onClick={() => props.setPageInState("schedule")}
                                color="inherit"
                            >
                                <Schedule/>
                            </IconButton>
                            <Typography variant="h6" className={classes.userName}>{props.currentUser.name}</Typography>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                // onClick={handleMenu}
                                color="inherit"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={showProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    )}
                    {!props.currentUser && (
                        <Button color="inherit">Login</Button>
                    )}
                </Toolbar>
            </AppBar>
        )
    } else {
        return (<div className="navbar"/>)
    }

}

export default NavBar