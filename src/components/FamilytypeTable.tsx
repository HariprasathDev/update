import React, { useEffect, useState } from 'react';
import { 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField 
} from '@mui/material';
import { getFamilyTypes, addFamilyType, updateFamilyType, deleteFamilyType } from '../services/api';

const FamilyTypeTable: React.FC = () => {
    const [familyTypes, setFamilyTypes] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [currentFamilyType, setCurrentFamilyType] = useState<any>(null);

    useEffect(() => {
        fetchFamilyTypes();
    }, []);

    const fetchFamilyTypes = async () => {
        const response = await getFamilyTypes();
        setFamilyTypes(response.data);
    };

    const handleOpen = (familyType: any = null) => {
        setCurrentFamilyType(familyType);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentFamilyType(null);
    };

    const handleSave = async () => {
        if (currentFamilyType.id) {
            await updateFamilyType(currentFamilyType.id, currentFamilyType);
        } else {
            await addFamilyType(currentFamilyType);
        }
        fetchFamilyTypes();
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await deleteFamilyType(id);
        fetchFamilyTypes();
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Family Type</Button>
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
                        {familyTypes.map((type) => (
                            <TableRow key={type.id}>
                                <TableCell>{type.id}</TableCell>
                                <TableCell>{type.name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(type)}>Edit</Button>
                                    <Button onClick={() => handleDelete(type.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentFamilyType?.id ? 'Edit Family Type' : 'Add Family Type'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentFamilyType?.name || ''}
                        onChange={(e) => setCurrentFamilyType({ ...currentFamilyType, name: e.target.value })}
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

export default FamilyTypeTable;
