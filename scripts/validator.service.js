function validateBoardPayload(id, title, color, method) {
    if (method !== 'POST' && !uuidRegex.test(id)) {
        alert(`This POST operation requires a valid id! Cannot update '${title}!'`);
        return false;
    }

    if (!title || title.length < 3) {
        alert(`Title must have 3 or more characters!`);
        return false;
    }

    if (!hexColorRegex.test(color)) {
        alert(`The color '${color}' is not a valid HEX color!`);
        return false;
    }

    return true;
}