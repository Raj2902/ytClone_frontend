import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function checkLogin() {
  const navigate = useNavigate();
  if (localStorage.getItem("user_data") && localStorage.getItem("token")) {
    toast.info("You are already logged in");
    navigate("/");
  }
}
