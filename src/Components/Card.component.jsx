import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import UseApiCall from "../utils/customHook/useApiCall";
import Loader from "./Loader";
import { toast } from "react-toastify";
import Avatar from "./Avatar.component";
import ErrorPage from "../Pages/Error.page";
import EditIcon from "@mui/icons-material/Edit";
import UpdateModal from "./updateModal.component";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CardShow(props) {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const project_url = import.meta.env.VITE_FRONTEND_URL;
  // console.log("props::", props);
  const [openModal, setOpenModal] = React.useState(false);
  const [updateVideo, setUpdateVideo] = React.useState(false);
  const [specificVideoData, setSpecificVideoData] = React.useState({});

  //state to manage the inputs of the changed video details
  const [video_details, setVideoDetails] = React.useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    categories: "",
  });

  //this is my local user
  const localUser = JSON.parse(localStorage.getItem("user_data"));

  //to display edit video icon
  const [editingVideo, setEditingVideo] = React.useState(false);

  const handleVideoEditing = () => {
    setEditingVideo(true);
  };

  //getting the token from the localStorage

  const handleDeleteVideo = () => {
    try {
      fetch(
        `${base_url}/delete-content/${props.asset.channel_id}/${props.asset._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
        .then(async (res) => {
          const result = await res.json();
          if (!res.ok) {
            // console.log("api response for delete video :: ", result);
            throw new Error(result.message);
          }
          // console.log("api response for delete video :: ", result);
          toast.success(result.message);
          props.getAllVideos();
        })
        .catch((error) => {
          // console.log("the error i am getting is::", error);
          toast.error(error.message);
          if (error.message == "jwt expired") {
            forceLogout();
          }
        });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVideoEditing_mouseLeave = () => {
    setEditingVideo(false);
  };

  //force logout
  function forceLogout() {
    localStorage.clear();
    toast.success("You have been logged out");
    navigate("/");
  }

  const { data, isLoading, error } = UseApiCall(
    `${base_url}/channel-details-byChannelId/${props.asset.channel_id}`
  );
  // console.log(data, isLoading, error);
  const navigate = useNavigate();
  if (error) {
    return <ErrorPage />;
  } else if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      {data && (
        <>
          <Card
            sx={{ maxWidth: 250 }}
            style={{ "--Paper-shadow": 0 }}
            className="cursor-pointer hover:scale-90"
          >
            <div onClick={() => navigate(`/videos/${props.asset._id}`)}>
              <div
                onMouseEnter={
                  props.page == "channel" ? handleVideoEditing : () => {}
                }
                onMouseLeave={
                  props.page == "channel"
                    ? handleVideoEditing_mouseLeave
                    : () => {}
                }
                className="relative"
              >
                <CardMedia
                  sx={{ height: 150 }}
                  image={props.asset.thumbnail_url}
                  title={props.asset.title}
                  style={{ borderRadius: "12px" }}
                />
                {editingVideo && localUser && localUser._id == data.user_id && (
                  <>
                    <EditIcon
                      className="bg-gray-200 !w-10 !h-10 right-0 top-2 p-1 rounded-[50%] absolute"
                      style={
                        editingVideo
                          ? { display: "inline-block" }
                          : { display: "none" }
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        setSpecificVideoData(props.asset);
                        setOpenModal(true);
                      }}
                    />
                    <DeleteIcon
                      className="bg-gray-200 !w-10 !h-10 left-0 top-2 p-1 rounded-[50%] absolute"
                      sx={{ color: "red" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteVideo();
                      }}
                    />
                  </>
                )}
              </div>
              <CardContent>
                <div className="flex gap-2">
                  <Avatar channel_details={data} />
                  <div style={{ flex: 3 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      <b className="font-semibold text-lg">
                        {props.asset.title}
                      </b>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {data.channel_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      <span className="flex text-sm flex-col">
                        <span>17K views</span>
                        <span>{props.asset.createdAt}</span>
                      </span>
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </div>
            <CardActions
              style={{
                position: "relative",
                justifyContent: "end",
              }}
            >
              <Button
                size="small"
                style={{ position: "absolute", bottom: "100px" }}
              >
                <ReplyIcon
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`${project_url}/videos/${props.asset._id}`)
                      .then(() => {
                        toast.success("Video Url copied!");
                      })
                      .catch((err) => {
                        // console.error("Failed to copy: ", err);
                        toast.error("Failed to copy Video Url.");
                      });
                  }}
                  style={{ transform: "rotateY(180deg)" }}
                />
              </Button>
            </CardActions>

            {/*Video update modal*/}
            <UpdateModal
              channel_id={props.asset.channel_id}
              getData={props.getAllVideos}
              openModal={openModal}
              setOpenModal={setOpenModal}
              updateVideo={updateVideo}
              setUpdateVideo={setUpdateVideo}
              specificVideoData={specificVideoData}
            />
          </Card>
        </>
      )}
    </>
  );
}
