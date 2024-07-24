// components/ParentsOccupationTable.tsx

import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getParentsOccupations, addParentsOccupation, updateParentsOccupation, deleteParentsOccupation } from '../services/api';

// Define a TypeScript interface for Parents Occupation data
interface ParentsOccupation {
    id?: string;
    occupation: string;
}

const ParentsOccupationTable: React.FC = () => {
    const [parentsOccupations, setParentsOccupations] = useState<ParentsOccupation[]>([]);
    const [open, setOpen] = useState(false);
    const [currentParentsOccupation, setCurrentParentsOccupation] = useState<ParentsOccupation | null>(null);

    useEffect(() => {
        fetchParentsOccupations();
    }, []);

    const fetchParentsOccupations = async () => {
        try {
            const response = await getParentsOccupations();
            console.log("Fetched parents occupations data:", response.data); // Log fetched data
            setParentsOccupations(response.data);
        } catch (error) {
            console.error("Error fetching parents occupations:", error);
        }
    };

    const handleOpen = (parentsOccupation: ParentsOccupation | null = null) => {
        setCurrentParentsOccupation(parentsOccupation);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentParentsOccupation(null);
    };

    const handleSave = async () => {
        if (!currentParentsOccupation) return;

        try {
            if (currentParentsOccupation.id) {
                await updateParentsOccupation(currentParentsOccupation.id, currentParentsOccupation);
            } else {
                await addParentsOccupation(currentParentsOccupation);
            }
            fetchParentsOccupations();
            handleClose();
        } catch (error) {
            console.error("Error saving parents occupation:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteParentsOccupation(id);
            fetchParentsOccupations();
        } catch (error) {
            console.error("Error deleting parents occupation:", error);
        }
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Parents Occupation</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Occupation</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parentsOccupations.map((parentsOccupation) => (
                            <TableRow key={parentsOccupation.id}>
                                <TableCell>{parentsOccupation.id}</TableCell>
                                <TableCell>{parentsOccupation.occupation}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(parentsOccupation)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(parentsOccupation.id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentParentsOccupation?.id ? 'Edit Parents Occupation' : 'Add Parents Occupation'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Occupation"
                        value={currentParentsOccupation?.occupation || ''}
                        onChange={(e) => setCurrentParentsOccupation({ ...currentParentsOccupation, occupation: e.target.value })}
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

export default ParentsOccupationTable;
