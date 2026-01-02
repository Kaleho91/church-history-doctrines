
const XLSX = require('xlsx');

const workbook = XLSX.readFile('Global_Church_History_Doctrine_Traceability_Atlas_v4.xlsx');

['Sources'].forEach(name => {
    console.log(`\n--- ${name} ---`);
    const sheet = workbook.Sheets[name];
    if (sheet) {
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log('Headers:', json[0]);
        if (json.length > 1) console.log('Row 1:', json[1]);
    } else {
        console.log('Sheet not found');
    }
});
