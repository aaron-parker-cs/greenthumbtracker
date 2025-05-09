import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserState } from "../redux/user/slice";
import { api } from "../redux/api";
import {
  fetchPlantsFailure,
  fetchPlantsStart,
  fetchPlantsSuccess,
  selectPlant,
} from "../redux/plant/slice";
import AubreyPlant from "../components/common/aubreyPlant";

const Home = () => {
  const user = useSelector((state: { user: UserState }) => state.user);
  const { data: plants, isLoading, isError, error } = api.useGetPlantsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      dispatch(fetchPlantsStart());
    }
    if (isError) {
      console.log(error);
      dispatch(fetchPlantsFailure(error as string));
    }
    if (plants) {
      dispatch(selectPlant(plants[0]));
      dispatch(fetchPlantsSuccess(plants));
    }
  }, [plants, dispatch, error, isError, isLoading]);

  if (!user.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Container
      fluid
      className="pt-3"
      style={{ marginBottom: "82px", marginTop: "56px" }}
    >
      {" "}
      {/* bottom margin to keep from going under footer */}
      <AubreyPlant/>
    </Container>
  );
};

export default Home;
