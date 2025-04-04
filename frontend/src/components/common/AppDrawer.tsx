import {
  Container,
  ListGroup,
  Spinner,
  FormControl,
  Button,
} from "react-bootstrap";
import { Drawer } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { selectPlant } from "../../redux/plant/slice";
import { api } from "../../redux/api";
import { Plant } from "../../models/plant";

const AppDrawer = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: plants, isLoading, isError, error } = api.useGetPlantsQuery();
  const dispatch = useDispatch();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleSelectPlant = useCallback(
    (plant: Plant) => {
      dispatch(selectPlant(plant));
      setOpen(false);
    },
    [dispatch]
  );

  const filteredPlants = useMemo(() => {
    if (!plants) return [];
    return plants.filter((plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [plants, searchTerm]);

  const DrawerList = useMemo(
    () => (
      <Container style={{ width: "250px" }}>
        <FormControl
          type="text"
          placeholder="Search plants..."
          className="mt-3 mb-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ListGroup>
          {isLoading && <Spinner animation="border" />}
          {isError && <p>{JSON.stringify(error)}</p>}
          {!!filteredPlants &&
            filteredPlants.map((plant, index) => (
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
    [filteredPlants, handleSelectPlant, isLoading, isError, error, searchTerm]
  );

  return (
    <>
      <Button
        className="m-3"
        variant="success"
        onClick={toggleDrawer(true)}
        style={{ position: "fixed" }}
      >
        <i className="bi bi-chevron-double-right"></i>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
};

export default AppDrawer;
