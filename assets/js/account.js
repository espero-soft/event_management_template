class AccountManager {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.userPreferences = this.loadUserPreferences();
        this.events = this.loadEvents();
        this.activityLog = this.loadActivityLog();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProfileData();
        this.loadPreferencesData();
        this.updateStats();
        this.renderActivityLog();
    }

    bindEvents() {
        // Navigation entre onglets
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Gestion du profil
        document.getElementById('changeAvatarBtn').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });

        document.getElementById('avatarInput').addEventListener('change', (e) => {
            this.handleAvatarChange(e);
        });

        // Sauvegarde
        document.getElementById('saveAccountBtn').addEventListener('click', () => this.saveAllData());

        // Gestion des données
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportData('json'));
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportData('csv'));
        document.getElementById('exportProfileBtn').addEventListener('click', () => this.exportProfile());
        
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        document.getElementById('processImportBtn').addEventListener('click', () => this.processImport());

        // Actions dangereuses
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearAllData());
        document.getElementById('resetAppBtn').addEventListener('click', () => this.resetApplication());

        // Synchronisation
        document.getElementById('syncBtn').addEventListener('click', () => this.syncData());
        document.getElementById('backupBtn').addEventListener('click', () => this.createBackup());

        // Sauvegarde automatique des changements
        this.bindAutoSave();
    }

    bindAutoSave() {
        const formElements = document.querySelectorAll('#profileForm input, #profileForm select, #profileForm textarea');
        formElements.forEach(element => {
            element.addEventListener('change', () => {
                if (document.getElementById('autoSave').checked) {
                    this.saveProfileData();
                }
            });
        });

        const preferenceElements = document.querySelectorAll('#preferences-tab input, #preferences-tab select');
        preferenceElements.forEach(element => {
            element.addEventListener('change', () => {
                if (document.getElementById('autoSave').checked) {
                    this.savePreferencesData();
                }
            });
        });
    }

    switchTab(tabName) {
        // Masquer tous les onglets
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Masquer tous les boutons actifs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });

        // Afficher l'onglet sélectionné
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Ajouter à l'historique
        this.addToActivityLog(`Consultation de l'onglet ${this.getTabDisplayName(tabName)}`, 'navigation');
    }

    getTabDisplayName(tabName) {
        const names = {
            'profile': 'Profil',
            'preferences': 'Préférences',
            'data': 'Données',
            'activity': 'Activité'
        };
        return names[tabName] || tabName;
    }

    loadProfileData() {
        if (this.userProfile) {
            document.getElementById('firstName').value = this.userProfile.firstName || '';
            document.getElementById('lastName').value = this.userProfile.lastName || '';
            document.getElementById('userEmail').value = this.userProfile.email || '';
            document.getElementById('phone').value = this.userProfile.phone || '';
            document.getElementById('userOrganization').value = this.userProfile.organization || '';
            document.getElementById('userRole').value = this.userProfile.role || 'user';
            document.getElementById('bio').value = this.userProfile.bio || '';

            if (this.userProfile.avatar) {
                const avatarElement = document.getElementById('profileAvatar');
                avatarElement.innerHTML = `<img src="${this.userProfile.avatar}" alt="Avatar">`;
            }
        }
    }

    loadPreferencesData() {
        if (this.userPreferences) {
            document.getElementById('defaultView').value = this.userPreferences.defaultView || 'all';
            document.getElementById('eventsPerPage').value = this.userPreferences.eventsPerPage || '20';
            document.getElementById('dateFormat').value = this.userPreferences.dateFormat || 'fr-FR';
            document.getElementById('timeFormat').value = this.userPreferences.timeFormat || '24h';
            document.getElementById('theme').value = this.userPreferences.theme || 'default';
            
            document.getElementById('enableNotifications').checked = this.userPreferences.enableNotifications || false;
            document.getElementById('autoSave').checked = this.userPreferences.autoSave || false;
            document.getElementById('emailReminders').checked = this.userPreferences.emailReminders || false;
        }
    }

    handleAvatarChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatarElement = document.getElementById('profileAvatar');
                avatarElement.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
                this.userProfile.avatar = e.target.result;
                this.addToActivityLog('Photo de profil mise à jour', 'profile');
            };
            reader.readAsDataURL(file);
        }
    }

    saveAllData() {
        this.saveProfileData();
        this.savePreferencesData();
        this.showNotification('Toutes les modifications ont été sauvegardées avec succès!', 'success');
        this.addToActivityLog('Sauvegarde complète des paramètres', 'save');
    }

    saveProfileData() {
        this.userProfile = {
            ...this.userProfile,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('phone').value,
            organization: document.getElementById('userOrganization').value,
            role: document.getElementById('userRole').value,
            bio: document.getElementById('bio').value,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    savePreferencesData() {
        this.userPreferences = {
            defaultView: document.getElementById('defaultView').value,
            eventsPerPage: document.getElementById('eventsPerPage').value,
            dateFormat: document.getElementById('dateFormat').value,
            timeFormat: document.getElementById('timeFormat').value,
            theme: document.getElementById('theme').value,
            enableNotifications: document.getElementById('enableNotifications').checked,
            autoSave: document.getElementById('autoSave').checked,
            emailReminders: document.getElementById('emailReminders').checked,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
    }

    updateStats() {
        const now = new Date();
        const today = new Date().toDateString();

        const totalEvents = this.events.length;
        const upcomingEvents = this.events.filter(event => {
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            return eventDateTime > now;
        }).length;

        // Calculer le nombre de jours depuis la première utilisation
        const firstUse = this.userProfile?.firstUse ? new Date(this.userProfile.firstUse) : new Date();
        const daysSinceFirstUse = Math.floor((now - firstUse) / (1000 * 60 * 60 * 24));

        document.getElementById('userTotalEvents').textContent = totalEvents;
        document.getElementById('userUpcomingEvents').textContent = upcomingEvents;
        document.getElementById('memberSince').textContent = daysSinceFirstUse;
    }

    exportData(format) {
        const data = {
            events: this.events,
            profile: this.userProfile,
            preferences: this.userPreferences,
            exportDate: new Date().toISOString()
        };

        if (format === 'json') {
            this.downloadFile(
                JSON.stringify(data, null, 2),
                `events-backup-${new Date().toISOString().split('T')[0]}.json`,
                'application/json'
            );
        } else if (format === 'csv') {
            const csv = this.convertToCSV(this.events);
            this.downloadFile(
                csv,
                `events-${new Date().toISOString().split('T')[0]}.csv`,
                'text/csv'
            );
        }

        this.addToActivityLog(`Export des données au format ${format.toUpperCase()}`, 'export');
        this.showNotification(`Données exportées au format ${format.toUpperCase()}`, 'success');
    }

    exportProfile() {
        const profileData = {
            profile: this.userProfile,
            preferences: this.userPreferences,
            stats: {
                totalEvents: this.events.length,
                joinDate: this.userProfile?.firstUse || new Date().toISOString()
            },
            exportDate: new Date().toISOString()
        };

        this.downloadFile(
            JSON.stringify(profileData, null, 2),
            `profile-backup-${new Date().toISOString().split('T')[0]}.json`,
            'application/json'
        );

        this.addToActivityLog('Export du profil utilisateur', 'export');
        this.showNotification('Profil exporté avec succès', 'success');
    }

    convertToCSV(events) {
        const headers = ['Titre', 'Date', 'Heure', 'Lieu', 'Catégorie', 'Description'];
        const rows = events.map(event => [
            event.title,
            event.date,
            event.time,
            event.location || '',
            event.category,
            event.description || ''
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('processImportBtn').style.display = 'inline-flex';
        }
    }

    processImport() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.events && Array.isArray(data.events)) {
                    // Demander confirmation
                    if (confirm('Voulez-vous remplacer tous vos événements actuels ou les fusionner ?')) {
                        // Remplacer
                        localStorage.setItem('events', JSON.stringify(data.events));
                    } else {
                        // Fusionner
                        const existingEvents = this.loadEvents();
                        const mergedEvents = [...existingEvents, ...data.events];
                        localStorage.setItem('events', JSON.stringify(mergedEvents));
                    }
                    
                    this.showNotification('Données importées avec succès!', 'success');
                    this.addToActivityLog('Import de données depuis un fichier', 'import');
                    
                    // Rafraîchir les statistiques
                    this.events = this.loadEvents();
                    this.updateStats();
                } else {
                    throw new Error('Format de fichier invalide');
                }
            } catch (error) {
                this.showNotification('Erreur lors de l\'import: format de fichier invalide', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        
        // Réinitialiser l'interface
        fileInput.value = '';
        document.getElementById('fileName').textContent = '';
        document.getElementById('processImportBtn').style.display = 'none';
    }

    syncData() {
        // Simulation de synchronisation
        this.showNotification('Synchronisation en cours...', 'info');
        
        setTimeout(() => {
            this.showNotification('Données synchronisées avec succès!', 'success');
            this.addToActivityLog('Synchronisation des données', 'sync');
        }, 2000);
    }

    createBackup() {
        const backupData = {
            events: this.events,
            profile: this.userProfile,
            preferences: this.userPreferences,
            activityLog: this.activityLog,
            backupDate: new Date().toISOString()
        };

        this.downloadFile(
            JSON.stringify(backupData, null, 2),
            `complete-backup-${new Date().toISOString().split('T')[0]}.json`,
            'application/json'
        );

        this.addToActivityLog('Création d\'une sauvegarde complète', 'backup');
        this.showNotification('Sauvegarde créée avec succès!', 'success');
    }

    clearAllData() {
        if (confirm('Êtes-vous sûr de vouloir effacer toutes vos données ? Cette action est irréversible.')) {
            if (confirm('Dernière confirmation: toutes vos données seront perdues définitivement.')) {
                localStorage.removeItem('events');
                localStorage.removeItem('userProfile');
                localStorage.removeItem('userPreferences');
                localStorage.removeItem('activityLog');
                
                this.showNotification('Toutes les données ont été effacées', 'success');
                this.addToActivityLog('Effacement de toutes les données', 'delete');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }
    }

    resetApplication() {
        if (confirm('Voulez-vous réinitialiser l\'application aux paramètres par défaut ?')) {
            localStorage.clear();
            this.showNotification('Application réinitialisée', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    renderActivityLog() {
        const container = document.getElementById('activityLog');
        
        if (!this.activityLog || this.activityLog.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">Aucune activité récente</div>
                        <div class="activity-time">Commencez à utiliser l'application pour voir votre historique</div>
                    </div>
                </div>
            `;
            return;
        }

        const sortedActivities = [...this.activityLog]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50); // Limiter à 50 entrées

        container.innerHTML = sortedActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.action}</div>
                    <div class="activity-time">${this.formatDateTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            'profile': 'user-edit',
            'save': 'save',
            'export': 'download',
            'import': 'upload',
            'sync': 'sync-alt',
            'backup': 'shield-alt',
            'delete': 'trash',
            'navigation': 'mouse-pointer',
            'settings': 'cog'
        };
        return icons[type] || 'circle';
    }

    addToActivityLog(action, type = 'general') {
        const activity = {
            action,
            type,
            timestamp: new Date().toISOString()
        };

        this.activityLog = this.activityLog || [];
        this.activityLog.push(activity);
        
        // Garder seulement les 100 dernières activités
        if (this.activityLog.length > 100) {
            this.activityLog = this.activityLog.slice(-100);
        }
        
        localStorage.setItem('activityLog', JSON.stringify(this.activityLog));
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const minutes = Math.floor((now - date) / (1000 * 60));
            return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const iconMap = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };

        notification.innerHTML = `
            <i class="fas fa-${iconMap[type]}"></i>
            <span>${message}</span>
        `;

        const colorMap = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colorMap[type]};
            color: ${type === 'warning' ? '#212529' : 'white'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Méthodes de chargement des données
    loadUserProfile() {
        const saved = localStorage.getItem('userProfile');
        const profile = saved ? JSON.parse(saved) : {};
        
        // Initialiser la date de première utilisation si elle n'existe pas
        if (!profile.firstUse) {
            profile.firstUse = new Date().toISOString();
            localStorage.setItem('userProfile', JSON.stringify(profile));
        }
        
        return profile;
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('userPreferences');
        return saved ? JSON.parse(saved) : {
            defaultView: 'all',
            eventsPerPage: '20',
            dateFormat: 'fr-FR',
            timeFormat: '24h',
            theme: 'default',
            enableNotifications: true,
            autoSave: false,
            emailReminders: false
        };
    }

    loadEvents() {
        const saved = localStorage.getItem('events');
        return saved ? JSON.parse(saved) : [];
    }

    loadActivityLog() {
        const saved = localStorage.getItem('activityLog');
        return saved ? JSON.parse(saved) : [];
    }
}

// Ajouter les animations CSS
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

// Initialiser le gestionnaire de compte
const accountManager = new AccountManager();

// Ajouter l'activité de visite de la page
accountManager.addToActivityLog('Ouverture de la page de gestion du compte', 'navigation');
