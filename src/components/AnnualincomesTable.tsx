// components/AnnualIncomeTable.tsx

import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAnnualIncomes, addAnnualIncome, updateAnnualIncome, deleteAnnualIncome } from '../services/api';

// Define a TypeScript interface for Annual Income data
interface AnnualIncome {
    id?: string;
    income: number;
}

const AnnualIncomeTable: React.FC = () => {
    const [annualIncomes, setAnnualIncomes] = useState<AnnualIncome[]>([]);
    const [open, setOpen] = useState(false);
    const [currentAnnualIncome, setCurrentAnnualIncome] = useState<AnnualIncome | null>(null);

    useEffect(() => {
        fetchAnnualIncomes();
    }, []);

    const fetchAnnualIncomes = async () => {
        try {
            const response = await getAnnualIncomes();
            console.log("Fetched annual incomes data:", response.data); // Log fetched data
            setAnnualIncomes(response.data);
        } catch (error) {
            console.error("Error fetching annual incomes:", error);
        }
    };

    const handleOpen = (annualIncome: AnnualIncome | null = null) => {
        setCurrentAnnualIncome(annualIncome);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentAnnualIncome(null);
    };

    const handleSave = async () => {
        if (!currentAnnualIncome) return;

        try {
            if (currentAnnualIncome.id) {
                await updateAnnualIncome(currentAnnualIncome.id, currentAnnualIncome);
            } else {
                await addAnnualIncome(currentAnnualIncome);
            }
            fetchAnnualIncomes();
            handleClose();
        } catch (error) {
            console.error("Error saving annual income:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAnnualIncome(id);
            fetchAnnualIncomes();
        } catch (error) {
            console.error("Error deleting annual income:", error);
        }
    };

    return (
        <Paper>
            <Button onClick={() => handleOpen()}>Add Annual Income</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Income</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {annualIncomes.map((annualIncome) => (
                            <TableRow key={annualIncome.id}>
                                <TableCell>{annualIncome.id}</TableCell>
                                <TableCell>{annualIncome.income}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(annualIncome)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(annualIncome.id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentAnnualIncome?.id ? 'Edit Annual Income' : 'Add Annual Income'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Income"
                        type="number"
                        value={currentAnnualIncome?.income || ''}
                        onChange={(e) => setCurrentAnnualIncome({ ...currentAnnualIncome, income: parseFloat(e.target.value) })}
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

export default AnnualIncomeTable;
