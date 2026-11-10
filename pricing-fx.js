/**
 * pricing-fx.js - Sovereign Purchasing Power Parity (PPP) & 228-Country Edge FX Engine v3.1.0
 * Powers localized fair pricing on frankpass.com using 6h cached Edge FX rates from store.frankbase.com
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
  "AF": {
    "name": "Afghanistan",
    "currency": "AFN",
    "symbol": "؋",
    "base": 500,
    "dodo_smallest_unit": 50000,
    "isFixed": true,
    "flag": "🇦🇫",
    "usdRef": "(~30%)"
  },
  "AX": {
    "name": "Åland Islands",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇦🇽",
    "usdRef": "(~PPP)"
  },
  "AL": {
    "name": "Albania",
    "currency": "ALL",
    "symbol": "L",
    "base": 900,
    "dodo_smallest_unit": 90000,
    "isFixed": true,
    "flag": "🇦🇱",
    "usdRef": "(~PPP)"
  },
  "DZ": {
    "name": "Algeria",
    "currency": "DZD",
    "symbol": "د.ج",
    "base": 1200,
    "dodo_smallest_unit": 120000,
    "isFixed": true,
    "flag": "🇩🇿",
    "usdRef": "(~PPP)"
  },
  "AS": {
    "name": "American Samoa",
    "currency": "USD",
    "symbol": "$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇦🇸",
    "usdRef": ""
  },
  "AD": {
    "name": "Andorra",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇦🇩",
    "usdRef": "(~PPP)"
  },
  "AO": {
    "name": "Angola",
    "currency": "AOA",
    "symbol": "Kz",
    "base": 6900,
    "dodo_smallest_unit": 690000,
    "isFixed": true,
    "flag": "🇦🇴",
    "usdRef": "(~30%)"
  },
  "AI": {
    "name": "Anguilla",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 45,
    "dodo_smallest_unit": 4500,
    "isFixed": true,
    "flag": "🇦🇮",
    "usdRef": "(~PPP)"
  },
  "AG": {
    "name": "Antigua and Barbuda",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 45,
    "dodo_smallest_unit": 4500,
    "isFixed": true,
    "flag": "🇦🇬",
    "usdRef": "(~PPP)"
  },
  "AR": {
    "name": "Argentina",
    "currency": "ARS",
    "symbol": "$",
    "base": 17400,
    "dodo_smallest_unit": 1740000,
    "isFixed": true,
    "flag": "🇦🇷",
    "usdRef": "(~PPP)"
  },
  "AM": {
    "name": "Armenia",
    "currency": "AMD",
    "symbol": "֏",
    "base": 3200,
    "dodo_smallest_unit": 320000,
    "isFixed": true,
    "flag": "🇦🇲",
    "usdRef": "(~PPP)"
  },
  "AW": {
    "name": "Aruba",
    "currency": "AWG",
    "symbol": "ƒ",
    "base": 35,
    "dodo_smallest_unit": 3500,
    "isFixed": true,
    "flag": "🇦🇼",
    "usdRef": "(~PPP)"
  },
  "AU": {
    "name": "Australia",
    "currency": "AUD",
    "symbol": "A$",
    "base": 32,
    "dodo_smallest_unit": 3200,
    "isFixed": true,
    "flag": "🇦🇺",
    "usdRef": "(~PPP)"
  },
  "AT": {
    "name": "Austria",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇦🇹",
    "usdRef": "(~PPP)"
  },
  "AZ": {
    "name": "Azerbaijan",
    "currency": "AZN",
    "symbol": "₼",
    "base": 13,
    "dodo_smallest_unit": 1300,
    "isFixed": true,
    "flag": "🇦🇿",
    "usdRef": "(~30%)"
  },
  "BS": {
    "name": "Bahamas",
    "currency": "BSD",
    "symbol": "B$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇧🇸",
    "usdRef": "(~PPP)"
  },
  "BH": {
    "name": "Bahrain",
    "currency": "BHD",
    "symbol": "BD",
    "base": 8,
    "dodo_smallest_unit": 8000,
    "isFixed": true,
    "flag": "🇧🇭",
    "usdRef": "(~PPP)"
  },
  "BD": {
    "name": "Bangladesh",
    "currency": "BDT",
    "symbol": "৳",
    "base": 950,
    "dodo_smallest_unit": 95000,
    "isFixed": true,
    "flag": "🇧🇩",
    "usdRef": "(~30%)"
  },
  "BB": {
    "name": "Barbados",
    "currency": "BBD",
    "symbol": "Bds$",
    "base": 50,
    "dodo_smallest_unit": 5000,
    "isFixed": true,
    "flag": "🇧🇧",
    "usdRef": "(~PPP)"
  },
  "BY": {
    "name": "Belarus",
    "currency": "BYN",
    "symbol": "Br",
    "base": 20,
    "dodo_smallest_unit": 2000,
    "isFixed": true,
    "flag": "🇧🇾",
    "usdRef": "(~30%)"
  },
  "BE": {
    "name": "Belgium",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇧🇪",
    "usdRef": "(~PPP)"
  },
  "BZ": {
    "name": "Belize",
    "currency": "BZD",
    "symbol": "BZ$",
    "base": 30,
    "dodo_smallest_unit": 3000,
    "isFixed": true,
    "flag": "🇧🇿",
    "usdRef": "(~PPP)"
  },
  "BJ": {
    "name": "Benin",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇧🇯",
    "usdRef": "(~PPP)"
  },
  "BM": {
    "name": "Bermuda",
    "currency": "BMD",
    "symbol": "$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇧🇲",
    "usdRef": "(~PPP)"
  },
  "BT": {
    "name": "Bhutan",
    "currency": "BTN",
    "symbol": "Nu.",
    "base": 700,
    "dodo_smallest_unit": 70000,
    "isFixed": true,
    "flag": "🇧🇹",
    "usdRef": "(~30%)"
  },
  "BO": {
    "name": "Bolivia",
    "currency": "BOB",
    "symbol": "Bs.",
    "base": 100,
    "dodo_smallest_unit": 10000,
    "isFixed": true,
    "flag": "🇧🇴",
    "usdRef": "(~PPP)"
  },
  "BA": {
    "name": "Bosnia and Herzegovina",
    "currency": "BAM",
    "symbol": "KM",
    "base": 15,
    "dodo_smallest_unit": 1500,
    "isFixed": true,
    "flag": "🇧🇦",
    "usdRef": "(~PPP)"
  },
  "BW": {
    "name": "Botswana",
    "currency": "BWP",
    "symbol": "P",
    "base": 100,
    "dodo_smallest_unit": 10000,
    "isFixed": true,
    "flag": "🇧🇼",
    "usdRef": "(~PPP)"
  },
  "BR": {
    "name": "Brazil",
    "currency": "BRL",
    "symbol": "R$",
    "base": 60,
    "dodo_smallest_unit": 6000,
    "isFixed": true,
    "flag": "🇧🇷",
    "usdRef": "(~PPP)"
  },
  "VG": {
    "name": "British Virgin Islands",
    "currency": "USD",
    "symbol": "$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇻🇬",
    "usdRef": ""
  },
  "BN": {
    "name": "Brunei",
    "currency": "BND",
    "symbol": "B$",
    "base": 11,
    "dodo_smallest_unit": 1100,
    "isFixed": true,
    "flag": "🇧🇳",
    "usdRef": "(~PPP)"
  },
  "BG": {
    "name": "Bulgaria",
    "currency": "BGN",
    "symbol": "лв",
    "base": 35,
    "dodo_smallest_unit": 3500,
    "isFixed": true,
    "flag": "🇧🇬",
    "usdRef": "(~PPP)"
  },
  "BF": {
    "name": "Burkina Faso",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇧🇫",
    "usdRef": "(~PPP)"
  },
  "BI": {
    "name": "Burundi",
    "currency": "BIF",
    "symbol": "FBu",
    "base": 22500,
    "dodo_smallest_unit": 22500,
    "isFixed": true,
    "flag": "🇧🇮",
    "usdRef": "(~30%)"
  },
  "KH": {
    "name": "Cambodia",
    "currency": "KHR",
    "symbol": "៛",
    "base": 35000,
    "dodo_smallest_unit": 3500000,
    "isFixed": true,
    "flag": "🇰🇭",
    "usdRef": "(~PPP)"
  },
  "CM": {
    "name": "Cameroon",
    "currency": "XAF",
    "symbol": "FCFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇨🇲",
    "usdRef": "(~PPP)"
  },
  "CA": {
    "name": "Canada",
    "currency": "CAD",
    "symbol": "CA$",
    "base": 30,
    "dodo_smallest_unit": 3000,
    "isFixed": true,
    "flag": "🇨🇦",
    "usdRef": "(~PPP)"
  },
  "CV": {
    "name": "Cape Verde",
    "currency": "CVE",
    "symbol": "Esc",
    "base": 1100,
    "dodo_smallest_unit": 110000,
    "isFixed": true,
    "flag": "🇨🇻",
    "usdRef": "(~PPP)"
  },
  "KY": {
    "name": "Cayman Islands",
    "currency": "KYD",
    "symbol": "CI$",
    "base": 20,
    "dodo_smallest_unit": 2000,
    "isFixed": true,
    "flag": "🇰🇾",
    "usdRef": "(~PPP)"
  },
  "CF": {
    "name": "Central African Republic",
    "currency": "XAF",
    "symbol": "FCFA",
    "base": 5900,
    "dodo_smallest_unit": 5900,
    "isFixed": true,
    "flag": "🇨🇫",
    "usdRef": "(~40%)"
  },
  "TD": {
    "name": "Chad",
    "currency": "XAF",
    "symbol": "FCFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇹🇩",
    "usdRef": "(~PPP)"
  },
  "CL": {
    "name": "Chile",
    "currency": "CLP",
    "symbol": "$",
    "base": 11000,
    "dodo_smallest_unit": 11000,
    "isFixed": true,
    "flag": "🇨🇱",
    "usdRef": "(~PPP)"
  },
  "CN": {
    "name": "China",
    "currency": "CNY",
    "symbol": "¥",
    "base": 85,
    "dodo_smallest_unit": 8500,
    "isFixed": true,
    "flag": "🇨🇳",
    "usdRef": "(~PPP)"
  },
  "CO": {
    "name": "Colombia",
    "currency": "COP",
    "symbol": "$",
    "base": 28000,
    "dodo_smallest_unit": 2800000,
    "isFixed": true,
    "flag": "🇨🇴",
    "usdRef": "(~PPP)"
  },
  "KM": {
    "name": "Comoros",
    "currency": "KMF",
    "symbol": "CF",
    "base": 4900,
    "dodo_smallest_unit": 4900,
    "isFixed": true,
    "flag": "🇰🇲",
    "usdRef": "(~PPP)"
  },
  "CD": {
    "name": "Congo [DRC]",
    "currency": "CDF",
    "symbol": "FC",
    "base": 22600,
    "dodo_smallest_unit": 2260000,
    "isFixed": true,
    "flag": "🇨🇩",
    "usdRef": "(~40%)"
  },
  "CG": {
    "name": "Congo [Republic]",
    "currency": "XAF",
    "symbol": "FCFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇨🇬",
    "usdRef": "(~PPP)"
  },
  "CK": {
    "name": "Cook Islands",
    "currency": "NZD",
    "symbol": "NZ$",
    "base": 39,
    "dodo_smallest_unit": 3900,
    "isFixed": true,
    "flag": "🇨🇰",
    "usdRef": "(~PPP)"
  },
  "CR": {
    "name": "Costa Rica",
    "currency": "CRC",
    "symbol": "₡",
    "base": 6800,
    "dodo_smallest_unit": 680000,
    "isFixed": true,
    "flag": "🇨🇷",
    "usdRef": "(~PPP)"
  },
  "CI": {
    "name": "Côte d'Ivoire",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇨🇮",
    "usdRef": "(~PPP)"
  },
  "HR": {
    "name": "Croatia",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇭🇷",
    "usdRef": "(~PPP)"
  },
  "CU": {
    "name": "Cuba",
    "currency": "CUP",
    "symbol": "$",
    "base": 600,
    "dodo_smallest_unit": 60000,
    "isFixed": true,
    "flag": "🇨🇺",
    "usdRef": "(~PPP)"
  },
  "CW": {
    "name": "Curaçao",
    "currency": "ANG",
    "symbol": "ƒ",
    "base": 30,
    "dodo_smallest_unit": 3000,
    "isFixed": true,
    "flag": "🇨🇼",
    "usdRef": "(~PPP)"
  },
  "CY": {
    "name": "Cyprus",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇨🇾",
    "usdRef": "(~PPP)"
  },
  "CZ": {
    "name": "Czech Republic",
    "currency": "CZK",
    "symbol": "Kč",
    "base": 300,
    "dodo_smallest_unit": 30000,
    "isFixed": true,
    "flag": "🇨🇿",
    "usdRef": "(~PPP)"
  },
  "DK": {
    "name": "Denmark",
    "currency": "DKK",
    "symbol": "kr",
    "base": 140,
    "dodo_smallest_unit": 14000,
    "isFixed": true,
    "flag": "🇩🇰",
    "usdRef": "(~PPP)"
  },
  "DJ": {
    "name": "Djibouti",
    "currency": "DJF",
    "symbol": "Fdj",
    "base": 2000,
    "dodo_smallest_unit": 2000,
    "isFixed": true,
    "flag": "🇩🇯",
    "usdRef": "(~PPP)"
  },
  "DM": {
    "name": "Dominica",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 35,
    "dodo_smallest_unit": 3500,
    "isFixed": true,
    "flag": "🇩🇲",
    "usdRef": "(~PPP)"
  },
  "DO": {
    "name": "Dominican Republic",
    "currency": "DOP",
    "symbol": "RD$",
    "base": 600,
    "dodo_smallest_unit": 60000,
    "isFixed": true,
    "flag": "🇩🇴",
    "usdRef": "(~40%)"
  },
  "EC": {
    "name": "Ecuador",
    "currency": "USD",
    "symbol": "$",
    "base": 12,
    "dodo_smallest_unit": 1200,
    "isFixed": true,
    "flag": "🇪🇨",
    "usdRef": ""
  },
  "EG": {
    "name": "Egypt",
    "currency": "EGP",
    "symbol": "E£",
    "base": 410,
    "dodo_smallest_unit": 41000,
    "isFixed": true,
    "flag": "🇪🇬",
    "usdRef": "(~30%)"
  },
  "SV": {
    "name": "El Salvador",
    "currency": "USD",
    "symbol": "$",
    "base": 10,
    "dodo_smallest_unit": 1000,
    "isFixed": true,
    "flag": "🇸🇻",
    "usdRef": ""
  },
  "GQ": {
    "name": "Equatorial Guinea",
    "currency": "XAF",
    "symbol": "FCFA",
    "base": 5900,
    "dodo_smallest_unit": 5900,
    "isFixed": true,
    "flag": "🇬🇶",
    "usdRef": "(~40%)"
  },
  "ER": {
    "name": "Eritrea",
    "currency": "ERN",
    "symbol": "Nfk",
    "base": 370,
    "dodo_smallest_unit": 37000,
    "isFixed": true,
    "flag": "🇪🇷",
    "usdRef": "(~PPP)"
  },
  "EE": {
    "name": "Estonia",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇪🇪",
    "usdRef": "(~PPP)"
  },
  "ET": {
    "name": "Ethiopia",
    "currency": "ETB",
    "symbol": "Br",
    "base": 1400,
    "dodo_smallest_unit": 140000,
    "isFixed": true,
    "flag": "🇪🇹",
    "usdRef": "(~PPP)"
  },
  "FK": {
    "name": "Falkland Islands",
    "currency": "FKP",
    "symbol": "£",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇫🇰",
    "usdRef": "(~PPP)"
  },
  "FO": {
    "name": "Faroe Islands",
    "currency": "DKK",
    "symbol": "kr",
    "base": 140,
    "dodo_smallest_unit": 14000,
    "isFixed": true,
    "flag": "🇫🇴",
    "usdRef": "(~PPP)"
  },
  "FJ": {
    "name": "Fiji",
    "currency": "FJD",
    "symbol": "FJ$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇫🇯",
    "usdRef": "(~40%)"
  },
  "FI": {
    "name": "Finland",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇫🇮",
    "usdRef": "(~PPP)"
  },
  "FR": {
    "name": "France",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇫🇷",
    "usdRef": "(~PPP)"
  },
  "GF": {
    "name": "French Guiana",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇬🇫",
    "usdRef": "(~PPP)"
  },
  "PF": {
    "name": "French Polynesia",
    "currency": "XPF",
    "symbol": "₣",
    "base": 2600,
    "dodo_smallest_unit": 2600,
    "isFixed": true,
    "flag": "🇵🇫",
    "usdRef": "(~PPP)"
  },
  "GA": {
    "name": "Gabon",
    "currency": "XAF",
    "symbol": "FCFA",
    "base": 5900,
    "dodo_smallest_unit": 5900,
    "isFixed": true,
    "flag": "🇬🇦",
    "usdRef": "(~40%)"
  },
  "GM": {
    "name": "Gambia",
    "currency": "GMD",
    "symbol": "D",
    "base": 550,
    "dodo_smallest_unit": 55000,
    "isFixed": true,
    "flag": "🇬🇲",
    "usdRef": "(~30%)"
  },
  "GE": {
    "name": "Georgia",
    "currency": "GEL",
    "symbol": "₾",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇬🇪",
    "usdRef": "(~PPP)"
  },
  "DE": {
    "name": "Germany",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇩🇪",
    "usdRef": "(~PPP)"
  },
  "GH": {
    "name": "Ghana",
    "currency": "GHS",
    "symbol": "GH₵",
    "base": 90,
    "dodo_smallest_unit": 9000,
    "isFixed": true,
    "flag": "🇬🇭",
    "usdRef": "(~30%)"
  },
  "GI": {
    "name": "Gibraltar",
    "currency": "GIP",
    "symbol": "£",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇬🇮",
    "usdRef": "(~PPP)"
  },
  "GR": {
    "name": "Greece",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇬🇷",
    "usdRef": "(~PPP)"
  },
  "GL": {
    "name": "Greenland",
    "currency": "DKK",
    "symbol": "kr",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇬🇱",
    "usdRef": "(~PPP)"
  },
  "GD": {
    "name": "Grenada",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 40,
    "dodo_smallest_unit": 4000,
    "isFixed": true,
    "flag": "🇬🇩",
    "usdRef": "(~PPP)"
  },
  "GP": {
    "name": "Guadeloupe",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇬🇵",
    "usdRef": "(~PPP)"
  },
  "GU": {
    "name": "Guam",
    "currency": "USD",
    "symbol": "$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇬🇺",
    "usdRef": ""
  },
  "GT": {
    "name": "Guatemala",
    "currency": "GTQ",
    "symbol": "Q",
    "base": 85,
    "dodo_smallest_unit": 8500,
    "isFixed": true,
    "flag": "🇬🇹",
    "usdRef": "(~PPP)"
  },
  "GG": {
    "name": "Guernsey",
    "currency": "GBP",
    "symbol": "£",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇬🇬",
    "usdRef": "(~PPP)"
  },
  "GN": {
    "name": "Guinea",
    "currency": "GNF",
    "symbol": "FG",
    "base": 77400,
    "dodo_smallest_unit": 77400,
    "isFixed": true,
    "flag": "🇬🇳",
    "usdRef": "(~PPP)"
  },
  "GW": {
    "name": "Guinea-Bissau",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 4400,
    "dodo_smallest_unit": 4400,
    "isFixed": true,
    "flag": "🇬🇼",
    "usdRef": "(~30%)"
  },
  "GY": {
    "name": "Guyana",
    "currency": "GYD",
    "symbol": "G$",
    "base": 1800,
    "dodo_smallest_unit": 180000,
    "isFixed": true,
    "flag": "🇬🇾",
    "usdRef": "(~PPP)"
  },
  "HT": {
    "name": "Haiti",
    "currency": "HTG",
    "symbol": "G",
    "base": 2100,
    "dodo_smallest_unit": 210000,
    "isFixed": true,
    "flag": "🇭🇹",
    "usdRef": "(~PPP)"
  },
  "HN": {
    "name": "Honduras",
    "currency": "HNL",
    "symbol": "L",
    "base": 300,
    "dodo_smallest_unit": 30000,
    "isFixed": true,
    "flag": "🇭🇳",
    "usdRef": "(~PPP)"
  },
  "HK": {
    "name": "Hong Kong",
    "currency": "HKD",
    "symbol": "HK$",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇭🇰",
    "usdRef": "(~PPP)"
  },
  "HU": {
    "name": "Hungary",
    "currency": "HUF",
    "symbol": "Ft",
    "base": 4000,
    "dodo_smallest_unit": 400000,
    "isFixed": true,
    "flag": "🇭🇺",
    "usdRef": "(~PPP)"
  },
  "IS": {
    "name": "Iceland",
    "currency": "ISK",
    "symbol": "kr",
    "base": 3000,
    "dodo_smallest_unit": 3000,
    "isFixed": true,
    "flag": "🇮🇸",
    "usdRef": "(~PPP)"
  },
  "IN": {
    "name": "India",
    "currency": "INR",
    "symbol": "₹",
    "base": 400,
    "dodo_smallest_unit": 40000,
    "isFixed": true,
    "flag": "🇮🇳",
    "usdRef": "(~PPP)"
  },
  "ID": {
    "name": "Indonesia",
    "currency": "IDR",
    "symbol": "Rp",
    "base": 140000,
    "dodo_smallest_unit": 14000000,
    "isFixed": true,
    "flag": "🇮🇩",
    "usdRef": "(~PPP)"
  },
  "IR": {
    "name": "Iran",
    "currency": "IRR",
    "symbol": "﷼",
    "base": 12463900,
    "dodo_smallest_unit": 1246390000,
    "isFixed": true,
    "flag": "🇮🇷",
    "usdRef": "(~30%)"
  },
  "IQ": {
    "name": "Iraq",
    "currency": "IQD",
    "symbol": "ع.د",
    "base": 15200,
    "dodo_smallest_unit": 15200000,
    "isFixed": true,
    "flag": "🇮🇶",
    "usdRef": "(~40%)"
  },
  "IE": {
    "name": "Ireland",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇮🇪",
    "usdRef": "(~PPP)"
  },
  "IM": {
    "name": "Isle of Man",
    "currency": "GBP",
    "symbol": "£",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇮🇲",
    "usdRef": "(~PPP)"
  },
  "IL": {
    "name": "Israel",
    "currency": "ILS",
    "symbol": "₪",
    "base": 75,
    "dodo_smallest_unit": 7500,
    "isFixed": true,
    "flag": "🇮🇱",
    "usdRef": "(~PPP)"
  },
  "IT": {
    "name": "Italy",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇮🇹",
    "usdRef": "(~PPP)"
  },
  "JM": {
    "name": "Jamaica",
    "currency": "JMD",
    "symbol": "J$",
    "base": 2400,
    "dodo_smallest_unit": 240000,
    "isFixed": true,
    "flag": "🇯🇲",
    "usdRef": "(~PPP)"
  },
  "JP": {
    "name": "Japan",
    "currency": "JPY",
    "symbol": "¥",
    "base": 2500,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇯🇵",
    "usdRef": "(~PPP)"
  },
  "JE": {
    "name": "Jersey",
    "currency": "GBP",
    "symbol": "£",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇯🇪",
    "usdRef": "(~PPP)"
  },
  "JO": {
    "name": "Jordan",
    "currency": "JOD",
    "symbol": "JD",
    "base": 8,
    "dodo_smallest_unit": 8000,
    "isFixed": true,
    "flag": "🇯🇴",
    "usdRef": "(~PPP)"
  },
  "KZ": {
    "name": "Kazakhstan",
    "currency": "KZT",
    "symbol": "₸",
    "base": 3900,
    "dodo_smallest_unit": 390000,
    "isFixed": true,
    "flag": "🇰🇿",
    "usdRef": "(~PPP)"
  },
  "KE": {
    "name": "Kenya",
    "currency": "KES",
    "symbol": "KSh",
    "base": 950,
    "dodo_smallest_unit": 95000,
    "isFixed": true,
    "flag": "🇰🇪",
    "usdRef": "(~30%)"
  },
  "KI": {
    "name": "Kiribati",
    "currency": "AUD",
    "symbol": "A$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇰🇮",
    "usdRef": "(~PPP)"
  },
  "XK": {
    "name": "Kosovo",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇽🇰",
    "usdRef": "(~PPP)"
  },
  "KW": {
    "name": "Kuwait",
    "currency": "KWD",
    "symbol": "KD",
    "base": 6,
    "dodo_smallest_unit": 6000,
    "isFixed": true,
    "flag": "🇰🇼",
    "usdRef": "(~PPP)"
  },
  "KG": {
    "name": "Kyrgyzstan",
    "currency": "KGS",
    "symbol": "с",
    "base": 650,
    "dodo_smallest_unit": 65000,
    "isFixed": true,
    "flag": "🇰🇬",
    "usdRef": "(~30%)"
  },
  "LA": {
    "name": "Laos",
    "currency": "LAK",
    "symbol": "₭",
    "base": 168000,
    "dodo_smallest_unit": 16800000,
    "isFixed": true,
    "flag": "🇱🇦",
    "usdRef": "(~30%)"
  },
  "LV": {
    "name": "Latvia",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇱🇻",
    "usdRef": "(~PPP)"
  },
  "LB": {
    "name": "Lebanon",
    "currency": "LBP",
    "symbol": "ل.ل",
    "base": 895000,
    "dodo_smallest_unit": 89500000,
    "isFixed": true,
    "flag": "🇱🇧",
    "usdRef": "(~40%)"
  },
  "LS": {
    "name": "Lesotho",
    "currency": "LSL",
    "symbol": "M",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇱🇸",
    "usdRef": "(~PPP)"
  },
  "LR": {
    "name": "Liberia",
    "currency": "LRD",
    "symbol": "L$",
    "base": 1900,
    "dodo_smallest_unit": 190000,
    "isFixed": true,
    "flag": "🇱🇷",
    "usdRef": "(~PPP)"
  },
  "LY": {
    "name": "Libya",
    "currency": "LYD",
    "symbol": "LD",
    "base": 70,
    "dodo_smallest_unit": 70000,
    "isFixed": true,
    "flag": "🇱🇾",
    "usdRef": "(~PPP)"
  },
  "LI": {
    "name": "Liechtenstein",
    "currency": "CHF",
    "symbol": "CHF",
    "base": 20,
    "dodo_smallest_unit": 2000,
    "isFixed": true,
    "flag": "🇱🇮",
    "usdRef": "(~PPP)"
  },
  "LT": {
    "name": "Lithuania",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇱🇹",
    "usdRef": "(~PPP)"
  },
  "LU": {
    "name": "Luxembourg",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇱🇺",
    "usdRef": "(~PPP)"
  },
  "MO": {
    "name": "Macau",
    "currency": "MOP",
    "symbol": "MOP$",
    "base": 100,
    "dodo_smallest_unit": 10000,
    "isFixed": true,
    "flag": "🇲🇴",
    "usdRef": "(~PPP)"
  },
  "MK": {
    "name": "Macedonia [FYROM]",
    "currency": "MKD",
    "symbol": "ден",
    "base": 500,
    "dodo_smallest_unit": 50000,
    "isFixed": true,
    "flag": "🇲🇰",
    "usdRef": "(~PPP)"
  },
  "MG": {
    "name": "Madagascar",
    "currency": "MGA",
    "symbol": "Ar",
    "base": 34300,
    "dodo_smallest_unit": 34300,
    "isFixed": true,
    "flag": "🇲🇬",
    "usdRef": "(~30%)"
  },
  "MW": {
    "name": "Malawi",
    "currency": "MWK",
    "symbol": "MK",
    "base": 13100,
    "dodo_smallest_unit": 1310000,
    "isFixed": true,
    "flag": "🇲🇼",
    "usdRef": "(~30%)"
  },
  "MY": {
    "name": "Malaysia",
    "currency": "MYR",
    "symbol": "RM",
    "base": 30,
    "dodo_smallest_unit": 3000,
    "isFixed": true,
    "flag": "🇲🇾",
    "usdRef": "(~30%)"
  },
  "MV": {
    "name": "Maldives",
    "currency": "MVR",
    "symbol": "Rf",
    "base": 200,
    "dodo_smallest_unit": 20000,
    "isFixed": true,
    "flag": "🇲🇻",
    "usdRef": "(~PPP)"
  },
  "ML": {
    "name": "Mali",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇲🇱",
    "usdRef": "(~PPP)"
  },
  "MT": {
    "name": "Malta",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇲🇹",
    "usdRef": "(~PPP)"
  },
  "MH": {
    "name": "Marshall Islands",
    "currency": "USD",
    "symbol": "$",
    "base": 24,
    "dodo_smallest_unit": 2400,
    "isFixed": true,
    "flag": "🇲🇭",
    "usdRef": ""
  },
  "MQ": {
    "name": "Martinique",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇲🇶",
    "usdRef": "(~PPP)"
  },
  "MR": {
    "name": "Mauritania",
    "currency": "MRU",
    "symbol": "UM",
    "base": 300,
    "dodo_smallest_unit": 30000,
    "isFixed": true,
    "flag": "🇲🇷",
    "usdRef": "(~30%)"
  },
  "MU": {
    "name": "Mauritius",
    "currency": "MUR",
    "symbol": "₨",
    "base": 450,
    "dodo_smallest_unit": 45000,
    "isFixed": true,
    "flag": "🇲🇺",
    "usdRef": "(~40%)"
  },
  "YT": {
    "name": "Mayotte",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇾🇹",
    "usdRef": "(~PPP)"
  },
  "MX": {
    "name": "Mexico",
    "currency": "MXN",
    "symbol": "MX$",
    "base": 250,
    "dodo_smallest_unit": 25000,
    "isFixed": true,
    "flag": "🇲🇽",
    "usdRef": "(~PPP)"
  },
  "FM": {
    "name": "Micronesia",
    "currency": "USD",
    "symbol": "$",
    "base": 24,
    "dodo_smallest_unit": 2400,
    "isFixed": true,
    "flag": "🇫🇲",
    "usdRef": ""
  },
  "MD": {
    "name": "Moldova",
    "currency": "MDL",
    "symbol": "L",
    "base": 200,
    "dodo_smallest_unit": 20000,
    "isFixed": true,
    "flag": "🇲🇩",
    "usdRef": "(~40%)"
  },
  "MC": {
    "name": "Monaco",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇲🇨",
    "usdRef": "(~PPP)"
  },
  "MN": {
    "name": "Mongolia",
    "currency": "MNT",
    "symbol": "₮",
    "base": 31700,
    "dodo_smallest_unit": 3170000,
    "isFixed": true,
    "flag": "🇲🇳",
    "usdRef": "(~PPP)"
  },
  "ME": {
    "name": "Montenegro",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇲🇪",
    "usdRef": "(~PPP)"
  },
  "MS": {
    "name": "Montserrat",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 45,
    "dodo_smallest_unit": 4500,
    "isFixed": true,
    "flag": "🇲🇸",
    "usdRef": "(~PPP)"
  },
  "MA": {
    "name": "Morocco",
    "currency": "MAD",
    "symbol": "DH",
    "base": 100,
    "dodo_smallest_unit": 10000,
    "isFixed": true,
    "flag": "🇲🇦",
    "usdRef": "(~40%)"
  },
  "MZ": {
    "name": "Mozambique",
    "currency": "MZN",
    "symbol": "MT",
    "base": 650,
    "dodo_smallest_unit": 65000,
    "isFixed": true,
    "flag": "🇲🇿",
    "usdRef": "(~40%)"
  },
  "MM": {
    "name": "Myanmar [Burma]",
    "currency": "MMK",
    "symbol": "K",
    "base": 15700,
    "dodo_smallest_unit": 1570000,
    "isFixed": true,
    "flag": "🇲🇲",
    "usdRef": "(~30%)"
  },
  "NA": {
    "name": "Namibia",
    "currency": "NAD",
    "symbol": "N$",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇳🇦",
    "usdRef": "(~40%)"
  },
  "NR": {
    "name": "Nauru",
    "currency": "AUD",
    "symbol": "A$",
    "base": 36,
    "dodo_smallest_unit": 3600,
    "isFixed": true,
    "flag": "🇳🇷",
    "usdRef": "(~PPP)"
  },
  "NP": {
    "name": "Nepal",
    "currency": "NPR",
    "symbol": "रू",
    "base": 1100,
    "dodo_smallest_unit": 110000,
    "isFixed": true,
    "flag": "🇳🇵",
    "usdRef": "(~30%)"
  },
  "NL": {
    "name": "Netherlands",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇳🇱",
    "usdRef": "(~PPP)"
  },
  "NC": {
    "name": "New Caledonia",
    "currency": "XPF",
    "symbol": "₣",
    "base": 2600,
    "dodo_smallest_unit": 2600,
    "isFixed": true,
    "flag": "🇳🇨",
    "usdRef": "(~PPP)"
  },
  "NZ": {
    "name": "New Zealand",
    "currency": "NZD",
    "symbol": "NZ$",
    "base": 39,
    "dodo_smallest_unit": 3900,
    "isFixed": true,
    "flag": "🇳🇿",
    "usdRef": "(~PPP)"
  },
  "NI": {
    "name": "Nicaragua",
    "currency": "NIO",
    "symbol": "C$",
    "base": 300,
    "dodo_smallest_unit": 30000,
    "isFixed": true,
    "flag": "🇳🇮",
    "usdRef": "(~PPP)"
  },
  "NE": {
    "name": "Niger",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇳🇪",
    "usdRef": "(~PPP)"
  },
  "NG": {
    "name": "Nigeria",
    "currency": "NGN",
    "symbol": "₦",
    "base": 10000,
    "dodo_smallest_unit": 1000000,
    "isFixed": true,
    "flag": "🇳🇬",
    "usdRef": "(~PPP)"
  },
  "KP": {
    "name": "North Korea",
    "currency": "KPW",
    "symbol": "₩",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇰🇵",
    "usdRef": "(~PPP)"
  },
  "MP": {
    "name": "Northern Mariana Islands",
    "currency": "USD",
    "symbol": "$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇲🇵",
    "usdRef": ""
  },
  "NO": {
    "name": "Norway",
    "currency": "NOK",
    "symbol": "kr",
    "base": 190,
    "dodo_smallest_unit": 19000,
    "isFixed": true,
    "flag": "🇳🇴",
    "usdRef": "(~PPP)"
  },
  "OM": {
    "name": "Oman",
    "currency": "OMR",
    "symbol": "RO",
    "base": 8,
    "dodo_smallest_unit": 8000,
    "isFixed": true,
    "flag": "🇴🇲",
    "usdRef": "(~PPP)"
  },
  "PK": {
    "name": "Pakistan",
    "currency": "PKR",
    "symbol": "₨",
    "base": 2000,
    "dodo_smallest_unit": 200000,
    "isFixed": true,
    "flag": "🇵🇰",
    "usdRef": "(~PPP)"
  },
  "PW": {
    "name": "Palau",
    "currency": "USD",
    "symbol": "$",
    "base": 22,
    "dodo_smallest_unit": 2200,
    "isFixed": true,
    "flag": "🇵🇼",
    "usdRef": ""
  },
  "PS": {
    "name": "Palestinian Territories",
    "currency": "ILS",
    "symbol": "₪",
    "base": 50,
    "dodo_smallest_unit": 5000,
    "isFixed": true,
    "flag": "🇵🇸",
    "usdRef": "(~PPP)"
  },
  "PA": {
    "name": "Panama",
    "currency": "USD",
    "symbol": "$",
    "base": 12,
    "dodo_smallest_unit": 1200,
    "isFixed": true,
    "flag": "🇵🇦",
    "usdRef": ""
  },
  "PG": {
    "name": "Papua New Guinea",
    "currency": "PGK",
    "symbol": "K",
    "base": 70,
    "dodo_smallest_unit": 7000,
    "isFixed": true,
    "flag": "🇵🇬",
    "usdRef": "(~PPP)"
  },
  "PY": {
    "name": "Paraguay",
    "currency": "PYG",
    "symbol": "₲",
    "base": 55000,
    "dodo_smallest_unit": 55000,
    "isFixed": true,
    "flag": "🇵🇾",
    "usdRef": "(~PPP)"
  },
  "PE": {
    "name": "Peru",
    "currency": "PEN",
    "symbol": "S/.",
    "base": 45,
    "dodo_smallest_unit": 4500,
    "isFixed": true,
    "flag": "🇵🇪",
    "usdRef": "(~PPP)"
  },
  "PH": {
    "name": "Philippines",
    "currency": "PHP",
    "symbol": "₱",
    "base": 500,
    "dodo_smallest_unit": 50000,
    "isFixed": true,
    "flag": "🇵🇭",
    "usdRef": "(~PPP)"
  },
  "PL": {
    "name": "Poland",
    "currency": "PLN",
    "symbol": "zł",
    "base": 50,
    "dodo_smallest_unit": 5000,
    "isFixed": true,
    "flag": "🇵🇱",
    "usdRef": "(~PPP)"
  },
  "PT": {
    "name": "Portugal",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇵🇹",
    "usdRef": "(~PPP)"
  },
  "PR": {
    "name": "Puerto Rico",
    "currency": "USD",
    "symbol": "$",
    "base": 20,
    "dodo_smallest_unit": 2000,
    "isFixed": true,
    "flag": "🇵🇷",
    "usdRef": ""
  },
  "QA": {
    "name": "Qatar",
    "currency": "QAR",
    "symbol": "QR",
    "base": 75,
    "dodo_smallest_unit": 7500,
    "isFixed": true,
    "flag": "🇶🇦",
    "usdRef": "(~PPP)"
  },
  "RE": {
    "name": "Réunion",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇷🇪",
    "usdRef": "(~PPP)"
  },
  "RO": {
    "name": "Romania",
    "currency": "RON",
    "symbol": "lei",
    "base": 50,
    "dodo_smallest_unit": 5000,
    "isFixed": true,
    "flag": "🇷🇴",
    "usdRef": "(~40%)"
  },
  "RU": {
    "name": "Russia",
    "currency": "RUB",
    "symbol": "₽",
    "base": 600,
    "dodo_smallest_unit": 60000,
    "isFixed": true,
    "flag": "🇷🇺",
    "usdRef": "(~30%)"
  },
  "RW": {
    "name": "Rwanda",
    "currency": "RWF",
    "symbol": "FRw",
    "base": 11100,
    "dodo_smallest_unit": 11100,
    "isFixed": true,
    "flag": "🇷🇼",
    "usdRef": "(~30%)"
  },
  "KN": {
    "name": "Saint Kitts and Nevis",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 45,
    "dodo_smallest_unit": 4500,
    "isFixed": true,
    "flag": "🇰🇳",
    "usdRef": "(~PPP)"
  },
  "LC": {
    "name": "Saint Lucia",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 35,
    "dodo_smallest_unit": 3500,
    "isFixed": true,
    "flag": "🇱🇨",
    "usdRef": "(~PPP)"
  },
  "MF": {
    "name": "Saint Martin",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇲🇫",
    "usdRef": "(~PPP)"
  },
  "VC": {
    "name": "Saint Vincent and the Grenadines",
    "currency": "XCD",
    "symbol": "EC$",
    "base": 35,
    "dodo_smallest_unit": 3500,
    "isFixed": true,
    "flag": "🇻🇨",
    "usdRef": "(~PPP)"
  },
  "WS": {
    "name": "Samoa",
    "currency": "WST",
    "symbol": "WS$",
    "base": 40,
    "dodo_smallest_unit": 4000,
    "isFixed": true,
    "flag": "🇼🇸",
    "usdRef": "(~PPP)"
  },
  "SM": {
    "name": "San Marino",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇸🇲",
    "usdRef": "(~PPP)"
  },
  "ST": {
    "name": "São Tomé and Príncipe",
    "currency": "STN",
    "symbol": "Db",
    "base": 300,
    "dodo_smallest_unit": 30000,
    "isFixed": true,
    "flag": "🇸🇹",
    "usdRef": "(~PPP)"
  },
  "SA": {
    "name": "Saudi Arabia",
    "currency": "SAR",
    "symbol": "SR",
    "base": 75,
    "dodo_smallest_unit": 7500,
    "isFixed": true,
    "flag": "🇸🇦",
    "usdRef": "(~PPP)"
  },
  "SN": {
    "name": "Senegal",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇸🇳",
    "usdRef": "(~PPP)"
  },
  "RS": {
    "name": "Serbia",
    "currency": "RSD",
    "symbol": "дин.",
    "base": 1100,
    "dodo_smallest_unit": 110000,
    "isFixed": true,
    "flag": "🇷🇸",
    "usdRef": "(~40%)"
  },
  "SC": {
    "name": "Seychelles",
    "currency": "SCR",
    "symbol": "SR",
    "base": 200,
    "dodo_smallest_unit": 20000,
    "isFixed": true,
    "flag": "🇸🇨",
    "usdRef": "(~PPP)"
  },
  "SL": {
    "name": "Sierra Leone",
    "currency": "SLE",
    "symbol": "Le",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇸🇱",
    "usdRef": "(~30%)"
  },
  "SG": {
    "name": "Singapore",
    "currency": "SGD",
    "symbol": "S$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇸🇬",
    "usdRef": "(~PPP)"
  },
  "SX": {
    "name": "Sint Maarten",
    "currency": "ANG",
    "symbol": "ƒ",
    "base": 35,
    "dodo_smallest_unit": 3500,
    "isFixed": true,
    "flag": "🇸🇽",
    "usdRef": "(~PPP)"
  },
  "SK": {
    "name": "Slovakia",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇸🇰",
    "usdRef": "(~PPP)"
  },
  "SI": {
    "name": "Slovenia",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇸🇮",
    "usdRef": "(~PPP)"
  },
  "SB": {
    "name": "Solomon Islands",
    "currency": "SBD",
    "symbol": "SI$",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇸🇧",
    "usdRef": "(~PPP)"
  },
  "SO": {
    "name": "Somalia",
    "currency": "SOS",
    "symbol": "Sh.So.",
    "base": 5700,
    "dodo_smallest_unit": 570000,
    "isFixed": true,
    "flag": "🇸🇴",
    "usdRef": "(~40%)"
  },
  "ZA": {
    "name": "South Africa",
    "currency": "ZAR",
    "symbol": "R",
    "base": 160,
    "dodo_smallest_unit": 16000,
    "isFixed": true,
    "flag": "🇿🇦",
    "usdRef": "(~40%)"
  },
  "KR": {
    "name": "South Korea",
    "currency": "KRW",
    "symbol": "₩",
    "base": 20000,
    "dodo_smallest_unit": 20000,
    "isFixed": true,
    "flag": "🇰🇷",
    "usdRef": "(~PPP)"
  },
  "SS": {
    "name": "South Sudan",
    "currency": "SSP",
    "symbol": "SS£",
    "base": 143800,
    "dodo_smallest_unit": 14380000,
    "isFixed": true,
    "flag": "🇸🇸",
    "usdRef": "(~PPP)"
  },
  "ES": {
    "name": "Spain",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇪🇸",
    "usdRef": "(~PPP)"
  },
  "LK": {
    "name": "Sri Lanka",
    "currency": "LKR",
    "symbol": "Rs",
    "base": 2500,
    "dodo_smallest_unit": 250000,
    "isFixed": true,
    "flag": "🇱🇰",
    "usdRef": "(~30%)"
  },
  "SD": {
    "name": "Sudan",
    "currency": "SDG",
    "symbol": "SDG",
    "base": 5100,
    "dodo_smallest_unit": 510000,
    "isFixed": true,
    "flag": "🇸🇩",
    "usdRef": "(~PPP)"
  },
  "SR": {
    "name": "Suriname",
    "currency": "SRD",
    "symbol": "$",
    "base": 300,
    "dodo_smallest_unit": 30000,
    "isFixed": true,
    "flag": "🇸🇷",
    "usdRef": "(~30%)"
  },
  "SZ": {
    "name": "Swaziland",
    "currency": "SZL",
    "symbol": "E",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇸🇿",
    "usdRef": "(~PPP)"
  },
  "SE": {
    "name": "Sweden",
    "currency": "SEK",
    "symbol": "kr",
    "base": 200,
    "dodo_smallest_unit": 20000,
    "isFixed": true,
    "flag": "🇸🇪",
    "usdRef": "(~PPP)"
  },
  "CH": {
    "name": "Switzerland",
    "currency": "CHF",
    "symbol": "CHF",
    "base": 20,
    "dodo_smallest_unit": 2000,
    "isFixed": true,
    "flag": "🇨🇭",
    "usdRef": "(~PPP)"
  },
  "SY": {
    "name": "Syria",
    "currency": "SYP",
    "symbol": "LS",
    "base": 900,
    "dodo_smallest_unit": 90000,
    "isFixed": true,
    "flag": "🇸🇾",
    "usdRef": "(~PPP)"
  },
  "TW": {
    "name": "Taiwan",
    "currency": "TWD",
    "symbol": "NT$",
    "base": 450,
    "dodo_smallest_unit": 45000,
    "isFixed": true,
    "flag": "🇹🇼",
    "usdRef": "(~PPP)"
  },
  "TJ": {
    "name": "Tajikistan",
    "currency": "TJS",
    "symbol": "SM",
    "base": 70,
    "dodo_smallest_unit": 7000,
    "isFixed": true,
    "flag": "🇹🇯",
    "usdRef": "(~30%)"
  },
  "TZ": {
    "name": "Tanzania",
    "currency": "TZS",
    "symbol": "TSh",
    "base": 20000,
    "dodo_smallest_unit": 2000000,
    "isFixed": true,
    "flag": "🇹🇿",
    "usdRef": "(~30%)"
  },
  "TH": {
    "name": "Thailand",
    "currency": "THB",
    "symbol": "฿",
    "base": 250,
    "dodo_smallest_unit": 25000,
    "isFixed": true,
    "flag": "🇹🇭",
    "usdRef": "(~30%)"
  },
  "TL": {
    "name": "Timor-Leste",
    "currency": "USD",
    "symbol": "$",
    "base": 8,
    "dodo_smallest_unit": 800,
    "isFixed": true,
    "flag": "🇹🇱",
    "usdRef": ""
  },
  "TG": {
    "name": "Togo",
    "currency": "XOF",
    "symbol": "CFA",
    "base": 5100,
    "dodo_smallest_unit": 5100,
    "isFixed": true,
    "flag": "🇹🇬",
    "usdRef": "(~PPP)"
  },
  "TO": {
    "name": "Tonga",
    "currency": "TOP",
    "symbol": "T$",
    "base": 45,
    "dodo_smallest_unit": 4500,
    "isFixed": true,
    "flag": "🇹🇴",
    "usdRef": "(~PPP)"
  },
  "TT": {
    "name": "Trinidad and Tobago",
    "currency": "TTD",
    "symbol": "TT$",
    "base": 85,
    "dodo_smallest_unit": 8500,
    "isFixed": true,
    "flag": "🇹🇹",
    "usdRef": "(~PPP)"
  },
  "TN": {
    "name": "Tunisia",
    "currency": "TND",
    "symbol": "DT",
    "base": 20,
    "dodo_smallest_unit": 20000,
    "isFixed": true,
    "flag": "🇹🇳",
    "usdRef": "(~30%)"
  },
  "TR": {
    "name": "Turkey",
    "currency": "TRY",
    "symbol": "₺",
    "base": 440,
    "dodo_smallest_unit": 44000,
    "isFixed": true,
    "flag": "🇹🇷",
    "usdRef": "(~PPP)"
  },
  "TM": {
    "name": "Turkmenistan",
    "currency": "TMT",
    "symbol": "T",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇹🇲",
    "usdRef": "(~30%)"
  },
  "TC": {
    "name": "Turks and Caicos Islands",
    "currency": "USD",
    "symbol": "$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇹🇨",
    "usdRef": ""
  },
  "TV": {
    "name": "Tuvalu",
    "currency": "AUD",
    "symbol": "A$",
    "base": 31,
    "dodo_smallest_unit": 3100,
    "isFixed": true,
    "flag": "🇹🇻",
    "usdRef": "(~PPP)"
  },
  "VI": {
    "name": "U.S. Virgin Islands",
    "currency": "USD",
    "symbol": "$",
    "base": 24,
    "dodo_smallest_unit": 2400,
    "isFixed": true,
    "flag": "🇻🇮",
    "usdRef": ""
  },
  "UG": {
    "name": "Uganda",
    "currency": "UGX",
    "symbol": "USh",
    "base": 35000,
    "dodo_smallest_unit": 35000,
    "isFixed": true,
    "flag": "🇺🇬",
    "usdRef": "(~PPP)"
  },
  "UA": {
    "name": "Ukraine",
    "currency": "UAH",
    "symbol": "₴",
    "base": 350,
    "dodo_smallest_unit": 35000,
    "isFixed": true,
    "flag": "🇺🇦",
    "usdRef": "(~30%)"
  },
  "AE": {
    "name": "United Arab Emirates",
    "currency": "AED",
    "symbol": "AED",
    "base": 80,
    "dodo_smallest_unit": 8000,
    "isFixed": true,
    "flag": "🇦🇪",
    "usdRef": "(~PPP)"
  },
  "GB": {
    "name": "United Kingdom",
    "currency": "GBP",
    "symbol": "£",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇬🇧",
    "usdRef": "(~PPP)"
  },
  "US": {
    "name": "United States",
    "currency": "USD",
    "symbol": "$",
    "base": 25,
    "dodo_smallest_unit": 2500,
    "isFixed": true,
    "flag": "🇺🇸",
    "usdRef": ""
  },
  "UY": {
    "name": "Uruguay",
    "currency": "UYU",
    "symbol": "$U",
    "base": 650,
    "dodo_smallest_unit": 65000,
    "isFixed": true,
    "flag": "🇺🇾",
    "usdRef": "(~PPP)"
  },
  "UZ": {
    "name": "Uzbekistan",
    "currency": "UZS",
    "symbol": "soʻm",
    "base": 90000,
    "dodo_smallest_unit": 9000000,
    "isFixed": true,
    "flag": "🇺🇿",
    "usdRef": "(~30%)"
  },
  "VU": {
    "name": "Vanuatu",
    "currency": "VUV",
    "symbol": "VT",
    "base": 2700,
    "dodo_smallest_unit": 2700,
    "isFixed": true,
    "flag": "🇻🇺",
    "usdRef": "(~PPP)"
  },
  "VA": {
    "name": "Vatican City",
    "currency": "EUR",
    "symbol": "€",
    "base": 18,
    "dodo_smallest_unit": 1800,
    "isFixed": true,
    "flag": "🇻🇦",
    "usdRef": "(~PPP)"
  },
  "VE": {
    "name": "Venezuela",
    "currency": "VES",
    "symbol": "Bs.",
    "base": 22500,
    "dodo_smallest_unit": 2250000,
    "isFixed": true,
    "flag": "🇻🇪",
    "usdRef": "(~PPP)"
  },
  "VN": {
    "name": "Vietnam",
    "currency": "VND",
    "symbol": "₫",
    "base": 190000,
    "dodo_smallest_unit": 190000,
    "isFixed": true,
    "flag": "🇻🇳",
    "usdRef": "(~PPP)"
  },
  "YE": {
    "name": "Yemen",
    "currency": "YER",
    "symbol": "﷼",
    "base": 5900,
    "dodo_smallest_unit": 590000,
    "isFixed": true,
    "flag": "🇾🇪",
    "usdRef": "(~PPP)"
  },
  "ZM": {
    "name": "Zambia",
    "currency": "ZMW",
    "symbol": "ZK",
    "base": 150,
    "dodo_smallest_unit": 15000,
    "isFixed": true,
    "flag": "🇿🇲",
    "usdRef": "(~30%)"
  },
  "ZW": {
    "name": "Zimbabwe",
    "currency": "USD",
    "symbol": "$",
    "base": 10,
    "dodo_smallest_unit": 1000,
    "isFixed": true,
    "flag": "🇿🇼",
    "usdRef": ""
  }
};
});
