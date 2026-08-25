const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'data_staging');
if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
}

// 1. MASTER ECOSYSTEM
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
    "MM Central Command"
];

// 2. GLOBAL PAYMENT SERVICES, MERCHANT OF RECORD (MoR) & FINTECH GATEWAYS
const PAYMENT_AND_FINTECH = [
    // Modern MoR & Global Payment Gateways
    "Dodo Payments", "Lemon Squeezy", "Stripe", "Paddle", "FastSpring", "2Checkout (Verifone)",
    "Adyen", "Worldpay", "Klarna", "Afterpay", "Affirm", "Mollie", "Skrill", "Neteller",
    "Wise (formerly TransferWise)", "Payoneer", "Revolut", "Revolut Business", "Monzo", "N26",
    "Starling Bank", "Chime", "Cash App (Square)", "Venmo", "Zelle", "Square", "Square Register",
    "SumUp", "Toast POS", "Clover POS", "Braintree (PayPal Service)", "Shopify Payments",
    "Authorize.Net", "CCBill", "Segpay", "Epoch Payments", "Checkout.com", "Paysafe",
    "Airwallex", "PayMongo", "Tazapay", "Xendit", "Midtrans", "2C2P", "Omise", "Rapyd",
    "PayCEC", "Bluesnap", "SecurionPay", "Worldline", "Ingenico", "Global Payments",
    "Elavon", "First Data (Fiserv)", "TSYS", "Chase Merchant Services", "Heartland Payment Systems",
    "Paysera", "Epay", "Payone", "PayU Global", "PayU India", "Razorpay", "RazorpayX",
    "Cashfree Payments", "Instamojo", "PhonePe", "PhonePe Business", "Paytm", "Paytm for Business",
    "Cred", "Cred Pay", "Pine Labs", "BillDesk", "CCAvenue", "Easebuzz", "SabPaisa",
    "Open Financial Technologies", "Jupiter Money", "Fi Money", "Slice Card", "Uni Cards",
    "OneCard", "BharatPe", "Mobikwik", "Mobikwik Zaakpay", "Freecharge", "PayZapp (HDFC)",
    "Amazon Pay", "Google Pay (GPay)", "Apple Pay", "Samsung Pay", "PayPal", "PayPal Honey",
    "PayPal Credit", "PayPal Business", "Venmo for Business", "WeChat Pay", "Alipay", "Alipay+",
    "UnionPay International", "Octopus Card (Hong Kong)", "PayMe by HSBC", "FPS (Hong Kong)",
    "PromptPay (Thailand)", "TrueMoney Wallet", "Rabbit LINE Pay", "GCash", "Maya (PayMaya)",
    "Coins.ph", "GrabPay", "GoPay (GoTo)", "OVO", "DANA", "LinkAja", "ShopeePay",
    "Toss (Viva Republica)", "KakaoPay", "Naver Pay", "PayPay (Japan)", "Line Pay",
    "Rakuten Pay", "Merpay", "au PAY", "d Barai (NTT Docomo)", "Fawry (Egypt)", "Paymob",
    "Paystack (Stripe)", "Flutterwave", "Chipper Cash", "OPay", "PalmPay", "Moniepoint",
    "Kuda Bank", "Yoco (South Africa)", "SnapScan", "Zapper", "M-Pesa (Safaricom)",
    "Airtel Money", "MTN Mobile Money (MoMo)", "Orange Money", "Wave Mobile Money",
    "Mercado Pago", "Pix (Banco Central do Brasil)", "PagSeguro (PagBank)", "Stone Pagamentos",
    "Cielo", "Nubank", "PicPay", "Boleto Bancario", "dLocal", "EBANX", "Kushki",
    "Clip (Mexico)", "Konfio", "Kueski", "Bold (Colombia)", "PSE (Colombia)",
    "Transbank (Chile)", "Webpay Plus", "Uala (Argentina)", "Mercado Libre", "Sellio IQ",
    "Helcim", "Stax Payments", "Daxko", "Bambora", "Cardknox", "Finix", "Dwolla",
    "Plaid", "Yodlee", "MX Technologies", "Tink (Visa)", "Truelayer", "Yapily",
    "GoCardless", "Modern Treasury", "Moov Financial", "Sila Money", "Column N.A.",
    "Lithic", "Marqeta", "Highnote", "Unit.co", "Bond Financial", "Synapse Financial",
    "Galileo Financial Technologies", "Cross River Bank", "Evolve Bank & Trust",
    "Shift4 Payments", "Nuvei", "Flywire", "Corpay (Fleetcor)", "Western Union",
    "MoneyGram", "Ria Money Transfer", "Remitly", "WorldRemit", "Sendwave", "Tala",
    "Branch International", "Affirm Financial", "Zip (formerly Quadpay)", "Sezzle",
    "Laybuy", "PayBright", "Splitit", "Sunbit", "Bread Financial", "Upstart", "SoFi Money"
];

