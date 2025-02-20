import {
  Container,
  Button,
  ListGroup,
} from "react-bootstrap";
import {
  Drawer,
} from '@mui/material';
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Home = () => {
  const user = useSelector((state) => state.user);

  // if the user isn't authenticated, redirect them to the login page
  if (!user.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const [open, setOpen] = useState(false);
  const flowers = ["Rose", "Tulip", "Lily", "Daisy", "Sunflower", "Orchid", "Marigold", "Lavender", "Peony", "Chrysanthemum",
    "Rose", "Tulip", "Lily", "Daisy", "Sunflower", "Orchid", "Marigold", "Lavender", "Peony", "Chrysanthemum"
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
          <ListGroup.Item>{`${index + 1} ${flower}`}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );

  return (
    <Container fluid className="my-2">
      <Button variant="success" onClick={toggleDrawer(true)}>
        {/* <i class="bi bi-chevron-double-right"></i> */}
        {/* <i class="bi bi-justify"></i> */}
        <i class="bi bi-list h4"></i>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Container>
  );
};

export default Home;
