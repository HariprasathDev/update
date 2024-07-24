import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCastes, addCaste, updateCaste, deleteCaste } from '../services/api';

// Define a TypeScript interface for Caste data
interface Caste {
    id?: string;
    name: string;
    description?: string;
}

const CasteTable: React.FC = () => {
    const [castes, setCastes] = useState<Caste[]>([]);
    const [open, setOpen] = useState(false);
    const [currentCaste, setCurrentCaste] = useState<Caste | null>(null);

    useEffect(() => {
        fetchCastes();
    }, []);

    const fetchCastes = async () => {
        try {
            const response = await getCastes();
            console.log("Fetched castes data:", response.data); // Log fetched data
            setCastes(response.data);
        } catch (error) {
            console.error("Error fetching castes:", error);
        }
    };

    const handleOpen = (caste: Caste | null = null) => {
        setCurrentCaste(caste);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCaste(null);
    };

    const handleSave = async () => {
        if (!currentCaste) return;

        try {
            if (currentCaste.id) {
                await updateCaste(currentCaste.id, currentCaste);
            } else {
                await addCaste(currentCaste);
            }
            fetchCastes();
            handleClose();
        } catch (error) {
            console.error("Error saving caste:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCaste(id);
            fetchCastes();
        } catch (error) {
            console.error("Error deleting caste:", error);
        }
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Caste</Button>
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
                        {castes.map((caste) => (
                            <TableRow key={caste.id}>
                                <TableCell>{caste.id}</TableCell>
                                <TableCell>{caste.name}</TableCell>
                              
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(caste)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(caste.id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentCaste?.id ? 'Edit Caste' : 'Add Caste'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentCaste?.name || ''}
                        onChange={(e) => setCurrentCaste({ ...currentCaste, name: e.target.value })}
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

export default CasteTable;
