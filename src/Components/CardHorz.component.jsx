import UseApiCall from "../utils/customHook/useApiCall";
import { useNavigate } from "react-router-dom";

import Loader from "./Loader";
import ErrorPage from "../Pages/Error.page";
export default function CardHorz(props) {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  // console.log(
  //   "card horizontal :: ",
  //   `${base_url}/channel-details-byChannelId/${props.data.channel_id}`
  // );
  const { data, isLoading, error } = UseApiCall(
    `${base_url}/channel-details-byChannelId/${props.data.channel_id}`
  );
  if (error) {
    return <ErrorPage />;
  } else if (isLoading) {
    return <Loader />;
  }
  return (
    <div
      onClick={() => navigate(`/videos/${props.data._id}`)}
      className="m-2 rounded flex gap-3 cursor-pointer hover:scale-90"
    >
      <img
        className="rounded"
        width="100"
        height="100"
        src={props.data.thumbnail_url}
        alt={props.data.title + " " + "img"}
        title={props.data.title}
      />
      <div>
        <p className="font-semibold">{props.data.title}</p>
        <p className="text-gray-500">{data && data.channel_name}</p>
        <p className="flex gap-2 flex-wrap text-gray-500">
          <span>17K views</span>
          <span className="flex items-center">
            <span className="w-1 h-1 rounded-[50%] inline-block bg-gray-500 mx-2"></span>
            {props.data.createdAt}
          </span>
        </p>
      </div>
    </div>
  );
}
