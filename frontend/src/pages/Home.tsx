import { Container, Button, ListGroup, Spinner } from "react-bootstrap";
import { Drawer } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Chart from "../components/common/Chart";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserState } from "../redux/user/slice";
import { api } from "../redux/api";
import { useMemo } from "react";
import {
  fetchPlantsFailure,
  fetchPlantsStart,
  fetchPlantsSuccess,
  selectPlant,
} from "../redux/plant/slice";
import { Plant } from "../models/plant";

const Home = () => {
  const [open, setOpen] = useState(false); // used for side nav bar
  const user = useSelector((state: { user: UserState }) => state.user);
  const { data: plants, isLoading, isError, error } = api.useGetPlantsQuery();
  const dispatch = useDispatch();

  interface ToggleDrawer {
    (newOpen: boolean): () => void;
  }

  const toggleDrawer: ToggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

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

  const handleSelectPlant = useCallback(
    (plant: Plant) => {
      dispatch(selectPlant(plant));
      setOpen(false);
    },
    [dispatch]
  );

  const DrawerList = useMemo(
    () => (
      <Container style={{ width: "250px" }}>
        <ListGroup>
          {isLoading && <Spinner animation="border" />}
          {isError && <p>{JSON.stringify(error)}</p>}
          {!!plants &&
            plants.map((plant, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => handleSelectPlant(plant)}
              >
                {`${index + 1} ${plant.name}`}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Container>
    ),
    [plants, handleSelectPlant, isLoading, isError, error]
  );

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
      <Button
        variant="success"
        onClick={toggleDrawer(true)}
        style={{ position: "fixed" }}
      >
        <i className="bi bi-chevron-double-right"></i>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
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
