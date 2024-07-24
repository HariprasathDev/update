// // components/BirthStarTable.tsx

// import React, { useEffect, useState } from 'react';
// import {
//     Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { getBirthStars, addBirthStar, updateBirthStar, deleteBirthStar } from '../services/api';

// // Define a TypeScript interface for Birth Star data
// interface BirthStar {
//     id?: string;
//     star: string;
// }

// const BirthStarTable: React.FC = () => {
//     const [birthStars, setBirthStars] = useState<BirthStar[]>([]);
//     const [open, setOpen] = useState(false);
//     const [currentBirthStar, setCurrentBirthStar] = useState<BirthStar | null>(null);

//     useEffect(() => {
//         fetchBirthStars();
//     }, []);

//     const fetchBirthStars = async () => {
//         try {
//             const response = await getBirthStars();
//             console.log("Fetched birth stars data:", response.data); // Log fetched data
//             setBirthStars(response.data);
//         } catch (error) {
//             console.error("Error fetching birth stars:", error);
//         }
//     };

//     const handleOpen = (birthStar: BirthStar | null = null) => {
//         setCurrentBirthStar(birthStar);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setCurrentBirthStar(null);
//     };

//     const handleSave = async () => {
//         if (!currentBirthStar) return;

//         try {
//             if (currentBirthStar.id) {
//                 await updateBirthStar(currentBirthStar.id, currentBirthStar);
//             } else {
//                 await addBirthStar(currentBirthStar);
//             }
//             fetchBirthStars();
//             handleClose();
//         } catch (error) {
//             console.error("Error saving birth star:", error);
//         }
//     };

//     const handleDelete = async (id: string) => {
//         try {
//             await deleteBirthStar(id);
//             fetchBirthStars();
//         } catch (error) {
//             console.error("Error deleting birth star:", error);
//         }
//     };

//     return (
//         <Paper>
//             <Button onClick={() => handleOpen()}>Add Birth Star</Button>
//             <TableContainer>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>ID</TableCell>
//                             <TableCell>Star</TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {birthStars.map((birthStar) => (
//                             <TableRow key={birthStar.id}>
//                                 <TableCell>{birthStar.id}</TableCell>
//                                 <TableCell>{birthStar.star}</TableCell>
//                                 <TableCell>
//                                     <IconButton onClick={() => handleOpen(birthStar)}>
//                                         <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleDelete(birthStar.id!)}>
//                                         <DeleteIcon />   
//                                     </IconButton>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>{currentBirthStar?.id ? 'Edit Birth Star' : 'Add Birth Star'}</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Star"
//                         value={currentBirthStar?.star || ''}
//                         onChange={(e) => setCurrentBirthStar({ ...currentBirthStar, star: e.target.value })}
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

// export default BirthStarTable;
