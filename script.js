// Simulierter JSON Datensatz
const rawData = [
    { company: "TechCorp", country: "USA", co2: 4500 },
    { company: "AutoWorks", country: "Deutschland", co2: 12000 },
    { company: "GreenEnergy", country: "Norwegen", co2: 800 },
    { company: "SteelGmbH", country: "Deutschland", co2: 25000 },
    { company: "ChinaExplort", country: "China", co2: 30000 },
    { company: "LaMode", country: "Frankreich", co2: 3200 },
    { company: "DesertOil", country: "Saudi Arabien", co2: 50000 },
    { company: "EcoFoods", country: "Brasilien", co2: 6000 }
];

let currentData = [...rawData]; // Kopie für Sortierung/Filterung

// Tabelle rendern
function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Tabelle leeren

    data.forEach(item => {
        const row = document.createElement('tr');

        // SICHERHEIT: Nutzung von innerText statt innerHTML
        // Dies verhindert Cross-Site-Scripting (XSS), da HTML-Tags als Text interpretiert werden.

        const cellCompany = document.createElement('td');
        cellCompany.innerText = item.company; // Sicher!
        row.appendChild(cellCompany);

        const cellCountry = document.createElement('td');
        cellCountry.innerText = item.country; // Sicher!
        row.appendChild(cellCountry);

        const cellCo2 = document.createElement('td');
        cellCo2.innerText = item.co2; // Sicher!
        row.appendChild(cellCo2);

        tbody.appendChild(row);
    });
}

// Suchfunktion (Filter)
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    // Filterlogik
    const filtered = rawData.filter(item =>
        item.company.toLowerCase().includes(term) ||
        item.country.toLowerCase().includes(term)
    );
    renderTable(filtered);
});

// Sortierfunktion
function sortTable(key) {
    currentData.sort((a, b) => {
        if (typeof a[key] === 'string') {
            return a[key].localeCompare(b[key]);
        }
        return a[key] - b[key];
    });
    renderTable(currentData);
}

// Initialer Aufruf
renderTable(rawData);

// Schriftkultur (RTL/LTR) umschalten
function toggleDirection(dir) {
    const body = document.body;
    const menu = document.getElementById('local-menu');

    if (dir === 'rtl') {
        body.setAttribute('dir', 'rtl');
        // Bootstrap Klasse für rechtsbündigen Text
        body.classList.add('text-end');
        // Menü visuell verschieben (im Grid-System passiert das durch RTL oft automatisch, hier nur zur Verdeutlichung)
    } else {
        body.setAttribute('dir', 'ltr');
        body.classList.remove('text-end');
    }
}