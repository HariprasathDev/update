import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Container,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  Pagination
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

interface BirthStar {
  id: number;
  star: string;
}

const BirthStarList: React.FC = () => {
  const [birthStars, setBirthStars] = useState<BirthStar[]>([]);
  const [newBirthStar, setNewBirthStar] = useState('');
  const [editStarId, setEditStarId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('star');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [starToDelete, setStarToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchBirthStars();
  }, []);

  const fetchBirthStars = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/accounts/birth-stars/');
      setBirthStars(response.data);
    } catch (error) {
      console.error('Error fetching birth stars:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/accounts/birth-stars/${id}/`);
      fetchBirthStars();
    } catch (error) {
      console.error('Error deleting birth star:', error);
    }
  };

  const handleAddOrUpdateBirthStar = async () => {
    const starData = { star: newBirthStar };
    if (editStarId) {
      await axios.put(`http://localhost:8000/api/accounts/birth-stars/${editStarId}/`, starData);
    } else {
      await axios.post('http://localhost:8000/api/accounts/birth-stars/', starData);
    }
    setNewBirthStar('');
    setEditStarId(null);
    setShowPopup(false);
    fetchBirthStars();
  };

  const handleEditStar = (star: BirthStar) => {
    setEditStarId(star.id);
    setNewBirthStar(star.star);
    setShowPopup(true);
  };

  const handleDeleteStar = (id: number) => {
    setStarToDelete(id);
    setDeleteConfirmation(true);
  };

  const confirmDeleteStar = async () => {
    if (starToDelete !== null) {
      await handleDelete(starToDelete);
      setStarToDelete(null);
      setDeleteConfirmation(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setItemsPerPage(parseInt(event.target.value as string, 10));
    setCurrentPage(1);
  };

  const filteredBirthStars = birthStars.filter((birthStar) =>
    birthStar.star.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBirthStars = [...filteredBirthStars].sort((a, b) => {
    const fieldA = a[sortField].toLowerCase();
    const fieldB = b[sortField].toLowerCase();
    if (fieldA < fieldB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginatedBirthStars = sortedBirthStars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container style={{ backgroundColor: 'white', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom>
        Birth Stars
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
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
            placeholder="Search birth star"
            style={{ marginRight: '10px' }}
          />
          <Button onClick={() => setShowPopup(true)}>
            <AddIcon />
          </Button>
        </div>
      </div>
      <List>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('star')}
                >
                  Birth Star {sortField === 'star' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBirthStars.map((birthStar) => (
                <TableRow key={birthStar.id}>
                  <TableCell>{birthStar.star.charAt(0).toUpperCase() + birthStar.star.slice(1)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditStar(birthStar)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteStar(birthStar.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </List>
      <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(filteredBirthStars.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
      {showPopup && (
        <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
          <DialogTitle>{editStarId ? 'Edit Birth Star' : 'Add Birth Star'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Birth Star"
              value={newBirthStar}
              onChange={(e) => setNewBirthStar(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPopup(false)}>Cancel</Button>
            <Button onClick={handleAddOrUpdateBirthStar} disabled={!newBirthStar.trim()}>
              {editStarId ? 'Update' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {deleteConfirmation && (
        <Dialog open={deleteConfirmation} onClose={() => setDeleteConfirmation(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this birth star?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmation(false)}>Cancel</Button>
            <Button onClick={confirmDeleteStar} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
      </div>
    </Container>
  );
};

export default BirthStarList;
