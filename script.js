function displayEvent() {
    const fileType = document.getElementById('type-of-file').value;
    const fileInput = document.getElementById('file-input').files[0];

    if (fileType && fileInput) {
        const reader = new FileReader();

        reader.onload = function(e) {
            if (fileType === 'event') {
                localStorage.setItem('eventFile', e.target.result);
            } else if (fileType === 'task') {
                localStorage.setItem('taskFile', e.target.result);
            }
            window.location.href = 'display.html';
        };

        reader.readAsText(fileInput);
    } else {
        alert('Please select a file type and a file.');
    }
}


function displayEvent() {
    const fileType = document.getElementById('type-of-file').value;
    const fileInput = document.getElementById('file-input').files[0];

    if (fileType && fileInput) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const csvContent = e.target.result;
            const rows = csvContent.split('\n');
            const headers = rows[0].split(',').map(header => header.trim());

            const expectedEventHeaders = ['eventid', 'eventname', 'startdate', 'enddate'];
            const expectedTaskHeaders = ['eventid', 'taskname'];

            let isValid = false;

            if (fileType === 'event') {
                isValid = headers.length === expectedEventHeaders.length &&
                          headers.every((header, index) => header === expectedEventHeaders[index]);
            } else if (fileType === 'task') {
                isValid = headers.length === expectedTaskHeaders.length &&
                          headers.every((header, index) => header === expectedTaskHeaders[index]);
            }

            if (!isValid) {
                alert('Invalid file headers. Please ensure you are uploading the correct file type.');
                return;
            }

            if (fileType === 'event') {
                localStorage.setItem('eventFile', csvContent);
            } else if (fileType === 'task') {
                localStorage.setItem('taskFile', csvContent);
            }

            window.location.href = 'display.html';
        };

        reader.readAsText(fileInput);
    } else {
        alert('Please select a file type and a file.');
    }
}


