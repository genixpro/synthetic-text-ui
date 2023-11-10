


export function convertToCsvRows(fragmentTexts) {
    const fragmentNames = Object.keys(fragmentTexts);
    const csvRows = [];
    // The first row is the headers, which will contain all the fragment names
    csvRows.push(fragmentNames);

    let maxNumberOfFragmentTexts = 0;
    for (const fragmentName of fragmentNames) {
        const fragmentTextsForName = fragmentTexts[fragmentName];
        // Count the number of non-empty fragment texts
        let numberOfFragmentTexts = fragmentTextsForName.filter((fragmentText) => (fragmentText ?? "").trim()).length;
        maxNumberOfFragmentTexts = Math.max(numberOfFragmentTexts, maxNumberOfFragmentTexts);
    }

    for (let fragmentTextIndex = 0; fragmentTextIndex < (maxNumberOfFragmentTexts + 1); fragmentTextIndex++) {
        const row = [];
        for (const fragmentName of fragmentNames) {
            if (fragmentTexts[fragmentName].length > fragmentTextIndex) {
                const fragmentTextsForFragmentName = fragmentTexts[fragmentName];
                const fragmentText = fragmentTextsForFragmentName[fragmentTextIndex] || '';
                row.push(fragmentText);
            } else {
                row.push('');
            }
        }
        csvRows.push(row);
    }

    return csvRows;
}

export function convertCsvRowsToFragmentTexts(csvRows) {
    const fragmentTexts = {};
    const fragmentNames = csvRows[0];
    for (const fragmentName of fragmentNames) {
        fragmentTexts[fragmentName] = [];
    }

    for (let rowIndex = 1; rowIndex < csvRows.length; rowIndex++) {
        const row = csvRows[rowIndex];
        for (let fragmentIndex = 0; fragmentIndex < fragmentNames.length; fragmentIndex++) {
            const fragmentName = fragmentNames[fragmentIndex];
            const fragmentText = row[fragmentIndex];
            fragmentTexts[fragmentName].push(fragmentText);
        }
    }

    return fragmentTexts;
}


export function exportRowsToCsvFile(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export function importRowsFromCSVFile() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (event) {
                const csvString = event.target.result;
                const csvRows = csvString.split("\n").map((rowString) => {
                    return rowString.split(",");
                });
                resolve(csvRows);
            };
        };
        input.click();
    });
}