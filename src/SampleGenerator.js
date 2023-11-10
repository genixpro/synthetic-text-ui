import {useCallback, useEffect, useMemo, useState} from "react";
import "./SampleGenerator.scss";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {CardHeader} from "@mui/material";
import {estimateUniqueFragments, generateRandomText} from "./fragment";

function GeneratedSamplesList({columnIndex, samples}) {
    return <ul className={"generated-samples-list"} key={columnIndex}>
        {samples.map((generatedFragment, index) => {
            return <li className={`generated-sample ${index === 0 && columnIndex === 0 ? 'new' : ''}`}
                       key={`${generatedFragment.id}`}>{generatedFragment.text}</li>
        })}
    </ul>;
}

export default function SampleGenerator(props) {
    const fragmentTexts = props.fragmentTexts;
    let maxNumberOfFragmentTexts = 15;
    const [generatedFragments, setGeneratedFragments] = useState([]);
    const [intervalId, setIntervalId] = useState(null);

    const addNewFragment = useCallback(() => {
        const newGeneratedFragments = [...generatedFragments];
        const newGeneratedFragmentText = generateRandomText(fragmentTexts);
        newGeneratedFragments.unshift({
            text: newGeneratedFragmentText,
            id: Math.random(),
        });
        if (newGeneratedFragments.length > maxNumberOfFragmentTexts) {
            newGeneratedFragments.pop();
        }
        setGeneratedFragments(newGeneratedFragments);
    }, [generatedFragments, fragmentTexts]);

    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }

        // Set up the interval
        const newIntervalId = setInterval(() => {
            addNewFragment();
        }, 1500); // Interval set for a half of a second

        setIntervalId(newIntervalId);

        // Clear the interval on unmount
        return () => clearInterval(newIntervalId);
    }, [addNewFragment]); // Empty dependency array ensures this runs once on mount

    const nonEmptyFragments = generatedFragments.filter((generatedFragment) => (generatedFragment.text ?? "").trim());

    const numColumns = 3;
    const entriesPerColumn = Math.max(5, Math.ceil(nonEmptyFragments.length / numColumns));
    const columns = [];
    for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
        columns.push(nonEmptyFragments.slice(columnIndex * entriesPerColumn, (columnIndex + 1) * entriesPerColumn));
    }

    const estimatedCount = useMemo(() => estimateUniqueFragments(fragmentTexts), [fragmentTexts]);

    return <div className={"sample-generator"}>
        <Card>
            <CardHeader title={"Generated Samples"} />
            <CardContent>
                <div className={"estimated-total-samples"}>
                    Estimated Total Samples: {estimatedCount.toLocaleString()}
                </div>
                <div className={"generated-samples-area"}>
                    {
                        columns.map((samples, columnIndex) =>
                            <GeneratedSamplesList key={columnIndex} samples={samples} columnIndex={columnIndex} />
                        )
                    }
                </div>
            </CardContent>
        </Card>
    </div>
}