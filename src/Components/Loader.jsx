import { BeatLoader, ClimbingBoxLoader } from "react-spinners";
/*made a seprate component for loader wil be shown just need to import and show on conditional rendering*/

export function BeatDots() {
  return (
    <div className="dotsSection">
      <BeatLoader
        loading={true}
        size={10}
        style={{
          textAlign: "center",
          top: "50%",
          position: "absolute",
          zIndex: 1,
          left: "50%",
          right: "50%",
          transform: "rotate(90deg)",
        }}
      />
    </div>
  );
}

export default function Loader() {
  return (
    <div className="loaderSection">
      <ClimbingBoxLoader
        color="rgb(75 182 0)"
        loading={true}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <p>Loading...</p>
    </div>
  );
}
