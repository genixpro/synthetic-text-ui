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
import {CardHeader} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {estimateUniqueFragments, isFragmentTextValid} from "./fragment";
import WarningIcon from '@mui/icons-material/Warning';
import "./FragmentsTable.scss";
import {useMemo} from "react";


export default function FragmentsTable(props) {
    const fragmentTextsByFragmentName = props.fragmentTexts;
    const fragmentNames = Object.keys(fragmentTextsByFragmentName);

    const changeFragmentTexts = function (newFragmentTexts) {
        if (props.onFragmentsChanged) {
            props.onFragmentsChanged(newFragmentTexts);
        }
    }

    const handleFragmentNameChange = function (evt, fragmentIndex) {
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
        changeFragmentTexts(newFragmentTextsByFragmentName);
    }

    const handleAddNewFragmentClicked = function () {
        const newFragmentName = `New Fragment #${fragmentNames.length}`;

        // Update fragmentTextsByFragmentName
        const newFragmentTextsByFragmentName = {
            ...fragmentTextsByFragmentName,
            [newFragmentName]: [''],
        };
        changeFragmentTexts(newFragmentTextsByFragmentName);
    }

    const handleFragmentTextChange = function (evt, fragmentName, fragmentTextIndex) {
        const newFragmentTextsByFragmentName = {...fragmentTextsByFragmentName};
        const fragmentTexts = [...newFragmentTextsByFragmentName[fragmentName]];
        fragmentTexts[fragmentTextIndex] = evt.target.value;
        newFragmentTextsByFragmentName[fragmentName] = fragmentTexts;
        changeFragmentTexts(newFragmentTextsByFragmentName);
    }

    let maxNumberOfFragmentTexts = 0;
    for (const fragmentName of fragmentNames) {
        const fragmentTexts = fragmentTextsByFragmentName[fragmentName];
        // Count the number of non-empty fragment texts
        let numberOfFragmentTexts = fragmentTexts.filter((fragmentText) => (fragmentText ?? "").trim()).length;
        maxNumberOfFragmentTexts = Math.max(numberOfFragmentTexts, maxNumberOfFragmentTexts);
    }

    let bodyRows = [];
    for (let fragmentTextIndex = 0; fragmentTextIndex < (maxNumberOfFragmentTexts + 1); fragmentTextIndex++) {
        const bodyRow = [];
        for (let fragmentIndex = 0; fragmentIndex < fragmentNames.length; fragmentIndex++) {
            const fragmentName = fragmentNames[fragmentIndex];
            const fragmentTexts = fragmentTextsByFragmentName[fragmentName];
            const fragmentText = fragmentTexts[fragmentTextIndex] || '';
            let isValid = isFragmentTextValid(fragmentText, fragmentTextsByFragmentName);
            bodyRow.push(
                <TableCell key={fragmentIndex} className={"fragment-text-cell"}>
                    <div className={"fragment-text-cell-contents"}>
                        <input
                            value={fragmentText}
                            onChange={(evt) => handleFragmentTextChange(evt, fragmentName, fragmentTextIndex)}
                        />
                        {
                            !isValid ? <div className={"invalid-reference-icon"} title={"Reference Is Invalid"}>
                                <WarningIcon color={"warning"}/>
                            </div> : null
                        }
                    </div>
                </TableCell>
            );
        }

        bodyRow.push(
            <TableCell key={'spare'}/>
        )

        bodyRows.push(
            <TableRow key={bodyRows.length}>
                {bodyRow}
            </TableRow>
        );
    }

    return (<Card className={"fragments-table"}>
            <CardHeader title={"Fragment Texts"}/>
            <CardContent>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {
                                    fragmentNames.map((fragmentName, fragmentIndex) => (
                                        <TableCell key={fragmentIndex} className={"fragment-name-cell"}>
                                            <div className={"fragment-name-cell-contents"}>
                                                <span className={"at-symbol"}>@</span>
                                                <input value={fragmentName}
                                                       onChange={(evt) => handleFragmentNameChange(evt, fragmentIndex)}
                                                />
                                            </div>
                                        </TableCell>
                                    ))
                                }
                                <TableCell className={"fragment-name-cell"}>
                                    <div className={"fragment-name-cell-contents"}>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddBoxIcon/>}
                                            onClick={handleAddNewFragmentClicked}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bodyRows}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}