import * as React from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {FragmentGenerator} from "./FragmentGenerator";

export default function FragmentsTable() {
    const [fragmentNames, setFragmentNames] = React.useState(['root']);
    const [fragmentTextsByFragmentName, setFragmentTextsByFragmentName] = React.useState({
        'root': [''],
    });

    const handleFragmentNameChange = function(evt, fragmentIndex) {
        const newFragmentNames = [...fragmentNames];
        newFragmentNames[fragmentIndex] = evt.target.value;
        setFragmentNames(newFragmentNames);

        // Create a new fragmentTextsByFragmentName object
        const newFragmentTextsByFragmentName = {};
        for (let existingFragmentIndex = 0; existingFragmentIndex < fragmentNames.length; existingFragmentIndex++) {
            const existingFragmentName = fragmentNames[existingFragmentIndex];
            if (existingFragmentIndex === fragmentIndex) {
                newFragmentTextsByFragmentName[evt.target.value] = fragmentTextsByFragmentName[existingFragmentName];
            } else {
                newFragmentTextsByFragmentName[existingFragmentName] = fragmentTextsByFragmentName[existingFragmentName];
            }
        }
        setFragmentTextsByFragmentName(newFragmentTextsByFragmentName);
    }

    const handleAddNewFragmentClicked = function() {
        const newFragmentName = `New Fragment #${fragmentNames.length}`;

        // Update fragmentTextsByFragmentName
        const newFragmentTextsByFragmentName = {
            ...fragmentTextsByFragmentName,
            [newFragmentName]: [''],
        };
        setFragmentTextsByFragmentName(newFragmentTextsByFragmentName);

        const newFragmentNames = [...fragmentNames];
        newFragmentNames.push(newFragmentName);
        setFragmentNames(newFragmentNames);
    }

    const handleFragmentTextChange = function(evt, fragmentName, fragmentTextIndex) {
        const newFragmentTextsByFragmentName = {...fragmentTextsByFragmentName};
        const fragmentTexts = [...newFragmentTextsByFragmentName[fragmentName]];
        fragmentTexts[fragmentTextIndex] = evt.target.value;
        newFragmentTextsByFragmentName[fragmentName] = fragmentTexts;
        setFragmentTextsByFragmentName(newFragmentTextsByFragmentName);
    }

    let maxNumberOfFragmentTexts = 0;
    for (const fragmentName of fragmentNames) {
        const fragmentTexts = fragmentTextsByFragmentName[fragmentName];
        // Count the number of non-empty fragment texts
        let numberOfFragmentTexts = fragmentTexts.filter((fragmentText) => fragmentText.trim()).length;
        maxNumberOfFragmentTexts = Math.max(numberOfFragmentTexts, maxNumberOfFragmentTexts);
    }

    let bodyRows = [];
    for (let fragmentTextIndex = 0; fragmentTextIndex < (maxNumberOfFragmentTexts + 1); fragmentTextIndex++) {
        const bodyRow = [];
        for (let fragmentIndex = 0; fragmentIndex < fragmentNames.length; fragmentIndex++) {
            const fragmentName = fragmentNames[fragmentIndex];
            const fragmentTexts = fragmentTextsByFragmentName[fragmentName];
            const fragmentText = fragmentTexts[fragmentTextIndex] || '';
            bodyRow.push(
                <TableCell>
                    <input value={fragmentText} onChange={(evt) => handleFragmentTextChange(evt, fragmentName, fragmentTextIndex)} />
                </TableCell>
            );
        }
        bodyRows.push(
            <TableRow>
                {bodyRow}
            </TableRow>
        );
    }

    return (<>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                fragmentNames.map((fragmentName, fragmentIndex) => (
                                    <TableCell>
                                        <input value={fragmentName} onChange={(evt) => handleFragmentNameChange(evt, fragmentIndex)} />
                                    </TableCell>
                                ))
                            }
                            <TableCell>
                                <Button
                                    variant="contained"
                                    startIcon={<AddBoxIcon />}
                                    onClick={handleAddNewFragmentClicked}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bodyRows}
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>
            <br/>
            <br/>
            <FragmentGenerator fragmentTextsByFragmentName={fragmentTextsByFragmentName} />
        </>
    );
}