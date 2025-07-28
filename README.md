# 📅 Système de Gestion d'Événements

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/espero-soft/event_management_template)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎯 Description

Un système de gestion d'événements moderne et intuitif développé en HTML5, CSS3 et JavaScript vanilla. Cette application web permet de créer, organiser et gérer facilement vos événements avec une interface utilisateur élégante et responsive.

## ✨ Fonctionnalités Principales

### 📋 Gestion des Événements
- ✅ **Création d'événements** avec formulaire complet
- ✏️ **Modification** des événements existants
- 🗑️ **Suppression** avec confirmation
- 🔍 **Recherche** par titre, description ou lieu
- 🏷️ **Filtrage** par statut (à venir, passés, aujourd'hui)
- 📊 **Catégorisation** (réunions, conférences, ateliers, social, autre)

### 👤 Gestion de Compte
- 🖼️ **Photo de profil** personnalisable
- 📝 **Informations personnelles** complètes
- ⚙️ **Préférences d'affichage** configurables
- 🌍 **Formats de date/heure** internationaux
- 🔔 **Notifications** personnalisables
- 📊 **Statistiques d'utilisation**

### 💾 Gestion des Données
- 📤 **Export** en JSON ou CSV
- 📥 **Import** depuis fichier JSON
- 💽 **Sauvegarde automatique** dans localStorage
- 🔄 **Synchronisation** des données
- 📈 **Journal d'activité** détaillé

### 🎨 Interface Utilisateur
- 📱 **Design responsive** (mobile, tablette, desktop)
- 🎭 **Animations fluides** et transitions
- 🌈 **Interface moderne** avec dégradés
- ⚡ **Performance optimisée**
- 🔄 **Notifications en temps réel**

## 🚀 Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel, recommandé pour le développement)

### Installation Simple
1. **Clonez** le repository :
   ```bash
   git clone https://github.com/espero-soft/event_management_template.git
   cd event_management_template
   ```

2. **Ouvrez** `index.html` dans votre navigateur
   ```bash
   # Option 1: Ouverture directe
   open index.html
   
   # Option 2: Serveur local simple (Python)
   python -m http.server 8000
   # Puis visitez http://localhost:8000
   
   # Option 3: Serveur local (Node.js)
   npx serve .
   ```

### Installation avec Serveur Web
Pour une expérience optimale, utilisez un serveur web local :

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (nécessite npx)
npx serve -s . -l 8000

# Avec PHP
php -S localhost:8000
```

## 📁 Structure du Projet

```
event_management_template/
├── 📄 index.html              # Page principale
├── 📄 account.html            # Page de gestion du compte
├── 📄 README.md              # Documentation (ce fichier)
└── assets/
    ├── css/
    │   ├── 🎨 styles.css      # Styles principaux
    │   └── 🎨 account.css     # Styles page compte
    └── js/
        ├── ⚡ script.js       # Logique principale
        └── ⚡ account.js      # Logique page compte
```

## 🎮 Utilisation

### 🏁 Première Utilisation

1. **Ouvrez** l'application dans votre navigateur
2. **Découvrez** les événements d'exemple pré-chargés
3. **Créez** votre premier événement avec le bouton "+"
4. **Configurez** vos préférences via "Mon Compte"

### 📝 Création d'un Événement

1. Cliquez sur **"Nouvel Événement"**
2. Remplissez les informations :
   - **Titre** (obligatoire)
   - **Date et heure** (obligatoires)
   - **Lieu** (optionnel)
   - **Catégorie**
   - **Description** (optionnelle)
3. Cliquez sur **"Enregistrer"**

### 🔍 Recherche et Filtrage

- **Barre de recherche** : Tapez des mots-clés
- **Filtre par statut** :
  - `Tous` : Affiche tous les événements
  - `À venir` : Événements futurs uniquement
  - `Passés` : Événements terminés
  - `Aujourd'hui` : Événements du jour

### 👥 Gestion du Compte

1. Cliquez sur **"Mon Compte"** dans l'en-tête
2. Naviguez entre les onglets :
   - **Profil** : Informations personnelles
   - **Préférences** : Paramètres d'affichage
   - **Données** : Import/Export
   - **Activité** : Historique des actions

## 🛠️ Configuration

### ⚙️ Préférences Disponibles

| Paramètre | Options | Description |
|-----------|---------|-------------|
| **Vue par défaut** | Tous, À venir, Aujourd'hui | Filtre affiché au chargement |
| **Événements par page** | 10, 20, 50, Tous | Pagination des événements |
| **Format de date** | FR, US, UK | Format d'affichage des dates |
| **Format d'heure** | 24h, 12h | Format d'affichage de l'heure |
| **Notifications** | Activé/Désactivé | Alertes visuelles |
| **Sauvegarde auto** | Activé/Désactivé | Sauvegarde automatique |
| **Thème** | Défaut, Sombre, Clair | Apparence de l'interface |

### 💾 Stockage des Données

Les données sont stockées localement dans le navigateur :
- **Événements** : `localStorage.events`
- **Profil utilisateur** : `localStorage.userProfile`
- **Préférences** : `localStorage.userPreferences`
- **Journal d'activité** : `localStorage.activityLog`

## 📊 API et Structure des Données

### 🗃️ Structure d'un Événement

```javascript
{
  "id": "1234567890",
  "title": "Réunion équipe",
  "date": "2025-07-28",
  "time": "14:30",
  "location": "Salle A",
  "category": "meeting",
  "description": "Réunion hebdomadaire",
  "createdAt": "2025-07-28T10:00:00.000Z"
}
```

### 👤 Structure du Profil

```javascript
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+33123456789",
  "organization": "Mon Entreprise",
  "role": "manager",
  "bio": "Description personnelle",
  "avatar": "data:image/jpeg;base64,...",
  "firstUse": "2025-07-28T10:00:00.000Z",
  "lastUpdated": "2025-07-28T15:30:00.000Z"
}
```

### ⚙️ Structure des Préférences

```javascript
{
  "defaultView": "upcoming",
  "eventsPerPage": "20",
  "dateFormat": "fr-FR",
  "timeFormat": "24h",
  "theme": "default",
  "enableNotifications": true,
  "autoSave": false,
  "emailReminders": true
}
```

## 🎨 Personnalisation

### 🖌️ Modification des Couleurs

Dans `assets/css/styles.css`, modifiez les variables CSS :

```css
:root {
  --primary-color: #4a90e2;      /* Bleu principal */
  --secondary-color: #357abd;     /* Bleu foncé */
  --success-color: #28a745;       /* Vert succès */
  --warning-color: #ffc107;       /* Jaune attention */
  --danger-color: #dc3545;        /* Rouge danger */
}
```

### 🎭 Ajout de Thèmes

1. Créez un nouveau fichier CSS dans `assets/css/`
2. Ajoutez les styles spécifiques au thème
3. Modifiez `account.js` pour inclure le nouveau thème

### 📱 Responsive Design

Le design s'adapte automatiquement aux différentes tailles d'écran :
- **Desktop** : > 1024px
- **Tablette** : 768px - 1024px
- **Mobile** : < 768px

## 🔧 Développement

### 🏗️ Architecture

L'application suit une architecture modulaire :

- **`EventManager`** : Classe principale de gestion des événements
- **`AccountManager`** : Classe pour la gestion du compte utilisateur
- **Composants UI** : Modales, notifications, filtres
- **Stockage** : LocalStorage avec API simple

### 🎯 Méthodes Principales

#### EventManager
```javascript
// Gestion des événements
addEvent(eventData)      // Ajouter un événement
updateEvent(id, data)    // Modifier un événement
deleteEvent(id)          // Supprimer un événement
filterEvents()           // Filtrer les événements
renderEvents()           // Afficher les événements
```

#### AccountManager
```javascript
// Gestion du compte
saveProfileData()        // Sauvegarder le profil
exportData(format)       // Exporter les données
importData(file)         // Importer les données
addToActivityLog(action) // Ajouter au journal
```

### 🧪 Tests

Pour tester l'application :

1. **Test manuel** : Ouvrez dans différents navigateurs
2. **Test responsive** : Utilisez les outils de développement
3. **Test des fonctionnalités** : Créez, modifiez, supprimez des événements
4. **Test d'import/export** : Vérifiez la cohérence des données

## 🐛 Dépannage

### ❗ Problèmes Courants

#### L'application ne se charge pas
- Vérifiez que tous les fichiers sont présents
- Ouvrez la console développeur (F12) pour voir les erreurs
- Utilisez un serveur web local au lieu d'ouvrir directement le fichier

#### Les données ne se sauvegardent pas
- Vérifiez que le localStorage est activé dans votre navigateur
- Videz le cache et rechargez la page
- Vérifiez les quotas de stockage du navigateur

#### L'interface ne s'affiche pas correctement
- Vérifiez que les fichiers CSS sont correctement liés
- Testez dans un autre navigateur
- Vérifiez la console pour les erreurs CSS

#### Les événements d'exemple ne s'affichent pas
- Ouvrez la console développeur
- Vérifiez que le JavaScript se charge correctement
- Rechargez la page après avoir vidé le localStorage

### 🔍 Debug

Pour activer le mode debug, ajoutez dans la console :
```javascript
localStorage.setItem('debug', 'true');
location.reload();
```

## 🤝 Contribution

### 🎁 Comment Contribuer

1. **Fork** le projet
2. Créez une **branche feature** (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Committez** vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une **Pull Request**

### 📝 Guidelines

- Respectez le style de code existant
- Ajoutez des commentaires pour les nouvelles fonctionnalités
- Testez vos modifications sur différents navigateurs
- Mettez à jour la documentation si nécessaire

### 🐛 Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une **issue** avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Navigateur et version
   - Captures d'écran si nécessaire

## 📜 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Crédits

### 🎨 Design et Développement
- **Espero Software** - Développement principal
- **Font Awesome** - Icônes
- **Google Fonts** - Polices (via CDN)

### 📚 Technologies Utilisées

| Technologie | Version | Usage |
|-------------|---------|--------|
| HTML5 | - | Structure de l'application |
| CSS3 | - | Styles et animations |
| JavaScript | ES6+ | Logique applicative |
| Font Awesome | 6.0.0 | Icônes |
| LocalStorage API | - | Stockage local |

## 🔮 Roadmap

### 🎯 Fonctionnalités Prévues

#### Version 1.1
- [ ] Mode sombre/clair
- [ ] Rappels par notification navigateur
- [ ] Export iCal/Google Calendar
- [ ] Impression des événements

#### Version 1.2
- [ ] Gestion des participants
- [ ] Événements récurrents
- [ ] Vue calendrier mensuel
- [ ] Synchronisation cloud

#### Version 2.0
- [ ] API REST backend
- [ ] Application mobile (PWA)
- [ ] Partage d'événements
- [ ] Intégrations tierces

## 📞 Support

### 🆘 Aide et Support

- **Documentation** : Ce README
- **Issues GitHub** : [Signaler un problème](https://github.com/espero-soft/event_management_template/issues)
- **Email** : support@espero-soft.com
- **Website** : [espero-soft.com](https://espero-soft.com)

### 💬 FAQ

**Q: Puis-je utiliser cette application hors ligne ?**
R: Oui, une fois chargée, l'application fonctionne entièrement hors ligne.

**Q: Mes données sont-elles sécurisées ?**
R: Les données sont stockées localement dans votre navigateur et ne sont pas transmises à des serveurs externes.

**Q: Puis-je personnaliser l'apparence ?**
R: Oui, vous pouvez modifier les fichiers CSS ou contribuer à ajouter de nouveaux thèmes.

**Q: L'application est-elle compatible avec tous les navigateurs ?**
R: L'application est compatible avec tous les navigateurs modernes supportant ES6 et localStorage.

---

<div align="center">

**✨ Merci d'utiliser notre Système de Gestion d'Événements ! ✨**

Si ce projet vous aide, n'hésitez pas à lui donner une ⭐ sur GitHub !

[🏠 Retour au Repository](https://github.com/espero-soft/event_management_template) | [📖 Documentation](README.md) | [🐛 Signaler un Bug](https://github.com/espero-soft/event_management_template/issues)

</div>