// 3. GLOBAL AI, LLM & MACHINE LEARNING PLATFORMS
const AI_AND_ML_PLATFORMS = [
    "OpenAI", "ChatGPT", "ChatGPT Plus", "ChatGPT Team", "ChatGPT Enterprise",
    "Anthropic Claude", "Claude Pro", "Claude Team", "Google Gemini", "Gemini Advanced",
    "Google AI Studio", "Google DeepMind", "Google Vertex AI", "Microsoft Copilot",
    "Microsoft Copilot Pro", "GitHub Copilot", "Perplexity AI", "Perplexity Pro",
    "Groq", "GroqCloud", "Mistral AI", "Le Chat (Mistral)", "Cohere", "DeepSeek",
    "DeepSeek R1", "xAI Grok", "Grok 2", "Hugging Face", "Hugging Face Hub",
    "Replicate", "Together AI", "Fireworks AI", "ElevenLabs", "RunwayML", "Runway Gen-3",
    "Midjourney", "Stability AI", "Stable Diffusion", "Leonardo AI", "Suno AI", "Udio Music",
    "Jasper AI", "Copy.ai", "Writesonic", "Synthesia", "HeyGen", "Descript", "Otter.ai",
    "Notion AI", "Cursor (Anysphere)", "Windsurf (Codeium)", "Codeium", "Tabnine",
    "v0 by Vercel", "Bolt.new (StackBlitz)", "Lovable.dev", "Devin (Cognition AI)",
    "Replit Agent", "Aider AI", "LangChain", "LangSmith", "LlamaIndex", "Pinecone",
    "Qdrant", "Weaviate", "Milvus", "ChromaDB", "Weights & Biases", "MLflow",
    "Kaggle", "Civitai", "Poe (Quora)", "Character.ai", "Jan AI", "LM Studio",
    "Ollama", "OpenRouter", "Deepgram", "AssemblyAI", "Cartesia AI", "Whisper (OpenAI)",
    "Pika Labs", "Luma AI (Dream Machine)", "Sora (OpenAI)", "Kling AI", "Haiper AI",
    "Ideogram AI", "Flux.1 (Black Forest Labs)", "Phind", "Kagi Search", "You.com",
    "Andi Search", "Consensus AI", "Elicit AI", "SciSpace", "Semantic Scholar",
    "ChatPDF", "Humata AI", "PDFgear AI", "Gamma App", "Tome AI", "Decktopus AI",
    "Beautiful.ai", "Tome App", "Speechify", "Lovo.ai", "Murf.ai", "Resemble AI",
    "Play.ht", "Voiceflow", "Botpress", "Dialogflow", "Rasa", "Coze (ByteDance)",
    "Dify.ai", "Flowise AI", "Langflow", "AutoGPT", "BabyAGI", "CrewAI", "AutoGen (Microsoft)",
    "Semantic Kernel", "BentoML", "Ray (Anyscale)", "vLLM", "TGI (Text Generation Inference)",
    "Ollama Cloud", "Modal Labs", "Baseten", "Beam Cloud", "RunPod", "Vast.ai", "Lambda Labs",
    "CoreWeave", "Crusoe Cloud", "Paperspace (DigitalOcean)", "JarvisLabs", "Hyperstack"
];

