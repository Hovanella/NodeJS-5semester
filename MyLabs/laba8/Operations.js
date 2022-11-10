const xmlbuilder = require("xmlbuilder");

function sum(x, y) {
    return x + y;
}

function difference(x, y) {
    return x - y;
}

function multiplication(x, y) {
    return x * y;
}

function division(x, y) {
    return (x / y).toFixed(2);
}

function getMathOperationsResult(x, y) {
    let result = '';

    result += `Sum: ${sum(x, y)}<br>`;
    result += `Difference: ${difference(x, y)}<br>`;
    result += `Multiplication: ${multiplication(x, y)}<br>`;
    result += `Division: ${division(x, y)}<br>`;

    return result;
}

function generateResultXml(objRequestXml) {
    const responseXml = xmlbuilder.create('response');
    responseXml.att('request', objRequestXml.request.$.id);

    let sum = 0;
    let concat= 0;


    if (objRequestXml.request.x !== undefined)
        objRequestXml.request.x.forEach(x => sum += +x.$.value);
    if (objRequestXml.request.m !== undefined)
    objRequestXml.request.m.forEach(m => concat += m.$.value);

    responseXml.element('sum', {element: 'x', result: sum});
    responseXml.element('concat', {element: 'm', result: concat});


    return responseXml.toString();
}

module.exports = {
    sum,
    difference,
    product: multiplication,
    quotient: division,
    generateResult: getMathOperationsResult,
    generateResultXml
}