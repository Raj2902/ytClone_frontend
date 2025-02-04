import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";

export default function CustomSidebar(props) {
  const navigation = useNavigate();
  const storeCS = useSelector((data) => data.customSideBar);
  // console.log("value of custom sidebar::", storeCS);
  return (
    <>
      {storeCS ? (
        <div className="custom-sidebar h-auto">
          <Box
            sx={{
              width: 250,
              background: "white",
              color: "black",
              height: "100%",
              minHeight: "100vh",
            }}
          >
            <List>
              {["Home", "Starred", "Send email", "Drafts"].map(
                (text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {index % 2 === 0 ? (
                          <HomeIcon onClick={() => navigation("/")} />
                        ) : (
                          <MailIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        onClick={() => navigation("/")}
                        primary={text}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              )}
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
                    <ListItemText
                      onClick={() => navigate("/")}
                      primary={text}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
