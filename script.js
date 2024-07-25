let eventFileContent = '';
let taskFileContent = '';
let eventUploaded = false;
let taskUploaded = false;

const expectedEventHeaders = ['eventid', 'eventname', 'startdate', 'enddate'];
const expectedTaskHeaders = ['eventid', 'taskname'];

function handleEventFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        const rows = csvContent.trim().split('\n');
        const headers = rows[0].split(',').map(header => header.trim());

        if (!validateHeaders(headers, expectedEventHeaders)) {
            alert("Invalid event file headers");
            return;
        }

        const jsonData = csvToJson(csvContent);
        localStorage.setItem('eventFile', JSON.stringify(jsonData));
        eventUploaded = true;
        alert("Event file uploaded successfully");
        updateNextPageButtonVisibility();
    };
    reader.readAsText(file);
}

function handleTaskFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        const rows = csvContent.trim().split('\n');
        const headers = rows[0].split(',').map(header => header.trim());

        if (!validateHeaders(headers, expectedTaskHeaders)) {
            alert("Invalid task file headers");
            return;
        }

        const jsonData = csvToJson(csvContent);
        localStorage.setItem('taskFile', JSON.stringify(jsonData));
        taskUploaded = true;
        alert("Task file uploaded successfully");
        updateNextPageButtonVisibility();
    };
    reader.readAsText(file);
}

function csvToJson(csv) {
    const rows = csv.trim().split('\n');
    const headers = rows[0].split(',').map(header => header.trim());
    return rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        let obj = {};
        headers.forEach((header, i) => {
            obj[header] = values[i];
        });
        return obj;
    });
}

function validateHeaders(headers, expectedHeaders) {
    if (headers.length !== expectedHeaders.length) {
        return false;
    }
    return expectedHeaders.every((header, index) => header === headers[index]);
}

function displayEvent() {
    const fileType = document.getElementById('type-of-file').value;
    const fileInput = document.getElementById('file-input').files[0];

    if (fileType && fileInput) {
        if (fileType === 'event') {
            handleEventFile(fileInput);
        } else if (fileType === 'task') {
            handleTaskFile(fileInput);
        }
    } else {
        alert('Please select a file type and a file.');
    }
}

function updateNextPageButtonVisibility() {
    if (eventUploaded && taskUploaded) {
        document.getElementById('nextPageButton').style.display = 'inline';
    }
}

function goToNextpage() {
    window.location.href = 'display.html';
}
