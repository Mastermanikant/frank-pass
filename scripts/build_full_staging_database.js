const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'data_staging');

// 1. ECOSYSTEM & SAAS
const ECOSYSTEM = [
    "FrankBase (frankbase.com)",
    "FrankPass (frankpass.com)",
    "FrankBase Store (store.frankbase.com)",
    "FrankBase Digital (digital.frankbase.com)",
    "Master Manikant (mastermanikant.com)",
    "English Vidya (englishvidya.com)",
    "Master Manikant Academy",
    "FrankBase Cloud",
    "FrankBase Auth",
    "FrankBase Pay",
    "FrankBase Vault",
    "FrankBase CDN",
    "FrankBase AI",
    "FrankBase Studio",
    "MM Central Command"
];

const SAAS_PRODUCTIVITY = [
    "Google Workspace", "Google Drive", "Google Docs", "Google Sheets", "Google Slides", "Google Forms", "Google Meet",
    "Google Calendar", "Google Keep", "Google Sites", "Google Groups", "Google Contacts", "Microsoft 365", "Microsoft OneDrive",
    "Microsoft Teams", "Microsoft SharePoint", "Microsoft Outlook", "Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint",
    "Microsoft OneNote", "Microsoft Loop", "Microsoft Whiteboard", "Microsoft Planner", "Microsoft To Do", "Microsoft Forms",
    "Notion", "Notion Calendar", "Slack", "Slack Enterprise Grid", "Zoom Video Communications", "Cisco Webex", "Trello (Atlassian)",
    "Asana", "Monday.com", "ClickUp", "Linear", "Jira (Atlassian)", "Jira Service Management", "Confluence (Atlassian)",
    "Basecamp", "Airtable", "Coda.io", "Smartsheet", "Wrike", "Teamwork.com", "Hive", "Productboard", "Craft.do", "Anytype",
    "Obsidian Sync", "Roam Research", "Logseq", "Figma", "FigJam", "Miro", "Mural", "Canva", "Canva Pro", "Adobe Creative Cloud",
    "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe Premiere Pro", "Adobe After Effects", "Adobe XD",
    "Adobe Lightroom", "Adobe Acrobat Reader", "Adobe Express", "Framer", "Webflow", "Sketch", "InVision", "Marvel App",
    "Zeplin", "Affinity Designer", "Procreate", "WordPress.org", "WordPress.com", "Ghost CMS", "Substack", "Medium", "Beehiiv",
    "Hashnode", "Dev.to", "Typefully", "Buffer", "Hootsuite", "Sprout Social", "Later", "Mailchimp", "ConvertKit (Kit)",
    "Brevo (Sendinblue)", "ActiveCampaign", "Klaviyo", "MailerLite", "Omnisend", "GetResponse", "AWeber", "Constant Contact",
    "SendGrid (Twilio)", "Mailgun (Sinch)", "Postmark", "Resend", "Amazon SES", "HubSpot", "HubSpot CRM", "HubSpot Marketing",
    "Salesforce", "Salesforce Service Cloud", "Salesforce Marketing Cloud", "Salesforce Sales Cloud", "Zoho CRM", "Zoho Books",
    "Zoho Desk", "Zoho Mail", "Zoho Workplace", "Zoho Creator", "Zoho People", "Zoho Invoice", "Freshworks", "Freshdesk",
    "Freshsales", "Freshservice", "Freshchat", "Freshmarketer", "Zendesk", "Zendesk Support", "Zendesk Chat", "Intercom",
    "Crisp Chat", "Help Scout", "Front App", "Gorgias", "Drift", "LiveChat", "Tidio", "Olark", "Kayako", "Groove",
    "Zapier", "Make (Integromat)", "n8n Cloud", "Workato", "Tray.io", "Integrately", "IFTTT", "Calendly", "Cal.com",
    "Acuity Scheduling", "Doodle", "SavvyCal", "Loom (Atlassian)", "Vidyard", "Pitch.com", "Tome", "DocuSign",
    "HelloSign (Dropbox Sign)", "PandaDoc", "Adobe Sign", "SignWell", "SignNow", "Eversign", "Dropbox", "Box.com", "Mega.nz"
];

// Write updated ecosystem_and_saas.json
const ecoCombined = Array.from(new Set([...ECOSYSTEM, ...SAAS_PRODUCTIVITY])).sort();
fs.writeFileSync(path.join(STAGING_DIR, 'ecosystem_and_saas.json'), JSON.stringify(ecoCombined, null, 2), 'utf8');
console.log(`Updated ecosystem_and_saas.json: ${ecoCombined.length} entries`);