// 4. GLOBAL DEVELOPER TOOLS, CLOUD, HOSTING & DEVOPS
const DEV_AND_CLOUD_PLATFORMS = [
    // Source Code & Version Control
    "GitHub", "GitHub Enterprise", "GitLab", "GitLab SaaS", "Bitbucket", "Bitbucket Cloud",
    "SourceForge", "Codeberg", "Launchpad", "Gitea", "Forgejo", "Phabricator",
    // Cloud Providers & CDNs
    "Cloudflare", "Cloudflare Pages", "Cloudflare Workers", "Cloudflare R2", "Cloudflare Turnstile",
    "Cloudflare Zero Trust", "Cloudflare Stream", "Cloudflare D1", "Cloudflare KV",
    "Amazon Web Services (AWS)", "AWS Management Console", "AWS IAM", "AWS Lambda", "AWS S3",
    "AWS EC2", "AWS CloudFront", "AWS Route 53", "AWS DynamoDB", "AWS RDS", "AWS ECS", "AWS EKS",
    "Google Cloud Platform (GCP)", "Google Firebase", "Google Cloud Run", "Google Compute Engine",
    "Google Cloud Storage", "Google BigQuery", "Google Kubernetes Engine (GKE)", "Google Cloud SQL",
    "Microsoft Azure", "Azure Portal", "Azure DevOps", "Azure Active Directory (Entra ID)",
    "Azure App Service", "Azure Functions", "Azure Blob Storage", "Azure Cosmos DB",
    // Modern Frontend & PaaS Hosts
    "Vercel", "Netlify", "Render", "Railway", "Fly.io", "DigitalOcean", "Linode (Akamai Connected Cloud)",
    "Hetzner Online", "Hetzner Cloud", "OVHcloud", "Hostinger", "SiteGround", "Bluehost",
    "Namecheap", "GoDaddy", "Porkbun", "Cloudns", "DNSimple", "Hover", "Dynadot", "Dyn",
    "Fastly", "Akamai Technologies", "StackPath", "Bunny.net", "KeyCDN", "Imperva",
    // Databases & Backend-as-a-Service
    "Supabase", "Neon Tech", "PlanetScale", "CockroachDB", "Cockroach Labs", "MongoDB Atlas",
    "Redis Cloud", "Upstash", "Turso (ChiselStrike)", "Convex", "Hasura Cloud", "Appwrite",
    "Back4App", "PocketBase", "FaunaDB", "ScyllaDB", "Neo4j Aura", "SingleStore", "ClickHouse Cloud",
    "TiDB Cloud", "InfluxDB Cloud", "Timescale Cloud", "Aiven", "ScaleGrid", "ElephantSQL",
    // API & Developer Productivity
    "Postman", "Postman API", "Insomnia", "SwaggerHub", "Stoplight", "Hoppscotch",
    "GraphQL Hive", "Apollo GraphQL", "Stellate", "WunderGraph", "Zuplo", "Kong Gateway",
    "Tyk API Management", "Apigee (Google)", "KrakenD", "Trevbl", "RapidAPI", "Apify",
    // Monitoring, Observability & Error Tracking
    "Datadog", "New Relic", "Sentry", "Dynatrace", "Grafana Cloud", "Prometheus",
    "Better Stack", "Logtail", "UptimeRobot", "Statuspage (Atlassian)", "PagerDuty",
    "Opsgenie", "VictorOps (Splunk)", "Splunk Cloud", "Sumo Logic", "LogDNA (Mezmo)",
    "Coralogix", "Honeycomb.io", "Lightstep (ServiceNow)", "Axiom.co", "SigNoz", "Highlight.io",
    // Container & Orchestration
    "Docker Hub", "Docker Desktop", "Kubernetes", "Red Hat OpenShift", "Rancher (SUSE)",
    "Portainer", "HashiCorp Cloud Platform", "Terraform Cloud", "HashiCorp Vault",
    "HashiCorp Consul", "HashiCorp Nomad", "Doppler Secret Ops", "Infisical", "Akeyless",
    "1Password", "1Password Developer", "Bitwarden", "LastPass", "Dashlane", "KeePass",
    "NordPass", "Proton Pass", "RoboForm", "Keeper Security", "Enpass",
    // Security & Package Registries
    "Snyk", "SonarQube", "SonarCloud", "Veracode", "Checkmarx", "GitGuardian", "TruffleHog",
    "npm (Node Package Manager)", "PyPI (Python Package Index)", "Crates.io (Rust)",
    "Maven Central", "Packagist (PHP)", "RubyGems", "NuGet (.NET)", "Go Packages (pkg.go.dev)",
    "Quay.io", "JFrog Artifactory", "Sonatype Nexus", "Cloudsmith", "CodeArtifact (AWS)"
];

