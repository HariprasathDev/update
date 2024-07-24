import React, { useEffect, useState, useMemo } from 'react';
import { useTable, usePagination, Row } from 'react-table';
import { 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
    TableCellProps
} from '@mui/material';
import { addRecord, getRecords} from '../../services/api';
import { JSX } from 'react/jsx-runtime';

const DataTable: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({
        ProfileId: '',
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await getRecords();
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch records', error);
        }
    };

    const handleAdd = async () => {
        try {
            await addRecord(formData);
            fetchRecords();
            handleClose();
        } catch (error) {
            console.error('Failed to add record', error);
        }
    };


    const handleClose = () => {
        setOpen(false);
        setRecordToEdit(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const columns = useMemo(
        () => [
            { Header: 'Profile ID', accessor: 'ProfileId' },

        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page: tablePage,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: page },
            manualPagination: true,
            pageCount: Math.ceil(data.length / rowsPerPage),
        },
        usePagination
    );

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function handleEdit(_event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Paper>
            <TableContainer>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {tablePage.map((row: Row<object>) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & TableCellProps; render: (arg0: string) => string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                                        <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{recordToEdit ? 'Edit Record' : 'Add New Record'}</DialogTitle>
                <DialogContent>
                    <TextField
                        name="ProfileId"
                        label="Profile ID"
                        value={formData.ProfileId}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={recordToEdit ? handleEdit : handleAdd}>
                        {recordToEdit ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default DataTable;
