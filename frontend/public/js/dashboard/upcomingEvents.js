async function addEvent(){
    const eventsData = {
        Title : document.getElementById('eventTitle').value,
        eventDate : document.getElementById('eventDate').value,
        Time : document.getElementById('eventTime').value,
        Description : document.getElementById('eventDescription').value,
        Location : document.getElementById('eventLocation').value
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/event/create', eventsData);

        if(response.ok){
            alert('Event added Succesfully!');
            toggleModal('#addEventModal', '#modalOverlay');
            loadEvents();
            resetEvents();
        }else{
            const error = await response.json();
            throw new Error(error.message || 'Failed to add event');
        }
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event. Please try again.');
    }
}

function resetEvents(){
    document.getElementById('eventTitle').value = '',
    document.getElementById('eventDate').value = '',
    document.getElementById('eventTime').value = '',
    document.getElementById('eventDescription').value = '',
    document.getElementById('eventLocation').value = ''
}

async function loadEvents() {
    const response = await fetchRequest('http://localhost:3000/api/simba-systems/event/viewAll');

    if (response.ok) {
        const events = await response.json();
        const eventsContainer = document.getElementById('events-container');
        eventsContainer.innerHTML = '';

        events.forEach(event => {
            const eventCard = document.createElement('div');
            const eventTitle = document.createElement('h3');
            const eventDate = document.createElement('p');
            const eventTime = document.createElement('p');
            const eventLocation = document.createElement('p');
            const eventDescription = document.createElement('p');
            const actionsCell = document.createElement('span');

            
            eventCard.classList.add('event-card');
            eventTitle.textContent = event.Title;
            eventDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${new Date(event.Date).toLocaleDateString()}`;
            eventTime.innerHTML = `<i class="fa-regular fa-clock"></i> ${event.Time}`;
            eventLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${event.Location}`;
            eventDescription.classList.add('event-description');
            eventDescription.textContent = event.Description || 'No description available'; // Fallback if no description is available

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.onclick = () => openEditEventModal(event);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteEvent(event.EventID);
            
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            eventCard.appendChild(eventTitle);
            eventCard.appendChild(eventDate);
            eventCard.appendChild(eventTime);
            eventCard.appendChild(eventLocation);
            eventCard.appendChild(eventDescription);
            eventCard.appendChild(actionsCell);

            eventsContainer.appendChild(eventCard);
        });
    } else {
        console.error('Failed to load events');
    }
}

loadEvents();

function openEditEventModal(event){
    document.getElementById('eventID').value = event.EventID,
    document.getElementById('editEventTitle').value = event.Title,
    document.getElementById('editEventDate').value = event.Date,
    document.getElementById('editEventTime').value = event.Time,
    document.getElementById('editEventDescription').value = event.Description,
    document.getElementById('editEventLocation').value = event.Location

    toggleModal('#editEventModal', '#modalOverlay');
}

async function deleteEvent(EventID) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            const response = await fetchRequest('http://localhost:3000/api/simba-systems/event/delete', { EventID });

            if (response.ok) {
                alert('Event Deleted successfully!');
                loadEvents();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete Event');
            }
        } catch (error) {
            console.error('Error deleting event', error);
            alert('Failed to delete Event');
        }
    }
}

async function editEvent() {
    const editEventsData = {
        EventID: document.getElementById('eventID').value,
        Title : document.getElementById('editEventTitle').value,
        Date : document.getElementById('editEventDate').value,
        Time : document.getElementById('editEventTime').value,
        Description : document.getElementById('editEventDescription').value,
        Location : document.getElementById('editEventLocation').value
    }

    try {
        const response = await fetchRequest('http://localhost:3000/api/simba-systems/event/edit', editEventsData);

        if (response.ok) {
            alert('Event updated successfully!');
            toggleModal('#editEventModal', '#modalOverlay');
            loadEvents();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update event');
        }
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
    }
}