// 5. GLOBAL SAAS, PRODUCTIVITY, COLLABORATION & MARKETING
const SAAS_AND_PRODUCTIVITY = [
    // Workspace & Office
    "Google Workspace", "Google Drive", "Google Docs", "Google Sheets", "Google Slides",
    "Google Forms", "Google Meet", "Google Calendar", "Google Keep", "Google Sites",
    "Microsoft 365", "Microsoft OneDrive", "Microsoft Teams", "Microsoft SharePoint",
    "Microsoft Outlook", "Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint",
    "Microsoft OneNote", "Microsoft Loop", "Microsoft Whiteboard", "Microsoft Planner",
    // Project Management & Tracking
    "Notion", "Slack", "Zoom Video Communications", "Cisco Webex", "Trello (Atlassian)",
    "Asana", "Monday.com", "ClickUp", "Linear", "Jira (Atlassian)", "Confluence (Atlassian)",
    "Basecamp", "Airtable", "Coda.io", "Smartsheet", "Wrike", "Teamwork.com", "Hive",
    "Productboard", "Craft.do", "Anytype", "Obsidian Sync", "Roam Research", "Logseq",
    // Design & Creative
    "Figma", "FigJam", "Miro", "Mural", "Canva", "Adobe Creative Cloud", "Adobe Photoshop",
    "Adobe Illustrator", "Adobe InDesign", "Adobe Premiere Pro", "Adobe After Effects",
    "Adobe XD", "Adobe Lightroom", "Adobe Acrobat", "Adobe Express", "Framer", "Webflow",
    "Sketch", "InVision", "Marvel App", "Zeplin", "Affinity Designer", "Procreate",
    // Publishing & Blogging
    "WordPress.org", "WordPress.com", "Ghost CMS", "Substack", "Medium", "Beehiiv",
    "Hashnode", "Dev.to", "Typefully", "Buffer", "Hootsuite", "Sprout Social", "Later",
    // Email Marketing & CRM
    "Mailchimp", "ConvertKit (Kit)", "Brevo (formerly Sendinblue)", "ActiveCampaign",
    "Klaviyo", "MailerLite", "Omnisend", "GetResponse", "AWeber", "Constant Contact",
    "SendGrid (Twilio)", "Mailgun (Sinch)", "Postmark", "Resend", "Amazon SES",
    "HubSpot", "Salesforce", "Salesforce Service Cloud", "Salesforce Marketing Cloud",
    "Zoho CRM", "Zoho Books", "Zoho Desk", "Zoho Mail", "Zoho Workplace", "Zoho Creator",
    "Zoho People", "Freshworks", "Freshdesk", "Freshsales", "Freshservice", "Freshchat",
    "Zendesk", "Zendesk Support", "Intercom", "Crisp Chat", "Help Scout", "Front App",
    "Gorgias", "Drift", "LiveChat", "Tidio", "Olark", "Kayako", "Groove",
    // Automation & Scheduling
    "Zapier", "Make (Integromat)", "n8n Cloud", "Workato", "Tray.io", "Integrately",
    "IFTTT", "Calendly", "Cal.com", "Acuity Scheduling", "Doodle", "SavvyCal",
    "Loom (Atlassian)", "Vidyard", "Pitch.com", "Tome", "DocuSign", "HelloSign (Dropbox Sign)",
    "PandaDoc", "Adobe Sign", "SignWell", "SignNow", "Eversign"
];

