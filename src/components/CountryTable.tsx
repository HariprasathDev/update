import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog,
    DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert, IconButton
} from '@mui/material';
import { getCountries, addCountry, updateCountry, deleteCountry } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CountryTable: React.FC = () => {
    const [countries, setCountries] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [currentCountry, setCurrentCountry] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteCountryId, setDeleteCountryId] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await getCountries();
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setSnackbarMessage('Error fetching countries');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleOpen = (country: any = null) => {
        setCurrentCountry(country);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCountry(null);
    };

    const handleSave = async () => {
        try {
            if (currentCountry.id) {
                await updateCountry(currentCountry.id, currentCountry);
                setSnackbarMessage('Country updated successfully');
            } else {
                await addCountry(currentCountry);
                setSnackbarMessage('Country added successfully');
            }
            setSnackbarSeverity('success');
            fetchCountries();
            handleClose();
        } catch (error) {
            console.error('Error saving country:', error);
            setSnackbarMessage(`Error saving country: ${error.response?.data || error.message}`);
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleDeleteDialogOpen = (id: string) => {
        setDeleteCountryId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeleteCountryId(null);
    };

    const handleDelete = async () => {
        if (!deleteCountryId) return;
        try {
            await deleteCountry(deleteCountryId);
            setSnackbarMessage('Country deleted successfully');
            setSnackbarSeverity('success');
            fetchCountries();
        } catch (error) {
            console.error('Error deleting country:', error);
            setSnackbarMessage(`Error deleting country: ${error.response?.data || error.message}`);
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            handleDeleteDialogClose();
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Country</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countries.map((country) => (
                            <TableRow key={country.id}>
                                <TableCell>{country.id}</TableCell>
                                <TableCell>{country.name}</TableCell>
                                <TableCell>{country.is_active ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(country)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteDialogOpen(country.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentCountry?.id ? 'Edit Country' : 'Add Country'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentCountry?.name || ''}
                        onChange={(e) => setCurrentCountry({ ...currentCountry, name: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Delete Country</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this country?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default CountryTable;