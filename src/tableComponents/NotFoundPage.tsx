import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <h2>No Page Found!</h2>
      <p>
        <Link to="/">Go to the HOME page</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
