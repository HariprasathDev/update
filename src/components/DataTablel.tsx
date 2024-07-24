// src/components/DataTable.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Button,
} from '@mui/material';
import axios from 'axios';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

interface DataTableProps {
  columns: Column[];
  apiEndpoint: string;
}

interface Data {
  results: any[];
  count: number;
}

const DataTable: React.FC<DataTableProps> = ({ columns, apiEndpoint }) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Data>({ results: [], count: 0 });
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, order, orderBy, search, apiEndpoint]);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiEndpoint, {
        params: {
          page: page + 1,
          page_size: rowsPerPage,
          ordering: order === 'asc' ? orderBy : `-${orderBy}`,
          search,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (ContentId: number) => {
    try {
      if (ContentId) {
        await axios.delete(`${apiEndpoint}/${ContentId}/`);
        fetchData(); // Refresh the data after deletion
      } else {
        console.error('Error: Missing ID for the row to delete');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <Paper className="w-full">
      <div className='w-full text-right px-2'>
      <TextField
        label="Search"
        variant="outlined"
        margin="normal"
        value={search}
        onChange={handleSearchChange}
        
      />
        </div>
      
      <TableContainer className="bg-white">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel
                  className='!text-red-600 !text-base  !text-md text-nowrap font-semibold  '
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell className='!text-red-600 !text-base !text-nowrap !font-semibold'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.results.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number'
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Button component={Link} to={`/admin/edit/${row.ContentId}`}>Edit</Button>
                  <Button onClick={() => handleDelete(row.ContentId)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
