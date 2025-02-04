import { Link } from "react-router-dom";
import "../Css/NotFound.css";

/*this is the not found page*/

function NotFound() {
  return (
    <div className="error-page-main-container">
      <div className="error-container">
        <div className="error-code">404</div>
        <div className="error-message">Page Not Found</div>
        {/* <Link to="/" className="back-button">
          Back to Home
        </Link> */}
      </div>
    </div>
  );
}
export default NotFound;
