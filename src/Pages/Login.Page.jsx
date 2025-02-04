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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";

export default function Login() {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [passEye, setPassEye] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({
    email: false,
    password: false,
  });
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
    // API call to login user
    // console.log("data of form submit::", formJson);
    let response = await fetch(`${base_url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formJson),
    });
    const result = await response.json();
    if (!response.ok) toast.error(result.message);
    else {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_data", JSON.stringify(result.user));
      toast.success(result.message);
      navigate("/");
    }
  }
  function resetForm() {
    setFormData({ email: "", password: "" });
    setFormErrors({ email: false, password: false });
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
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>
        <form
          onSubmit={(event) => {
            handleFormSubmit(event);
            resetForm();
          }}
        >
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
          <Button
            className="w-full"
            type="submit"
            sx={{ mt: 1 /* margin top */ }}
          >
            Log in
          </Button>
        </form>
        <Typography
          endDecorator={
            <Link
              onClick={() => {
                navigate("/register");
              }}
            >
              Sign up
            </Link>
          }
          sx={{ fontSize: "sm", alignSelf: "center" }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  );
}
