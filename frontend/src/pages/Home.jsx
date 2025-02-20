import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import {
  Box,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.user);

  // if the user isn't authenticated, redirect them to the login page
  if (!user.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const [open, setOpen] = useState(false);
  const flowers = ["Rose", "Tulip", "Lily", "Daisy", "Sunflower", "Orchid", "Marigold", "Lavender", "Peony", "Chrysanthemum"];

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {flowers.map((flower, index) => (
          <ListItem key={flower} disablePadding>
            <ListItemText primary={flower} />
          </ListItem>
        ))};
      </List>
    </Box>
  );

  return (
    <MDBContainer>
      <Button onClick={toggleDrawer(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </MDBContainer>
  );
};

export default Home;
