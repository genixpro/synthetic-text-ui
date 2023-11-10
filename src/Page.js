import * as React from 'react';
import SampleGenerator from "./SampleGenerator";
import FragmentsTable from "./FragmentsTable";
import Button from '@mui/material/Button';
import {convertToCsvRows, exportRowsToCsvFile, importRowsFromCSVFile, convertCsvRowsToFragmentTexts} from "./csv";
import "./Page.scss";


export default function Page() {
    const [fragmentTexts, setFragmentTexts] = React.useState({
        "root": [''],
    });

    const onFragmentsChanged = function(fragmentTextsByFragmentName) {
        // Filter out any columns that both have no header and no values
        const fragmentNames = Object.keys(fragmentTextsByFragmentName);
        for (const fragmentName of fragmentNames) {
            const isFragmentNameEmpty = (fragmentName ?? "").trim() === "";
            const isFragmentTextsEmpty = fragmentTextsByFragmentName[fragmentName].filter(text => (text ?? "").trim()).length === 0;
            if (isFragmentTextsEmpty && isFragmentNameEmpty) {
                delete fragmentTextsByFragmentName[fragmentName];
            }
        }

        setFragmentTexts(fragmentTextsByFragmentName);
    }

    const handleExportToCsvClicked = function () {
        const csvRows = convertToCsvRows(fragmentTexts);
        exportRowsToCsvFile("generated-fragments.csv", csvRows);
    }

    const handleImportFromCsvClicked = function () {
        importRowsFromCSVFile().then((csvRows) => {
            const fragmentTexts = convertCsvRowsToFragmentTexts(csvRows);
            setFragmentTexts(fragmentTexts);
        });
    }

    return <div className={"page"}>
        <div className={"buttons-bar"}>
            <Button
                variant="contained"
                onClick={handleExportToCsvClicked}
            >
                Export to CSV
            </Button>
            <Button
                variant="contained"
                component="label"
                onClick={handleImportFromCsvClicked}
            >
                Import from CSV
            </Button>
        </div>
        <FragmentsTable
            fragmentTexts={fragmentTexts}
            onFragmentsChanged={onFragmentsChanged}
        />
        <SampleGenerator fragmentTexts={fragmentTexts} />
    </div>
}