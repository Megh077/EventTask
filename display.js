document.addEventListener('DOMContentLoaded', function() {
    const eventFileContent = localStorage.getItem('eventFile');
    if (eventFileContent) {
        const jsonData = JSON.parse(eventFileContent);
        const eventTable = createTableFromJSON(jsonData, true); 
        document.getElementById('event-file-content').appendChild(eventTable);
    }
});

function createTableFromJSON(jsonData, isEventTable = false) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    const currentDate = new Date();
    
    if (jsonData.length > 0) {
        const headers = Object.keys(jsonData[0]);
        const headerRow = document.createElement('tr');
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        if (isEventTable) {
            const statusTh = document.createElement('th');
            statusTh.textContent = 'Status';
            headerRow.appendChild(statusTh);

            const actionTh = document.createElement('th');
            actionTh.textContent = 'Action';
            headerRow.appendChild(actionTh);
        }
        
        thead.appendChild(headerRow);

        jsonData.forEach(item => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header] || '';
                tr.appendChild(td);
            });

            if (isEventTable) {
                const statusTd = document.createElement('td');
                const startDate = new Date(item['startdate']);
                const endDate = new Date(item['enddate']);
                
                let status;
                if (currentDate >= startDate && currentDate <= endDate) {
                    status = 'In Progress';
                } else if (currentDate > endDate) {
                    status = 'Failed';
                } else if (currentDate < startDate) {
                    status = 'Not Started';
                }

                const { allCompleted, inProgress } = getEventStatus(item['eventid']);
                if (inProgress) {
                    status = 'In Progress';
                } else if (allCompleted) {
                    status = 'Completed';
                }

                statusTd.textContent = status;
                tr.appendChild(statusTd);

                const actionTd = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = 'Action';
                button.addEventListener('click', () => {
                    handleActionButtonClick(item['eventid']);
                });
                actionTd.appendChild(button);
                tr.appendChild(actionTd);
            }

            tbody.appendChild(tr);
        });
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

function handleActionButtonClick(eventId) {
    localStorage.setItem('selectedEventId', eventId);
    window.location.href = 'eventTasks.html';
}

function getEventStatus(eventId) {
    const statusArray = getStatusArray();
    if (!statusArray[eventId]) return { allCompleted: false, inProgress: false };

    const statuses = Object.values(statusArray[eventId]);
    const allCompleted = statuses.every(status => status === 'Completed');
    const inProgress = statuses.some(status => status === 'In Progress');

    return { allCompleted, inProgress };
}

function getStatusArray() {
    const statusArray = localStorage.getItem('statusArray');
    return statusArray ? JSON.parse(statusArray) : {};
}
