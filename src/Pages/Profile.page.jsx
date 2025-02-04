import React, { useEffect, useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfileModal = ({
  openModal,
  setOpenModal,
  userInfo,
  getLocalStorage,
}) => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [isOpen, setIsOpen] = useState(openModal);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: userInfo.username,
    email: userInfo.email,
    image: userInfo.image,
  });
  const [previewSource, setPreviewSource] = React.useState(userInfo.image);

  const handleFileInput = () => {
    //add event listner to the image to add an image triggering the input click of the file
    if (isEditing) document.getElementById("fileInput").click();
  };

  useEffect(() => {
    setPreviewSource(JSON.parse(localStorage.getItem("user_data"))?.image);
    setUserData(JSON.parse(localStorage.getItem("user_data")));
  }, [openModal]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    // setIsOpen(false);
    setOpenModal(false);
    setIsEditing(false);
    setPreviewSource(userInfo.image);
    setUserData({
      ...userData,
      username: userInfo.username,
      email: userInfo.email,
    });
  };

  //function to handle preview image
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  //force logout
  function forceLogout() {
    localStorage.clear();
    toast.success("You have been logged out");
    navigate("/");
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    // Here you would typically send the updated data to your backend
    // console.log("Saving user data:", userData);
    setIsEditing(false);

    const formData = new FormData(document.getElementById("profileEditForm"));
    const formJson = Object.fromEntries(formData.entries());
    // API call to edit user data along with the image
    formJson.username = userData.username;
    if (
      JSON.stringify(userData.image) == JSON.stringify(userInfo.image) ||
      !formJson.image.name
    ) {
      delete formJson.image;
    }
    delete formJson.email;
    const newFormData = new FormData();
    if (formJson.hasOwnProperty("image")) {
      newFormData.append("image", formJson.image);
    }
    newFormData.append("username", formJson.username);

    try {
      let response = await fetch(`${base_url}/update-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newFormData,
      });
      const result = await response.json();
      // console.log("result from the upadate profile api::", result);
      if (!response.ok) {
        throw new Error(result.message);
      } else {
        toast.success(result.message);
        localStorage.setItem("user_data", JSON.stringify(result.data));
        getLocalStorage();
      }
    } catch (error) {
      toast.error(error.message);
      if (error.message == "jwt expired") {
        forceLogout();
      }
    } finally {
      handleCloseModal();
    }
  }

  return (
    <div>
      {/* <button
        onClick={handleOpenModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
      >
        Open User Profile
      </button> */}

      {openModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <form
              className="flex flex-col items-center pb-6"
              id="profileEditForm"
              onSubmit={(event) => {
                handleFormSubmit(event);
              }}
            >
              <div className="flex justify-center items-center">
                <img
                  src={previewSource}
                  alt="User Avatar"
                  id="profileAvatar"
                  onClick={handleFileInput}
                  className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4 hover:opacity-50 cursor-pointer"
                />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  name="image"
                  id="fileInput"
                  className="absolute hidden"
                  onChange={(event) => {
                    handleFileInputChange(event), handleInputChange(event);
                  }}
                />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  required
                  value={userData.username}
                  onChange={handleInputChange}
                  className="text-2xl font-bold mb-2 text-center w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold mb-2">
                  {userData?.username}
                </h2>
              )}
              <div className="flex items-center mb-2">
                <MailIcon className="text-gray-500 mr-2" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    className="text-gray-600 w-full"
                    readOnly={true}
                  />
                ) : (
                  <span className="text-gray-600">{userData?.email}</span>
                )}
              </div>
              <div className="flex justify-between w-full">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out flex items-center"
                    >
                      <SaveIcon className="mr-2" /> Save
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out flex items-center"
                    >
                      <EditIcon className="mr-2" /> Edit
                    </span>
                  </>
                )}
                <span
                  onClick={handleCloseModal}
                  className="bg-red-500 cursor-pointer hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                >
                  Close
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileModal;
