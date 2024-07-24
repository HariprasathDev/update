import React, { useEffect, useState } from 'react';
import { 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'; // Import icons
import { getProfileHolders, addProfileHolder, updateProfileHolder, deleteProfileHolder } from '../services/api';

const ProfileHolderTable: React.FC = () => {
    const [profileHolders, setProfileHolders] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [currentProfileHolder, setCurrentProfileHolder] = useState<any>(null);

    useEffect(() => {
        fetchProfileHolders();
    }, []);

    const fetchProfileHolders = async () => {
        const response = await getProfileHolders();
        setProfileHolders(response.data);
    };

    const handleOpen = (profileHolder: any = null) => {
        setCurrentProfileHolder(profileHolder);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentProfileHolder(null);
    };

    const handleSave = async () => {
        if (currentProfileHolder.id) {
            await updateProfileHolder(currentProfileHolder.id, currentProfileHolder);
        } else {
            await addProfileHolder(currentProfileHolder);
        }
        fetchProfileHolders();
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await deleteProfileHolder(id);
        fetchProfileHolders();
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Profile Holder</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Relation</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profileHolders.map((profileHolder) => (
                            <TableRow key={profileHolder.id}>
                                <TableCell>{profileHolder.id}</TableCell>
                                <TableCell>{profileHolder.name}</TableCell>
                                <TableCell>{profileHolder.relation}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(profileHolder)} aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(profileHolder.id)} aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentProfileHolder?.id ? 'Edit Profile Holder' : 'Add Profile Holder'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={currentProfileHolder?.name || ''}
                        onChange={(e) => setCurrentProfileHolder({ ...currentProfileHolder, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Relation"
                        value={currentProfileHolder?.relation || ''}
                        onChange={(e) => setCurrentProfileHolder({ ...currentProfileHolder, relation: e.target.value })}
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

export default ProfileHolderTable;
