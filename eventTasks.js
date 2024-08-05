const statusArrayKey = 'statusArray';
function getStatusArray() {
    const statusArray = localStorage.getItem(statusArrayKey);
    return statusArray ? JSON.parse(statusArray) : {};
}
function saveStatusArray(statusArray) {
    localStorage.setItem(statusArrayKey, JSON.stringify(statusArray));
}

function initializeStatusArray(taskData) {
    const statusArray = getStatusArray();
    const currentEventStatus = JSON.parse(localStorage.getItem('currentEventStatus') || '{}');

    taskData.forEach(item => {
        if (!statusArray[item.eventid]) {
            statusArray[item.eventid] = {};
        }
        if (!statusArray[item.eventid][item.taskname]) {
            const eventStatus = currentEventStatus[item.eventid] || 'Not Started';
            statusArray[item.eventid][item.taskname] = eventStatus === 'Failed' ? 'Failed' : 'Not Completed';
        }
    });

    saveStatusArray(statusArray);
}

document.addEventListener('DOMContentLoaded', function() {
    const selectedEventId = localStorage.getItem('selectedEventId');
    const taskFileContent = localStorage.getItem('taskFile');
    const taskData = taskFileContent ? JSON.parse(taskFileContent) : [];

    if (selectedEventId && taskData.length > 0) {
        initializeStatusArray(taskData);
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
            const options = ['Not Started', 'In Progress', 'Completed', 'Failed'];
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                if (statusArray[eventId] && statusArray[eventId][item['taskname']] === option) opt.selected = true;
                select.appendChild(opt);
            });
            select.addEventListener('change', () => {
                updateTaskStatus(eventId, item['taskname'], select.value);
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


function getEventStatus(eventId) {
    const statusArray = getStatusArray();
    if (!statusArray[eventId]) return { allCompleted: false, inProgress: false };

    const statuses = Object.values(statusArray[eventId]);
    const allCompleted = statuses.every(status => status === 'Completed');
    const inProgress = statuses.some(status => status === 'In Progress');

    return { allCompleted, inProgress };
}

function updateTaskStatus(eventId, taskName, status) {
    const statusArray = getStatusArray();
    const eventFileContent = localStorage.getItem('eventFile');
    if (eventFileContent) {
        const jsonData = JSON.parse(eventFileContent);
        const event = jsonData.find(item => item['eventid'] === eventId);
        const startDate = new Date(event['startdate']);
        const endDate = new Date(event['enddate']);
        const currentDate = new Date();
        let eventStatus;
        if (currentDate >= startDate && currentDate <= endDate) {
            eventStatus = 'In Progress';
        } else if (currentDate > endDate) {
            eventStatus = 'Failed';
        } else if (currentDate < startDate) {
            eventStatus = 'Not Started';
        }

        if (eventStatus === 'Failed') {
            return; 
        }
    }

    if (!statusArray[eventId]) {
        statusArray[eventId] = {};
    }
    statusArray[eventId][taskName] = status;
    saveStatusArray(statusArray);

    const { allCompleted, inProgress } = getEventStatus(eventId);

    if (inProgress) {
        updateEventStatusInDisplay(eventId, 'In Progress');
    } else if (allCompleted) {
        updateEventStatusInDisplay(eventId, 'Completed');
    } else {
        updateEventStatusInDisplay(eventId, 'Not Started');
    }
}


function updateEventStatusInDisplay(eventId, status) {
    const eventFileContent = localStorage.getItem('eventFile');
    if (eventFileContent) {
        const jsonData = JSON.parse(eventFileContent);
        jsonData.forEach(item => {
            if (item['eventid'] === eventId) {
                const rows = document.querySelectorAll(`#event-file-content table tbody tr`);
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells[0].textContent === eventId) {
                        cells[cells.length - 2].textContent = status; 
                    }
                });
            }
        });
    }
}




