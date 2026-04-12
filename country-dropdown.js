/**
 * FrankPass Custom Country Dropdown
 * Replaces native <datalist> with a searchable dropdown with real flag images.
 * Uses FlagCDN (https://flagcdn.com) — no emoji dependency.
 */
(function () {
    'use strict';

    const CDN = 'https://flagcdn.com/w40/';
    const DEFAULT_CODE = 'in';
    const DEFAULT_LABEL = 'India (IN)';

    // Elements
    let trigger, panel, searchInput, listScroll, displayName, triggerFlag;
    let hiddenInput, flagBadge;
    let allCountries = [];
    let currentCode = DEFAULT_CODE;

    function getFlagUrl(code) {
        return CDN + code.toLowerCase() + '.png';
    }

    function extractCode(label) {
        const m = label.match(/\(([A-Z]{2})\)/);
        return m ? m[1].toLowerCase() : '';
    }

    // Build one row
    function buildOption(country) {
        const div = document.createElement('div');
        div.className = 'country-option';
        div.dataset.code = country.code;
        div.dataset.label = country.label;
        div.setAttribute('role', 'option');

        const img = document.createElement('img');
        img.className = 'c-flag';
        img.src = getFlagUrl(country.code);
        img.alt = country.code.toUpperCase();
        img.loading = 'lazy';
        img.onerror = function () { this.style.display = 'none'; };

        const name = document.createElement('span');
        name.className = 'c-name';
        name.textContent = country.name;

        const code = document.createElement('span');
        code.className = 'c-code';
        code.textContent = country.code.toUpperCase();

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(code);

        div.addEventListener('click', () => selectCountry(country));
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') selectCountry(country);
        });

        return div;
    }

    function renderList(filter) {
        listScroll.innerHTML = '';
        const q = (filter || '').toLowerCase().trim();
        const filtered = q
            ? allCountries.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q))
            : allCountries;

        if (!filtered.length) {
            const empty = document.createElement('div');
            empty.className = 'country-no-results';
            empty.textContent = 'No country found';
            listScroll.appendChild(empty);
            return;
        }

        filtered.forEach(c => {
            const el = buildOption(c);
            if (c.code === currentCode) el.classList.add('selected');
            listScroll.appendChild(el);
        });

        // Scroll selected into view
        const sel = listScroll.querySelector('.selected');
        if (sel) sel.scrollIntoView({ block: 'nearest' });
    }

    function openDropdown() {
        trigger.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
        searchInput.value = '';
        renderList('');
        searchInput.focus();
    }

    function closeDropdown() {
        trigger.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
    }

    function selectCountry(country) {
        currentCode = country.code;

        // Update trigger display
        triggerFlag.src = getFlagUrl(country.code);
        triggerFlag.style.display = '';
        displayName.textContent = country.label;

        // Update premium header flag
        const headerFlag = document.getElementById('header-flag-img');
        if (headerFlag) {
            headerFlag.src = `https://flagcdn.com/w160/${country.code.toLowerCase()}.png`;
            headerFlag.style.display = '';
        }

        // Update hidden input (replaces old regionEl value)
        hiddenInput.value = country.label;
        // Fire change event so script.js listeners pick it up
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));

        // Update platform datalist
        if (typeof populatePlatformDatalist === 'function') {
            populatePlatformDatalist(country.code);
        }

        // Update URL
        try {
            window.history.pushState({ code: country.code }, '', '/' + country.code);
        } catch (e) { /* local file:// - ignore */ }

        closeDropdown();
    }

    function init() {
        // Guard: wait for country data
        if (!window.COUNTRY_LIST || !window.COUNTRY_LIST.length) {
            setTimeout(init, 50);
            return;
        }

        allCountries = window.COUNTRY_LIST;

        trigger      = document.getElementById('country-trigger');
        panel        = document.getElementById('country-dropdown-panel');
        searchInput  = document.getElementById('country-search-input');
        listScroll   = document.getElementById('country-list-scroll');
        displayName  = document.getElementById('country-display-name');
        triggerFlag  = document.getElementById('country-flag-img');
        hiddenInput  = document.getElementById('region');
        flagBadge    = document.getElementById('flag-badge');

        if (!trigger || !panel || !searchInput || !listScroll) return;

        // ── Auto-detect initial country ────────────────────────────────
        let initCode = DEFAULT_CODE;

        // 1. URL path (/in → 'in')
        const path = window.location.pathname.replace(/\//g, '').toLowerCase();
        if (path.length === 2 && allCountries.find(c => c.code === path)) {
            initCode = path;
        }

        // 2. Timezone
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const tzMap = {
                'Asia/Kolkata': 'in', 'Asia/Calcutta': 'in',
                'America/New_York': 'us', 'America/Los_Angeles': 'us',
                'America/Chicago': 'us', 'America/Denver': 'us',
                'Europe/London': 'gb', 'Europe/Paris': 'fr', 'Europe/Berlin': 'de',
                'America/Toronto': 'ca', 'Australia/Sydney': 'au', 'Australia/Melbourne': 'au',
                'Asia/Dhaka': 'bd', 'Asia/Karachi': 'pk', 'Africa/Lagos': 'ng',
                'Asia/Manila': 'ph', 'Asia/Jakarta': 'id', 'Africa/Nairobi': 'ke',
                'Asia/Dubai': 'ae', 'Asia/Riyadh': 'sa',
                'Asia/Tokyo': 'jp', 'America/Sao_Paulo': 'br', 'Africa/Johannesburg': 'za',
                'Europe/Madrid': 'es', 'Europe/Rome': 'it', 'Europe/Amsterdam': 'nl'
            };
            if (tzMap[tz]) initCode = tzMap[tz];
        } catch (e) {}

        const initCountry = allCountries.find(c => c.code === initCode) ||
                            allCountries.find(c => c.code === DEFAULT_CODE);

        if (initCountry) {
            currentCode = initCountry.code;
            triggerFlag.src = getFlagUrl(initCountry.code);
            displayName.textContent = initCountry.label;
            hiddenInput.value = initCountry.label;

            // Sync premium header flag on load
            const headerFlag = document.getElementById('header-flag-img');
            if (headerFlag) {
                headerFlag.src = `https://flagcdn.com/w160/${initCountry.code.toLowerCase()}.png`;
                headerFlag.style.display = '';
            }

            // Load platform list for this country
            if (typeof populatePlatformDatalist === 'function') {
                populatePlatformDatalist(initCountry.code);
            }
        }

        // ── Events ──────────────────────────────────────────────────────
        trigger.addEventListener('click', () =>
            panel.classList.contains('open') ? closeDropdown() : openDropdown());

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                openDropdown();
            }
        });

        searchInput.addEventListener('input', (e) => renderList(e.target.value));

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!trigger.closest('.custom-country-dropdown').contains(e.target)) {
                closeDropdown();
            }
        });
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
