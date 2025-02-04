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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Register() {
  const base_url = import.meta.env.VITE_API_BASE_URL;

  const [previewSource, setPreviewSource] = React.useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    image: "",
    password: "",
    confPassword: "",
  });

  //check already logged in
  React.useEffect(() => {
    if (localStorage.getItem("user_data") && localStorage.getItem("token")) {
      toast.info("You are already logged in");
      navigate("/");
    }
  });

  const [confPassEye, setConfPassEye] = React.useState(false);
  const [passEye, setPassEye] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({
    username: false,
    email: false,
    image: false,
    password: false,
    confPassword: false,
  });
  function handleUsername(event) {
    setFormData({ ...formData, username: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, username: true });
    } else {
      setFormErrors({ ...formErrors, username: false });
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

  function handleEmail(event) {
    setFormData({ ...formData, email: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, email: true });
    } else {
      setFormErrors({ ...formErrors, email: false });
    }
  }
  function handlePassword(event) {
    setFormData({ ...formData, password: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, password: true });
    } else {
      setFormErrors({ ...formErrors, password: false });
    }
  }
  async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    // API call to register user
    // console.log("data of form submit::", formJson);
    let response = await fetch(`${base_url}/register`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) toast.error(result.message);
    else {
      toast.success(result.message);
      navigate("/login");
    }
  }
  function handleConfPassword(event) {
    setFormData({ ...formData, confPassword: event.target.value });
    if (!event.target.value) {
      setFormErrors({ ...formErrors, confPassword: true });
    } else {
      setFormErrors({ ...formErrors, confPassword: false });
    }
  }
  function resetForm() {
    setFormData({
      username: "",
      email: "",
      password: "",
      confPassword: "",
      image: "",
    });
    setFormErrors({
      username: false,
      email: false,
      image: false,
      password: false,
      confPassword: false,
    });
    setPreviewSource("");
    document.getElementById("profileImg").value = "";
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
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign up to continue.</Typography>
        </div>
        <form
          onSubmit={(event) => {
            handleFormSubmit(event);
            resetForm();
          }}
        >
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              // html input attribute
              name="username"
              type="type"
              placeholder="John Doe"
              onChange={handleUsername}
              error={formErrors.username}
              value={formData.username}
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
            <FormLabel>Email</FormLabel>
            <Input
              // html input attribute
              name="email"
              type="email"
              placeholder="johndoe@email.com"
              onChange={handleEmail}
              error={formErrors.email}
              value={formData.email}
              required
            />
            {formErrors.email && (
              <FormHelperText>
                <InfoOutlined />
                Email is required.
              </FormHelperText>
            )}
          </FormControl>
          {/*Adding the file input field to add profile image*/}
          <FormControl>
            <FormLabel>Profile Image</FormLabel>
            <Input
              // html input attribute
              name="image"
              type="file"
              id="profileImg"
              placeholder="upload image"
              onChange={handleFileInputChange}
              // error={formErrors.email}
              // value={formData.email}
              // required
            />
            {/* {formErrors.email && (
              <FormHelperText>
                <InfoOutlined />
                Email is required.
              </FormHelperText>
            )} */}
            <img
              id="preview"
              src={previewSource}
              alt="Image Preview"
              style={{ maxWidth: "200px" }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>
              <span>Password</span>{" "}
              {passEye ? (
                <VisibilityIcon onClick={() => setPassEye(false)} />
              ) : (
                <VisibilityOffIcon onClick={() => setPassEye(true)} />
              )}
            </FormLabel>
            <Input
              // html input attribute
              name="password"
              type={passEye ? "text" : "password"}
              placeholder="password"
              onChange={handlePassword}
              value={formData.password}
              error={formErrors.password}
              required
            />
            {formErrors.password && (
              <FormHelperText>
                <InfoOutlined />
                Password is required.
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>
              <span>Confirm Password</span>{" "}
              {confPassEye ? (
                <VisibilityIcon onClick={() => setConfPassEye(false)} />
              ) : (
                <VisibilityOffIcon onClick={() => setConfPassEye(true)} />
              )}
            </FormLabel>
            <Input
              // html input attribute
              name="confirm_password"
              type={confPassEye ? "text" : "password"}
              placeholder="password"
              onChange={handleConfPassword}
              value={formData.confPassword}
              error={formErrors.confPassword}
              required
            />
            {formErrors.confPassword && (
              <FormHelperText>
                <InfoOutlined />
                Confirm Password is required.
              </FormHelperText>
            )}
            {formData.confPassword !== formData.password && (
              <FormHelperText>
                <InfoOutlined />
                Password and Confirm password are not same.
              </FormHelperText>
            )}
          </FormControl>
          <Button
            className="w-full"
            type="submit"
            sx={{ mt: 1 /* margin top */ }}
          >
            Sign up
          </Button>
        </form>
        <Typography
          endDecorator={
            <Link
              onClick={() => {
                navigate("/login");
              }}
            >
              Log in
            </Link>
          }
          sx={{ fontSize: "sm", alignSelf: "center" }}
        >
          Already have an account?
        </Typography>
      </Sheet>
    </main>
  );
}
