document.addEventListener('DOMContentLoaded', function() {
    const eventFileContent = localStorage.getItem('eventFile');
    const taskFileContent = localStorage.getItem('taskFile');

    if (eventFileContent) {
        const eventTable = createTableFromCSV(eventFileContent);
        document.getElementById('event-file-content').appendChild(eventTable);
    }

    if (taskFileContent) {
        const taskTable = createTableFromCSV(taskFileContent);
        document.getElementById('task-file-content').appendChild(taskTable);
    }
});

function createTableFromCSV(csvContent) {
    const rows = csvContent.split('\n');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    const expectedEventHeaders = ['eventid', 'eventname', 'startdate', 'enddate'];
    const expectedTaskHeaders = ['eventid', 'taskname'];

    rows.forEach((row, rowIndex) => {
        if (row.trim() !== "") {
            const tr = document.createElement('tr');
            const columns = row.split(',');
            columns.forEach(column => {
                const cell = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
                cell.textContent = column.trim();
                tr.appendChild(cell);
            });

            if (rowIndex === 0) {
                thead.appendChild(tr);
            } else {
                tbody.appendChild(tr);
            }
        }
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}