// 6. GLOBAL E-COMMERCE, MARKETPLACES & LOGISTICS
const ECOMMERCE_AND_LOGISTICS = [
    // Major Global Marketplaces
    "Amazon", "Amazon Prime", "Amazon Seller Central", "Amazon Pay", "Amazon Business",
    "eBay", "Walmart", "Walmart Marketplace", "Target", "Best Buy", "Costco Wholesale",
    "Home Depot", "Lowe's", "Etsy", "AliExpress", "Alibaba.com", "Taobao", "Tmall",
    "JD.com", "Pinduoduo", "Temu", "Shein", "Rakuten", "Yahoo Shopping Japan",
    "Mercado Libre", "Shopee", "Lazada", "Tokopedia", "Bukalapak", "Blibli",
    // Indian E-Commerce & Quick Commerce
    "Flipkart", "Flipkart Seller Hub", "Myntra", "Meesho", "Nykaa", "Ajio",
    "Tata CLiQ", "Tata Neu", "JioMart", "Reliance Digital", "Croma", "BigBasket",
    "Blinkit (Zomato)", "Zepto", "Swiggy Instamart", "Dunzo", "Zomato", "Swiggy",
    "Magicpin", "Oorja", "DealShare", "CityMall", "Purplle", "FirstCry", "Pepperfry",
    "Urban Company", "Lenskart", "Mamaearth", "Boat Lifestyle", "Noise", "Sugar Cosmetics",
    // Global Food Delivery & Quick Commerce
    "Uber Eats", "DoorDash", "Grubhub", "Deliveroo", "Just Eat (Takeaway.com)",
    "Delivery Hero", "Foodpanda", "Talabat", "Rappi", "iFood", "Wolt", "Glovo",
    "Instacart", "Gopuff", "Getir", "Flink", "Gorillas", "Deliverect", "ChowNow",
    // Fashion & Specialty Retail
    "ASOS", "Zalando", "Boohoo", "Next Directory", "Zara (Inditex)", "H&M (Hennes & Mauritz)",
    "Uniqlo (Fast Retailing)", "Nike", "Adidas", "Puma", "Under Armour", "Lululemon",
    "Sephora (LVMH)", "Ulta Beauty", "Wayfair", "IKEA", "Decathlon", "Overstock (Bed Bath)",
    // E-Commerce Platforms & Store Builders
    "Shopify", "Shopify Plus", "Shopify App Store", "BigCommerce", "WooCommerce",
    "Magento (Adobe Commerce)", "PrestaShop", "OpenCart", "Squarespace Commerce",
    "Wix eCommerce", "Ecwid (Lightspeed)", "Volusion", "Shift4Shop", "Shopware",
    // Logistics, Couriers & Shipping
    "FedEx", "FedEx Express", "UPS (United Parcel Service)", "DHL Express", "DHL Global",
    "USPS (United States Postal Service)", "DPDgroup", "Royal Mail (UK)", "PostNL",
    "Deutsche Post", "La Poste (France)", "Australia Post", "Canada Post", "Japan Post",
    "China Post", "Singapore Post (SingPost)", "India Post", "Blue Dart Express",
    "Delhivery", "Shadowfax", "Xpressbees", "DTDC Courier", "Shiprocket", "Ecom Express",
    "Ekart Logistics", "Gati", "Safexpress", "TCI Express", "Trackon Couriers"
];

// 7. GLOBAL STREAMING, GAMING, SOCIAL & COMMUNITIES
const STREAMING_AND_SOCIAL = [
    // Video & Music Streaming
    "YouTube", "YouTube Premium", "YouTube Studio", "YouTube Music", "YouTube Kids",
    "Netflix", "Disney+", "Disney+ Hotstar", "Hulu", "HBO Max (Max)", "Amazon Prime Video",
    "Apple TV+", "Paramount+", "Peacock TV", "Crunchyroll", "Funimation", "Twitch",
    "Kick Streaming", "Vimeo", "Dailymotion", "Roku", "Pluto TV", "Tubi TV",
    "Spotify", "Spotify for Artists", "Apple Music", "Apple Podcasts", "Tidal",
    "Deezer", "SoundCloud", "SoundCloud Pro", "Pandora Music", "iHeartRadio",
    "TuneIn Radio", "Gaana", "JioSaavn", "Wynk Music", "Hungama Play", "Audible (Amazon)",
    "Storytel", "Kobo Audiobooks", "Libro.fm", "Pocket FM", "Kuku FM",
    // Gaming & Digital Distribution
    "Steam (Valve)", "Epic Games Store", "PlayStation Network (PSN)", "PlayStation Plus",
    "Xbox Network (Xbox Live)", "Xbox Game Pass", "Nintendo eShop", "Nintendo Switch Online",
    "Battle.net (Blizzard)", "EA App (Origin)", "Ubisoft Connect", "GOG.com",
    "Roblox", "Riot Games (Valorant / League of Legends)", "Tencent Games",
    "Activision Blizzard", "Rockstar Games Social Club", "Itch.io", "Humble Bundle",
    "Unity Asset Store", "Unreal Engine Marketplace", "Nexus Mods", "ModDB",
    // Social Networks & Chat
    "Discord", "Discord Nitro", "Reddit", "Reddit Premium", "X (formerly Twitter)",
    "X Premium", "Facebook", "Facebook Messenger", "Facebook Groups", "Instagram",
    "Threads (Instagram)", "TikTok", "Snapchat", "Snapchat+", "Pinterest", "Tumblr",
    "LinkedIn", "LinkedIn Premium", "Bluesky Social", "Mastodon", "Telegram",
    "Telegram Premium", "WhatsApp", "WhatsApp Business", "Signal Messenger",
    "WeChat (Tencent)", "LINE App", "KakaoTalk", "Viber (Rakuten)", "Quora", "Quora+",
    "Clubhouse", "BeReal", "Lemon8 (ByteDance)", "VK (VKontakte)", "Kwai (Kuaishou)"
];

