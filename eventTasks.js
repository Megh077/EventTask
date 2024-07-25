const statusArrayKey = 'statusArray';

function getStatusArray() {
    const statusArray = localStorage.getItem(statusArrayKey);
    return statusArray ? JSON.parse(statusArray) : {};
}

function saveStatusArray(statusArray) {
    localStorage.setItem(statusArrayKey, JSON.stringify(statusArray));
}

document.addEventListener('DOMContentLoaded', function() {
    const selectedEventId = localStorage.getItem('selectedEventId');
    const taskFileContent = localStorage.getItem('taskFile');
    const taskData = taskFileContent ? JSON.parse(taskFileContent) : [];

    if (selectedEventId && taskData.length > 0) {
        const statusArray = getStatusArray();
        const taskTable = createTaskTableFromJSON(taskData, selectedEventId, statusArray);
        document.getElementById('event-tasks-content').appendChild(taskTable);
    }
});

function createTaskTableFromJSON(data, eventId, statusArray) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    if (data.length === 0) return table;

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    const statusTh = document.createElement('th');
    statusTh.textContent = 'Status';
    headerRow.appendChild(statusTh);

    thead.appendChild(headerRow);

    data.forEach(item => {
        if (item['eventid'] === eventId) {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header];
                tr.appendChild(td);
            });

            const statusTd = document.createElement('td');
            const select = document.createElement('select');
            const options = ['Not Completed', 'In Progress', 'Completed'];
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                if (statusArray[eventId] && statusArray[eventId][item['taskname']] === option) opt.selected = true;
                select.appendChild(opt);
            });
            select.addEventListener('change', () => {
                updateTaskStatus(eventId, item['taskname'], select.value);
                updateEventStatus(eventId);
            });
            statusTd.appendChild(select);
            tr.appendChild(statusTd);

            tbody.appendChild(tr);
        }
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

function updateTaskStatus(eventId, taskName, status) {
    const statusArray = getStatusArray();
    if (!statusArray[eventId]) {
        statusArray[eventId] = {};
    }
    statusArray[eventId][taskName] = status;
    saveStatusArray(statusArray);
}

function updateEventStatus(eventId) {
    const statusArray = getStatusArray();
    const tasks = statusArray[eventId];
    if (tasks) {
        const allCompleted = Object.values(tasks).every(status => status === 'Completed');
        if (allCompleted) {
            // Update the status of the event in the event file
            const eventFileContent = localStorage.getItem('eventFile');
            if (eventFileContent) {
                const jsonData = JSON.parse(eventFileContent);
                const event = jsonData.find(event => event['eventid'] === eventId);
                if (event) {
                    event['status'] = 'Completed';
                    localStorage.setItem('eventFile', JSON.stringify(jsonData));
                }
            }
        }
    }
}
