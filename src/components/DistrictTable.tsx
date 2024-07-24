import React, { useEffect, useState } from 'react';
import { 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl 
} from '@mui/material';
import { getCountries, getStates, getDistricts, addDistrict, updateDistrict, deleteDistrict } from '../services/api';

const DistrictTable: React.FC = () => {
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [currentDistrict, setCurrentDistrict] = useState<any>(null);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        const response = await getCountries();
        setCountries(response.data);
    };

    const fetchStates = async (countryId: string) => {
        const response = await getStates(countryId);
        setStates(response.data);
    };

    const fetchDistricts = async (countryId: string, stateId: string) => {
        const response = await getDistricts(countryId, stateId);
        setDistricts(response.data);
    };

    const handleOpen = (district: any = null) => {
        setCurrentDistrict(district);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDistrict(null);
    };

    const handleSave = async () => {
        if (currentDistrict.id) {
            await updateDistrict(selectedCountry, selectedState, currentDistrict.id, currentDistrict);
        } else {
            await addDistrict(selectedCountry, selectedState, currentDistrict);
        }
        fetchDistricts(selectedCountry, selectedState);
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await deleteDistrict(selectedCountry, selectedState, id);
        fetchDistricts(selectedCountry, selectedState);
    };

    const handleCountryChange = (countryId: string) => {
        setSelectedCountry(countryId);
        fetchStates(countryId);
        setSelectedState('');
        setDistricts([]);
    };

    const handleStateChange = (stateId: string) => {
        setSelectedState(stateId);
        fetchDistricts(selectedCountry, stateId);
    };

    return (
        <Paper>
            <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                >
                    {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                            {country.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                >
                    {states.map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                            {state.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button onClick={() => handleOpen()}>Add District</Button>
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
                        {districts.map((district) => (
                            <TableRow key={district.id}>
                                <TableCell>{district.id}</TableCell>
                                <TableCell>{district.name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(district)}>Edit</Button>
                                    <Button onClick={() => handleDelete(district.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentDistrict?.id ? 'Edit District' : 'Add District'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentDistrict?.name || ''}
                        onChange={(e) => setCurrentDistrict({ ...currentDistrict, name: e.target.value })}
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

export default DistrictTable;
