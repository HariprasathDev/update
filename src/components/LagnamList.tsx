import React, { useState, useEffect, useMemo } from 'react';
import {Button, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useTable } from 'react-table';
import axios from 'axios';

interface Lagnam {
  id: number;
  name: string;
}

const LagnamList: React.FC = () => {
  const [lagnams, setLagnams] = useState<Lagnam[]>([]);
  const [newLagnam, setNewLagnam] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [editLagnamId, setEditLagnamId] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [lagnamToDelete, setLagnamToDelete] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    fetchLagnams();
  }, []);

  const fetchLagnams = async () => {
    const response = await axios.get('http://localhost:8000/api/accounts/lagnams/');
    setLagnams(response.data);
  };

  const addOrUpdateLagnam = async () => {
    const lagnamData = { name: newLagnam };
    if (editLagnamId) {
      await axios.put(`http://localhost:8000/api/accounts/lagnams/${editLagnamId}/`, lagnamData);
    } else {
      await axios.post('http://localhost:8000/api/accounts/lagnams/', lagnamData);
    }
    setNewLagnam('');
    setShowPopup(false);
    setEditLagnamId(null);
    fetchLagnams();
    setShowSuccessPopup(true);
  };

  const handleEditLagnam = (lagnam: Lagnam) => {
    setEditLagnamId(lagnam.id);
    setNewLagnam(lagnam.name);
    setShowPopup(true);
  };

  const handleDeleteLagnam = (id: number) => {
    setLagnamToDelete(id);
    setDeleteConfirmation(true);
  };

  const confirmDeleteLagnam = async () => {
    if (lagnamToDelete !== null) {
      await axios.delete(`http://localhost:8000/api/accounts/lagnams/${lagnamToDelete}/`);
      setLagnamToDelete(null);
      setDeleteConfirmation(false);
      fetchLagnams();
    }
  };

  const cancelDeleteLagnam = () => {
    setLagnamToDelete(null);
    setDeleteConfirmation(false);
  };

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setNewLagnam('');
    setEditLagnamId(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPageSize(event.target.value as number);
    setCurrentPage(0); // Reset to first page whenever page size changes
  };

  const filteredLagnams = lagnams.filter((lagnam) =>
    lagnam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const data = useMemo(() => filteredLagnams, [filteredLagnams]);
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Actions',
        Cell: ({ row }: any) => (
          <div>
            <IconButton edge="end" aria-label="edit" onClick={() => handleEditLagnam(row.original)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteLagnam(row.original.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns, data });

  return (
    <Container style={{ backgroundColor: 'white', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Lagnams
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <Select value={pageSize} onChange={handlePageSizeChange}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>
        <div>
          <TextField
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Lagnam"
            style={{ marginRight: '10px' }}
          />
          <Button onClick={handlePopupOpen}>
            <AddIcon />
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(filteredLagnams.length / pageSize)}
        page={currentPage + 1}
        onChange={handlePageChange}
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'end' }}
      />
      {showPopup && (
        <Dialog open={showPopup} onClose={handlePopupClose}>
          <DialogTitle>{editLagnamId ? 'Edit Lagnam' : 'Add Lagnam'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Lagnam"
              value={newLagnam}
              onChange={(e) => setNewLagnam(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopupClose}>Cancel</Button>
            <Button onClick={addOrUpdateLagnam} disabled={!newLagnam.trim()}>
              {editLagnamId ? 'Update' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {deleteConfirmation && (
        <Dialog open={deleteConfirmation} onClose={cancelDeleteLagnam}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this Lagnam?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteLagnam}>Yes</Button>
            <Button onClick={cancelDeleteLagnam}>No</Button>
          </DialogActions>
        </Dialog>
      )}
      {showSuccessPopup && (
        <Dialog open={showSuccessPopup} onClose={() => setShowSuccessPopup(false)}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <p>Lagnam has been successfully {editLagnamId ? 'updated' : 'added'}!</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSuccessPopup(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default LagnamList;
