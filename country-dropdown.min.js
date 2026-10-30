/**

 * FrankPass Custom Country Dropdown

 * Replaces native <datalist> with a searchable dropdown with real flag images.

 * Uses local /flags/ with FlagCDN fallback.

 * Multi-Tier Zero-Latency Geolocation (User Preference -> Path -> Client Locale -> Global Timezones -> Background Edge Trace).

 */

(function () {

    'use strict';



    if (window.__fp_country_dropdown_inited) return;

    window.__fp_country_dropdown_inited = true;



    const CDN = '/flags/';

    const FALLBACK_CDN = '/flags/';

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



    // Build one row (Rendered on demand when dropdown is opened)

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

        img.onerror = function () {

            if (!this.src.includes('global.png')) {

                this.src = '/flags/global.png';

            } else {

                this.style.display = 'none';

            }

        };



        const name = document.createElement('span');

        name.className = 'c-name';

        name.textContent = country.name;



        const code = document.createElement('span');

        code.className = 'c-code';

        code.textContent = country.code.toUpperCase();



        div.appendChild(img);

        div.appendChild(name);

        div.appendChild(code);



        div.addEventListener('click', () => selectCountry(country, true));

        div.addEventListener('keydown', (e) => {

            if (e.key === 'Enter' || e.key === ' ') selectCountry(country, true);

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



    function selectCountry(country, savePreference) {

        if (!country) return;

        currentCode = country.code;



        // Persist user selection if explicitly triggered (localStorage + 1-year Cookie)

        if (savePreference) {

            try {

                localStorage.setItem('fp_preferred_country', country.code);

                document.cookie = 'fp_preferred_country=' + encodeURIComponent(country.code) + '; path=/; max-age=31536000; SameSite=Lax';

            } catch (e) {}

        }



        // 1. Update header trigger flag and name

        if (triggerFlag) {

            triggerFlag.src = getFlagUrl(country.code);

            triggerFlag.alt = country.name;

            triggerFlag.onerror = function() {

                if (!this.src.includes('global.png')) {

                    this.src = '/flags/global.png';

                }

            };

            triggerFlag.style.display = 'inline-block';

        }

        if (displayName) {

            displayName.textContent = country.name;

        }



        // 2. Update generator card pill flag and label (Keep in 100% sync!)

        const headerFlag = document.getElementById('header-flag-img');

        if (headerFlag) {

            headerFlag.src = getFlagUrl(country.code);

            headerFlag.alt = country.name;

            headerFlag.onerror = function() { this.src = '/flags/global.png'; };

            headerFlag.style.display = '';

        }

        const cardLabel = document.getElementById('card-country-label');

        if (cardLabel) cardLabel.textContent = country.code.toUpperCase();

        const cardPill = document.getElementById('card-country-pill');

        if (cardPill) cardPill.title = country.label;



        // 3. Update hidden input (replaces old regionEl value)

        if (hiddenInput) {

            hiddenInput.value = country.label;

            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));

        }



        // 4. Update platform datalist

        if (typeof populatePlatformDatalist === 'function') {

            populatePlatformDatalist(country.code);

        }



        // 5. Explicit country slug on home/root paths (/in, /us, /ug)

        try {

            const targetPath = '/' + country.code.toLowerCase();

            if (window.location.pathname.length <= 4 && window.location.pathname !== targetPath) {

                window.history.replaceState({ code: country.code }, '', targetPath);

            }

        } catch (e) { /* local file:// - ignore */ }



        // 6. Dispatch global event for profile settings and other components

        try {

            window.dispatchEvent(new CustomEvent('fp-country-changed', { detail: country }));

        } catch (e) {}



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



        if (!trigger || !panel || !searchInput || !listScroll || !displayName || !triggerFlag || !hiddenInput) return;



        // ── Multi-Tier Auto-Detect Initial Country ─────────────────────

        let initCode = null;

        // Hardware Timezone & Offset Check (High Precision for India UTC+05:30)
        const tz = (typeof Intl !== 'undefined' && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone || '' : '');
        const tzOffset = (new Date()).getTimezoneOffset(); // -330 for IST
        const isIndiaDevice = (tz.includes('Kolkata') || tz.includes('Calcutta') || tzOffset === -330);

        // Tier 1: Explicit URL Path (/in, /us, /ug, etc.)
        let urlPath = window.location.pathname.split('/').filter(Boolean)[0] || '';
        urlPath = urlPath.toLowerCase();
        if (urlPath === 'hn') urlPath = 'in';
        if (urlPath.length === 2 && allCountries.find(c => c.code === urlPath)) {
            initCode = urlPath;
        }

        // Tier 2: Explicit User Click in Previous Session
        if (!initCode) {
            try {
                const explicitChoice = localStorage.getItem('fp_user_explicit_choice');
                if (explicitChoice && allCountries.find(c => c.code === explicitChoice.toLowerCase())) {
                    initCode = explicitChoice.toLowerCase();
                }
            } catch (e) {}
        }

        // Tier 3: Device Physical Location via Hardware Clock
        if (!initCode) {
            if (isIndiaDevice) {
                initCode = 'in';
            } else {
                try {
                    const tzMap = {
                        'Asia/Kolkata': 'in', 'Asia/Calcutta': 'in',
                        'America/New_York': 'us', 'America/Los_Angeles': 'us',
                        'America/Chicago': 'us', 'America/Denver': 'us',
                        'America/Phoenix': 'us', 'America/Detroit': 'us',
                        'America/Indiana/Indianapolis': 'us', 'America/Anchorage': 'us',
                        'Pacific/Honolulu': 'us', 'America/Boise': 'us',
                        'Europe/London': 'gb', 'Europe/Paris': 'fr', 'Europe/Berlin': 'de',
                        'America/Toronto': 'ca', 'America/Vancouver': 'ca', 'America/Montreal': 'ca',
                        'America/Edmonton': 'ca', 'America/Winnipeg': 'ca', 'America/Halifax': 'ca',
                        'Australia/Sydney': 'au', 'Australia/Melbourne': 'au', 'Australia/Brisbane': 'au',
                        'Australia/Perth': 'au', 'Australia/Adelaide': 'au',
                        'Asia/Dhaka': 'bd', 'Asia/Karachi': 'pk', 'Africa/Lagos': 'ng',
                        'Asia/Manila': 'ph', 'Asia/Jakarta': 'id', 'Africa/Nairobi': 'ke',
                        'Asia/Dubai': 'ae', 'Asia/Riyadh': 'sa', 'Asia/Singapore': 'sg',
                        'Asia/Kuala_Lumpur': 'my', 'Asia/Bangkok': 'th', 'Asia/Kathmandu': 'np',
                        'Asia/Colombo': 'lk', 'Asia/Seoul': 'kr', 'Asia/Tokyo': 'jp',
                        'America/Sao_Paulo': 'br', 'Africa/Johannesburg': 'za', 'America/Mexico_City': 'mx',
                        'Europe/Madrid': 'es', 'Europe/Rome': 'it', 'Europe/Amsterdam': 'nl'
                    };
                    if (tzMap[tz]) {
                        initCode = tzMap[tz];
                    } else if (tz.startsWith('America/')) {
                        initCode = 'us';
                    } else if (tz.startsWith('Europe/')) {
                        initCode = 'gb';
                    } else if (tz.startsWith('Australia/')) {
                        initCode = 'au';
                    }
                } catch (e) {}
            }
        }

        // Tier 4: Locale check ONLY if not in India (prevents en-US Windows bug in India)
        if (!initCode && !isIndiaDevice) {
            try {
                const navLang = navigator.language || (navigator.languages && navigator.languages[0]);
                if (navLang && navLang.includes('-')) {
                    const parts = navLang.split('-');
                    if (parts[1] && parts[1].length === 2) {
                        const reg = parts[1].toLowerCase();
                        if (allCountries.find(c => c.code === reg)) initCode = reg;
                    }
                }
            } catch (e) {}
        }

        // Final safe fallback

        if (!initCode || !allCountries.find(c => c.code === initCode)) {

            initCode = DEFAULT_CODE;

        }



        const initCountry = allCountries.find(c => c.code === initCode) ||

                            allCountries.find(c => c.code === DEFAULT_CODE);



        if (initCountry) {

            selectCountry(initCountry, false);

        }



        // Tier 4: Background Non-blocking Cloudflare Edge Geolocation (/cdn-cgi/trace)

        try {

            const hasSaved = !!localStorage.getItem('fp_preferred_country');

            const pathClean = window.location.pathname.split('/').filter(Boolean)[0] || '';

            const hasPath = pathClean.length === 2 && allCountries.find(c => c.code === pathClean.toLowerCase());

            if (!hasSaved && !hasPath && typeof fetch === 'function') {

                const idleRunner = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));

                idleRunner(() => {

                    fetch('/cdn-cgi/trace')

                        .then(r => r.text())

                        .then(t => {

                            const m = t.match(/^loc=([A-Za-z]{2})$/m);

                            if (m && m[1]) {

                                const edgeCode = m[1].toLowerCase();

                                const edgeCountry = allCountries.find(c => c.code === edgeCode);

                                if (edgeCountry && edgeCountry.code !== currentCode) {

                                    selectCountry(edgeCountry, false);

                                }

                            }

                        })

                        .catch(() => {});

                });

            }

        } catch (e) {}



        // ── Events ──────────────────────────────────────────────────────

        trigger.addEventListener('click', (e) => {

            e.preventDefault();

            e.stopPropagation();

            if (panel.classList.contains('open')) {

                closeDropdown();

            } else {

                openDropdown();

            }

        });



        panel.addEventListener('click', (e) => {

            e.stopPropagation();

        });



        trigger.addEventListener('keydown', (e) => {

            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {

                e.preventDefault();

                e.stopPropagation();

                openDropdown();

            }

        });



        searchInput.addEventListener('input', (e) => renderList(e.target.value));



        searchInput.addEventListener('keydown', (e) => {

            if (e.key === 'Escape') closeDropdown();

        });



        // ── Browser Back / Forward Sync ──────────────────────────────

        window.addEventListener('popstate', (e) => {

            let p = window.location.pathname.split('/').filter(Boolean)[0] || '';

            p = p.toLowerCase();

            if (p === 'hn') p = 'in';

            const matched = allCountries.find(c => c.code === p) || allCountries.find(c => c.code === DEFAULT_CODE);

            if (matched && matched.code !== currentCode) {

                selectCountry(matched, false);

            }

        });



        // Close on outside click

        document.addEventListener('click', (e) => {

            const dropdown = trigger ? trigger.closest('.custom-country-dropdown') : null;

            if (!dropdown || !dropdown.contains(e.target)) {

                closeDropdown();

            }

        });

    }



    // Expose Global API for programmatic country selection (e.g., Profile Settings)

    window.FrankPassCountry = {

        select: function(code) {

            if (!code || !allCountries) return;

            var c = allCountries.find(function(item) { return item.code === code.toLowerCase(); });

            if (c) selectCountry(c, true);

        },

        getCurrent: function() { return currentCode; },

        getAll: function() { return allCountries; }

    };



    // Run after DOM ready

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init);

    } else {

        init();

    }

})();

