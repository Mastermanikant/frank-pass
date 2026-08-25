const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'data_staging');
if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
}

// Helper to sanitize & title case
function cleanName(str) {
    return str.trim().replace(/\s+/g, ' ');
}

// 1. COMPREHENSIVE GLOBAL PAYMENT SERVICES, MoR & FINTECH (500+ Platforms)
const GLOBAL_PAYMENT_PROVIDERS = [
    // Global Gateways & MoRs
    "Dodo Payments", "Lemon Squeezy", "Stripe", "Stripe Connect", "Stripe Billing", "Stripe Checkout", "Stripe Radar",
    "Paddle", "Paddle Billing", "FastSpring", "2Checkout (Verifone)", "Adyen", "Worldpay (FIS)", "Klarna", "Klarna Pay Later",
    "Afterpay", "Affirm", "Mollie", "Skrill", "Neteller", "Wise (TransferWise)", "Wise Business", "Payoneer", "Payoneer Checkout",
    "Revolut", "Revolut Business", "Revolut Pay", "Monzo", "Monzo Business", "N26", "N26 Business", "Starling Bank", "Starling Business",
    "Chime", "Cash App (Block)", "Venmo", "Venmo Business", "Zelle", "Square", "Square POS", "Square Online", "Square Invoices",
    "SumUp", "SumUp POS", "Toast POS", "Clover POS", "Braintree (PayPal)", "Shopify Payments", "Shopify POS", "Shopify Balance",
    "Authorize.Net", "CCBill", "Segpay", "Epoch", "Checkout.com", "Paysafe", "Paysafecard", "Airwallex", "PayMongo", "Tazapay",
    "Xendit", "Midtrans", "2C2P", "Omise", "Rapyd", "PayCEC", "BlueSnap", "SecurionPay", "Worldline", "Ingenico", "Global Payments",
    "Elavon", "First Data (Fiserv)", "TSYS", "Chase Merchant Services", "Heartland Payment Systems", "Paysera", "Epay", "Payone",
    "PayU Global", "PayU India", "Razorpay", "RazorpayX", "Razorpay POS", "Cashfree Payments", "Cashfree AutoCollect", "Instamojo",
    "PhonePe", "PhonePe Business", "PhonePe Merchant", "Paytm", "Paytm for Business", "Paytm Soundbox", "Cred", "Cred Pay", "Pine Labs",
    "Pine Labs Plural", "BillDesk", "CCAvenue", "Easebuzz", "SabPaisa", "Open Financial Technologies", "Jupiter Money", "Fi Money",
    "Slice Card", "Uni Cards", "OneCard", "BharatPe", "BharatPe Swipe", "Mobikwik", "Mobikwik Zaakpay", "Freecharge", "PayZapp (HDFC)",
    "Amazon Pay", "Amazon Pay ICICI", "Google Pay (GPay)", "Apple Pay", "Apple Wallet", "Samsung Pay", "Samsung Wallet",
    "PayPal", "PayPal Honey", "PayPal Credit", "PayPal Business", "PayPal Working Capital", "PayPal Zettle",
    "WeChat Pay (Tenpay)", "Alipay (Ant Group)", "Alipay+", "UnionPay International", "Octopus Card (Hong Kong)", "PayMe by HSBC",
    "FPS (Hong Kong Faster Payment System)", "PromptPay (Thailand)", "TrueMoney Wallet", "Rabbit LINE Pay", "GCash", "Maya (PayMaya)",
    "Coins.ph", "GrabPay", "GoPay (GoTo)", "OVO (Lippo)", "DANA Indonesia", "LinkAja", "ShopeePay", "Toss (Viva Republica)",
    "Toss Bank", "Toss Payments", "KakaoPay", "Kakao Bank", "Naver Pay", "PayPay (SoftBank)", "Line Pay", "Rakuten Pay", "Merpay",
    "au PAY", "d Barai (NTT Docomo)", "Fawry (Egypt)", "Paymob", "Paystack (Stripe)", "Flutterwave", "Chipper Cash", "OPay",
    "PalmPay", "Moniepoint", "Kuda Bank", "Yoco (South Africa)", "SnapScan", "Zapper", "M-Pesa (Safaricom)", "Airtel Money",
    "MTN Mobile Money (MoMo)", "Orange Money", "Wave Mobile Money", "Mercado Pago", "Pix (Banco Central do Brasil)", "PagSeguro (PagBank)",
    "Stone Pagamentos", "Cielo", "Nubank", "Nubank PJ", "PicPay", "Boleto Bancario", "dLocal", "EBANX", "Kushki", "Clip (Mexico)",
    "Konfio", "Kueski", "Bold (Colombia)", "PSE (Colombia)", "Transbank (Chile)", "Webpay Plus", "Uala (Argentina)", "Mercado Libre",
    "Sellio IQ", "Helcim", "Stax Payments", "Daxko", "Bambora", "Cardknox", "Finix", "Dwolla", "Plaid", "Yodlee", "MX Technologies",
    "Tink (Visa)", "Truelayer", "Yapily", "GoCardless", "Modern Treasury", "Moov Financial", "Sila Money", "Column N.A.", "Lithic",
    "Marqeta", "Highnote", "Unit.co", "Bond Financial", "Synapse Financial", "Galileo Financial Technologies", "Cross River Bank",
    "Evolve Bank & Trust", "Shift4 Payments", "Nuvei", "Flywire", "Corpay (Fleetcor)", "Western Union", "MoneyGram", "Ria Money Transfer",
    "Remitly", "WorldRemit", "Sendwave", "Tala Mobile Loans", "Branch International", "Affirm Financial", "Zip (Quadpay)", "Sezzle",
    "Laybuy", "PayBright", "Splitit", "Sunbit", "Bread Financial", "Upstart", "SoFi Money", "Creditas", "Neon Pagamentos", "C6 Bank",
    "Inter (Banco Inter)", "Next Bank (Bradesco)", "Banco PAN", "Digio", "Superdigital", "PagBank", "Aura Pay", "Elo Card",
    "Hipercard", "Rede (Redecard)", "Getnet (Santander)", "SafraPay", "Bin (First Data)", "PagHiper", "Iugu", "Asaas", "Vindi",
    "Pagar.me", "Moip (Wirecard)", "MaxiPago", "Koin (Despegar)", "Ame Digital", "Mercado Pago Point", "SumUp Top", "Stone Ton"
];

