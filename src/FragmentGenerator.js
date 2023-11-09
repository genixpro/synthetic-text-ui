import {useCallback, useEffect, useState} from "react";
import "./FragmentGenerator.scss";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {CardHeader} from "@mui/material";

function generateRandomText(fragmentTextsByFragmentName, fragmentName) {
    if (!fragmentName) {
        fragmentName = "root";
    }

    // We recursively generate and fill all fragments
    const fragmentTexts = fragmentTextsByFragmentName[fragmentName];

    if (!fragmentTexts) {
        return "";
    }

    // Filter for only texts that have something other then whitespace
    const nonEmptyFragmentTexts = fragmentTexts.filter((fragmentText) => fragmentText.trim());

    // IF there is nothing left, use an empty string
    if (nonEmptyFragmentTexts.length === 0) {
        return "";
    }

    // Choose a text at random
    const randomTextIndex = Math.floor(Math.random() * nonEmptyFragmentTexts.length);
    let randomText = nonEmptyFragmentTexts[randomTextIndex];

    // Find all the references fragment names within this text. They will be of the form @fragmentName
    const references = randomText.match(/@([a-zA-Z0-9]+)/g) || [];
    for (const reference of references) {
        const referencedFragmentName = reference.substring(1);
        const referencedFragmentText = generateRandomText(fragmentTextsByFragmentName, referencedFragmentName);
        randomText = randomText.replace(reference, referencedFragmentText);
    }

    return randomText;
}



export const FragmentGenerator = function FragmentGenerator(props) {
    const fragmentTextsByFragmentName = props.fragmentTextsByFragmentName;
    let maxNumberOfFragmentTexts = 10;
    const [generatedFragments, setGeneratedFragments] = useState([]);
    const [intervalId, setIntervalId] = useState(null);

    const addNewFragment = useCallback(() => {
        const newGeneratedFragments = [...generatedFragments];
        const newGeneratedFragmentText = generateRandomText(fragmentTextsByFragmentName);
        newGeneratedFragments.unshift({
            text: newGeneratedFragmentText,
            id: Math.random(),
        });
        if (newGeneratedFragments.length > maxNumberOfFragmentTexts) {
            newGeneratedFragments.pop();
        }
        setGeneratedFragments(newGeneratedFragments);
    }, [generatedFragments, fragmentTextsByFragmentName]);

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


    return <div className={"fragment-generator"}>
        <Card>
            <CardHeader title={"Generated Fragments"} />
            <CardContent>
                <ul className={"generated-fragments-list"}>
                    {generatedFragments.map((generatedFragment, index) => {
                        return <li className={"generated-fragment"} key={`${generatedFragment.id}`}>{generatedFragment.text}</li>
                    })}
                </ul>
            </CardContent>
        </Card>
    </div>
}