// 8. GLOBAL BANKING, INVESTMENTS & CRYPTO
const BANKING_AND_INVESTMENTS = [
    // Top US & North America Banks
    "JPMorgan Chase", "Chase Bank NetBanking", "Bank of America", "Wells Fargo",
    "Citibank (Citi)", "Goldman Sachs", "Morgan Stanley", "Capital One", "U.S. Bank",
    "PNC Bank", "Truist Bank", "TD Bank (USA)", "BMO Harris", "Fifth Third Bank",
    "KeyBank", "Citizens Bank", "Huntington National Bank", "Regions Bank", "M&T Bank",
    "Charles Schwab", "Fidelity Investments", "Vanguard", "Robinhood", "Webull",
    "Interactive Brokers", "E*TRADE (Morgan Stanley)", "TD Ameritrade", "Acorns",
    "Betterment", "Wealthfront", "SoFi Bank", "Ally Bank", "Marcus by Goldman Sachs",
    "Discover Bank", "American Express (Amex)", "Synchrony Bank",
    // Top UK & European Banks
    "Barclays Bank", "HSBC", "HSBC UK", "Lloyds Bank", "NatWest (National Westminster)",
    "Royal Bank of Scotland (RBS)", "Santander UK", "Banco Santander", "BNP Paribas",
    "Credit Agricole", "Societe Generale", "Deutsche Bank", "Commerzbank", "UBS",
    "Credit Suisse", "ING Bank", "BBVA (Banco Bilbao Vizcaya Argentaria)", "CaixaBank",
    "Intesa Sanpaolo", "UniCredit", "Nordea Bank", "Danske Bank", "Swedbank", "SEB Bank",
    "Rabobank", "ABN AMRO", "KBC Bank", "Erste Group", "Raiffeisen Bank International",
    // Top Canadian & Australian Banks
    "RBC (Royal Bank of Canada)", "TD Canada Trust", "Scotiabank (Bank of Nova Scotia)",
    "BMO (Bank of Montreal)", "CIBC (Canadian Imperial Bank of Commerce)", "National Bank of Canada",
    "Desjardins", "Commonwealth Bank of Australia (CBA)", "ANZ (Australia and New Zealand Banking Group)",
    "Westpac Banking Corporation", "NAB (National Australia Bank)", "Macquarie Bank",
    "Bank of Queensland", "Bendigo and Adelaide Bank", "Suncorp Bank",
    // Top Indian Banks & Brokers
    "State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank",
    "Kotak Mahindra Bank", "Punjab National Bank (PNB)", "Bank of Baroda (BOB)",
    "Canara Bank", "Union Bank of India", "IndusInd Bank", "Yes Bank", "IDFC FIRST Bank",
    "Federal Bank", "Bandhan Bank", "RBL Bank", "Indian Bank", "Central Bank of India",
    "Indian Overseas Bank", "UCO Bank", "Bank of Maharashtra", "Punjab & Sind Bank",
    "South Indian Bank", "Karur Vysya Bank", "City Union Bank", "Tamilnad Mercantile Bank",
    "Jammu & Kashmir Bank", "Karnataka Bank", "AU Small Finance Bank", "Equitas SFB",
    "Ujjivan Small Finance Bank", "Jana Small Finance Bank", "Suryoday SFB",
    "Paytm Payments Bank", "Airtel Payments Bank", "IPPB (India Post Payments Bank)",
    "Fino Payments Bank", "Jio Payments Bank", "NSDL Payments Bank",
    "Zerodha (Kite / Coin)", "Groww (Stocks & Mutual Funds)", "Upstox (Pro)",
    "Angel One (Angel Broking)", "5paisa", "Dhan (Raise Financial)", "INDmoney",
    "Kuvera", "Paytm Money", "Motilal Oswal", "Sharekhan", "ICICI Direct",
    "HDFC Sky", "Kotak Securities (Kotak Neo)", "Axis Direct", "Geojit Financial",
    // Global Crypto Exchanges & Wallets
    "Binance", "Binance US", "Coinbase", "Coinbase Pro", "Coinbase Wallet", "Kraken",
    "OKX", "Bybit", "KuCoin", "Bitfinex", "Gate.io", "Gemini Crypto", "Bitstamp",
    "Crypto.com", "MEXC Global", "HTX (formerly Huobi)", "Bitget", "LBank",
    "CoinDCX", "CoinSwitch Kuber", "WazirX", "ZebPay", "Bitbns", "Mudrex",
    "MetaMask", "Trust Wallet", "Ledger Live", "Trezor Suite", "Exodus Wallet",
    "Phantom Wallet", "Coin98 Wallet", "Rainbow Wallet", "Uniswap Interface",
    "PancakeSwap", "SushiSwap", "Curve Finance", "Aave", "Compound Finance",
    "OpenSea", "Magic Eden", "Blur.io", "LooksRare", "Rarible"
];

