import { useParams } from "react-router-dom";
import React from "react";
import UseApiCall from "../utils/customHook/useApiCall";
import ErrorPage from "./Error.page";
import Loader from "../Components/Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CardShow from "../Components/Card.component";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import UploadModal from "../Components/uploadModal.component";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";

export default function Channel() {
  const [openModal, setOpenModal] = useState(false);
  const [uploadVideo, setUploadVideo] = useState(false);
  //this is my local user
  const localUser = JSON.parse(localStorage.getItem("user_data"));
  //this is bottleNeck handled message if the username is updated then the page will not be found hence this match must match
  const errorMessage = "Getting Channel details failed";
  const { username } = useParams();
  const navigate = useNavigate();
  //state to manage the inputs of the changed channel details
  const [channel_details, setChannelDetails] = useState({
    channel_name: "",
    image: "",
    banner_image: "",
    username: "",
    channel_description: "",
    about: "",
  });

  //state to manage if editing the channel detail is possible or not and what things i can change shown so red border if editable is true
  const [editable, setEditable] = useState(false);

  //to display edit profile icon
  const [isHovered, setIsHovered] = useState(false);

  //state to preview the banner Image
  const [previewBannerImage, setPreviewBannerImage] = React.useState({});
  //state to preview the channel Image
  const [previewChannelImage, setPreviewChannelImage] = React.useState({});

  const base_url = import.meta.env.VITE_API_BASE_URL;
  const [channelVideos, setChannelVideos] = useState([]);
  const { data, isLoading, error } = UseApiCall(
    `${base_url}/channel-details-byUsername/${username}`
  );
  // console.log("data from api::", data);
  //get all videos
  function getAllVideos() {
    fetch(`${base_url}/channel-videos/${username}`)
      .then((res) => res.json())
      .then((result) => setChannelVideos(result))
      .catch((error) => toast.error(error.message));
  }
  //force logout
  function forceLogout() {
    localStorage.clear();
    toast.success("You have been logged out");
    navigate("/");
  }
  //edit channel page data submission
  async function handleEditSubmit() {
    const formData = new FormData();
    let valids = 0;
    //get the auth token from the localStorage
    const token = localStorage.getItem("token");
    for (let key of Object.keys(channel_details)) {
      if (key != "image" && key != "banner_image") {
        formData.append(key, channel_details[key]);
      }
      let channel_data = channel_details[key];
      if (channel_data == "") {
        toast.error("Fill all the details");
        break;
      } else {
        valids++;
      }
    }
    if (valids == Object.keys(channel_details).length) {
      setEditable(false);
      if (typeof channel_details.image == "string") {
        delete channel_details.image;
      } else {
        formData.append("image", channel_details.image);
      }
      if (typeof channel_details.banner_image == "string") {
        delete channel_details.banner_image;
      } else {
        formData.append("banner_image", channel_details.banner_image);
      }
      // console.log("submitted channel details::", channel_details);
      //update the channel detials through api.
      try {
        let response = await fetch(
          `${base_url}/update-channel-details/${data._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        const result = await response.json();
        // console.log("result from the upadate channel details api::", result);
        if (!response.ok) {
          throw new Error(result.message);
        } else {
          toast.success(result.message);
          navigate(`/channels/${result.username}`);
        }
      } catch (error) {
        toast.error(error.message);
        if (error.message == "jwt expired") {
          forceLogout();
        }
      }
    }
  }
  //onChange of the username
  function handleUsername() {
    const value = event.target.textContent;
    if (!value) {
      toast.error("Username can't be empty");
    }
    setChannelDetails({ ...channel_details, username: value });
  }
  //onChange of the channel name
  function handleChannelName() {
    const value = event.target.textContent;
    if (!value) {
      toast.error("Channel name can't be empty");
    }
    setChannelDetails({ ...channel_details, channel_name: value });
  }
  function handleFileInput(event) {
    setChannelDetails({
      ...channel_details,
      [event.target.name]: event.target.files[0],
    });
  }
  //onChange of the channel name
  function handleAbout() {
    const value = event.target.textContent;
    if (!value) {
      toast.error("Channel about can't be empty");
    }
    setChannelDetails({ ...channel_details, about: value });
  }
  //onChange of the channel name
  function handleDescription() {
    const value = event.target.textContent;
    if (!value) {
      toast.error("Channel description can't be empty");
    }
    setChannelDetails({ ...channel_details, channel_description: value });
  }
  //onChange of the banner image
  function handleBannerImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewBannerImage(reader.result);
    };

    reader.readAsDataURL(file);
  }
  //onChange of the banner image
  function handleChannelImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewChannelImage(reader.result);
    };

    reader.readAsDataURL(file);
  }
  useEffect(() => {
    getAllVideos();
    if (data) {
      setChannelDetails({
        channel_name: data.channel_name,
        image: data.image,
        banner_image: data.banner_image,
        username: data.username,
        channel_description: data.channel_description,
        about: data.about,
      });
      setPreviewBannerImage(data.banner_image);
      setPreviewChannelImage(data.image);
    }
  }, [data]);
  return (
    <>
      {error && <ErrorPage />}
      {data && data?.message?.toLowerCase() == errorMessage.toLowerCase() && (
        <ErrorPage />
      )}
      {isLoading &&
        data?.message?.toLowerCase() != errorMessage.toLowerCase() && (
          <Loader />
        )}
      {data && data?.message?.toLowerCase() != errorMessage.toLowerCase() && (
        <div className="flex flex-col gap-8 w-full customPadding">
          <div
            className="bannerImg relative"
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
          >
            {isHovered && localUser && localUser._id == data.user_id && (
              <EditIcon
                className="bg-gray-200 !w-10 !h-10 right-0 top-2 p-1 rounded-[50%] absolute"
                onClick={() => {
                  setEditable(true);
                }}
              />
            )}
            <img
              src={previewBannerImage}
              alt="bannerImg"
              onClick={() => {
                localUser &&
                  localUser._id == data.user_id &&
                  editable &&
                  document.getElementById("bannerFileInput")?.click();
              }}
              title="bannerImg"
              className={`banner-img ${editable && "border border-red-600"} ${
                editable && "cursor-pointer"
              }`}
            />
            {/* Input to select new banner img */}
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              name="banner_image"
              id="bannerFileInput"
              className="absolute hidden"
              onChange={(event) => {
                handleBannerImage(event), handleFileInput(event);
              }}
            />
          </div>
          <div className="channelImage  flex gap-8 items-center">
            <div className="w-[160px] h-[160px]">
              <img
                src={previewChannelImage}
                alt="channelImage"
                title="channelImage"
                onClick={() => {
                  localUser &&
                    localUser._id == data.user_id &&
                    editable &&
                    document.getElementById("channelImageFileInput")?.click();
                }}
                className={`channel-image rounded-[50%] ${
                  editable && "border border-red-600"
                } ${editable && "cursor-pointer"}`}
              />
              {/* Input to select new channel image */}
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                name="image"
                id="channelImageFileInput"
                className="absolute hidden"
                onChange={(event) => {
                  handleChannelImage(event), handleFileInput(event);
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <p
                contentEditable={editable}
                onInput={handleChannelName}
                suppressContentEditableWarning
                className={`text-4xl ${editable && "border border-red-600"}`}
              >
                {data.channel_name}
              </p>
              <div className="flex flex-wrap gap-2">
                <p
                  contentEditable={editable}
                  onInput={handleUsername}
                  suppressContentEditableWarning
                  className={`${editable && "border border-red-600"}`}
                >
                  {data.username}
                </p>{" "}
                <p className="text-gray-400">1.19M subscribers</p>{" "}
                <p className="text-gray-400">2.9K videos</p>
              </div>
              <p
                contentEditable={editable}
                onInput={handleAbout}
                suppressContentEditableWarning
                className={`${editable && "border border-red-600"}`}
              >
                {data.about}
              </p>
              <p
                contentEditable={editable}
                onInput={handleDescription}
                suppressContentEditableWarning
                className={`${editable && "border border-red-600"}`}
              >
                {data.channel_description}
              </p>
              <div className="group-btns flex flex-wrap gap-4">
                <button className="bg-black text-white rounded-full px-4 py-2 w-fit">
                  Subscribe
                </button>
                {/*the below two buttons only available when the editable state is set true*/}
                {editable && (
                  <>
                    <button
                      onClick={handleEditSubmit}
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
            </div>
          </div>
          {channelVideos && channelVideos.data ? (
            <>
              <div className="flex flex-wrap justify-between">
                <span className="border-2 border-t-0 border-l-0 border-r-0 w-fit border-black p-2 font-semibold text-2xl">
                  Videos
                </span>
                {JSON.parse(localStorage.getItem("user_data")) &&
                  data.user_id ==
                    JSON.parse(localStorage.getItem("user_data"))._id && (
                    <Button
                      onClick={() => {
                        setUploadVideo(true);
                        setOpenModal(true);
                      }}
                      variant="outlined"
                      size="small"
                    >
                      Upload <AddIcon />
                    </Button>
                  )}
              </div>
              <hr />
              <div className="cardGroup">
                {channelVideos.data.reverse().map((asset) => {
                  return (
                    <CardShow
                      key={asset._id}
                      asset={asset}
                      page="channel"
                      getAllVideos={getAllVideos}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <Loader />
          )}
          {/*video upload modal*/}
          <UploadModal
            _id={data._id}
            getData={getAllVideos}
            openModal={openModal}
            setOpenModal={setOpenModal}
            uploadVideo={uploadVideo}
            setUploadVideo={setUploadVideo}
          />
        </div>
      )}
    </>
  );
}
