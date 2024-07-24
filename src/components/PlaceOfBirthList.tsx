import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  MenuItem,
  Select,
  Container,
  Typography,
  Pagination,  // Import Pagination
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

interface PlaceOfBirth {
  id: number;
  place: string;
}

const PlaceOfBirthList: React.FC = () => {
  const [placesOfBirth, setPlacesOfBirth] = useState<PlaceOfBirth[]>([]);
  const [newPlaceOfBirth, setNewPlaceOfBirth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [editPlaceId, setEditPlaceId] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);  // Pagination starts at 1

  useEffect(() => {
    fetchPlacesOfBirth();
  }, []);

  const fetchPlacesOfBirth = async () => {
    const response = await axios.get('http://localhost:8000/api/accounts/place-of-births/');
    setPlacesOfBirth(response.data);
  };

  const addOrUpdatePlaceOfBirth = async () => {
    const placeData = { place: newPlaceOfBirth };
    if (editPlaceId) {
      await axios.put(`http://localhost:8000/api/accounts/place-of-births/${editPlaceId}/`, placeData);
    } else {
      await axios.post('http://localhost:8000/api/accounts/place-of-births/', placeData);
    }
    setNewPlaceOfBirth('');
    setShowPopup(false);
    setEditPlaceId(null);
    fetchPlacesOfBirth();
    setShowSuccessPopup(true);
  };

  const handleEditPlace = (place: PlaceOfBirth) => {
    setEditPlaceId(place.id);
    setNewPlaceOfBirth(place.place);
    setShowPopup(true);
  };

  const handleDeletePlace = (id: number) => {
    setPlaceToDelete(id);
    setDeleteConfirmation(true);
  };

  const confirmDeletePlace = async () => {
    if (placeToDelete !== null) {
      await axios.delete(`http://localhost:8000/api/accounts/place-of-births/${placeToDelete}/`);
      setPlaceToDelete(null);
      setDeleteConfirmation(false);
      fetchPlacesOfBirth();
    }
  };

  const cancelDeletePlace = () => {
    setPlaceToDelete(null);
    setDeleteConfirmation(false);
  };

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setNewPlaceOfBirth('');
    setEditPlaceId(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPageSize(event.target.value as number);
    setCurrentPage(1);  // Reset to first page whenever page size changes
  };

  const filteredPlacesOfBirth = placesOfBirth
    .filter((placeOfBirth) =>
      placeOfBirth.place.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Container style={{ backgroundColor: 'white', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Places of Birth
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
              placeholder="Search place of birth"
              style={{ marginRight: '10px' }}
            />
            <Button onClick={handlePopupOpen}>
              <AddIcon />
            </Button>
          </div>
        </div>
        <List>
          {filteredPlacesOfBirth.map((place) => (
            <ListItem key={place.id}>
              <ListItemText primary={place.place} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditPlace(place)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePlace(place.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(placesOfBirth.filter((placeOfBirth) =>
            placeOfBirth.place.toLowerCase().includes(searchQuery.toLowerCase())
          ).length / pageSize)}
          page={currentPage}
          onChange={handlePageChange}
        />
        </div>
      </div>
      {showPopup && (
        <Dialog open={showPopup} onClose={handlePopupClose}>
          <DialogTitle>{editPlaceId ? 'Edit Place of Birth' : 'Add Place of Birth'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Place Of Birth"
              value={newPlaceOfBirth}
              onChange={(e) => setNewPlaceOfBirth(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopupClose}>Cancel</Button>
            <Button onClick={addOrUpdatePlaceOfBirth} disabled={!newPlaceOfBirth.trim()}>
              {editPlaceId ? 'Update' : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {deleteConfirmation && (
        <Dialog open={deleteConfirmation} onClose={cancelDeletePlace}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this place of birth?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeletePlace}>Yes</Button>
            <Button onClick={cancelDeletePlace}>No</Button>
          </DialogActions>
        </Dialog>
      )}
      {showSuccessPopup && (
        <Dialog open={showSuccessPopup} onClose={() => setShowSuccessPopup(false)}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <p>Place of birth has been successfully {editPlaceId ? 'updated' : 'added'}!</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSuccessPopup(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default PlaceOfBirthList;
