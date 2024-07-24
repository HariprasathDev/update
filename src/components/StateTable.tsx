import React, { useEffect, useState } from 'react';
import { 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl 
} from '@mui/material';
import { getCountries, getStates, addState, updateState, deleteState } from '../services/api';

const StateTable: React.FC = () => {
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [currentState, setCurrentState] = useState<any>(null);

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            fetchStates(selectedCountry);
        }
    }, [selectedCountry]);

    const fetchCountries = async () => {
        try {
            const response = await getCountries();
            console.log('Fetched countries:', response.data); // Log to see fetched countries
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchStates = async (countryId: string) => {
        try {
            const response = await getStates(countryId);
            console.log('Fetched states:', response.data); // Log to see fetched states
            setStates(response.data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleOpen = (state: any = null) => {
        setCurrentState(state || { name: '', country: selectedCountry });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentState(null);
    };

    const handleSave = async () => {
        try {
            if (currentState.id) {
                await updateState(selectedCountry, currentState.id, currentState);
            } else {
                await addState(selectedCountry, currentState);
            }
            fetchStates(selectedCountry);
            handleClose();
        } catch (error) {
            console.error('Error saving state:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteState(selectedCountry, id);
            fetchStates(selectedCountry);
        } catch (error) {
            console.error('Error deleting state:', error);
        }
    };

    const handleCountryChange = (countryId: string) => {
        setSelectedCountry(countryId);
    };

    return (
        <Paper>
            <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value as string)}
                >
                    {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                            {country.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button onClick={() => handleOpen()}>Add State</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {states.map((state) => (
                            <TableRow key={state.id}>
                                <TableCell>{state.id}</TableCell>
                                <TableCell>{state.name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(state)}>Edit</Button>
                                    <Button onClick={() => handleDelete(state.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentState?.id ? 'Edit State' : 'Add State'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentState?.name || ''}
                        onChange={(e) => setCurrentState({ ...currentState, name: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default StateTable;
