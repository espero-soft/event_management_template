class EventManager {
    constructor() {
        this.events = this.loadEvents();
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderEvents();
        this.updateStats();
    }

    bindEvents() {
        // Modal events
        document.getElementById('addEventBtn').addEventListener('click', () => this.openModal());
        document.getElementById('eventForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());

        // Close modal events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Search and filter events
        document.getElementById('searchInput').addEventListener('input', () => this.filterEvents());
        document.getElementById('filterSelect').addEventListener('change', () => this.filterEvents());
    }

    openModal(eventId = null) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('eventForm');
        
        if (eventId) {
            // Edit mode
            this.currentEditId = eventId;
            const event = this.events.find(e => e.id === eventId);
            modalTitle.textContent = 'Modifier l\'événement';
            this.populateForm(event);
        } else {
            // Add mode
            this.currentEditId = null;
            modalTitle.textContent = 'Nouvel événement';
            form.reset();
            // Set default date to today
            document.getElementById('eventDate').value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('eventModal').style.display = 'none';
        this.currentEditId = null;
    }

    openDeleteModal(eventId) {
        const event = this.events.find(e => e.id === eventId);
        this.currentDeleteId = eventId;
        document.getElementById('deleteEventTitle').textContent = event.title;
        document.getElementById('deleteModal').style.display = 'block';
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        this.currentDeleteId = null;
    }

    populateForm(event) {
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location || '';
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDescription').value = event.description || '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('eventTitle').value.trim(),
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value.trim(),
            category: document.getElementById('eventCategory').value,
            description: document.getElementById('eventDescription').value.trim()
        };

        if (!formData.title || !formData.date || !formData.time) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (this.currentEditId) {
            this.updateEvent(this.currentEditId, formData);
        } else {
            this.addEvent(formData);
        }

        this.closeModal();
    }

    addEvent(eventData) {
        const event = {
            id: Date.now().toString(),
            ...eventData,
            createdAt: new Date().toISOString()
        };

        this.events.push(event);
        this.saveEvents();
        this.renderEvents();
        this.updateStats();
        this.showNotification('Événement ajouté avec succès!', 'success');
    }

    updateEvent(id, eventData) {
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
            this.events[index] = { ...this.events[index], ...eventData };
            this.saveEvents();
            this.renderEvents();
            this.updateStats();
            this.showNotification('Événement modifié avec succès!', 'success');
        }
    }

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveEvents();
        this.renderEvents();
        this.updateStats();
        this.showNotification('Événement supprimé avec succès!', 'success');
    }

    confirmDelete() {
        if (this.currentDeleteId) {
            this.deleteEvent(this.currentDeleteId);
            this.closeDeleteModal();
        }
    }

    renderEvents(eventsToRender = this.events) {
        console.log({ eventsToRender });
        const container = document.getElementById('eventsContainer');
        const noEventsDiv = document.getElementById('noEvents');

        if (eventsToRender.length === 0) {
            container.innerHTML = '';
            noEventsDiv.style.display = 'block';
            return;
        }

        noEventsDiv.style.display = 'none';
        
        // Sort events by date and time
        const sortedEvents = [...eventsToRender].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        container.innerHTML = sortedEvents.map(event => this.createEventCard(event)).join('');
    }

    createEventCard(event) {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const now = new Date();
        const today = new Date().toDateString();
        const eventDate = eventDateTime.toDateString();
        
        let status = 'upcoming';
        let statusText = 'À venir';
        
        if (eventDate === today) {
            status = 'today';
            statusText = 'Aujourd\'hui';
        } else if (eventDateTime < now) {
            status = 'past';
            statusText = 'Passé';
        }

        const categoryLabels = {
            meeting: 'Réunion',
            conference: 'Conférence',
            workshop: 'Atelier',
            social: 'Social',
            other: 'Autre'
        };

        return `
            <div class="event-card">
                <div class="event-status status-${status}">${statusText}</div>
                <div class="event-header">
                    <div>
                        <h3 class="event-title">${this.escapeHtml(event.title)}</h3>
                        <span class="event-category">${categoryLabels[event.category]}</span>
                    </div>
                </div>
                <div class="event-details">
                    <div class="event-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(event.date)}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-clock"></i>
                        <span>${this.formatTime(event.time)}</span>
                    </div>
                    ${event.location ? `
                        <div class="event-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${this.escapeHtml(event.location)}</span>
                        </div>
                    ` : ''}
                </div>
                ${event.description ? `
                    <div class="event-description">
                        ${this.escapeHtml(event.description)}
                    </div>
                ` : ''}
                <div class="event-actions">
                    <button class="btn btn-edit" onclick="eventManager.openModal('${event.id}')">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-delete" onclick="eventManager.openDeleteModal('${event.id}')">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    }

    filterEvents() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filterValue = document.getElementById('filterSelect').value;
        
        let filteredEvents = this.events;

        // Apply search filter
        if (searchTerm) {
            filteredEvents = filteredEvents.filter(event => 
                event.title.toLowerCase().includes(searchTerm) ||
                (event.description && event.description.toLowerCase().includes(searchTerm)) ||
                (event.location && event.location.toLowerCase().includes(searchTerm))
            );
        }

        // Apply date filter
        if (filterValue !== 'all') {
            const now = new Date();
            const today = new Date().toDateString();

            filteredEvents = filteredEvents.filter(event => {
                const eventDateTime = new Date(`${event.date}T${event.time}`);
                const eventDate = eventDateTime.toDateString();

                switch (filterValue) {
                    case 'upcoming':
                        return eventDateTime > now;
                    case 'past':
                        return eventDateTime < now;
                    case 'today':
                        return eventDate === today;
                    default:
                        return true;
                }
            });
        }

        this.renderEvents(filteredEvents);
    }

    updateStats() {
        const now = new Date();
        const today = new Date().toDateString();

        const totalEvents = this.events.length;
        const upcomingEvents = this.events.filter(event => {
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            return eventDateTime > now;
        }).length;
        const todayEvents = this.events.filter(event => {
            const eventDate = new Date(`${event.date}T${event.time}`).toDateString();
            return eventDate === today;
        }).length;

        document.getElementById('totalEvents').textContent = totalEvents;
        document.getElementById('upcomingEvents').textContent = upcomingEvents;
        document.getElementById('todayEvents').textContent = todayEvents;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
    }

    loadEvents() {
        const saved = localStorage.getItem('events');
        return saved ? JSON.parse(saved) : [];
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the event manager
const eventManager = new EventManager();

// Add some sample events for demonstration (only if no events exist)
if (eventManager.events.length === 0) {
    const sampleEvents = [
        {
            id: '1',
            title: 'Réunion équipe marketing',
            date: new Date().toISOString().split('T')[0],
            time: '14:30',
            location: 'Salle de conférence A',
            category: 'meeting',
            description: 'Réunion hebdomadaire pour faire le point sur les campagnes en cours.',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Conférence Tech 2024',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '09:00',
            location: 'Centre de congrès',
            category: 'conference',
            description: 'Grande conférence annuelle sur les nouvelles technologies.',
            createdAt: new Date().toISOString()
        }
        ,
        {
            id: '3',
            title: 'Atelier de développement web',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:00',
            location: 'Salle informatique',
            category: 'workshop',
            description: 'Atelier pratique sur les bases du développement web moderne.',
            createdAt: new Date().toISOString()
        },
        {
            id: '4',
            title: 'Soirée jeux de société',
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '18:00',
            location: 'Cafétéria',
            category: 'social',
            description: 'Venez partager un moment convivial autour de jeux de société.',
            createdAt: new Date().toISOString()
        },
        {
            id: '5',
            title: 'Réunion de planification',
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '16:00',
            location: 'Salle de réunion B',
            category: 'meeting',
            description: 'Planification des activités du mois prochain.',
            createdAt: new Date().toISOString()
        },
        {
            id: '6',
            title: 'Atelier d\'écriture créative',
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '15:00',
            location: 'Bibliothèque',
            category: 'workshop',
            description: 'Développez votre créativité à travers des exercices d\'écriture.',
            createdAt: new Date().toISOString()
        },
        {
            id: '7',
            title: 'Sortie culturelle',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '13:30',
            location: 'Musée d\'art moderne',
            category: 'other',
            description: 'Visite guidée du musée et découverte des expositions temporaires.',
            createdAt: new Date().toISOString()
        }
    ];
    
    eventManager.events = sampleEvents;
    eventManager.saveEvents();
    eventManager.renderEvents();
    eventManager.updateStats();
}