import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Chart from "../components/common/Chart";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserState } from "../redux/user/slice";
import { api } from "../redux/api";
import {
  fetchPlantsFailure,
  fetchPlantsStart,
  fetchPlantsSuccess,
  selectPlant,
} from "../redux/plant/slice";

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

  // Dummy info for visuals, replace with functioning GET data
  const chartHeaders = [
    "Water Levels",
    "Sunlight",
    "Plant Height",
    "Soil Nutrients",
  ];
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <Container
      fluid
      className="pt-3"
      style={{ marginBottom: "82px", marginTop: "56px" }}
    >
      {" "}
      {/* bottom margin to keep from going under footer */}
      <Container
        fluid
        className="d-inline-flex flex-wrap justify-content-around"
      >
        {chartHeaders.map((header) => (
          <Chart header={header} data={data} />
        ))}
      </Container>
    </Container>
  );
};

export default Home;
