import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import FormHelperText from "@mui/joy/FormHelperText";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Error } from "@mui/icons-material";

export default function CreateChannel() {
  const navigate = useNavigate();
  const [previewImageSource, setPreviewImageSource] = React.useState("");
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const [previewBannerImageSource, setPreviewBannerImageSource] =
    React.useState("");
  const [formData, setFormData] = React.useState({
    channel_name: "",
    username: "",
    channel_description: "",
    about: "",
    image: "",
    banner_image: "",
  });
  const [formErrors, setFormErrors] = React.useState({
    channel_name: false,
    username: false,
    channel_description: false,
    about: false,
    image: false,
    banner_image: false,
  });
  function handleChannelName(event) {
    setFormData({ ...formData, channel_name: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, channel_name: true });
    } else {
      setFormErrors({ ...formErrors, channel_name: false });
    }
  }
  function handleUsername(event) {
    setFormData({ ...formData, username: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, username: true });
    } else {
      setFormErrors({ ...formErrors, username: false });
    }
  }

  function handleChannelName(event) {
    setFormData({ ...formData, channel_name: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, channel_name: true });
    } else {
      setFormErrors({ ...formErrors, channel_name: false });
    }
  }
  function handleChannelDescription(event) {
    setFormData({ ...formData, channel_description: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, channel_description: true });
    } else {
      setFormErrors({ ...formErrors, channel_description: false });
    }
  }

  function handleChannelName(event) {
    setFormData({ ...formData, channel_name: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, channel_name: true });
    } else {
      setFormErrors({ ...formErrors, channel_name: false });
    }
  }
  function handleAbout(event) {
    setFormData({ ...formData, about: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, about: true });
    } else {
      setFormErrors({ ...formErrors, about: false });
    }
  }

  function handleChannelName(event) {
    setFormData({ ...formData, channel_name: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, channel_name: true });
    } else {
      setFormErrors({ ...formErrors, channel_name: false });
    }
  }
  function handleImage(event) {
    setFormData({ ...formData, image: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, image: true });
    } else {
      setFormErrors({ ...formErrors, image: false });
    }
  }

  function handleChannelName(event) {
    setFormData({ ...formData, channel_name: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, channel_name: true });
    } else {
      setFormErrors({ ...formErrors, channel_name: false });
    }
  }
  function handleBannerImage(event) {
    setFormData({ ...formData, banner_image: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, banner_image: true });
    } else {
      setFormErrors({ ...formErrors, banner_image: false });
    }
  }
  //function to handle preview image
  const handleFileInputChangeImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImageSource(reader.result);
    };

    reader.readAsDataURL(file);
  };
  const handleFileInputChangeBannerImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewBannerImageSource(reader.result);
    };

    reader.readAsDataURL(file);
  };
  async function handleFormSubmission(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    //hit the api to create channel
    try {
      const createChannelData = await fetch(`${base_url}/create-channel`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const jsonRes = await createChannelData.json();
      if (!createChannelData.ok) {
        toast.error(jsonRes.message);
      } else {
        toast.success(jsonRes.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  function resetForm() {
    setFormData({
      channel_name: "",
      username: "",
      channel_description: "",
      about: "",
      image: "",
      banner_image: "",
    });
    setFormErrors({
      channel_name: false,
      username: false,
      channel_description: false,
      about: false,
      image: false,
      banner_image: false,
    });
    setPreviewImageSource("");
    setPreviewBannerImageSource("");
  }
  return (
    <main className="loginForm">
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
          <Typography level="h4" component="h1">
            <b>Create Channel</b>
          </Typography>
        </div>
        <form
          onSubmit={(event) => {
            handleFormSubmission(event);
            resetForm();
          }}
        >
          <FormControl>
            <FormLabel>Channel Name</FormLabel>
            <Input
              // html input attribute
              name="channel_name"
              type="text"
              placeholder="YT Clone"
              onChange={handleChannelName}
              error={formErrors.channel_name}
              value={formData.channel_name}
              required
            />
            {formErrors.channel_name && (
              <FormHelperText>
                <InfoOutlined />
                Channel name is required.
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              // html input attribute
              name="username"
              type="text"
              placeholder="ytclone"
              onChange={handleUsername}
              value={formData.username}
              error={formErrors.username}
              required
            />
            {formErrors.username && (
              <FormHelperText>
                <InfoOutlined />
                Username is required.
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Channel Description</FormLabel>
            <Input
              // html input attribute
              name="channel_description"
              type="text"
              placeholder="Enter your channel description here..."
              onChange={handleChannelDescription}
              value={formData.channel_description}
              error={formErrors.channel_description}
              required
            />
            {formErrors.channel_description && (
              <FormHelperText>
                <InfoOutlined />
                Channel Description is required.
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>About</FormLabel>
            <Input
              // html input attribute
              name="about"
              type="text"
              placeholder="Enter something about your channel like a caption."
              onChange={handleAbout}
              value={formData.about}
              error={formErrors.about}
              required
            />
            {formErrors.about && (
              <FormHelperText>
                <InfoOutlined />
                About is required.
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Input
              // html input attribute
              name="image"
              type="file"
              placeholder="Select channel immage"
              onChange={(event) => {
                handleImage(event);
                handleFileInputChangeImage(event);
              }}
              value={formData.image}
              error={formErrors.image}
              required
            />
            {formErrors.image && (
              <FormHelperText>
                <InfoOutlined />
                Image is required.
              </FormHelperText>
            )}
            <img
              id="preview"
              src={previewImageSource}
              alt="Image Preview"
              style={{ maxWidth: "200px" }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Banner Image</FormLabel>
            <Input
              // html input attribute
              name="banner_image"
              type="file"
              placeholder="Select banner Image"
              onChange={(event) => {
                handleBannerImage(event);
                handleFileInputChangeBannerImage(event);
              }}
              value={formData.banner_image}
              error={formErrors.banner_image}
              required
            />
            {formErrors.banner_image && (
              <FormHelperText>
                <InfoOutlined />
                Banner Image is required.
              </FormHelperText>
            )}
            <img
              id="preview"
              src={previewBannerImageSource}
              alt="Image Preview"
              style={{ maxWidth: "200px" }}
            />
          </FormControl>
          <Button
            className="w-full"
            type="submit"
            sx={{ mt: 1 /* margin top */ }}
          >
            Create
          </Button>
        </form>
      </Sheet>
    </main>
  );
}
