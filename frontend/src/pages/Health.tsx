import { Spinner } from "react-bootstrap";
import { api } from "../redux/api";

const Health = () => {
  const { data: apiStatus, isLoading: apiLoading } = api.useHealthQuery();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center mb-2">
        <p className="mr-2">
          Api Status:
          {apiStatus ? apiStatus.status : "Error"}
          {apiLoading && <Spinner animation="border" role="status" />}
        </p>
        <p className="text-2xl font-bold mr-2"></p>
      </div>
    </div>
  );
};

export default Health;
