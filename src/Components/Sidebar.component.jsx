import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ openSidebar, handleDrawerOpen }) {
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    handleDrawerOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: 250, background: "white", color: "black" }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {["Home", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <HomeIcon onClick={() => navigate("/")} />
                ) : (
                  <MailIcon />
                )}
              </ListItemIcon>
              <ListItemText onClick={() => navigate("/")} primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <HomeIcon onClick={() => navigate("/")} />
                ) : (
                  <MailIcon />
                )}
              </ListItemIcon>
              <ListItemText onClick={() => navigate("/")} primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={openSidebar} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
