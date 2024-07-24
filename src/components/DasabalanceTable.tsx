// // components/DasaBalanceTable.tsx

// import React, { useEffect, useState } from 'react';
// import {
//     Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { getDasaBalances, addDasaBalance, updateDasaBalance, deleteDasaBalance } from '../services/api';

// // Define a TypeScript interface for Dasa Balance data
// interface DasaBalance {
//     id?: string;
//     balance: string; // Assuming balance is of type string, adjust as per your API response
// }

// const DasaBalanceTable: React.FC = () => {
//     const [dasaBalances, setDasaBalances] = useState<DasaBalance[]>([]);
//     const [open, setOpen] = useState(false);
//     const [currentDasaBalance, setCurrentDasaBalance] = useState<DasaBalance | null>(null);

//     useEffect(() => {
//         fetchDasaBalances();
//     }, []);

//     const fetchDasaBalances = async () => {
//         try {
//             const response = await getDasaBalances();
//             console.log("Fetched dasa balances data:", response.data); // Log fetched data
//             setDasaBalances(response.data);
//         } catch (error) {
//             console.error("Error fetching dasa balances:", error);
//         }
//     };

//     const handleOpen = (dasaBalance: DasaBalance | null = null) => {
//         setCurrentDasaBalance(dasaBalance);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setCurrentDasaBalance(null);
//     };

//     const handleSave = async () => {
//         if (!currentDasaBalance) return;

//         try {
//             if (currentDasaBalance.id) {
//                 await updateDasaBalance(currentDasaBalance.id, currentDasaBalance);
//             } else {
//                 await addDasaBalance(currentDasaBalance);
//             }
//             fetchDasaBalances();
//             handleClose();
//         } catch (error) {
//             console.error("Error saving dasa balance:", error);
//         }
//     };

//     const handleDelete = async (id: string) => {
//         try {
//             await deleteDasaBalance(id);
//             fetchDasaBalances();
//         } catch (error) {
//             console.error("Error deleting dasa balance:", error);
//         }
//     };

//     return (
//         <Paper>
//             <Button onClick={() => handleOpen()}>Add Dasa Balance</Button>
//             <TableContainer>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>ID</TableCell>
//                             <TableCell>Balance</TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {dasaBalances.map((dasaBalance) => (
//                             <TableRow key={dasaBalance.id}>
//                                 <TableCell>{dasaBalance.id}</TableCell>
//                                 <TableCell>{dasaBalance.balance}</TableCell>
//                                 <TableCell>
//                                     <IconButton onClick={() => handleOpen(dasaBalance)}>
//                                         <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleDelete(dasaBalance.id!)}>
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>{currentDasaBalance?.id ? 'Edit Dasa Balance' : 'Add Dasa Balance'}</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Balance"
//                         value={currentDasaBalance?.balance || ''}
//                         onChange={(e) => setCurrentDasaBalance({ ...currentDasaBalance, balance: e.target.value })}
//                         fullWidth
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose}>Cancel</Button>
//                     <Button onClick={handleSave}>Save</Button>
//                 </DialogActions>
//             </Dialog>
//         </Paper>
//     );
// };

// export default DasaBalanceTable;