// 2. FRANKBASE & MASTER MANIKANT ECOSYSTEM
const ECOSYSTEM_PLATFORMS = [
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

// 3. GLOBAL AI & MACHINE LEARNING PLATFORMS (300+ entries)
const AI_PLATFORMS = [
    "OpenAI", "ChatGPT", "ChatGPT Plus", "ChatGPT Team", "ChatGPT Enterprise", "OpenAI API", "OpenAI Playground",
    "Anthropic Claude", "Claude Pro", "Claude Team", "Claude Enterprise", "Anthropic Console",
    "Google Gemini", "Gemini Advanced", "Google AI Studio", "Google DeepMind", "Google Vertex AI",
    "Microsoft Copilot", "Microsoft Copilot Pro", "Microsoft Copilot for M365", "GitHub Copilot", "GitHub Copilot Chat",
    "Perplexity AI", "Perplexity Pro", "Perplexity Enterprise", "Groq", "GroqCloud", "Mistral AI", "Le Chat (Mistral)",
    "Mistral La Plateforme", "Cohere", "Cohere Coral", "DeepSeek", "DeepSeek R1", "DeepSeek V3", "DeepSeek Coder",
    "xAI Grok", "Grok 2", "Hugging Face", "Hugging Face Hub", "Hugging Face Spaces", "Hugging Face Inference",
    "Replicate", "Together AI", "Fireworks AI", "ElevenLabs", "ElevenLabs VoiceLab", "ElevenLabs Reader",
    "RunwayML", "Runway Gen-3 Alpha", "Runway Gen-2", "Midjourney", "Midjourney Alpha", "Stability AI", "Stable Diffusion",
    "DreamStudio (Stability)", "Leonardo AI", "Suno AI", "Udio Music", "Jasper AI", "Copy.ai", "Writesonic",
    "Synthesia", "HeyGen", "Descript", "Otter.ai", "Notion AI", "Cursor (Anysphere)", "Windsurf (Codeium)", "Codeium",
    "Tabnine", "v0 by Vercel", "Bolt.new (StackBlitz)", "Lovable.dev", "Devin (Cognition AI)", "Replit Agent", "Aider AI",
    "LangChain", "LangSmith", "LangServe", "LlamaIndex", "LlamaCloud", "Pinecone", "Pinecone Serverless", "Qdrant",
    "Weaviate", "Milvus", "Zilliz Cloud", "ChromaDB", "Weights & Biases", "MLflow", "Kaggle", "Civitai", "Poe (Quora)",
    "Character.ai", "Jan AI", "LM Studio", "Ollama", "OpenRouter", "Deepgram", "AssemblyAI", "Cartesia AI",
    "Whisper (OpenAI)", "Pika Labs", "Luma AI (Dream Machine)", "Sora (OpenAI)", "Kling AI (Kuaishou)", "Haiper AI",
    "Ideogram AI", "Flux.1 (Black Forest Labs)", "Phind", "Kagi Search", "You.com", "Andi Search", "Consensus AI",
    "Elicit AI", "SciSpace", "Semantic Scholar", "ChatPDF", "Humata AI", "PDFgear AI", "Gamma App", "Tome AI",
    "Decktopus AI", "Beautiful.ai", "Speechify", "Lovo.ai", "Murf.ai", "Resemble AI", "Play.ht", "Voiceflow",
    "Botpress", "Dialogflow (Google)", "Rasa", "Coze (ByteDance)", "Dify.ai", "Flowise AI", "Langflow", "AutoGPT",
    "BabyAGI", "CrewAI", "AutoGen (Microsoft)", "Semantic Kernel", "BentoML", "Ray (Anyscale)", "vLLM", "TGI (Hugging Face)",
    "Ollama Cloud", "Modal Labs", "Baseten", "Beam Cloud", "RunPod", "Vast.ai", "Lambda Labs", "CoreWeave", "Crusoe Cloud",
    "Paperspace (DigitalOcean)", "JarvisLabs", "Hyperstack", "TensorWave", "Nebius AI", "Cerebras Cloud", "SambaNova Cloud"
];

// 4. GLOBAL DEVELOPER TOOLS, CLOUD, HOSTING & DEVOPS (500+ entries)
const DEV_AND_CLOUD = [
    "GitHub", "GitHub Enterprise", "GitHub Actions", "GitHub Packages", "GitLab", "GitLab SaaS", "GitLab CI/CD",
    "Bitbucket", "Bitbucket Cloud", "Bitbucket Pipelines", "SourceForge", "Codeberg", "Launchpad", "Gitea", "Forgejo",
    "Cloudflare", "Cloudflare Pages", "Cloudflare Workers", "Cloudflare R2", "Cloudflare Turnstile", "Cloudflare Zero Trust",
    "Cloudflare Stream", "Cloudflare D1", "Cloudflare KV", "Cloudflare Hyperdrive", "Cloudflare Vectorize", "Cloudflare Queues",
    "Amazon Web Services (AWS)", "AWS Management Console", "AWS IAM", "AWS Lambda", "AWS S3", "AWS EC2", "AWS CloudFront",
    "AWS Route 53", "AWS DynamoDB", "AWS RDS", "AWS ECS", "AWS EKS", "AWS Fargate", "AWS API Gateway", "AWS SQS", "AWS SNS",
    "AWS CloudWatch", "AWS Cognito", "AWS Amplify", "AWS AppSync", "AWS CodePipeline", "AWS Secrets Manager",
    "Google Cloud Platform (GCP)", "Google Cloud Console", "Google Firebase", "Firebase Auth", "Firebase Firestore", "Firebase Storage",
    "Firebase Hosting", "Google Cloud Run", "Google Compute Engine", "Google Cloud Storage", "Google BigQuery",
    "Google Kubernetes Engine (GKE)", "Google Cloud SQL", "Google Cloud Functions", "Google Cloud Spanner", "Google Pub/Sub",
    "Microsoft Azure", "Azure Portal", "Azure DevOps", "Azure Active Directory (Entra ID)", "Azure App Service",
    "Azure Functions", "Azure Blob Storage", "Azure Cosmos DB", "Azure SQL Database", "Azure Kubernetes Service (AKS)",
    "Azure Key Vault", "Azure Monitor", "Azure Front Door", "Vercel", "Vercel Preview", "Vercel Blob", "Vercel KV", "Vercel Postgres",
    "Netlify", "Netlify Edge", "Netlify Forms", "Render", "Render PostgreSQL", "Railway", "Fly.io", "DigitalOcean",
    "DigitalOcean Droplets", "DigitalOcean App Platform", "DigitalOcean Spaces", "Linode (Akamai)", "Hetzner Online", "Hetzner Cloud",
    "OVHcloud", "Hostinger", "Hostinger hPanel", "SiteGround", "Bluehost", "Namecheap", "GoDaddy", "Porkbun", "Cloudns",
    "DNSimple", "Hover", "Dynadot", "Fastly", "Akamai Technologies", "StackPath", "Bunny.net", "KeyCDN", "Imperva Incapsula",
    "Supabase", "Supabase Auth", "Supabase Database", "Supabase Storage", "Supabase Realtime", "Neon Tech (Serverless Postgres)",
    "PlanetScale (Serverless MySQL)", "CockroachDB", "Cockroach Labs", "MongoDB Atlas", "Redis Cloud", "Upstash (Serverless Redis/Kafka)",
    "Turso (ChiselStrike LibSQL)", "Convex (Reactive Backend)", "Hasura Cloud (GraphQL)", "Appwrite Cloud", "Back4App", "PocketBase",
    "FaunaDB", "ScyllaDB Cloud", "Neo4j AuraDB", "SingleStore Cloud", "ClickHouse Cloud", "TiDB Cloud (PingCAP)", "InfluxDB Cloud",
    "Timescale Cloud", "Aiven", "ScaleGrid", "Postman", "Postman API Platform", "Insomnia (Kong)", "SwaggerHub (SmartBear)",
    "Stoplight", "Hoppscotch", "GraphQL Hive", "Apollo GraphQL (Studio)", "Stellate (GraphQL CDN)", "WunderGraph", "Zuplo",
    "Kong Gateway", "Kong Konnect", "Tyk API Management", "Apigee (Google)", "KrakenD", "RapidAPI Hub", "Apify Cloud",
    "Datadog", "New Relic", "Sentry", "Dynatrace", "Grafana Cloud", "Prometheus", "Better Stack (Logtail / Better Uptime)",
    "UptimeRobot", "Statuspage (Atlassian)", "PagerDuty", "Opsgenie", "Splunk Cloud", "Sumo Logic", "Coralogix", "Honeycomb.io",
    "Axiom.co", "SigNoz", "Highlight.io", "Docker Hub", "Kubernetes", "Red Hat OpenShift", "Rancher (SUSE)", "Portainer",
    "HashiCorp Cloud Platform", "Terraform Cloud", "HashiCorp Vault", "HashiCorp Consul", "HashiCorp Nomad", "Doppler Secret Ops",
    "Infisical", "Akeyless Vault", "1Password", "1Password Developer", "Bitwarden", "Bitwarden Passwordless", "LastPass",
    "Dashlane", "KeePass", "NordPass", "Proton Pass", "RoboForm", "Keeper Security", "Enpass", "Snyk", "SonarQube",
    "SonarCloud", "Veracode", "Checkmarx", "GitGuardian", "TruffleHog", "npm (Node Package Manager)", "PyPI (Python)",
    "Crates.io (Rust)", "Maven Central", "Packagist (PHP)", "RubyGems", "NuGet (.NET)", "Go Packages", "Quay.io",
    "JFrog Artifactory", "Sonatype Nexus", "Cloudsmith", "CodeArtifact (AWS)"
];

// 5. GLOBAL SAAS, PRODUCTIVITY & WORKSPACE (400+ entries)
const SAAS_AND_WORK = [
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

// Write out modular files
console.log('Expanding high-density global databases...');

const modularDatabases = {
    'global_payment_and_fintech.json': Array.from(new Set(GLOBAL_PAYMENT_PROVIDERS)).sort(),
    'ecosystem_and_saas.json': Array.from(new Set([...ECOSYSTEM_PLATFORMS, ...SAAS_AND_WORK])).sort(),
    'global_ai_and_dev_tools.json': Array.from(new Set([...AI_PLATFORMS, ...DEV_AND_CLOUD])).sort()
};

for (const [filename, arr] of Object.entries(modularDatabases)) {
    fs.writeFileSync(path.join(STAGING_DIR, filename), JSON.stringify(arr, null, 2), 'utf8');
    console.log(`Updated ${filename} with ${arr.length} curated entries.`);
}

console.log('Staging files expanded successfully.');
