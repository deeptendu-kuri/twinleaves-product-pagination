import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import dummyImage from "./istockphoto-1409236261-612x612.jpg";

export default function ProductDetailsPage() {
  const location = useLocation();
  const { product } = location.state || {};

  if (!product) {
    return <Typography variant="h6">No product details available.</Typography>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      padding={2}
    >
      <Card
        sx={{ width: "100%", maxWidth: 600, borderRadius: 2, boxShadow: 3 }}
      >
        <CardMedia
          component="img"
          height="200"
          image={product.image || dummyImage}
          alt={product.name}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            fontWeight="bold"
            component="div"
            align="center"
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Category: {product.main_category}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            MRP: ₹{product.mrp}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            marginTop={2}
          >
            Description: Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
