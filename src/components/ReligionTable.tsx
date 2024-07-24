import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getreligions, addreligions, updatereligions, deletereligions } from '../services/api';

// Define a TypeScript interface for Religion data
interface Religion {
    id?: string;
    name: string;
}

const ReligionTable: React.FC = () => {
    const [religions, setReligions] = useState<Religion[]>([]);
    const [open, setOpen] = useState(false);
    const [currentReligion, setCurrentReligion] = useState<Religion | null>(null);

    useEffect(() => {
        fetchReligions();
    }, []);

    const fetchReligions = async () => {
        try {
            const response = await getreligions();
            console.log("Fetched religions data:", response.data); // Log fetched data
            setReligions(response.data);
        } catch (error) {
            console.error("Error fetching religions:", error);
        }
    };

    const handleOpen = (religion: Religion | null = null) => {
        setCurrentReligion(religion);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentReligion(null);
    };

    const handleSave = async () => {
        if (!currentReligion) return;

        try {
            if (currentReligion.id) {
                await updatereligions(currentReligion.id, currentReligion);
            } else {
                await addreligions(currentReligion);
            }
            fetchReligions();
            handleClose();
        } catch (error) {
            console.error("Error saving religion:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletereligions(id);
            fetchReligions();
        } catch (error) {
            console.error("Error deleting religion:", error);
        }
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Religion</Button>
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
                        {religions.map((religion) => (
                            <TableRow key={religion.id}>
                                <TableCell>{religion.id}</TableCell>
                                <TableCell>{religion.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(religion)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(religion.id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentReligion?.id ? 'Edit Religion' : 'Add Religion'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentReligion?.name || ''}
                        onChange={(e) => setCurrentReligion({ ...currentReligion, name: e.target.value })}
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

export default ReligionTable;
