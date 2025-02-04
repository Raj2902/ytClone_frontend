import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Sidebar from "./Sidebar.component";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSearch, showCustomSidebar } from "../utils/Redux/reducer";
import Avatar from "./Avatar.component";
import UseApiCall from "../utils/customHook/useApiCall";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";

import Loader from "./Loader";
import ProfileAvatar from "./ProfileAvatar.component ";
import UserProfileModal from "../Pages/Profile.page";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navbar(props) {
  //declare the useDispath to use it
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user_data"))
  );

  //state for profile modala
  const [openModal, setOpenModal] = useState(false);

  //to display edit profile icon
  const [isHovered, setIsHovered] = useState(false);

  const [scs, setSCS] = useState(true);

  //handle the input that your are giving in the search field
  function handleSearchInput(event) {
    // console.log(event.target.value);
    dispatch(setSearch(event.target.value));
  }

  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  //state to handle open and close the sidebar
  const [openDrawer, setOpenDrawer] = React.useState(false);

  //get all channels of the user
  if (!userData) {
    setUserData({ id: 0 });
  }

  function getLocalStorage() {
    setUserData(JSON.parse(localStorage.getItem("user_data")));
  }
  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user_data")));
  }, [localStorage.getItem("user_data")]);

  const { data, isLoading, error } = UseApiCall(
    `${base_url}/get-channels/${userData?._id}`
  );
  // console.log(data, isLoading, error);
  if (error) {
    toast.error(error.message);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  //handle change in openSidebar
  const handleDrawerOpen = (drawerState) => {
    setOpenDrawer(drawerState);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {!localStorage.getItem("token") ? (
        <MenuItem
          id="login-btn"
          onClick={() => {
            handleMenuClose();
            navigate("/login");
          }}
        >
          <LoginIcon />
          Login
        </MenuItem>
      ) : (
        <>
          <MenuItem
            className="hover:!bg-transparent hover:cursor-text"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* <AccountCircle className="hover:cursor-text" /> */}
            <ProfileAvatar user_details={userData} />
            <p className="flex justify-between w-full">
              <span className="ml-2">{userData.username}</span>
              {isHovered && (
                <EditIcon
                  className="bg-gray-200 p-1 rounded-[50%]"
                  onClick={() => {
                    handleMenuClose();
                    setOpenModal(true);
                  }}
                />
              )}
            </p>
          </MenuItem>
          <MenuItem className="hover:!bg-transparent hover:cursor-text">
            <MailIcon className="hover:cursor-text" />
            {userData.email}
          </MenuItem>
          <hr />
          {data && data.length > 0 && (
            <>
              <MenuItem className="hover:!bg-transparent hover:cursor-text">
                <span className="text-blue-600 text-center block w-full font-semibold">
                  Your channels
                </span>
              </MenuItem>
              {data.map((channel) => {
                return (
                  <MenuItem
                    key={channel._id}
                    className="flex gap-3"
                    onClick={() => {
                      handleMenuClose();
                      navigate(`/channels/${channel.username}`);
                    }}
                  >
                    <Avatar channel_details={channel} />
                    <span>{channel.channel_name}</span>
                  </MenuItem>
                );
              })}
            </>
          )}
          <MenuItem
            className="hover:!bg-transparent"
            onClick={() => {
              handleMenuClose();
              navigate(`/create-channel`);
            }}
          >
            <span className="text-blue-600 text-center block w-full font-semibold">
              Create channel
            </span>
          </MenuItem>
          <hr />
          <MenuItem
            id="logout-btn"
            onClick={() => {
              handleMenuClose();
              localStorage.clear();
              navigate("/");
              toast.success("Logged Out Successfully");
            }}
          >
            <LogoutIcon />
            Logout
          </MenuItem>
        </>
      )}
      {!localStorage.getItem("user_data") && !localStorage.getItem("token") && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/register");
          }}
        >
          <AppRegistrationIcon />
          Register
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/*hamburer sign for smaller devices*/}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2, display: { xs: "flex", lg: "none" } }}
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              <MenuIcon />
            </IconButton>
            {/*hamburger sign for larger devices*/}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2, display: { xs: "none", lg: "flex" } }}
              onClick={() => {
                dispatch(showCustomSidebar(!scs));
                setSCS(!scs);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <div className="flex items-center">
                <img
                  src="https://res.cloudinary.com/drp3wlohv/image/upload/v1738704274/thumbnails/oqgq3ororsqwlfazj9d5.png"
                  alt="logo"
                  width="150"
                  height="150"
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                  }}
                />
              </div>
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                onChange={handleSearchInput}
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {/* This is my child component sidebar */}
        <Sidebar openSidebar={openDrawer} handleDrawerOpen={handleDrawerOpen} />
      </Box>
      <UserProfileModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        userInfo={userData}
        getLocalStorage={getLocalStorage}
      />
    </>
  );
}
