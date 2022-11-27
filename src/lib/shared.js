let exports = {};

exports.capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.log = (title, entity) => {
    console.log(`${title}: ${JSON.stringify(entity)}`);
}

export default exports