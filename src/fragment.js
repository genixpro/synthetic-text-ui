
export function generateRandomText(fragmentTexts, fragmentName) {
    if (!fragmentName) {
        fragmentName = "root";
    }

    // We recursively generate and fill all fragments
    const fragmentTextsForFragmentName = fragmentTexts[fragmentName];
    if (!fragmentTextsForFragmentName) {
        return "";
    }

    // Filter for only texts that have something other then whitespace
    const nonEmptyFragmentTexts = fragmentTextsForFragmentName.filter((fragmentText) => (fragmentText ?? "").trim());

    // IF there is nothing left, use an empty string
    if (nonEmptyFragmentTexts.length === 0) {
        return "";
    }

    // Choose a text at random
    const randomTextIndex = Math.floor(Math.random() * nonEmptyFragmentTexts.length);
    let randomText = nonEmptyFragmentTexts[randomTextIndex];

    // Find all the references fragment names within this text. They will be of the form @fragmentName
    const references = getAllReferencedFragmentsInText(randomText);
    for (const referencedFragmentName of references) {
        const referencedFragmentText = generateRandomText(fragmentTexts, referencedFragmentName);
        randomText = randomText.replace("@" + referencedFragmentName, referencedFragmentText);
    }

    return randomText;
}

export function getAllReferencedFragmentsInText(text) {
    const referenceMatches = text.match(/@([a-zA-Z0-9]+)/g) || [];
    let references = [];
    for (const reference of referenceMatches) {
        const referencedFragmentName = reference.substring(1);
        if (referencedFragmentName) {
            references.push(referencedFragmentName);
        }
    }
    return references;
}

export function isFragmentTextValid(text, fragmentTexts) {
    // Get all the references in the text and ensure they refer to valid fragments
    const references = getAllReferencedFragmentsInText(text);
    for (const referencedFragmentName of references) {
        if (!fragmentTexts[referencedFragmentName]) {
            return false;
        }
    }
    return true;
}