// 9. GLOBAL TRAVEL, AIRLINES, HOTELS & TICKETING
const TRAVEL_AND_HOSPITALITY = [
    // Ride Hailing & Micro-Mobility
    "Uber", "Lyft", "Grab (Southeast Asia)", "Gojek", "Ola Cabs", "Bolt (Taxify)",
    "Didi Chuxing", "Free Now", "Careem", "Cabify", "Yango", "Rapido Bike Taxi",
    "BluSmart Mobility", "InDrive", "BlaBlaCar", "Lime Scooters", "Bird Scooters",
    "Tier Mobility", "Voi Scooters", "Yulu Bikes",
    // OTAs & Accommodation
    "Airbnb", "Airbnb Host", "Booking.com", "Expedia", "Hotels.com", "Vrbo",
    "Agoda", "Trip.com", "Kayak", "Skyscanner", "Trivago", "Google Flights",
    "TripAdvisor", "Hostelworld", "Priceline", "Orbitz", "Travelocity", "Hotwire",
    "CheapOair", "Hopper", "Omio (GoEuro)", "Rome2rio", "Trainline",
    "MakeMyTrip (MMT)", "Cleartrip", "Yatra.com", "EaseMyTrip", "Goibibo",
    "redBus", "AbhiBus", "IRCTC Rail Connect", "IRCTC Tourism", "ixigo",
    // Hotel Chains
    "Marriott Bonvoy", "Hilton Honors", "IHG One Rewards (InterContinental)",
    "World of Hyatt", "Accor Live Limitless (ALL)", "Wyndham Rewards",
    "Radisson Rewards", "Choice Privileges", "Best Western Rewards", "OYO Rooms",
    "Treebo Hotels", "FabHotels", "Taj Hotels (IHCL)", "Oberoi Hotels", "ITC Hotels",
    // Major Airlines
    "Emirates Airlines", "Qatar Airways", "Singapore Airlines", "Delta Air Lines",
    "United Airlines", "American Airlines", "British Airways", "Lufthansa",
    "Air France", "KLM Royal Dutch Airlines", "Turkish Airlines", "Etihad Airways",
    "Qantas Airways", "Air Canada", "Cathay Pacific", "All Nippon Airways (ANA)",
    "Japan Airlines (JAL)", "Korean Air", "SWISS International Air Lines",
    "Virgin Atlantic", "Air India", "IndiGo Airlines", "SpiceJet", "Akasa Air",
    "Vistara", "Ryanair", "easyJet", "Wizz Air", "Southwest Airlines", "JetBlue Airways",
    "Alaska Airlines", "Spirit Airlines", "Frontier Airlines"
];

