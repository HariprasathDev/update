import React, { useEffect, useState } from 'react';
import { 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField 
} from '@mui/material';
import { getFamilyStatuses, addFamilyStatus, updateFamilyStatus, deleteFamilyStatus } from '../../src/services/api';

const FamilyStatusTable: React.FC = () => {
    const [familyStatuses, setFamilyStatuses] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [currentFamilyStatus, setCurrentFamilyStatus] = useState<any>(null);

    useEffect(() => {
        fetchFamilyStatuses();
    }, []);

    const fetchFamilyStatuses = async () => {
        const response = await getFamilyStatuses();
        setFamilyStatuses(response.data);
    };

    const handleOpen = (familyStatus: any = null) => {
        setCurrentFamilyStatus(familyStatus);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentFamilyStatus(null);
    };

    const handleSave = async () => {
        if (currentFamilyStatus.id) {
            await updateFamilyStatus(currentFamilyStatus.id, currentFamilyStatus);
        } else {
            await addFamilyStatus(currentFamilyStatus);
        }
        fetchFamilyStatuses();
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await deleteFamilyStatus(id);
        fetchFamilyStatuses();
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Family Status</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {familyStatuses.map((status) => (
                            <TableRow key={status.id}>
                                <TableCell>{status.id}</TableCell>
                                <TableCell>{status.status}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(status)}>Edit</Button>
                                    <Button onClick={() => handleDelete(status.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentFamilyStatus?.id ? 'Edit Family Status' : 'Add Family Status'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Status"
                        value={currentFamilyStatus?.status || ''}
                        onChange={(e) => setCurrentFamilyStatus({ ...currentFamilyStatus, status: e.target.value })}
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

export default FamilyStatusTable;
