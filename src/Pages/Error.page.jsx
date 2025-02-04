import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="errorPageMain">
      <img src="/images/no-file.png" width="100" height="100" />
      <p className="text-2xl">Error</p>
      <button
        onClick={() => navigate("/")}
        className="text-2xl border-2 border-black p-2 hover:scale-90"
      >
        Back to home
      </button>
    </div>
  );
}
