class CO2App {
    constructor() {
        this.data = [];
        this.sortKey = null;
        this.sortDirection = 1;
        // Bindings für Event-Listener
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
    }

    // MODEL: Daten laden
    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
            this.updateView();
        } catch (error) {
            console.error("Fehler beim Laden:&lrm;", error);
        }
    }

    // CONTROLLER: Event-Listener einrichten
    setupEventListeners() {
        document.getElementById('searchInput').addEventListener('keyup', () => {
            this.updateView();
        });
    }

    // CONTROLLER: Sortierung steuern
    handleSort(key) {
        if (this.sortKey === key) {
            this.sortDirection *= -1;
        } else {
            this.sortKey = key;
            this.sortDirection = 1;
        }
        this.updateView();
    }

    // VIEW: Logik zur Darstellung
    updateView() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        // Filtern & Sortieren
        let displayData = [...this.data].filter(item =>
            item.company.toLowerCase().includes(searchTerm) ||
            item.country.toLowerCase().includes(searchTerm)
        );

        if (this.sortKey) {
            displayData.sort((a, b) => {
                const valA = a[this.sortKey];
                const valB = b[this.sortKey];
                return (typeof valA === 'number' ? (valA - valB) : valA.localeCompare(valB)) * this.sortDirection;
            });
        }

        this.renderTable(displayData);
    }

    renderTable(data) {
        const tbody = document.getElementById('tableBody');
        const noResults = document.getElementById('no-results');
        tbody.innerHTML = '';

        if (data.length === 0) {
            noResults.classList.remove('d-none');
            // Sicherstellen, dass die aktuelle Ausrichtung angewendet wird
            if (document.body.getAttribute('dir') === 'rtl') {
                noResults.classList.add('text-end');
            } else {
                noResults.classList.remove('text-end');
            }
        } else {
            noResults.classList.add('d-none');
            data.forEach(item => {
                const row = document.createElement('tr');
                // SICHERHEIT: textContent gegen XSS
                const cells = [item.company, item.country, item.co2.toLocaleString('de-DE')];
                cells.forEach(text => {
                    const td = document.createElement('td');
                    td.textContent = text;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
        }
    }

    // Hilfsfunktion für RTL/LTR (Anforderung c)
    toggleDirection(dir) {
        const body = document.body;
        const mainRow = document.getElementById('main-row');
        const noResults = document.getElementById('no-results');
        const navList = document.querySelector('.navbar-nav');
        const navBrand = document.querySelector('.navbar-brand');

        if (dir === 'rtl') {
            body.setAttribute('dir', 'rtl');
            body.classList.add('text-end');
            if (mainRow) mainRow.classList.add('flex-row-reverse');
            if (noResults) noResults.classList.add('text-end');
            
            // Navbar Spiegelung
            if (navList) {
                navList.classList.remove('ms-auto');
                navList.classList.add('me-auto');
            }
            if (navBrand) {
                navBrand.classList.remove('me-auto');
                navBrand.classList.add('ms-auto');
            }
        } else {
            body.setAttribute('dir', 'ltr');
            body.classList.remove('text-end');
            if (mainRow) mainRow.classList.remove('flex-row-reverse');
            if (noResults) noResults.classList.remove('text-end');
            
            if (navList) {
                navList.classList.remove('me-auto');
                navList.classList.add('ms-auto');
            }
            if (navBrand) {
                navBrand.classList.remove('ms-auto');
                navBrand.classList.add('me-auto');
            }
        }
    }
}

// App global verfügbar machen für HTML-onclick-Handler
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CO2App();
});