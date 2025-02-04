import { useParams } from "react-router-dom";
import useApiCall from "../utils/customHook/useApiCall";
import Loader from "../Components/Loader";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ReplyIcon from "@mui/icons-material/Reply";
import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import CardHorz from "../Components/CardHorz.component";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Avatar from "../Components/Avatar.component";
import ErrorPage from "./Error.page";
import ProfileAvatar from "../Components/ProfileAvatar.component ";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

export default function Video() {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user_data"));
  let filteredVideosData = useSelector((data) => data.allVideosData);
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const [channelDetails, setChannelDetails] = useState("");
  const [commData, setCommData] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const { id } = useParams();
  // console.log("video id::", id);
  //showing the only rest of the videos that is not playing
  filteredVideosData = filteredVideosData.filter((video) => video._id !== id);
  const { data, isLoading, error } = useApiCall(`${base_url}/videos/${id}`);

  //state to manage if editing commments is enabled or not.
  const [editable, setEditable] = useState(false);

  const [commentChange, setCommentChange] = useState("");

  const handleCommentChangeSubmit = async (comm_id) => {
    // console.log("submiited change::", commentChange);
    try {
      const response = await fetch(`${base_url}/update-comment/${comm_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: commentChange }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.message == "jwt expired") {
          localStorage.clear();
          navigate("/");
          toast.error("You have been logged Out");
        }
        throw new Error(result.message);
      }
      toast.success(result.message);
      setEditable(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  function handleComment() {
    const comm = document.getElementById("comment_input");
    if (comm.value) {
      try {
        fetch(`${base_url}/create-comment/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ text: comm.value }),
        })
          .then(async (res) => {
            const result = await res.json();
            if (!res.ok) {
              if (result.message == "jwt malformed") {
                toast.error("Your need to login to make a comment.");
              } else {
                toast.error(result.message);
              }
              return;
            }
            toast.success(result.message);
            getVideoComments();
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } catch (err) {
        toast.error(err.message);
      }
      comm.value = "";
    } else if (!comm.value) {
      toast.error("Comment cannot be empty");
    }
  }

  function handleCommentInput(event) {
    setCommentChange(event.target.textContent);
  }

  function getVideoComments() {
    fetch(`${base_url}/video-comments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCommData(data.data.reverse());
      });
  }

  useEffect(() => {
    if (data) {
      // console.log("asset data::", data);
      fetch(`${base_url}/channel-details-byChannelId/${data.data.channel_id}`)
        .then((res) => res.json())
        .then((data) => setChannelDetails(data));
      getVideoComments();
    }
  }, [data]);
  return (
    <>
      {error && <ErrorPage />}
      {isLoading && <Loader />}
      {!error && !isLoading && (
        <div className="totalVideoPage">
          <div className="mainVideoSection flex-2">
            <div className="videoContainer">
              {data ? (
                <video width="320" height="240" autoPlay controls>
                  <source src={data.data.video_url} type="video/mp4" />
                </video>
              ) : (
                <p>Unable to load the Video</p>
              )}
            </div>
            {data && (
              <div className="VideoData m-2">
                <p className="video-title text-3xl my-2 font-bold">
                  {data.data.title}
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  <Avatar channel_details={channelDetails} />
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/channels/${channelDetails.username}`)
                    }
                  >
                    <p className="channel-name font-semibold">
                      {channelDetails.channel_name}
                    </p>
                    <p className="subscribers text-gray-400">385 subscribers</p>
                  </div>
                  <button className="bg-black px-6 py-1 rounded-full">
                    <b className="text-white">Subscribe</b>
                  </button>
                  <div className="stats-options flex gap-5">
                    <span className=" bg-gray-300 px-4 py-1 rounded-full">
                      <ThumbUpOffAltIcon />
                      141
                      <ThumbDownOffAltIcon />0
                    </span>
                    <span className=" bg-gray-300 px-4 py-1 rounded-full">
                      <ReplyIcon style={{ transform: "rotateY(180deg)" }} />
                      Share
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <Accordion
                    className="video-desc"
                    style={{ background: "rgb(209 213 219)" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span">
                        <p className="flex gap-3 flex-wrap">
                          <strong>46,116 views</strong>
                          <strong>{data.data.createdAt}</strong>
                          {data.data.tags.map((tag, index) => (
                            <strong className="text-blue-600" key={index}>
                              #{tag}
                            </strong>
                          ))}
                        </p>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>{data.data.description}</AccordionDetails>
                  </Accordion>
                </div>
                <div className="comment-section flex flex-col gap-6 my-5">
                  <p>
                    <strong className="text-2xl">20,049 Comments</strong>
                  </p>
                  <div className="flex gap-2">
                    {localUser ? (
                      <ProfileAvatar user_details={localUser} />
                    ) : (
                      <ProfileAvatar />
                    )}
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full"
                      id="comment_input"
                    />
                  </div>
                  <button
                    className="py-1 px-3 rounded-full w-fit bg-blue-700 text-white"
                    id="comment-btn"
                    onClick={handleComment}
                  >
                    Comment
                  </button>
                  {/*this is the part of dynamic commects to be shown*/}
                  {commData &&
                    commData.map((comm, index) => (
                      <div key={comm._id} className="flex gap-3">
                        <ProfileAvatar user_details={{ image: comm.image }} />
                        <div className="flex flex-col gap-1">
                          <p className="flex gap-2">
                            <strong>{comm.username}</strong>
                            <span className="text-gray-400">
                              {comm.createdAt}
                            </span>
                            <EditIcon
                              style={
                                localUser &&
                                localUser.username === comm.username
                                  ? { display: "inline-block" }
                                  : { display: "none" }
                              }
                              className="bg-gray-200 p-1 rounded-[50%]"
                              onClick={() => {
                                setEditable(true);
                              }}
                            />
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <p
                              contentEditable={editable}
                              suppressContentEditableWarning
                              onInput={(e) => handleCommentInput(e)}
                              style={
                                editable &&
                                localUser &&
                                localUser.username === comm.username
                                  ? {
                                      border: "1px solid red",
                                      minWidth: "100px",
                                    }
                                  : { border: "none", minWidth: "100px" }
                              }
                            >
                              {comm.text}
                            </p>
                            {editable &&
                              localUser &&
                              localUser.username === comm.username && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleCommentChangeSubmit(comm._id)
                                    }
                                    className="bg-blue-600 text-white rounded-full uppercase px-4 py-2 w-fit"
                                  >
                                    <SaveIcon className="mr-2" />
                                    Save
                                  </button>
                                  <button
                                    className="bg-red-600 uppercase text-white rounded-full px-4 py-2 w-fit"
                                    onClick={() => setEditable(false)}
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                          </div>
                          <span>
                            <ThumbUpOffAltIcon />
                            141
                            <ThumbDownOffAltIcon />0
                          </span>
                          <span className="text-blue-700 cursor-pointer">
                            Reply
                          </span>
                          <p>
                            <ArrowForwardIosIcon
                              style={{ transform: "rotateZ(90deg)" }}
                            />{" "}
                            404 replies
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="remaingSpace flex-1 min-w-[300px]">
            {filteredVideosData &&
              filteredVideosData.map((asset) => (
                <CardHorz key={asset._id} data={asset} />
              ))}
          </div>
        </div>
      )}
    </>
  );
}
