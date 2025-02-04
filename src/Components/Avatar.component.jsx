export default function Avatar(props) {
  // console.log("avatar data::", props);
  return (
    <>
      {props.channel_details &&
      props.channel_details.image &&
      props.channel_details.banner_image ? (
        <div className="w-8 h-8 rounded-[50%]">
          <img
            src={props.channel_details.image}
            alt="channelImg"
            className="w-full rounded-[50%]"
          />
        </div>
      ) : (
        <div className="channelImg">Yt</div>
      )}
    </>
  );
}
