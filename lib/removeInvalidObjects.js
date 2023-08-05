export { removeInvalidObjects }
function removeInvalidObjects(objects, requiredNames) {
    const result = [];

    for (const obj of objects) {
        const isValid = requiredNames.every(x=>Object.keys(obj).includes(x))

        if (!isValid) {
            continue;
        }

        const isSubset = objects.some(existingObj =>
            obj != existingObj && Object.keys(obj).every(key => existingObj[key] === obj[key])
        );

        if (isSubset) {
            continue;
        }

        result.push(obj)

    }

    return result;
}