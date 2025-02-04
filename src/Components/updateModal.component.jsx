import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import AddIcon from "@mui/icons-material/Add";
import FormHelperText from "@mui/joy/FormHelperText";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Switch from "@mui/material/Switch";
import { setAllVideosData } from "../utils/Redux/reducer";
import { BeatDots } from "./Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UpdateModal({
  openModal,
  getData,
  setOpenModal,
  channel_id,
  updateVideo,
  setUpdateVideo,
  specificVideoData,
}) {
  // console.log("specific video data is::", specificVideoData);

  const [focusedIndex, setFocusedIndex] = React.useState(-1); // Track focused input for categorys
  const [focusedTagIndex, setFocusedTagIndex] = React.useState(-1); // Track focused input for tags
  const [focusedTitle, setFocusedTitle] = React.useState(false); // Track focused input for tags
  const [focusedDescription, setFocusedDecription] = React.useState(false); // Track focused input for tags

  const [open, setOpen] = React.useState(openModal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [catArr, setCatArr] = React.useState([]);
  const [catArrCount, setCatArrCount] = React.useState(0);
  const [tagArrCount, setTagArrCount] = React.useState(0);
  const [tagArr, setTagArr] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOpenModal(false);
  };
  const handleSwitchChange = (event) => {
    setUpdateVideo(event.target.checked);
  };
  const [videoUpdating, setVideoUpdating] = React.useState(false);

  React.useEffect(() => {
    if (openModal) {
      handleOpen();
    } else if (!openModal) {
      handleClose();
    }
    if (specificVideoData) {
      setFormData({
        title: specificVideoData.title,
        description: specificVideoData.description,
        image: specificVideoData.thumbnail_url,
        tags: specificVideoData.tags,
        categories: specificVideoData.categories,
      });
      setPreviewSource(specificVideoData.thumbnail_url);
      setCatArr(
        specificVideoData?.categories ? [...specificVideoData.categories] : []
      );
      setTagArr(specificVideoData?.tags ? [...specificVideoData.tags] : []);
    }
  }, [specificVideoData, openModal]);

  //making unique key
  function generateUniqueKey() {
    const timestamp = Date.now(); // current timestamp in milliseconds
    const randomNum = Math.floor(Math.random() * 1000000); // generates a random number
    const randomString = Math.random().toString(36).substring(2, 10); // generates a random alphanumeric string

    // Combine timestamp, random number, and random string to create a unique key
    const uniqueKey = `${timestamp}-${randomNum}-${randomString}`;

    return uniqueKey;
  }

  //force logout
  function forceLogout() {
    localStorage.clear();
    toast.success("You have been logged out");
    navigate("/");
  }

  const base_url = import.meta.env.VITE_API_BASE_URL;
  //for image preview.
  const [previewSource, setPreviewSource] = React.useState("");
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    categories: "",
  });
  const [formErrors, setFormErrors] = React.useState({
    title: false,
    description: false,
  });
  function handletitle(event) {
    setFormData({ ...formData, title: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, title: true });
    } else {
      setFormErrors({ ...formErrors, title: false });
    }
  }

  //get all videos after a successfull upload and dispatch it to the store
  async function getAllVideos() {
    const response = await fetch(`${base_url}/all-videos`);
    const dataVideo = await response.json();
    if (!response.ok) {
      toast.error(dataVideo.message);
    } else if (dataVideo) {
      dispatch(setAllVideosData(dataVideo.data));
    }
  }

  //function to handle preview image
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };

    reader.readAsDataURL(file);
  };

  //add more category fields :
  function addCategoryField() {
    setCatArrCount(catArrCount + 1);
    setCatArr([...catArr, `catg${catArrCount}`]);
  }
  //add more tag field
  function addTagField() {
    setTagArrCount(tagArrCount + 1);
    setTagArr([...tagArr, `tag${tagArrCount}`]);
  }

  function handledescription(event) {
    setFormData({ ...formData, description: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, description: true });
    } else {
      setFormErrors({ ...formErrors, description: false });
    }
  }
  async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    // API uplaod content

    if (!formData.getAll("categories").length) {
      toast.error("Atleast one category is required.");
    } else if (!formData.getAll("tags").length) {
      toast.error("Atleast one tag is required.");
    } else if (
      formData.getAll("categories").length &&
      formData.getAll("tags").length &&
      !formErrors.title &&
      !formErrors.description
    ) {
      // console.log("data of form submit::", formJson);
      // console.log("all categories::", formData.getAll("categories"));
      // console.log("all tags::", formData.getAll("tags"));

      //make it as formData :
      const newFormData = new FormData();
      newFormData.append("title", formJson.title);
      newFormData.append("description", formJson.description);
      if (formJson && formJson?.image?.name) {
        newFormData.append("image", formJson.image);
      }
      // newFormData.append("categories", formData.getAll("categories"));
      formData.getAll("categories").forEach((category) => {
        // console.log("category::", category);
        newFormData.append("categories", category);
      });
      formData.getAll("tags").forEach((tag) => {
        newFormData.append("tags", tag);
      });

      // console.log("new form data::", Object.fromEntries(newFormData.entries()));

      //disable the button not to make wrong hits
      setUpdateVideo(false);
      //enable the loader of video uploading
      setVideoUpdating(true);
      // Make the api call to upload the content
      fetch(
        `${base_url}/update-video-data/${channel_id}/${specificVideoData._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
          body: newFormData,
        }
      )
        .then(async (res) => {
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.message);
          }
          return result;
        })
        .then((data) => {
          // console.log("updated content data :: ", data);
          toast.success(data.message);
          getData();
          getAllVideos();
          resetForm();
          handleClose();
        })
        .catch((error) => {
          toast.error(error.message);
          if (error.message == "jwt expired") {
            forceLogout();
          }
        })
        .finally(() => setVideoUpdating(false));
    }
  }

  function handleRemoveCat(index) {
    catArr.splice(index, 1);
    setCatArr([...catArr]);
  }

  function handleRemoveTag(index) {
    tagArr.splice(index, 1);
    setTagArr([...tagArr]);
  }

  //working with the foucs on the input field
  function handleFocus(focusFor, index) {
    if (focusFor == "category") {
      setFocusedIndex(index);
    } else {
      setFocusedIndex(-1);
    }
    if (focusFor == "tag") {
      setFocusedTagIndex(index);
    } else {
      setFocusedTagIndex(-1);
    }
    if (focusFor == "title") {
      setFocusedTitle(true);
    } else {
      setFocusedTitle(false);
    }
    if (focusFor == "description") {
      setFocusedDecription(true);
    } else {
      setFocusedDecription(false);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
    });
    setFormErrors({
      title: false,
      description: false,
    });
    setPreviewSource("");
    setTagArr([]);
    setCatArr([]);
    setCatArrCount(0);
    setTagArrCount(0);
    document.getElementById("updateImage").value = "";

    //resetting the image file not working fix later.
  }

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modalBox">
          {videoUpdating && <BeatDots />}
          <main className="loginForm relative">
            <div className="flex flex-wrap justify-between">
              <span className="flex font-semibold">
                Scroll <ArrowDownwardIcon className="top-0" />
              </span>
              <Switch checked={updateVideo} onChange={handleSwitchChange} />
            </div>
            <CssBaseline />
            <Sheet
              sx={{
                width: 300,
                mx: "auto", // margin left & right
                my: 4, // margin top & bottom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: "sm",
                boxShadow: "md",
              }}
              variant="outlined"
            >
              <div>
                {/* <Typography level="h4" component="h1">
                  <b>Welcome!</b>
                </Typography> */}
                {/* <Typography level="body-sm">Sign up to continue.</Typography> */}
              </div>
              <form
                onSubmit={(event) => {
                  handleFormSubmit(event);
                }}
              >
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    // html input attribute
                    name="title"
                    type="type"
                    placeholder="YT Title"
                    onChange={handletitle}
                    error={formErrors.title}
                    onFocus={() => handleFocus("title")} // Track focus
                    autoFocus={focusedTitle}
                    value={formData.title}
                    required
                  />
                  {formErrors.title && (
                    <FormHelperText>
                      <InfoOutlined />
                      Title is required.
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    // html input attribute
                    name="description"
                    type="text"
                    placeholder="YT Description"
                    onChange={handledescription}
                    onFocus={() => handleFocus("description")} // Track focus
                    autoFocus={focusedDescription}
                    error={formErrors.description}
                    value={formData.description}
                    required
                  />
                  {formErrors.description && (
                    <FormHelperText>
                      <InfoOutlined />
                      Description is required.
                    </FormHelperText>
                  )}
                </FormControl>
                {/*Adding the file input field to add profile image*/}
                <FormControl id="updateImage">
                  <FormLabel> Image</FormLabel>
                  <Input
                    // html input attribute
                    name="image"
                    type="file"
                    placeholder="upload image"
                    onChange={handleFileInputChange}
                  />
                  <img
                    id="preview"
                    src={previewSource}
                    alt="Image Preview"
                    style={{ maxWidth: "200px" }}
                  />
                </FormControl>
                <Button
                  onClick={addCategoryField}
                  type="button"
                  sx={{ mt: 1 /* margin top */ }}
                >
                  Add Category <AddIcon />
                </Button>
                {catArr &&
                  catArr.map((cat, index) => (
                    <FormControl key={generateUniqueKey()}>
                      <div className="flex">
                        <FormLabel>
                          <span>
                            Category{" "}
                            <DeleteIcon
                              onClick={() => handleRemoveCat(index)}
                              sx={{ color: "red" }}
                            />
                          </span>
                        </FormLabel>
                      </div>
                      <Input
                        // html input attribute
                        name="categories"
                        id={`catg${index}`}
                        type="text"
                        value={!cat.includes("catg") ? cat : ""}
                        onChange={(e) => {
                          const newCatArr = [...catArr];
                          newCatArr[index] = e.target.value;
                          setCatArr(newCatArr);
                        }}
                        onFocus={() => handleFocus("category", index)} // Track focus
                        autoFocus={focusedIndex === index}
                        placeholder="YT category"
                        required
                      />
                    </FormControl>
                  ))}
                <Button
                  onClick={addTagField}
                  type="button"
                  sx={{ mt: 1 /* margin top */ }}
                >
                  Add Tag <AddIcon />
                </Button>
                {tagArr &&
                  tagArr.map((tag, index) => (
                    <FormControl key={generateUniqueKey()}>
                      <div className="flex">
                        <FormLabel>
                          <span>
                            Tags{" "}
                            <DeleteIcon
                              onClick={() => handleRemoveTag(index)}
                              sx={{ color: "red" }}
                            />
                          </span>{" "}
                        </FormLabel>
                      </div>
                      <Input
                        // html input attribute
                        name="tags"
                        type="text"
                        value={!tag.includes("tag") ? tag : ""}
                        placeholder="YT tag"
                        onChange={(e) => {
                          const newTagArr = [...tagArr];
                          newTagArr[index] = e.target.value;
                          setTagArr(newTagArr);
                        }}
                        onFocus={() => handleFocus("tag", index)} // Track focus
                        autoFocus={focusedTagIndex === index}
                        required
                      />
                    </FormControl>
                  ))}
                <Button
                  className="w-full"
                  type="submit"
                  sx={{ mt: 1 /* margin top */ }}
                  disabled={!updateVideo}
                >
                  Update
                </Button>
              </form>
            </Sheet>
          </main>
        </Box>
      </Modal>

      {/*testing dipatch*/}
      {/* <button onClick={() => dispatch(setUpdateApp())}>Update</button> */}
    </div>
  );
}
