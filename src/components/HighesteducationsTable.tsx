// components/HighestEducationTable.tsx

import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getHighestEducations, addHighestEducation, updateHighestEducation, deleteHighestEducation } from '../services/api';

// Define a TypeScript interface for Highest Education data
interface HighestEducation {
    id?: string;
    degree: string;
}

const HighestEducationTable: React.FC = () => {
    const [highestEducations, setHighestEducations] = useState<HighestEducation[]>([]);
    const [open, setOpen] = useState(false);
    const [currentHighestEducation, setCurrentHighestEducation] = useState<HighestEducation | null>(null);

    useEffect(() => {
        fetchHighestEducations();
    }, []);

    const fetchHighestEducations = async () => {
        try {
            const response = await getHighestEducations();
            console.log("Fetched highest educations data:", response.data); // Log fetched data
            setHighestEducations(response.data);
        } catch (error) {
            console.error("Error fetching highest educations:", error);
        }
    };

    const handleOpen = (highestEducation: HighestEducation | null = null) => {
        setCurrentHighestEducation(highestEducation);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentHighestEducation(null);
    };

    const handleSave = async () => {
        if (!currentHighestEducation) return;

        try {
            if (currentHighestEducation.id) {
                await updateHighestEducation(currentHighestEducation.id, currentHighestEducation);
            } else {
                await addHighestEducation(currentHighestEducation);
            }
            fetchHighestEducations();
            handleClose();
        } catch (error) {
            console.error("Error saving highest education:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteHighestEducation(id);
            fetchHighestEducations();
        } catch (error) {
            console.error("Error deleting highest education:", error);
        }
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Highest Education</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Degree</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {highestEducations.map((highestEducation) => (
                            <TableRow key={highestEducation.id}>
                                <TableCell>{highestEducation.id}</TableCell>
                                <TableCell>{highestEducation.degree}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(highestEducation)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(highestEducation.id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentHighestEducation?.id ? 'Edit Highest Education' : 'Add Highest Education'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Degree"
                        value={currentHighestEducation?.degree || ''}
                        onChange={(e) => setCurrentHighestEducation({ ...currentHighestEducation, degree: e.target.value })}
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

export default HighestEducationTable;
