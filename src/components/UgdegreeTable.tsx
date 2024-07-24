// components/UgDegreeTable.tsx

import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUgDegrees, addUgDegree, updateUgDegree, deleteUgDegree } from '../services/api';

// Define a TypeScript interface for UG Degree data
interface UgDegree {
    id?: string;
    degree: string;
}

const UgDegreeTable: React.FC = () => {
    const [ugDegrees, setUgDegrees] = useState<UgDegree[]>([]);
    const [open, setOpen] = useState(false);
    const [currentUgDegree, setCurrentUgDegree] = useState<UgDegree | null>(null);

    useEffect(() => {
        fetchUgDegrees();
    }, []);

    const fetchUgDegrees = async () => {
        try {
            const response = await getUgDegrees();
            console.log("Fetched UG degrees data:", response.data); // Log fetched data
            setUgDegrees(response.data);
        } catch (error) {
            console.error("Error fetching UG degrees:", error);
        }
    };

    const handleOpen = (ugDegree: UgDegree | null = null) => {
        setCurrentUgDegree(ugDegree);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentUgDegree(null);
    };

    const handleSave = async () => {
        if (!currentUgDegree) return;

        try {
            if (currentUgDegree.id) {
                await updateUgDegree(currentUgDegree.id, currentUgDegree);
            } else {
                await addUgDegree(currentUgDegree);
            }
            fetchUgDegrees();
            handleClose();
        } catch (error) {
            console.error("Error saving UG degree:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUgDegree(id);
            fetchUgDegrees();
        } catch (error) {
            console.error("Error deleting UG degree:", error);
        }
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add UG Degree</Button>
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
                        {ugDegrees.map((ugDegree) => (
                            <TableRow key={ugDegree.id}>
                                <TableCell>{ugDegree.id}</TableCell>
                                <TableCell>{ugDegree.degree}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(ugDegree)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(ugDegree.id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentUgDegree?.id ? 'Edit UG Degree' : 'Add UG Degree'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Degree"
                        value={currentUgDegree?.degree || ''}
                        onChange={(e) => setCurrentUgDegree({ ...currentUgDegree, degree: e.target.value })}
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

export default UgDegreeTable;
