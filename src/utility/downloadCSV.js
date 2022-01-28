import { saveAs } from 'file-saver';

export const handleDownload = function(items, type) {    
    let file = null
    let fileName = null
    let data = null

    if (type == 'singleEvent') {
        data = singleDiagnosticToCSV(items)
        fileName = "entries.csv"
    } else {
        console.log('CSV Downloader: A type was not provided. Refer to this function\'s declaration for details.')
    }

    file = new File([data], fileName, {type: "text/csv"});

    if (file) {
        saveAs(file);
    }
}

function singleDiagnosticToCSV(items) {
    // Build date string
    const date = (new Date(items.date.start).getMonth() + 1).toString() + '/' + (new Date(items.date.start).getDate()).toString() + '/' + (new Date(items.date.start).getFullYear()).toString() + ' from ' + 
        new Date(items.date.start).toLocaleString(undefined, {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
        }) + ' to ' + 
        new Date(items.date.end).toLocaleString(undefined, {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
        })

    // Setup up first two rows of csv
    let csv = [
        ['Name', 'Description', 'Date'],
        [items.name, items.description, date],
        [],
        ['Entries'],
        ['Name', 'ID']
    ]

    let entryList = items.entries
    for (let i = 0; i < entryList.length; i++) {
        csv.push([
            entryList[i].entryName || 'N/A', 
            entryList[i].entryId || 'N/A'
        ])
    }

    let csvString = ''

    // Convert 2D array to csv
    for (let i = 0; i < csv.length; i++) {
        for (let j = 0; j < csv[i].length; j++) {
            csvString = csvString + csv[i][j] + ','
        }
        csvString = csvString + '\r\n'
    }

    return csvString;
}