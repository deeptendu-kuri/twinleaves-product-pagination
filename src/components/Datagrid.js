// import React from 'react';
// import { DataGrid } from '@mui/x-data-grid';

// const rows = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];

// const columns = [
//   { field: 'col1', headerName: 'Column 1', width: 150 },
//   { field: 'col2', headerName: 'Column 2', width: 150 },
// ];

// export default function Home() {
//   return (
//     <div style={{ height: 400, width: '',display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
//       <h1>Data Regarding the products</h1>
//       <DataGrid rows={rows} columns={columns} />
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const columns = [
  { field: 'serialNumber', headerName: 'Serial No', width: 100 },
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'mrp', headerName: 'MRP', width: 100 },
  { field: 'main_category', headerName: 'Category', width: 200 }
];

const PAGE_SIZE = 20; // Number of products per page

export default function Home() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const currentPage = searchParams.get('page') || 1;
    setPage(Number(currentPage));
    fetchProducts(Number(currentPage));
  }, [searchParams]);

  // Fetch products from API
  const fetchProducts = async (currentPage) => {
    try {
      const response = await axios.get(`https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products`, {
        params: { page: currentPage, pageSize: PAGE_SIZE }
      });
      const products = response.data.products;
      const totalPages = response.data.totalPages;

      // Map products to include the required unique `id`
      const mappedRows = products.map((product, index) => ({
        id: product.id || `${currentPage}-${index}`, // Ensure `id` is present
        serialNumber: (currentPage - 1) * PAGE_SIZE + index + 1,
        name: product.name,
        mrp: product.mrp.mrp,
        main_category: product.main_category,
      }));

      setRows(mappedRows);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage + 1 }); // Adjusting to 1-indexed for the API
  };

  return (
    <div style={{ height: 600, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Data Regarding the Products</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={PAGE_SIZE}
        pagination
        paginationMode="server"
        rowCount={totalPages * PAGE_SIZE}
        onPageChange={(params) => handlePageChange(params.page)}
        page={page - 1} // DataGrid uses 0-indexed pages
        lazyLoading
      />
    </div>
  );
}


