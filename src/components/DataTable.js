import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import dummyImage from "./istockphoto-1409236261-612x612.jpg"; // Ensure this path is correct

import {
  Box,
  CssBaseline,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputBase,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const pageSize = 20;
  const navigate = useNavigate();

  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const categories = [
    "All Category",
    "House Hold Needs",
    "Cleaning & Household",
    "Home Needs",
    "Kitchen, Garden & Pets",
    "Ice Creams",
    "Hair Care",
  ];

  useEffect(() => {
    const currentPage = Number(searchParams.get("page")) || 1;
    setPage(currentPage);
    fetchProducts(currentPage, pageSize);
  }, [searchParams, pageSize]);

  const fetchProducts = async (currentPage, currentPageSize) => {
    try {
      const response = await axios.get(
        `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products`,
        { params: { page: currentPage, pageSize: currentPageSize } }
      );
      const products = response.data.products || [];
      const totalRowsCount =
        response.data.totalPages * response.data.currentPageResults || 0;

      const mappedRows = products.map((product, index) => ({
        id: product.id || `${currentPage}-${index}`,
        serialNumber: (currentPage - 1) * currentPageSize + index + 1,
        name: product.name,
        mrp: product.mrp.mrp,
        main_category: product.main_category,
        image: product.image || dummyImage,
      }));

      setRows(mappedRows);
      setTotalRows(totalRowsCount);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePageChange = (paginationModel) => {
    const newPageIndex = paginationModel.page + 1;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPageIndex);
    setSearchParams(newSearchParams);
    setPage(newPageIndex);
    fetchProducts(newPageIndex, paginationModel.pageSize);
  };

  const filteredRows = rows.filter((row) => {
    const productCategory = row.main_category?.toLowerCase();
    const selectedCategoryLC = selectedCategory.toLowerCase();

    if (selectedCategory === "All Category") {
      return row.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return (
      productCategory === selectedCategoryLC &&
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleRowClick = (params) => {
    const selectedProduct = rows.find((row) => row.id === params.id);
    navigate(`/product-details/${params.id}`, {
      state: { product: selectedProduct },
    });
  };

  const columns = [
    { field: "serialNumber", headerName: "Serial No", flex: 1, hide: isMobile },
    { field: "name", headerName: "Name", flex: 2 },
    {
      field: "image",
      headerName: "Image",
      flex: 2,
      renderCell: (params) => (
        <img
          src={params.value || dummyImage}
          alt={params.row.name}
          style={{ width: "50px", height: "auto" }}
        />
      ),
    },
    { field: "mrp", headerName: "MRP", flex: 1 },
    {
      field: "main_category",
      headerName: "Category",
      flex: 2,
      hide: isTablet,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <CssBaseline />
      {!isMobile && (
        <Box
          sx={{
            width: "240px",
            height: "100vh",
            bgcolor: "#f5f5f5",
            padding: "16px",
            position: "fixed",
          }}
        >
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "2px 4px",
              mb: 2,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Paper>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box
        sx={{
          marginLeft: isMobile ? "0" : "240px",
          padding: "16px",
          flexGrow: 1,
        }}
      >
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "2px 4px",
                mb: 2,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: "10px" }}>
                <SearchIcon />
              </IconButton>
            </Paper>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <div style={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={pageSize}
            paginationMode="server"
            rowCount={totalRows}
            paginationModel={{ page: page - 1, pageSize }}
            onPaginationModelChange={handlePageChange}
            onRowClick={handleRowClick}
            sx={{ width: isMobile ? "100%" : "auto" }}
          />
        </div>
      </Box>
    </Box>
  );
}
