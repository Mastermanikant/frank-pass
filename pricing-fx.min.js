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

  const EU_CODES = ["DE","FR","IT","ES","NL","BE","AT","IE","PT","FI","GR","LU","CY","MT","SK","SI","EE","LV","LT"];

  let coupon20Active = false;
  let currentActiveCountry = null;

  function getActiveCountryCode() {
    if (currentActiveCountry) return currentActiveCountry.toUpperCase();
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
      if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < FX_CACHE_MS)) {
        return parsed.rates;
      }
    } catch (e) {}
    return null;
  }

  function saveCachedFxRates(rates) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        rates: rates
      }));
    } catch (e) {}
  }

  async function fetchFxRates() {
    const cached = getCachedFxRates();
    if (cached) return cached;

    try {
      const res = await fetch(FX_API_URL, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          saveCachedFxRates(data.rates);
          return data.rates;
        }
      }
    } catch (e) {}
    return null;
  }

  const GATEWAY_USD_SETTLED_COUNTRIES = {
    'PK': { usd: 7 },
    'CO': { usd: 9 },
    'AF': { usd: 10 },
    'DZ': { usd: 10 },
    'AO': { usd: 10 },
    'AR': { usd: 15 },
    'BY': { usd: 10 },
    'BT': { usd: 10 },
    'KH': { usd: 10 },
    'CV': { usd: 10 },
    'CD': { usd: 10 },
    'CU': { usd: 10 },
    'ER': { usd: 10 },
    'GH': { usd: 10 },
    'HT': { usd: 10 },
    'IR': { usd: 10 },
    'JM': { usd: 10 },
    'KE': { usd: 10 },
    'KG': { usd: 10 },
    'LA': { usd: 10 },
    'LB': { usd: 10 },
    'MR': { usd: 10 },
    'MD': { usd: 10 },
    'MN': { usd: 10 },
    'MZ': { usd: 10 },
    'MM': { usd: 10 },
    'NA': { usd: 10 },
    'NI': { usd: 10 },
    'KP': { usd: 10 },
    'RU': { usd: 10 },
    'ST': { usd: 10 },
    'SL': { usd: 10 },
    'SO': { usd: 10 },
    'SS': { usd: 8 },
    'SD': { usd: 8 },
    'SR': { usd: 10 },
    'SY': { usd: 8 },
    'TJ': { usd: 10 },
    'TT': { usd: 10 },
    'TM': { usd: 10 },
    'UG': { usd: 10 },
    'UA': { usd: 10 },
    'UZ': { usd: 10 },
    'VE': { usd: 10 },
    'YE': { usd: 10 },
    'AI': { usd: 15 },
    'AG': { usd: 15 },
    'DM': { usd: 15 },
    'GD': { usd: 15 },
    'MS': { usd: 15 },
    'KN': { usd: 15 },
    'LC': { usd: 15 },
    'VC': { usd: 15 },
    'CW': { usd: 18 },
    'SX': { usd: 18 },
    'FK': { usd: 22 },
    'GI': { usd: 22 },
    'BB': { usd: 25 },
    'KY': { usd: 25 },
    'XK': { usd: 18 }
  };

  function calculatePricing(countryCode, fxRates) {
    const code = (countryCode || getActiveCountryCode()).toUpperCase();

    // 0. Gateway USD Settled Country (Has explicit 'i' button and USD settlement)
    if (GATEWAY_USD_SETTLED_COUNTRIES[code] && FIXED_COUNTRIES[code]) {
      const fc = FIXED_COUNTRIES[code];
      const gw = GATEWAY_USD_SETTLED_COUNTRIES[code];
      const base = fc.base;
      return {
        code: code,
        name: fc.name,
        currency: fc.currency,
        symbol: fc.symbol,
        base: base,
        isFixed: false,
        isGatewayUSD: true,
        usdAmount: gw.usd,
        usdRef: '(≈ $' + gw.usd + ' USD)',
        isPPP: fc.ppp,
        formatted: fc.symbol + (Number.isInteger(base) ? base : base.toFixed(2))
      };
    }

    // 1. Fixed PPP country (India, Nepal, Pakistan, Bangladesh, Sri Lanka, UK, EU, etc.)
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
        formatted: fc.symbol + (Number.isInteger(base) ? base : base.toFixed(2)) + (fc.currency === 'USD' ? ' USD' : '')
      };
    }

    // 2. Eurozone Member States (Mapped to EUR fixed PPP)
    if (EU_CODES.includes(code)) {
      const fc = FIXED_COUNTRIES['EU'];
      const cMeta = ALL_COUNTRIES[code] || { name: 'European Union' };
      const base = fc.base;
      return {
        code: code,
        name: cMeta.name,
        currency: fc.currency,
        symbol: fc.symbol,
        base: base,
        isFixed: true,
        isPPP: true,
        usdRef: '',
        formatted: fc.symbol + (Number.isInteger(base) ? base : base.toFixed(2))
      };
    }

    // 3. Dynamic FX Conversion from $25.00 USD global base
    const countryMeta = ALL_COUNTRIES[code] || { name: 'Global', currency: 'USD', symbol: '$' };
    const currency = countryMeta.currency || 'USD';
    const symbol = countryMeta.symbol || '$';
    const rates = fxRates || getCachedFxRates();

    let rate = null;
    if (rates && rates[currency]) {
      rate = rates[currency];
    }

    if (rate && rate > 0) {
      const rawPrice = 25.00 * rate;
      let convertedPrice = Math.round(rawPrice);
      if (rawPrice < 10) {
        convertedPrice = parseFloat(rawPrice.toFixed(2));
      } else if (rawPrice > 1000) {
        convertedPrice = Math.round(rawPrice / 50) * 50;
      } else {
        convertedPrice = Math.round(rawPrice);
      }

      return {
        code: code,
        name: countryMeta.name,
        currency: currency,
        symbol: symbol + ' ',
        base: convertedPrice,
        isFixed: false,
        isPPP: false,
        usdRef: '(~$25.00 USD)',
        formatted: symbol + ' ' + (Number.isInteger(convertedPrice) ? convertedPrice : convertedPrice.toFixed(2))
      };
    }

    // 4. Fallback to Global Standard $25.00 USD
    return {
      code: code,
      name: countryMeta.name,
      currency: 'USD',
      symbol: '$',
      base: 25.00,
      isFixed: false,
      isPPP: false,
      usdRef: '',
      formatted: '$25.00 USD'
    };
  }

  function syncPricingUI(customCode) {
    if (typeof document === 'undefined') return;
    if (customCode && typeof customCode === 'string') {
      currentActiveCountry = customCode.trim().toUpperCase();
    }
    const pricing = calculatePricing(currentActiveCountry);
    currentActiveCountry = pricing.code;
    const code = pricing.code;
    const base = pricing.base;
    const symbol = pricing.symbol;
    const currency = pricing.currency;
    const isFixed = pricing.isFixed;
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

    // 2. Update Solo PPP / FX Badge & Strict Rule for 'i' Button:
    // "fix wala me koi i button nahi and jo 6 hours me update hota hai usme de dena price update in every 6 hours"
    const pppBadge = document.getElementById('solo-ppp-badge');
    const fxNoticeBox = document.getElementById('fx-rate-notice-box');

    if (pppBadge) {
      pppBadge.style.display = 'inline-flex';
      if (isFixed) {
        // FIXED PPP: Strictly ZERO 'i' button!
        pppBadge.innerHTML = isHindi
          ? '✓ गारंटीकृत उचित क्षेत्रीय मूल्य (PPP): ' + pricing.name + ' (' + currency + ')'
          : '✓ Guaranteed Fixed PPP Rate: ' + pricing.name + ' (' + currency + ')';
        pppBadge.style.background = 'rgba(16,185,129,0.12)';
        pppBadge.style.borderColor = 'rgba(16,185,129,0.3)';
        pppBadge.style.color = '#10b981';
        if (fxNoticeBox) fxNoticeBox.style.display = 'none';
      } else {
        // DYNAMIC 6-HOUR FX: Has 'i' button with explicit 6-hour update text!
        pppBadge.innerHTML = isHindi
          ? '⚡ लाइव विनिमय दर: ' + pricing.name + ' (' + currency + ') ' + (pricing.usdRef || '') + ' <button type="button" onclick="FrankPassPricing.toggleFxNoticeModal()" style="background:none;border:none;cursor:pointer;color:inherit;font-weight:800;text-decoration:underline;margin-left:4px;" title="प्रत्येक 6 घंटे में मूल्य अपडेट होता है">ℹ️</button>'
          : '⚡ Live Exchange Rate: ' + pricing.name + ' (' + currency + ') ' + (pricing.usdRef || '') + ' <button type="button" onclick="FrankPassPricing.toggleFxNoticeModal()" style="background:none;border:none;cursor:pointer;color:inherit;font-weight:800;text-decoration:underline;margin-left:4px;" title="Price updates every 6 hours based on live exchange rates">ℹ️</button>';
        pppBadge.style.background = 'rgba(234,179,8,0.12)';
        pppBadge.style.borderColor = 'rgba(234,179,8,0.3)';
        pppBadge.style.color = '#eab308';
        if (fxNoticeBox) {
          fxNoticeBox.innerHTML = isHindi
            ? '<strong>ℹ️ 6-घंटे लाइव विनिमय दर अपडेट:</strong> यह मूल्य वैश्विक मानक $25.00 USD से स्वचालित रूप से कनवर्ट किया गया है और लाइव मुद्रा विनिमय दरों के अनुसार प्रत्येक 6 घंटे में अपडेट होता है।'
            : '<strong>ℹ️ Price updates every 6 hours based on live exchange rates:</strong> This local price is automatically converted from the $25.00 USD global benchmark and updates every 6 hours based on live edge foreign exchange rates.';
        }
      }
    }

    // 3. Update Volume Calculator Card Intro & Scale
    const volIntro = document.getElementById('vol-calc-intro') || document.getElementById('vol-calc-intro-hi');
    if (volIntro) {
      const refStr = pricing.usdRef ? ' ' + pricing.usdRef : '';
      volIntro.innerHTML = isHindi
        ? pricing.name + ' के लिए मानक मूल्य 1-PC लाइफटाइम पास हेतु <strong>' + pricing.formatted + '</strong>' + refStr + ' है। वॉल्यूम छूट और 20% कूपन लागू करने के लिए नीचे वर्कस्टेशन चुनें।'
        : 'Pricing for ' + pricing.name + ' is <strong>' + pricing.formatted + '</strong>' + refStr + ' for a lifetime 1-PC pass. Select your required number of workstations to calculate tiered volume discounts and apply coupon codes.';
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
        } else if (isFixed) {
          // STRICT RULE: FIXED PPP has ZERO 'i' button!
          assuranceEl.innerHTML = isHindi
            ? '✓ Dodo Payments द्वारा ' + pricing.name + ' में गारंटीकृत क्रय शक्ति समता (PPP) दर (' + pricing.formatted + ')'
            : '✓ Dodo Payments securely processes payment in ' + pricing.name + ' with guaranteed fixed PPP rate (' + pricing.formatted + ')';
        } else {
          // Dynamic 6-hour FX has 6-hour update mention
          assuranceEl.innerHTML = isHindi
            ? '✓ Dodo Payments द्वारा ' + currency + ' (प्रत्येक 6 घंटे में लाइव दर अपडेट, ~$25.00 USD बेस) में सुरक्षित कार्ड भुगतान'
            : '✓ Dodo Payments securely converts payment to ' + currency + ' (Price updates every 6 hours based on live exchange rates, ~$25.00 USD base)';
        }
      }
    }

    // 6. Update 50% Replacement Policy Fee
    const replaceFeeEl = document.getElementById('vol-replacement-rate') || document.getElementById('vol-replacement-rate-hi');
    if (replaceFeeEl) {
      const repAmount = Number.isInteger(base) ? Math.round(base * 0.5) : (base * 0.5);
      replaceFeeEl.textContent = symbol + formatNum(repAmount) + ' ' + currency;
    }
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
