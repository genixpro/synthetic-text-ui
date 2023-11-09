import * as React from 'react';
import SampleGenerator from "./SampleGenerator";
import FragmentsTable from "./FragmentsTable";


export default function Page() {
    const [fragmentTexts, setFragmentTexts] = React.useState({});

    const onFragmentsChanged = function(fragmentTextsByFragmentName) {
        setFragmentTexts(fragmentTextsByFragmentName);
    }


    return <>
        <FragmentsTable
            onFragmentsChanged={onFragmentsChanged}
        />
        <br/>
        <SampleGenerator fragmentTexts={fragmentTexts} />
    </>
}