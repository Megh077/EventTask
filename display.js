

document.addEventListener('DOMContentLoaded', function() {
    const eventFileContent = localStorage.getItem('eventFile');
    const statusArray = JSON.parse(localStorage.getItem('statusArray') || '{}');
    
    if (eventFileContent) {
        const jsonData = JSON.parse(eventFileContent);
        const eventTable = createTableFromJSON(jsonData, true, statusArray); 
        document.getElementById('event-file-content').appendChild(eventTable);
    }
});


function createTableFromJSON(jsonData, isEventTable = false, statusArray = {}) {
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
        
        // Append 'Status' and 'Action' columns only if it's an event table
        if (isEventTable) {
            // Check if 'Status' column already exists
            if (!headers.includes('Status')) {
                const statusTh = document.createElement('th');
                statusTh.textContent = 'Status';
                headerRow.appendChild(statusTh);

                const actionTh = document.createElement('th');
                actionTh.textContent = 'Action';
                headerRow.appendChild(actionTh);
            }
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
                    status = 'Not Completed';
                }

                // Update status based on task statuses
                const eventId = item['eventid'];
                const taskStatuses = statusArray[eventId];
                if (taskStatuses) {
                    const allCompleted = Object.values(taskStatuses).every(status => status === 'Completed');
                    if (allCompleted) {
                        status = 'Completed';
                    }
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


