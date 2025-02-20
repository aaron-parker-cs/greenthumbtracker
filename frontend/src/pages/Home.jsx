import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
} from "react-bootstrap";
import {
  Drawer,
} from '@mui/material';
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Chart from '../components/common/Chart';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Home = () => {
  const user = useSelector((state) => state.user);

  // if the user isn't authenticated, redirect them to the login page
  if (!user.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const [open, setOpen] = useState(false);
  const flowers = ["Dashboard", "Rose", "Tulip", "Lily", "Daisy", "Sunflower", "Orchid", "Marigold", "Lavender", "Peony", "Chrysanthemum",
    "Rose", "Tulip", "Lily", "Daisy", "Sunflower", "Orchid", "Marigold", "Lavender", "Peony"
  ];

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // TODO: get user's plants from database and add them to ListGroup
  // The flowers array is only temporary for visual purposes
  const DrawerList = (
    <Container style={{width: "250px"}}>
      <ListGroup>
        {flowers.map((flower, index) => (
          <ListGroup.Item onClick={toggleDrawer(false)}> {/* TODO: change dashboard page to whatever was selected */}
            {`${index + 1} ${flower}`}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );

  const chartList = ["this", "is", "testing", "the", "charts", "heeheeheehoo"];

  // d-flex flex-wrap

  return (
    <Container fluid className="pt-3"
      style={{border: "2px solid red", marginBottom: "82px", marginTop: "56px"}}> {/* bottom margin to keep from going under footer */}
      <Button variant="success" onClick={toggleDrawer(true)}
        style={{position: "fixed"}}>
        <i class="bi bi-chevron-double-right"></i>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <Container fluid className="d-inline-flex flex-wrap justify-content-around">
        {chartList.map((chartText, index) => (
          <Chart text={chartText} />
        ))}
      </Container>

    </Container>
  );
};

export default Home;