// 10. GLOBAL EDUCATION, LEARNING & JOBS
const EDUCATION_AND_JOBS = [
    // Online Learning & MOOCs
    "Coursera", "edX", "Udemy", "Udacity", "Khan Academy", "Skillshare",
    "Pluralsight", "MasterClass", "Codecademy", "freeCodeCamp", "LeetCode",
    "HackerRank", "CodeChef", "GeeksforGeeks", "W3Schools", "Brilliant.org",
    "Duolingo", "Duolingo English Test", "Babbel", "Rosetta Stone", "Busuu",
    "Memrise", "Mondly", "Lingoda", "Cambly", "Preply", "italki",
    "LinkedIn Learning", "DataCamp", "Dataquest", "Treehouse (TeamTreehouse)",
    "Frontend Masters", "Scrimba", "Egghead.io", "Laracasts", "Udemy Business",
    "Coursera for Business", "FutureLearn", "OpenLearn (Open University)",
    "MIT OpenCourseWare", "Harvard Online", "Stanford Online", "Oxford Continuing Education",
    // Indian EdTech & Test Prep
    "English Vidya", "Master Manikant Academy", "Unacademy", "Physics Wallah (PW)",
    "BYJU'S", "Vedantu", "Adda247", "Testbook", "Oliveboard", "Gradeup (BYJU'S Exam Prep)",
    "Careerwill App", "Next IAS", "Drishti IAS", "Vajiram & Ravi", "Vision IAS",
    "Khan Global Studies", "StudyIQ Education", "Sanskriti IAS", "Allen Career Institute",
    "Aakash Digital", "Resonance", "FIITJEE", "NPTEL Portal", "SWAYAM Portal",
    "Diksha Portal (NCERT)", "Swayam Prabha", "IGNOU eGyanKosh",
    // Job Portals & Freelance Platforms
    "LinkedIn Jobs", "Indeed", "Indeed Employer", "Glassdoor", "Monster.com",
    "ZipRecruiter", "CareerBuilder", "SimplyHired", "Naukri.com", "Naukri Employer",
    "Foundit (formerly Monster India)", "Internshala", "Wellfound (AngelList Talent)",
    "Instahyre", "Hirist", "Cutshort", "IIMJobs", "Apna App", "WorkIndia",
    "Upwork", "Upwork Enterprise", "Fiverr", "Fiverr Pro", "Freelancer.com",
    "Toptal", "PeoplePerHour", "Guru.com", "Truelancer", "TaskRabbit", "Thumbtack"
];

// Generate JSON files
const categories = {
    'global_payment_and_fintech.json': PAYMENT_AND_FINTECH,
    'ecosystem_and_saas.json': [...ECOSYSTEM_PLATFORMS, ...SAAS_AND_PRODUCTIVITY],
    'global_ai_and_dev_tools.json': [...AI_AND_ML_PLATFORMS, ...DEV_AND_CLOUD_PLATFORMS],
    'global_ecommerce_and_retail.json': ECOMMERCE_AND_LOGISTICS,
    'global_streaming_and_social.json': STREAMING_AND_SOCIAL,
    'global_banking_and_finance.json': BANKING_AND_INVESTMENTS,
    'global_travel_and_education.json': [...TRAVEL_AND_HOSPITALITY, ...EDUCATION_AND_JOBS]
};

console.log('Writing categorized staging JSON files...');
let totalStaged = 0;
const allPlatforms = new Set();

for (const [filename, list] of Object.entries(categories)) {
    const sorted = Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
    fs.writeFileSync(path.join(STAGING_DIR, filename), JSON.stringify(sorted, null, 2), 'utf8');
    console.log(`Saved ${filename}: ${sorted.length} entries`);
    sorted.forEach(p => allPlatforms.add(p));
    totalStaged += sorted.length;
}

const combinedList = Array.from(allPlatforms).sort((a, b) => a.localeCompare(b));
fs.writeFileSync(path.join(STAGING_DIR, 'all_master_platforms_combined.json'), JSON.stringify(combinedList, null, 2), 'utf8');
console.log(`Saved all_master_platforms_combined.json: ${combinedList.length} unique platforms.`);
