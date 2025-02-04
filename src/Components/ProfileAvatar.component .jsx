export default function ProfileAvatar(props) {
  // console.log("avatar data::", props);
  return (
    <>
      {props.user_details ? (
        <div className="w-8 h-8 rounded-[50%]">
          <img
            src={props.user_details.image}
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
