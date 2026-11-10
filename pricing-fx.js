/**
 * pricing-fx.js - Sovereign Purchasing Power Parity (PPP) & 228-Country Edge FX Engine v2.1.0
 * Powers localized fair pricing on frankpass.com using 24h cached Edge FX rates from store.frankbase.com
 * Adheres strictly to Zero Em-Dash (Rule SEO-05) and 100% Truth & Transparency (Rule SEO-04)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FrankPassPricing = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const FX_API_URL = 'https://store.frankbase.com/api/fx-rates';
  const FX_CACHE_KEY = 'fp_edge_fx_v1';
  const FX_CACHE_MS = 6 * 60 * 60 * 1000; // 6-hour Edge cache

  const ALL_COUNTRIES = {
  "AF": {
    "name": "Afghanistan",
    "currency": "AFN",
    "symbol": "؋",
    "flag": "🇦🇫"
  },
  "AX": {
    "name": "Åland Islands",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇦🇽"
  },
  "AL": {
    "name": "Albania",
    "currency": "ALL",
    "symbol": "L",
    "flag": "🇦🇱"
  },
  "DZ": {
    "name": "Algeria",
    "currency": "DZD",
    "symbol": "د.ج",
    "flag": "🇩🇿"
  },
  "AS": {
    "name": "American Samoa",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇦🇸"
  },
  "AD": {
    "name": "Andorra",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇦🇩"
  },
  "AO": {
    "name": "Angola",
    "currency": "AOA",
    "symbol": "Kz",
    "flag": "🇦🇴"
  },
  "AI": {
    "name": "Anguilla",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇦🇮"
  },
  "AG": {
    "name": "Antigua and Barbuda",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇦🇬"
  },
  "AR": {
    "name": "Argentina",
    "currency": "ARS",
    "symbol": "$",
    "flag": "🇦🇷"
  },
  "AM": {
    "name": "Armenia",
    "currency": "AMD",
    "symbol": "֏",
    "flag": "🇦🇲"
  },
  "AW": {
    "name": "Aruba",
    "currency": "AWG",
    "symbol": "Afl.",
    "flag": "🇦🇼"
  },
  "AU": {
    "name": "Australia",
    "currency": "AUD",
    "symbol": "AU$",
    "flag": "🇦🇺"
  },
  "AT": {
    "name": "Austria",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇦🇹"
  },
  "AZ": {
    "name": "Azerbaijan",
    "currency": "AZN",
    "symbol": "₼",
    "flag": "🇦🇿"
  },
  "BS": {
    "name": "Bahamas",
    "currency": "BSD",
    "symbol": "B$",
    "flag": "🇧🇸"
  },
  "BH": {
    "name": "Bahrain",
    "currency": "BHD",
    "symbol": "BD",
    "flag": "🇧🇭"
  },
  "BD": {
    "name": "Bangladesh",
    "currency": "BDT",
    "symbol": "৳",
    "flag": "🇧🇩"
  },
  "BB": {
    "name": "Barbados",
    "currency": "BBD",
    "symbol": "Bds$",
    "flag": "🇧🇧"
  },
  "BY": {
    "name": "Belarus",
    "currency": "BYN",
    "symbol": "Br",
    "flag": "🇧🇾"
  },
  "BE": {
    "name": "Belgium",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇧🇪"
  },
  "BZ": {
    "name": "Belize",
    "currency": "BZD",
    "symbol": "BZ$",
    "flag": "🇧🇿"
  },
  "BJ": {
    "name": "Benin",
    "currency": "XOF",
    "symbol": "CFA",
    "flag": "🇧🇯"
  },
  "BM": {
    "name": "Bermuda",
    "currency": "BMD",
    "symbol": "$",
    "flag": "🇧🇲"
  },
  "BT": {
    "name": "Bhutan",
    "currency": "BTN",
    "symbol": "Nu.",
    "flag": "🇧🇹"
  },
  "BO": {
    "name": "Bolivia",
    "currency": "BOB",
    "symbol": "Bs.",
    "flag": "🇧🇴"
  },
  "BA": {
    "name": "Bosnia and Herzegovina",
    "currency": "BAM",
    "symbol": "KM",
    "flag": "🇧🇦"
  },
  "BW": {
    "name": "Botswana",
    "currency": "BWP",
    "symbol": "P",
    "flag": "🇧🇼"
  },
  "BR": {
    "name": "Brazil",
    "currency": "BRL",
    "symbol": "R$",
    "flag": "🇧🇷"
  },
  "VG": {
    "name": "British Virgin Islands",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇻🇬"
  },
  "BN": {
    "name": "Brunei",
    "currency": "BND",
    "symbol": "B$",
    "flag": "🇧🇳"
  },
  "BG": {
    "name": "Bulgaria",
    "currency": "BGN",
    "symbol": "лв",
    "flag": "🇧🇬"
  },
  "BF": {
    "name": "Burkina Faso",
    "currency": "XOF",
    "symbol": "CFA",
    "flag": "🇧🇫"
  },
  "BI": {
    "name": "Burundi",
    "currency": "BIF",
    "symbol": "FBu",
    "flag": "🇧🇮"
  },
  "CV": {
    "name": "Cabo Verde",
    "currency": "CVE",
    "symbol": "Esc",
    "flag": "🇨🇻"
  },
  "KH": {
    "name": "Cambodia",
    "currency": "KHR",
    "symbol": "៛",
    "flag": "🇰🇭"
  },
  "CM": {
    "name": "Cameroon",
    "currency": "XAF",
    "symbol": "FCFA",
    "flag": "🇨🇲"
  },
  "CA": {
    "name": "Canada",
    "currency": "CAD",
    "symbol": "CA$",
    "flag": "🇨🇦"
  },
  "KY": {
    "name": "Cayman Islands",
    "currency": "KYD",
    "symbol": "CI$",
    "flag": "🇰🇾"
  },
  "CF": {
    "name": "Central African Republic",
    "currency": "XAF",
    "symbol": "FCFA",
    "flag": "🇨🇫"
  },
  "TD": {
    "name": "Chad",
    "currency": "XAF",
    "symbol": "FCFA",
    "flag": "🇹🇩"
  },
  "CL": {
    "name": "Chile",
    "currency": "CLP",
    "symbol": "$",
    "flag": "🇨🇱"
  },
  "CN": {
    "name": "China",
    "currency": "CNY",
    "symbol": "¥",
    "flag": "🇨🇳"
  },
  "CO": {
    "name": "Colombia",
    "currency": "COP",
    "symbol": "$",
    "flag": "🇨🇴"
  },
  "KM": {
    "name": "Comoros",
    "currency": "KMF",
    "symbol": "CF",
    "flag": "🇰🇲"
  },
  "CG": {
    "name": "Congo (Congo-Brazzaville)",
    "currency": "XAF",
    "symbol": "FCFA",
    "flag": "🇨🇬"
  },
  "CD": {
    "name": "Congo (DRC)",
    "currency": "CDF",
    "symbol": "FC",
    "flag": "🇨🇩"
  },
  "CK": {
    "name": "Cook Islands",
    "currency": "NZD",
    "symbol": "NZ$",
    "flag": "🇨🇰"
  },
  "CR": {
    "name": "Costa Rica",
    "currency": "CRC",
    "symbol": "₡",
    "flag": "🇨🇷"
  },
  "HR": {
    "name": "Croatia",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇭🇷"
  },
  "CU": {
    "name": "Cuba",
    "currency": "CUP",
    "symbol": "$",
    "flag": "🇨🇺"
  },
  "CW": {
    "name": "Curaçao",
    "currency": "ANG",
    "symbol": "NAƒ",
    "flag": "🇨🇼"
  },
  "CY": {
    "name": "Cyprus",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇨🇾"
  },
  "CZ": {
    "name": "Czechia",
    "currency": "CZK",
    "symbol": "Kč",
    "flag": "🇨🇿"
  },
  "DK": {
    "name": "Denmark",
    "currency": "DKK",
    "symbol": "kr",
    "flag": "🇩🇰"
  },
  "DJ": {
    "name": "Djibouti",
    "currency": "DJF",
    "symbol": "Fdj",
    "flag": "🇩🇯"
  },
  "DM": {
    "name": "Dominica",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇩🇲"
  },
  "DO": {
    "name": "Dominican Republic",
    "currency": "DOP",
    "symbol": "RD$",
    "flag": "🇩🇴"
  },
  "EC": {
    "name": "Ecuador",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇪🇨"
  },
  "EG": {
    "name": "Egypt",
    "currency": "EGP",
    "symbol": "E£",
    "flag": "🇪🇬"
  },
  "SV": {
    "name": "El Salvador",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇸🇻"
  },
  "GQ": {
    "name": "Equatorial Guinea",
    "currency": "XAF",
    "symbol": "FCFA",
    "flag": "🇬🇶"
  },
  "ER": {
    "name": "Eritrea",
    "currency": "ERN",
    "symbol": "Nfk",
    "flag": "🇪🇷"
  },
  "EE": {
    "name": "Estonia",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇪🇪"
  },
  "SZ": {
    "name": "Eswatini",
    "currency": "SZL",
    "symbol": "L",
    "flag": "🇸🇿"
  },
  "ET": {
    "name": "Ethiopia",
    "currency": "ETB",
    "symbol": "Br",
    "flag": "🇪🇹"
  },
  "FK": {
    "name": "Falkland Islands",
    "currency": "FKP",
    "symbol": "£",
    "flag": "🇫🇰"
  },
  "FO": {
    "name": "Faroe Islands",
    "currency": "DKK",
    "symbol": "kr",
    "flag": "🇫🇴"
  },
  "FJ": {
    "name": "Fiji",
    "currency": "FJD",
    "symbol": "FJ$",
    "flag": "🇫🇯"
  },
  "FI": {
    "name": "Finland",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇫🇮"
  },
  "FR": {
    "name": "France",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇫🇷"
  },
  "GF": {
    "name": "French Guiana",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇬🇫"
  },
  "PF": {
    "name": "French Polynesia",
    "currency": "XPF",
    "symbol": "₣",
    "flag": "🇵🇫"
  },
  "GA": {
    "name": "Gabon",
    "currency": "XAF",
    "symbol": "FCFA",
    "flag": "🇬🇦"
  },
  "GM": {
    "name": "Gambia",
    "currency": "GMD",
    "symbol": "D",
    "flag": "🇬🇲"
  },
  "GE": {
    "name": "Georgia",
    "currency": "GEL",
    "symbol": "₾",
    "flag": "🇬🇪"
  },
  "DE": {
    "name": "Germany",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇩🇪"
  },
  "GH": {
    "name": "Ghana",
    "currency": "GHS",
    "symbol": "GH₵",
    "flag": "🇬🇭"
  },
  "GI": {
    "name": "Gibraltar",
    "currency": "GIP",
    "symbol": "£",
    "flag": "🇬🇮"
  },
  "GR": {
    "name": "Greece",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇬🇷"
  },
  "GL": {
    "name": "Greenland",
    "currency": "DKK",
    "symbol": "kr",
    "flag": "🇬🇱"
  },
  "GD": {
    "name": "Grenada",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇬🇩"
  },
  "GP": {
    "name": "Guadeloupe",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇬🇵"
  },
  "GU": {
    "name": "Guam",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇬🇺"
  },
  "GT": {
    "name": "Guatemala",
    "currency": "GTQ",
    "symbol": "Q",
    "flag": "🇬🇹"
  },
  "GG": {
    "name": "Guernsey",
    "currency": "GBP",
    "symbol": "£",
    "flag": "🇬🇬"
  },
  "GN": {
    "name": "Guinea",
    "currency": "GNF",
    "symbol": "FG",
    "flag": "🇬🇳"
  },
  "GW": {
    "name": "Guinea-Bissau",
    "currency": "XOF",
    "symbol": "CFA",
    "flag": "🇬🇼"
  },
  "GY": {
    "name": "Guyana",
    "currency": "GYD",
    "symbol": "G$",
    "flag": "🇬🇾"
  },
  "HT": {
    "name": "Haiti",
    "currency": "HTG",
    "symbol": "G",
    "flag": "🇭🇹"
  },
  "HN": {
    "name": "Honduras",
    "currency": "HNL",
    "symbol": "L",
    "flag": "🇭🇳"
  },
  "HK": {
    "name": "Hong Kong",
    "currency": "HKD",
    "symbol": "HK$",
    "flag": "🇭🇰"
  },
  "HU": {
    "name": "Hungary",
    "currency": "HUF",
    "symbol": "Ft",
    "flag": "🇭🇺"
  },
  "IS": {
    "name": "Iceland",
    "currency": "ISK",
    "symbol": "kr",
    "flag": "🇮🇸"
  },
  "IN": {
    "name": "India",
    "currency": "INR",
    "symbol": "₹",
    "flag": "🇮🇳"
  },
  "ID": {
    "name": "Indonesia",
    "currency": "IDR",
    "symbol": "Rp",
    "flag": "🇮🇩"
  },
  "IR": {
    "name": "Iran",
    "currency": "IRR",
    "symbol": "﷼",
    "flag": "🇮🇷"
  },
  "IQ": {
    "name": "Iraq",
    "currency": "IQD",
    "symbol": "ع.د",
    "flag": "🇮🇶"
  },
  "IE": {
    "name": "Ireland",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇮🇪"
  },
  "IM": {
    "name": "Isle of Man",
    "currency": "GBP",
    "symbol": "£",
    "flag": "🇮🇲"
  },
  "IL": {
    "name": "Israel",
    "currency": "ILS",
    "symbol": "₪",
    "flag": "🇮🇱"
  },
  "IT": {
    "name": "Italy",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇮🇹"
  },
  "JM": {
    "name": "Jamaica",
    "currency": "JMD",
    "symbol": "J$",
    "flag": "🇯🇲"
  },
  "JP": {
    "name": "Japan",
    "currency": "JPY",
    "symbol": "¥",
    "flag": "🇯🇵"
  },
  "JE": {
    "name": "Jersey",
    "currency": "GBP",
    "symbol": "£",
    "flag": "🇯🇪"
  },
  "JO": {
    "name": "Jordan",
    "currency": "JOD",
    "symbol": "JD",
    "flag": "🇯🇴"
  },
  "KZ": {
    "name": "Kazakhstan",
    "currency": "KZT",
    "symbol": "₸",
    "flag": "🇰🇿"
  },
  "KE": {
    "name": "Kenya",
    "currency": "KES",
    "symbol": "KSh",
    "flag": "🇰🇪"
  },
  "KI": {
    "name": "Kiribati",
    "currency": "AUD",
    "symbol": "AU$",
    "flag": "🇰🇮"
  },
  "XK": {
    "name": "Kosovo",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇽🇰"
  },
  "KW": {
    "name": "Kuwait",
    "currency": "KWD",
    "symbol": "KD",
    "flag": "🇰🇼"
  },
  "KG": {
    "name": "Kyrgyzstan",
    "currency": "KGS",
    "symbol": "с",
    "flag": "🇰🇬"
  },
  "LA": {
    "name": "Laos",
    "currency": "LAK",
    "symbol": "₭",
    "flag": "🇱🇦"
  },
  "LV": {
    "name": "Latvia",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇱🇻"
  },
  "LB": {
    "name": "Lebanon",
    "currency": "LBP",
    "symbol": "L£",
    "flag": "🇱🇧"
  },
  "LS": {
    "name": "Lesotho",
    "currency": "LSL",
    "symbol": "L",
    "flag": "🇱🇸"
  },
  "LR": {
    "name": "Liberia",
    "currency": "LRD",
    "symbol": "L$",
    "flag": "🇱🇷"
  },
  "LY": {
    "name": "Libya",
    "currency": "LYD",
    "symbol": "LD",
    "flag": "🇱🇾"
  },
  "LI": {
    "name": "Liechtenstein",
    "currency": "CHF",
    "symbol": "CHF",
    "flag": "🇱🇮"
  },
  "LT": {
    "name": "Lithuania",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇱🇹"
  },
  "LU": {
    "name": "Luxembourg",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇱🇺"
  },
  "MO": {
    "name": "Macau",
    "currency": "MOP",
    "symbol": "MOP$",
    "flag": "🇲🇴"
  },
  "MG": {
    "name": "Madagascar",
    "currency": "MGA",
    "symbol": "Ar",
    "flag": "🇲🇬"
  },
  "MW": {
    "name": "Malawi",
    "currency": "MWK",
    "symbol": "MK",
    "flag": "🇲🇼"
  },
  "MY": {
    "name": "Malaysia",
    "currency": "MYR",
    "symbol": "RM",
    "flag": "🇲🇾"
  },
  "MV": {
    "name": "Maldives",
    "currency": "MVR",
    "symbol": "Rf",
    "flag": "🇲🇻"
  },
  "ML": {
    "name": "Mali",
    "currency": "XOF",
    "symbol": "CFA",
    "flag": "🇲🇱"
  },
  "MT": {
    "name": "Malta",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇲🇹"
  },
  "MH": {
    "name": "Marshall Islands",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇲🇭"
  },
  "MQ": {
    "name": "Martinique",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇲🇶"
  },
  "MR": {
    "name": "Mauritania",
    "currency": "MRU",
    "symbol": "UM",
    "flag": "🇲🇷"
  },
  "MU": {
    "name": "Mauritius",
    "currency": "MUR",
    "symbol": "₨",
    "flag": "🇲🇺"
  },
  "YT": {
    "name": "Mayotte",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇾🇹"
  },
  "MX": {
    "name": "Mexico",
    "currency": "MXN",
    "symbol": "Mex$",
    "flag": "🇲🇽"
  },
  "FM": {
    "name": "Micronesia",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇫🇲"
  },
  "MD": {
    "name": "Moldova",
    "currency": "MDL",
    "symbol": "L",
    "flag": "🇲🇩"
  },
  "MC": {
    "name": "Monaco",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇲🇨"
  },
  "MN": {
    "name": "Mongolia",
    "currency": "MNT",
    "symbol": "₮",
    "flag": "🇲🇳"
  },
  "ME": {
    "name": "Montenegro",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇲🇪"
  },
  "MS": {
    "name": "Montserrat",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇲🇸"
  },
  "MA": {
    "name": "Morocco",
    "currency": "MAD",
    "symbol": "DH",
    "flag": "🇲🇦"
  },
  "MZ": {
    "name": "Mozambique",
    "currency": "MZN",
    "symbol": "MT",
    "flag": "🇲🇿"
  },
  "MM": {
    "name": "Myanmar",
    "currency": "MMK",
    "symbol": "K",
    "flag": "🇲🇲"
  },
  "NA": {
    "name": "Namibia",
    "currency": "NAD",
    "symbol": "N$",
    "flag": "🇳🇦"
  },
  "NR": {
    "name": "Nauru",
    "currency": "AUD",
    "symbol": "AU$",
    "flag": "🇳🇷"
  },
  "NP": {
    "name": "Nepal",
    "currency": "NPR",
    "symbol": "रू",
    "flag": "🇳🇵"
  },
  "NL": {
    "name": "Netherlands",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇳🇱"
  },
  "NC": {
    "name": "New Caledonia",
    "currency": "XPF",
    "symbol": "₣",
    "flag": "🇳🇨"
  },
  "NZ": {
    "name": "New Zealand",
    "currency": "NZD",
    "symbol": "NZ$",
    "flag": "🇳🇿"
  },
  "NI": {
    "name": "Nicaragua",
    "currency": "NIO",
    "symbol": "C$",
    "flag": "🇳🇮"
  },
  "NE": {
    "name": "Niger",
    "currency": "XOF",
    "symbol": "CFA",
    "flag": "🇳🇪"
  },
  "NG": {
    "name": "Nigeria",
    "currency": "NGN",
    "symbol": "₦",
    "flag": "🇳🇬"
  },
  "KP": {
    "name": "North Korea",
    "currency": "KPW",
    "symbol": "₩",
    "flag": "🇰🇵"
  },
  "MK": {
    "name": "North Macedonia",
    "currency": "MKD",
    "symbol": "ден",
    "flag": "🇲🇰"
  },
  "MP": {
    "name": "Northern Mariana Islands",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇲🇵"
  },
  "NO": {
    "name": "Norway",
    "currency": "NOK",
    "symbol": "kr",
    "flag": "🇳🇴"
  },
  "OM": {
    "name": "Oman",
    "currency": "OMR",
    "symbol": "OMR",
    "flag": "🇴🇲"
  },
  "PK": {
    "name": "Pakistan",
    "currency": "PKR",
    "symbol": "₨",
    "flag": "🇵🇰"
  },
  "PW": {
    "name": "Palau",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇵🇼"
  },
  "PS": {
    "name": "Palestine",
    "currency": "ILS",
    "symbol": "₪",
    "flag": "🇵🇸"
  },
  "PA": {
    "name": "Panama",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇵🇦"
  },
  "PG": {
    "name": "Papua New Guinea",
    "currency": "PGK",
    "symbol": "K",
    "flag": "🇵🇬"
  },
  "PY": {
    "name": "Paraguay",
    "currency": "PYG",
    "symbol": "₲",
    "flag": "🇵🇾"
  },
  "PE": {
    "name": "Peru",
    "currency": "PEN",
    "symbol": "S/",
    "flag": "🇵🇪"
  },
  "PH": {
    "name": "Philippines",
    "currency": "PHP",
    "symbol": "₱",
    "flag": "🇵🇭"
  },
  "PL": {
    "name": "Poland",
    "currency": "PLN",
    "symbol": "zł",
    "flag": "🇵🇱"
  },
  "PT": {
    "name": "Portugal",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇵🇹"
  },
  "PR": {
    "name": "Puerto Rico",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇵🇷"
  },
  "QA": {
    "name": "Qatar",
    "currency": "QAR",
    "symbol": "QR",
    "flag": "🇶🇦"
  },
  "RE": {
    "name": "Réunion",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇷🇪"
  },
  "RO": {
    "name": "Romania",
    "currency": "RON",
    "symbol": "lei",
    "flag": "🇷🇴"
  },
  "RU": {
    "name": "Russia",
    "currency": "RUB",
    "symbol": "₽",
    "flag": "🇷🇺"
  },
  "RW": {
    "name": "Rwanda",
    "currency": "RWF",
    "symbol": "FRw",
    "flag": "🇷🇼"
  },
  "KN": {
    "name": "Saint Kitts and Nevis",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇰🇳"
  },
  "LC": {
    "name": "Saint Lucia",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇱🇨"
  },
  "VC": {
    "name": "Saint Vincent and the Grenadines",
    "currency": "XCD",
    "symbol": "EC$",
    "flag": "🇻🇨"
  },
  "WS": {
    "name": "Samoa",
    "currency": "WST",
    "symbol": "WS$",
    "flag": "🇼🇸"
  },
  "SM": {
    "name": "San Marino",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇸🇲"
  },
  "ST": {
    "name": "Sao Tome and Principe",
    "currency": "STN",
    "symbol": "Db",
    "flag": "🇸🇹"
  },
  "SA": {
    "name": "Saudi Arabia",
    "currency": "SAR",
    "symbol": "SR",
    "flag": "🇸🇦"
  },
  "SN": {
    "name": "Senegal",
    "currency": "XOF",
    "symbol": "CFA",
    "flag": "🇸🇳"
  },
  "RS": {
    "name": "Serbia",
    "currency": "RSD",
    "symbol": "дин.",
    "flag": "🇷🇸"
  },
  "SC": {
    "name": "Seychelles",
    "currency": "SCR",
    "symbol": "SR",
    "flag": "🇸🇨"
  },
  "SL": {
    "name": "Sierra Leone",
    "currency": "SLE",
    "symbol": "Le",
    "flag": "🇸🇱"
  },
  "SG": {
    "name": "Singapore",
    "currency": "SGD",
    "symbol": "S$",
    "flag": "🇸🇬"
  },
  "SX": {
    "name": "Sint Maarten",
    "currency": "ANG",
    "symbol": "NAƒ",
    "flag": "🇸🇽"
  },
  "SK": {
    "name": "Slovakia",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇸🇰"
  },
  "SI": {
    "name": "Slovenia",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇸🇮"
  },
  "SB": {
    "name": "Solomon Islands",
    "currency": "SBD",
    "symbol": "SI$",
    "flag": "🇸🇧"
  },
  "SO": {
    "name": "Somalia",
    "currency": "SOS",
    "symbol": "S",
    "flag": "🇸🇴"
  },
  "ZA": {
    "name": "South Africa",
    "currency": "ZAR",
    "symbol": "R",
    "flag": "🇿🇦"
  },
  "KR": {
    "name": "South Korea",
    "currency": "KRW",
    "symbol": "₩",
    "flag": "🇰🇷"
  },
  "SS": {
    "name": "South Sudan",
    "currency": "SSP",
    "symbol": "£",
    "flag": "🇸🇸"
  },
  "ES": {
    "name": "Spain",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇪🇸"
  },
  "LK": {
    "name": "Sri Lanka",
    "currency": "LKR",
    "symbol": "Rs",
    "flag": "🇱🇰"
  },
  "SD": {
    "name": "Sudan",
    "currency": "SDG",
    "symbol": "SDG",
    "flag": "🇸🇩"
  },
  "SR": {
    "name": "Suriname",
    "currency": "SRD",
    "symbol": "$",
    "flag": "🇸🇷"
  },
  "SE": {
    "name": "Sweden",
    "currency": "SEK",
    "symbol": "kr",
    "flag": "🇸🇪"
  },
  "CH": {
    "name": "Switzerland",
    "currency": "CHF",
    "symbol": "CHF",
    "flag": "🇨🇭"
  },
  "SY": {
    "name": "Syria",
    "currency": "SYP",
    "symbol": "LS",
    "flag": "🇸🇾"
  },
  "TW": {
    "name": "Taiwan",
    "currency": "TWD",
    "symbol": "NT$",
    "flag": "🇹🇼"
  },
  "TJ": {
    "name": "Tajikistan",
    "currency": "TJS",
    "symbol": "SM",
    "flag": "🇹🇯"
  },
  "TZ": {
    "name": "Tanzania",
    "currency": "TZS",
    "symbol": "TSh",
    "flag": "🇹🇿"
  },
  "TH": {
    "name": "Thailand",
    "currency": "THB",
    "symbol": "฿",
    "flag": "🇹🇭"
  },
  "TL": {
    "name": "Timor-Leste",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇹🇱"
  },
  "TG": {
    "name": "Togo",
    "currency": "XOF",
    "symbol": "CFA",
    "flag": "🇹🇬"
  },
  "TO": {
    "name": "Tonga",
    "currency": "TOP",
    "symbol": "T$",
    "flag": "🇹🇴"
  },
  "TT": {
    "name": "Trinidad and Tobago",
    "currency": "TTD",
    "symbol": "TT$",
    "flag": "🇹🇹"
  },
  "TN": {
    "name": "Tunisia",
    "currency": "TND",
    "symbol": "DT",
    "flag": "🇹🇳"
  },
  "TR": {
    "name": "Turkey",
    "currency": "TRY",
    "symbol": "₺",
    "flag": "🇹🇷"
  },
  "TM": {
    "name": "Turkmenistan",
    "currency": "TMT",
    "symbol": "T",
    "flag": "🇹🇲"
  },
  "TC": {
    "name": "Turks and Caicos Islands",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇹🇨"
  },
  "TV": {
    "name": "Tuvalu",
    "currency": "AUD",
    "symbol": "AU$",
    "flag": "🇹🇻"
  },
  "VI": {
    "name": "U.S. Virgin Islands",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇻🇮"
  },
  "UG": {
    "name": "Uganda",
    "currency": "UGX",
    "symbol": "USh",
    "flag": "🇺🇬"
  },
  "UA": {
    "name": "Ukraine",
    "currency": "UAH",
    "symbol": "₴",
    "flag": "🇺🇦"
  },
  "AE": {
    "name": "United Arab Emirates",
    "currency": "AED",
    "symbol": "AED",
    "flag": "🇦🇪"
  },
  "GB": {
    "name": "United Kingdom",
    "currency": "GBP",
    "symbol": "£",
    "flag": "🇬🇧"
  },
  "US": {
    "name": "United States",
    "currency": "USD",
    "symbol": "$",
    "flag": "🇺🇸"
  },
  "UY": {
    "name": "Uruguay",
    "currency": "UYU",
    "symbol": "$U",
    "flag": "🇺🇾"
  },
  "UZ": {
    "name": "Uzbekistan",
    "currency": "UZS",
    "symbol": "so'm",
    "flag": "🇺🇿"
  },
  "VU": {
    "name": "Vanuatu",
    "currency": "VUV",
    "symbol": "VT",
    "flag": "🇻🇺"
  },
  "VA": {
    "name": "Vatican City",
    "currency": "EUR",
    "symbol": "€",
    "flag": "🇻🇦"
  },
  "VE": {
    "name": "Venezuela",
    "currency": "VES",
    "symbol": "Bs.S",
    "flag": "🇻🇪"
  },
  "VN": {
    "name": "Vietnam",
    "currency": "VND",
    "symbol": "₫",
    "flag": "🇻🇳"
  },
  "YE": {
    "name": "Yemen",
    "currency": "YER",
    "symbol": "﷼",
    "flag": "🇾🇪"
  },
  "ZM": {
    "name": "Zambia",
    "currency": "ZMW",
    "symbol": "ZK",
    "flag": "🇿🇲"
  },
  "ZW": {
    "name": "Zimbabwe",
    "currency": "ZWL",
    "symbol": "Z$",
    "flag": "🇿🇼"
  }
};

  const FIXED_COUNTRIES = {
    IN: { name: 'India', currency: 'INR', symbol: '₹', base: 400, ppp: true },
    US: { name: 'United States & Global', currency: 'USD', symbol: '$', base: 25.00, ppp: false },
    GB: { name: 'United Kingdom', currency: 'GBP', symbol: '£', base: 20.00, ppp: true },
    EU: { name: 'European Union', currency: 'EUR', symbol: '€', base: 20.00, ppp: true },
    CA: { name: 'Canada', currency: 'CAD', symbol: 'CA$', base: 30.00, ppp: true },
    AU: { name: 'Australia', currency: 'AUD', symbol: 'A$', base: 32.00, ppp: true },
    JP: { name: 'Japan', currency: 'JPY', symbol: '¥', base: 3800, ppp: true },
    SG: { name: 'Singapore', currency: 'SGD', symbol: 'S$', base: 30.00, ppp: true },
    AE: { name: 'United Arab Emirates', currency: 'AED', symbol: 'AED ', base: 80.00, ppp: true },
    ID: { name: 'Indonesia', currency: 'IDR', symbol: 'Rp ', base: 75000, ppp: true },
    BR: { name: 'Brazil', currency: 'BRL', symbol: 'R$ ', base: 30.00, ppp: true },
    MX: { name: 'Mexico', currency: 'MXN', symbol: 'MX$ ', base: 100.00, ppp: true },
    ZA: { name: 'South Africa', currency: 'ZAR', symbol: 'R ', base: 100.00, ppp: true },
    PH: { name: 'Philippines', currency: 'PHP', symbol: '₱', base: 280.00, ppp: true },
    CN: { name: 'China', currency: 'CNY', symbol: '¥', base: 40.00, ppp: true },
    VN: { name: 'Vietnam', currency: 'VND', symbol: '₫', base: 120000, ppp: true },
    NG: { name: 'Nigeria', currency: 'NGN', symbol: '₦', base: 7500, ppp: true },
    TR: { name: 'Turkey', currency: 'TRY', symbol: '₺', base: 160.00, ppp: true }
  };

  const EU_CODES = [
    'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'PT', 'FI',
    'GR', 'LU', 'CY', 'MT', 'SK', 'SI', 'EE', 'LV', 'LT'
  ];

  let coupon20Active = false;

  function getActiveCountryCode() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('fp_preferred_country');
        if (saved && saved.trim()) return saved.trim().toUpperCase();
      }
      if (typeof document !== 'undefined') {
        const cardLabel = document.getElementById('card-country-label');
        if (cardLabel && cardLabel.textContent) {
          const txt = cardLabel.textContent.trim().toUpperCase();
          if (txt && txt.length === 2) return txt;
        }
      }
    } catch (e) {}
    return 'IN';
  }

  function getCachedFxRates() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(FX_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < FX_CACHE_MS && parsed.rates) {
        return parsed.rates;
      }
    } catch (e) {}
    return null;
  }

  async function fetchFxRates() {
    try {
      if (typeof fetch === 'undefined') return null;
      const cached = getCachedFxRates();
      if (cached) return cached;

      const res = await fetch(FX_API_URL, { mode: 'cors' });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.success && data.rates) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(FX_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            rates: data.rates
          }));
        }
        return data.rates;
      }
    } catch (e) {}
    return null;
  }

  function calculatePricing(countryCode, fxRates) {
    const code = (countryCode || getActiveCountryCode()).toUpperCase();

    // 1. Fixed PPP country
    if (FIXED_COUNTRIES[code]) {
      const fc = FIXED_COUNTRIES[code];
      const base = fc.base;
      return {
        code: code,
        name: fc.name,
        currency: fc.currency,
        symbol: fc.symbol,
        base: base,
        isFixed: true,
        isPPP: fc.ppp,
        usdRef: '',
        formatted: fc.symbol + (Number.isInteger(base) ? base : base.toFixed(2))
      };
    }

    // 2. Eurozone
    if (EU_CODES.includes(code)) {
      const eu = FIXED_COUNTRIES.EU;
      const base = eu.base;
      return {
        code: code,
        name: 'Eurozone (' + code + ')',
        currency: eu.currency,
        symbol: eu.symbol,
        base: base,
        isFixed: true,
        isPPP: true,
        usdRef: '',
        formatted: eu.symbol + base.toFixed(2)
      };
    }

    // 3. Non-fixed 228-country dynamic conversion
    const cInfo = (typeof ALL_COUNTRIES !== 'undefined' && ALL_COUNTRIES[code]) ? ALL_COUNTRIES[code] : { name: code, currency: 'USD', symbol: '$' };
    const rates = fxRates || getCachedFxRates();
    const curr = cInfo.currency || 'USD';
    const sym = cInfo.symbol || '$';
    const rate = (rates && rates[curr]) ? rates[curr] : 1;

    let base = 25.00;
    let usdRef = '';

    if (curr !== 'USD' && rate !== 1) {
      base = Math.round(25.00 * rate);
      usdRef = '(~$25.00 USD)';
    }

    return {
      code: code,
      name: cInfo.name,
      currency: curr,
      symbol: sym,
      base: base,
      isFixed: false,
      isPPP: false,
      usdRef: usdRef,
      rate: rate,
      formatted: sym + ' ' + (Number.isInteger(base) ? base : base.toFixed(2)) + ' ' + curr
    };
  }

  function toggleCoupon20() {
    coupon20Active = !coupon20Active;
    syncPricingUI();
    if (typeof showToast === 'function') {
      if (coupon20Active) {
        showToast('🏷️ Coupon PRIVACY20 Applied: 20% Extra Discount!', 'success');
      } else {
        showToast('Coupon removed. Showing standard pricing.', '');
      }
    }
  }

  function toggleFxNoticeModal() {
    const el = document.getElementById('fx-rate-notice-box');
    if (el) {
      el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
    }
  }

  function syncPricingUI(customCode) {
    if (typeof document === 'undefined') return;

    const pricing = calculatePricing(customCode);
    const code = pricing.code;
    const base = pricing.base;
    const symbol = pricing.symbol;
    const currency = pricing.currency;
    const isHindi = document.documentElement.lang === 'hi' || window.location.pathname.includes('hindi');

    const formatNum = (num) => Number.isInteger(num) ? String(num) : num.toFixed(2);

    // 1. Update Solo Lifetime Pass Price Tag
    const soloPriceEl = document.getElementById('solo-price-display');
    const soloHeaderPriceEl = document.getElementById('solo-card-header-price');
    const soloCurrencyEl = document.getElementById('solo-price-currency');

    if (soloPriceEl) {
      if (coupon20Active) {
        const discounted = Number.isInteger(base) ? Math.round(base * 0.8) : (base * 0.8);
        soloPriceEl.innerHTML = '<s style="font-size:1.6rem;opacity:0.6;margin-right:8px;">' + pricing.formatted + '</s> ' + symbol + (Number.isInteger(discounted) ? discounted : discounted.toFixed(2));
      } else {
        soloPriceEl.textContent = pricing.formatted;
      }
    }

    if (soloHeaderPriceEl) {
      soloHeaderPriceEl.textContent = pricing.formatted;
    }

    if (soloCurrencyEl) {
      const refText = pricing.usdRef ? ' ' + pricing.usdRef : '';
      soloCurrencyEl.textContent = isHindi 
        ? '/ लाइफटाइम 1-PC (' + currency + ')' + refText
        : '/ Lifetime 1-PC (' + currency + ')' + refText;
    }

    // 2. Update Solo PPP / FX Badge & Info Button
    const pppBadge = document.getElementById('solo-ppp-badge');
    if (pppBadge) {
      pppBadge.style.display = 'inline-flex';
      if (pricing.isPPP) {
        pppBadge.innerHTML = isHindi
          ? '✓ PPP लागू: ' + pricing.name + ' के लिए गारंटीकृत उचित क्षेत्रीय मूल्य (' + currency + ')'
          : '✓ PPP Applied: Guaranteed Fair Regional Price for ' + pricing.name + ' (' + currency + ')';
        pppBadge.style.background = 'rgba(16,185,129,0.12)';
        pppBadge.style.borderColor = 'rgba(16,185,129,0.3)';
        pppBadge.style.color = '#10b981';
      } else {
        pppBadge.innerHTML = isHindi
          ? '⚡ 24-घंटे एज FX दर: ' + pricing.name + ' (' + currency + ') ' + (pricing.usdRef || '') + ' <button type="button" onclick="FrankPassPricing.toggleFxNoticeModal()" style="background:none;border:none;cursor:pointer;color:inherit;font-weight:800;text-decoration:underline;margin-left:4px;">ℹ️ सूचना</button>'
          : '⚡ 24h Edge FX Rate: ' + pricing.name + ' (' + currency + ') ' + (pricing.usdRef || '') + ' <button type="button" onclick="FrankPassPricing.toggleFxNoticeModal()" style="background:none;border:none;cursor:pointer;color:inherit;font-weight:800;text-decoration:underline;margin-left:4px;">ℹ️ Info</button>';
        pppBadge.style.background = 'rgba(56,189,248,0.12)';
        pppBadge.style.borderColor = 'rgba(56,189,248,0.3)';
        pppBadge.style.color = '#38bdf8';
      }
    }

    // 3. Update Volume Calculator Card Intro & Scale
    const volIntro = document.getElementById('vol-calc-intro');
    if (volIntro) {
      const refStr = pricing.usdRef ? ' ' + pricing.usdRef : '';
      volIntro.innerHTML = isHindi
        ? 'मानक मूल्य 1-PC लाइफटाइम पास के लिए <strong>' + pricing.formatted + '</strong>' + refStr + ' है। वॉल्यूम छूट और 20% कूपन लागू करने के लिए नीचे वर्कस्टेशन चुनें।'
        : 'Standard pricing is <strong>' + pricing.formatted + '</strong>' + refStr + ' for a lifetime 1-PC pass. Select your required number of workstations to calculate tiered volume discounts and apply coupon codes.';
    }

    const scale1 = document.getElementById('vol-mark-1pc');
    const scale2 = document.getElementById('vol-mark-2to5pc');
    const scale3 = document.getElementById('vol-mark-6to20pc');

    if (scale1) scale1.textContent = '1 PC (' + pricing.formatted + ')';
    if (scale2) {
      const p30 = Number.isInteger(base) ? Math.round(base * 0.7) : (base * 0.7);
      scale2.textContent = isHindi ? '2-5 PCs (30% छूट: ' + symbol + formatNum(p30) + '/PC)' : '2-5 PCs (30% off: ' + symbol + formatNum(p30) + '/PC)';
    }
    if (scale3) {
      const p50 = Number.isInteger(base) ? Math.round(base * 0.5) : (base * 0.5);
      scale3.textContent = isHindi ? '6-20 PCs (50% छूट: ' + symbol + formatNum(p50) + '/PC)' : '6-20 PCs (50% off: ' + symbol + formatNum(p50) + '/PC)';
    }

    // 4. Update Coupon Button & Promotion Card
    const btnCoupon = document.getElementById('btn-toggle-coupon');
    const couponSavings = document.getElementById('calc-coupon-savings-text');
    const couponCard = document.getElementById('calc-coupon-card');

    if (btnCoupon) {
      if (coupon20Active) {
        btnCoupon.innerHTML = isHindi ? '✕ 20% छूट हटाएं (सक्रिय)' : '✕ Remove 20% (Active)';
        btnCoupon.style.background = 'rgba(239, 68, 68, 0.15)';
        btnCoupon.style.borderColor = '#ef4444';
        btnCoupon.style.color = '#ef4444';
        if (couponCard) couponCard.style.borderColor = '#10b981';
      } else {
        btnCoupon.innerHTML = isHindi ? '🏷️ 20% छूट लागू करें' : '🏷️ Apply 20% OFF';
        btnCoupon.style.background = '#eab308';
        btnCoupon.style.borderColor = '#eab308';
        btnCoupon.style.color = '#000000';
        if (couponCard) couponCard.style.borderColor = 'rgba(234,179,8,0.35)';
      }
    }

    if (couponSavings) {
      const save20 = Number.isInteger(base) ? Math.round(base * 0.2) : (base * 0.2);
      couponSavings.textContent = isHindi
        ? 'कूपन PRIVACY20 द्वारा फ्लैट 20% छूट (बचत: ' + symbol + formatNum(save20) + ' प्रति PC)।'
        : 'Flat 20% off with code PRIVACY20 (Save ' + symbol + formatNum(save20) + ' per PC).';
    }

    // 5. Update Volume Math Output Box (Support both standard IDs and Hindi -hi IDs)
    const pcCountInput = document.getElementById('vol-pc-count') || document.getElementById('vol-pc-count-hi');
    const pcLabel = document.getElementById('vol-pc-label') || document.getElementById('vol-pc-label-hi');
    const finalPriceSpan = document.getElementById('vol-final-price') || document.getElementById('vol-final-price-hi');
    const discountBadge = document.getElementById('vol-discount-badge') || document.getElementById('vol-discount-badge-hi');
    const breakdownText = document.getElementById('vol-breakdown-text') || document.getElementById('vol-breakdown-text-hi');
    const assuranceEl = document.getElementById('vol-currency-assurance');

    if (pcCountInput && finalPriceSpan) {
      const pcs = parseInt(pcCountInput.value, 10) || 1;
      if (pcLabel) {
        pcLabel.textContent = pcs === 1 ? (isHindi ? '1 PC (एकल)' : '1 PC (Solo)') : pcs + ' PCs';
      }

      let volumeDiscountPct = 0;
      let badgeText = isHindi ? 'सोलो लाइफटाइम पास' : 'Solo Lifetime Pass';
      let badgeBg = 'rgba(139,92,246,0.18)';
      let badgeColor = 'var(--accent-light)';

      if (pcs >= 6) {
        volumeDiscountPct = 0.50;
        badgeText = isHindi ? '50% टीम वॉल्यूम छूट' : '50% Team Volume Discount';
        badgeBg = 'rgba(56,189,248,0.18)';
        badgeColor = '#38bdf8';
      } else if (pcs >= 2) {
        volumeDiscountPct = 0.30;
        badgeText = isHindi ? '30% वॉल्यूम छूट' : '30% Volume Discount';
        badgeBg = 'rgba(234,179,8,0.18)';
        badgeColor = '#eab308';
      }

      const standardUnitPrice = Number.isInteger(base) ? Math.round(base * (1 - volumeDiscountPct)) : (base * (1 - volumeDiscountPct));
      const standardTotal = standardUnitPrice * pcs;

      let finalUnitPrice = standardUnitPrice;
      if (coupon20Active) {
        finalUnitPrice = Number.isInteger(standardUnitPrice) ? Math.round(standardUnitPrice * 0.80) : (standardUnitPrice * 0.80);
      }
      const finalTotal = finalUnitPrice * pcs;

      if (coupon20Active) {
        finalPriceSpan.innerHTML = '<s style="font-size:1.6rem;opacity:0.6;margin-right:10px;">' + symbol + formatNum(standardTotal) + '</s> ' + symbol + formatNum(finalTotal);
        badgeText += isHindi ? ' + 20% कूपन' : ' + 20% Promo';
        badgeBg = 'rgba(16,185,129,0.2)';
        badgeColor = '#10b981';
      } else {
        finalPriceSpan.textContent = symbol + formatNum(finalTotal);
      }

      if (discountBadge) {
        discountBadge.textContent = badgeText + (volumeDiscountPct > 0 || coupon20Active ? ' (' + symbol + formatNum(finalUnitPrice) + ' / PC)' : '');
        discountBadge.style.background = badgeBg;
        discountBadge.style.color = badgeColor;
      }

      if (breakdownText) {
        const couponNote = coupon20Active ? (isHindi ? ' (कूपन PRIVACY20 द्वारा अतिरिक्त 20% छूट शामिल)' : ' (Includes extra 20% off with coupon PRIVACY20)') : '';
        if (pcs === 1) {
          breakdownText.textContent = isHindi
            ? '1 हार्डवेयर-बाउंड PC लाइसेंस (' + symbol + formatNum(finalTotal) + ')' + couponNote + '। विंडोज क्रोमियम एक्सटेंशन व ऑफलाइन लाइफटाइम की शामिल।'
            : '1 Hardware-Bound PC License (' + symbol + formatNum(finalTotal) + ')' + couponNote + '. Includes Windows Chromium Extension & Offline Lifetime Key.';
        } else {
          breakdownText.textContent = isHindi
            ? pcs + ' अलग हार्डवेयर-बाउंड PC लाइसेंस (' + symbol + formatNum(finalUnitPrice) + ' प्रति PC)' + couponNote + '। स्वतंत्र ऑफलाइन सक्रियण कीज।'
            : pcs + ' Separate Hardware-Bound PC Licenses (' + symbol + formatNum(finalUnitPrice) + ' per PC)' + couponNote + '. Independent offline activation keys.';
        }
      }

      if (assuranceEl) {
        if (code === 'IN') {
          assuranceEl.innerHTML = isHindi
            ? '✓ Dodo Payments द्वारा INR (UPI GPay/PhonePe/Paytm, RuPay व भारतीय कार्ड) में 100% सुरक्षित भुगतान'
            : '✓ Dodo Payments securely processes payment in INR (UPI, RuPay, Indian Debit & Credit Cards)';
        } else if (pricing.isPPP) {
          assuranceEl.innerHTML = isHindi
            ? '✓ Dodo Payments द्वारा स्थानीय मुद्रा (' + currency + ') में गारंटीकृत क्रय शक्ति समता (PPP) दर'
            : '✓ Dodo Payments securely processes payment in local currency (' + currency + ') with guaranteed PPP fair rate';
        } else {
          assuranceEl.innerHTML = isHindi
            ? '✓ Dodo Payments द्वारा ' + currency + ' (24-घंटे एज FX दर, ~$25.00 USD बेस) में सुरक्षित कार्ड भुगतान'
            : '✓ Dodo Payments securely converts payment to ' + currency + ' (24h Edge FX rate from $25.00 USD base)';
        }
      }
    }
  }

  // Auto initialize on DOM load
  if (typeof window !== 'undefined') {
    window.addEventListener('fp-country-changed', function (e) {
      const detail = e.detail;
      const code = detail && detail.code ? detail.code : null;
      syncPricingUI(code);
    });

    const bindInput = () => {
      const el = document.getElementById('vol-pc-count') || document.getElementById('vol-pc-count-hi');
      if (el) {
        el.addEventListener('input', () => syncPricingUI());
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        bindInput();
        syncPricingUI();
        fetchFxRates().then(() => syncPricingUI());
      });
    } else {
      bindInput();
      syncPricingUI();
      fetchFxRates().then(() => syncPricingUI());
    }
  }

  return {
    ALL_COUNTRIES: ALL_COUNTRIES,
    FIXED_COUNTRIES: FIXED_COUNTRIES,
    calculatePricing: calculatePricing,
    getActiveCountryCode: getActiveCountryCode,
    syncPricingUI: syncPricingUI,
    toggleCoupon20: toggleCoupon20,
    toggleFxNoticeModal: toggleFxNoticeModal,
    fetchFxRates: fetchFxRates
  };
});
