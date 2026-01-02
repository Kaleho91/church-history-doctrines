
const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('Global_Church_History_Doctrine_Traceability_Atlas_v4.xlsx');
const sheetNames = workbook.SheetNames;

console.log('Sheet Names:', sheetNames);

sheetNames.forEach(name => {
    console.log(`\n--- Sheet: ${name} ---`);
    const sheet = workbook.Sheets[name];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays

    if (json.length > 0) {
        console.log('Headers:', json[0]);
        console.log('First 2 rows of data:');
        console.log(json.slice(1, 3));
    } else {
        console.log('Empty sheet');
    }
});
