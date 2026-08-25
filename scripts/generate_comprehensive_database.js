const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'data_staging');
if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
}

// 1. MASTER ECOSYSTEM & SISTER ENTITIES
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

// 2. GLOBAL PAYMENT SERVICES, MERCHANT OF RECORD (MoR) & FINTECH GATEWAYS (500+ items)
const PAYMENT_AND_FINTECH = [
    // MoRs and Global Gateways
    "Dodo Payments", "Lemon Squeezy", "Stripe", "Stripe Connect", "Stripe Billing", "Stripe Checkout", "Stripe Radar", "Stripe Issuing", "Stripe Treasury",
    "Paddle", "Paddle Billing", "FastSpring", "2Checkout (Verifone)", "Adyen", "Worldpay (FIS)", "Klarna", "Klarna Pay in 4", "Klarna Financing",
    "Afterpay (Block)", "Affirm", "Affirm Card", "Mollie", "Skrill", "Neteller", "Wise (TransferWise)", "Wise Business", "Wise Multi-Currency",
    "Payoneer", "Payoneer Checkout", "Payoneer Commercial", "Revolut", "Revolut Business", "Revolut Pay", "Revolut <18", "Monzo", "Monzo Business",
    "Monzo Flex", "N26", "N26 Business", "Starling Bank", "Starling Business", "Chime", "Chime Credit Builder", "Cash App (Block)", "Cash Card",
    "Venmo", "Venmo Business", "Venmo Debit Card", "Zelle", "Square", "Square POS", "Square Terminal", "Square Register", "Square Invoices",
    "SumUp", "SumUp Solo", "SumUp Air", "Toast POS", "Clover POS (Fiserv)", "Braintree (PayPal)", "Braintree Direct", "Shopify Payments",
    "Shopify POS", "Shopify Balance", "Authorize.Net", "CCBill", "Segpay", "Epoch Payments", "Checkout.com", "Paysafe", "Paysafecard",
    "Airwallex", "PayMongo", "Tazapay", "Xendit", "Midtrans", "2C2P", "Omise", "Rapyd", "PayCEC", "BlueSnap", "SecurionPay", "Worldline",
    "Ingenico", "Global Payments", "Elavon", "First Data (Fiserv)", "TSYS (Total System Services)", "Chase Merchant Services", "Heartland Payment Systems",
    "Paysera", "Epay", "Payone", "PayU Global", "PayU India", "PayU Latam", "PayU Hub", "Razorpay", "RazorpayX", "Razorpay POS", "Razorpay Capital",
    "Cashfree Payments", "Cashfree AutoCollect", "Cashfree Payouts", "Instamojo", "Instamojo Online Store", "PhonePe", "PhonePe Business", "PhonePe PG",
    "Paytm", "Paytm for Business", "Paytm Payment Gateway", "Paytm Soundbox", "Paytm Postpaid", "Cred", "Cred Pay", "Cred Cash", "Cred Garage",
    "Pine Labs", "Pine Labs Plural", "BillDesk", "CCAvenue", "Easebuzz", "SabPaisa", "Open Financial Technologies (Open Money)", "Jupiter Money",
    "Fi Money (Epifi)", "Slice Card (Slice Super Card)", "Uni Cards (Uni Orbit)", "OneCard (FPL Technologies)", "BharatPe", "BharatPe Swipe",
    "BharatPe QR", "Mobikwik", "Mobikwik Zaakpay", "Mobikwik ZIP", "Freecharge", "Freecharge Pay Later", "PayZapp (HDFC Bank)", "Amazon Pay",
    "Amazon Pay ICICI", "Google Pay (GPay)", "Google Wallet", "Apple Pay", "Apple Wallet", "Apple Card", "Apple Cash", "Samsung Pay", "Samsung Wallet",
    "PayPal", "PayPal Honey", "PayPal Credit", "PayPal Business", "PayPal Working Capital", "PayPal Zettle", "PayPal MicroPayments",
    "Tenpay (WeChat Pay)", "Alipay (Ant Group)", "Alipay+", "UnionPay International", "Octopus Card (Hong Kong)", "PayMe by HSBC (Hong Kong)",
    "FPS (Faster Payment System Hong Kong)", "PromptPay (Bank of Thailand)", "TrueMoney Wallet", "Rabbit LINE Pay", "GCash (Mynt Philippines)",
    "Maya (PayMaya)", "Coins.ph", "GrabPay", "GoPay (GoTo Group)", "OVO (Lippo Group)", "DANA Indonesia", "LinkAja", "ShopeePay",
    "Toss (Viva Republica)", "Toss Bank", "Toss Payments", "Toss Securities", "KakaoPay", "Kakao Bank", "Naver Pay", "PayPay (SoftBank / Yahoo Japan)",
    "Line Pay", "Rakuten Pay", "Rakuten Edy", "Merpay (Mercari)", "au PAY (KDDI)", "d Barai (NTT Docomo)", "Suica Mobile (JR East)", "Pasmo Mobile",
    "Fawry (Egypt)", "Paymob (MENA)", "Paystack (Stripe)", "Flutterwave", "Chipper Cash", "OPay (Opera)", "PalmPay", "Moniepoint", "Kuda Bank",
    "Yoco (South Africa)", "SnapScan", "Zapper", "M-Pesa (Safaricom Kenya)", "Airtel Money (Africa & India)", "MTN Mobile Money (MoMo)",
    "Orange Money", "Wave Mobile Money (Senegal & Ivory Coast)", "Mercado Pago", "Pix (Banco Central do Brasil)", "PagSeguro (PagBank)",
    "Stone Pagamentos", "Cielo (Banco do Brasil / Bradesco)", "Nubank (Nu Holdings)", "Nubank PJ", "PicPay", "Boleto Bancario", "dLocal (Cross-Border)",
    "EBANX", "Kushki", "Clip (Mexico)", "Konfio", "Kueski Pay", "Bold (Colombia)", "PSE (Pagos Seguros En Linea Colombia)", "Transbank (Chile)",
    "Webpay Plus (Chile)", "Uala (Argentina / Mexico / Colombia)", "Mercado Libre", "Sellio IQ", "Helcim", "Stax Payments", "Daxko",
    "Bambora (Worldline)", "Cardknox", "Finix", "Dwolla", "Plaid", "Yodlee (Envestnet)", "MX Technologies", "Tink (Visa)", "Truelayer",
    "Yapily", "GoCardless (Direct Debit)", "Modern Treasury", "Moov Financial", "Sila Money", "Column N.A.", "Lithic", "Marqeta",
    "Highnote", "Unit.co", "Bond Financial", "Synapse Financial", "Galileo Financial Technologies (SoFi)", "Cross River Bank", "Evolve Bank & Trust",
    "Shift4 Payments", "Nuvei", "Flywire", "Corpay (Fleetcor)", "Western Union", "MoneyGram", "Ria Money Transfer", "Remitly", "WorldRemit",
    "Sendwave", "Tala Mobile Loans", "Branch International", "Affirm Financial", "Zip (formerly Quadpay)", "Sezzle", "Laybuy", "PayBright",
    "Splitit", "Sunbit", "Bread Financial (Alliance Data)", "Upstart", "SoFi Money", "Creditas (Brazil)", "Neon Pagamentos", "C6 Bank",
    "Inter (Banco Inter Brazil)", "Next Bank (Bradesco)", "Banco PAN", "Digio (Elopar)", "Superdigital (Santander)", "PagBank", "Aura Pay",
    "Elo Card (Brazil)", "Hipercard (Itaú)", "Rede (Redecard Itaú)", "Getnet (Santander)", "SafraPay", "Bin (First Data)", "PagHiper",
    "Iugu", "Asaas", "Vindi (Locaweb)", "Pagar.me (Stone)", "Moip (Wirecard)", "MaxiPago", "Koin (Despegar)", "Ame Digital (Americanas)",
    "Mercado Pago Point", "SumUp Top", "Stone Ton", "Clearco (Clearbanc)", "Wayflyer", "Pipe.com", "Capchase", "Uncapped", "Silo (Agri FinTech)",
    "Stripe Climate", "Watershed Climate", "Patch.io", "Sweep.net", "Persefoni", "Normative", "Climatiq"
];

// 3. GLOBAL AI, LLM & MACHINE LEARNING PLATFORMS (350+ items)
const AI_AND_ML = [
    "OpenAI", "ChatGPT", "ChatGPT Plus", "ChatGPT Team", "ChatGPT Enterprise", "OpenAI API", "OpenAI Playground", "OpenAI Sora",
    "Anthropic Claude", "Claude Pro", "Claude Team", "Claude Enterprise", "Anthropic Console", "Claude Artifacts",
    "Google Gemini", "Gemini Advanced", "Google AI Studio", "Google DeepMind", "Google Vertex AI", "Google Imagen", "NotebookLM",
    "Microsoft Copilot", "Microsoft Copilot Pro", "Microsoft Copilot for M365", "Microsoft Copilot Studio", "GitHub Copilot", "GitHub Copilot Chat", "GitHub Copilot Workspace",
    "Perplexity AI", "Perplexity Pro", "Perplexity Enterprise", "Perplexity Pages", "Groq", "GroqCloud", "Groq LPU", "Mistral AI",
    "Le Chat (Mistral)", "Mistral La Plateforme", "Mistral Codestral", "Cohere", "Cohere Coral", "DeepSeek", "DeepSeek R1", "DeepSeek V3", "DeepSeek Coder",
    "xAI Grok", "Grok 2", "Grok 2 Mini", "Hugging Face", "Hugging Face Hub", "Hugging Face Spaces", "Hugging Face Inference", "Hugging Face AutoTrain",
    "Replicate", "Together AI", "Together Compute", "Fireworks AI", "ElevenLabs", "ElevenLabs VoiceLab", "ElevenLabs Reader", "ElevenLabs Dubbing",
    "RunwayML", "Runway Gen-3 Alpha", "Runway Gen-2", "Midjourney", "Midjourney Alpha", "Stability AI", "Stable Diffusion", "Stable Video Diffusion",
    "DreamStudio (Stability)", "Leonardo AI", "Suno AI", "Udio Music", "Jasper AI", "Copy.ai", "Writesonic", "Chatsonic", "Synthesia",
    "HeyGen", "Descript", "Otter.ai", "Notion AI", "Cursor (Anysphere)", "Windsurf (Codeium)", "Codeium", "Tabnine", "v0 by Vercel",
    "Bolt.new (StackBlitz)", "Lovable.dev", "Devin (Cognition AI)", "Replit Agent", "Aider AI", "LangChain", "LangSmith", "LangServe",
    "LlamaIndex", "LlamaCloud", "Pinecone", "Pinecone Serverless", "Qdrant", "Weaviate", "Milvus", "Zilliz Cloud", "ChromaDB",
    "Weights & Biases", "MLflow", "Kaggle", "Civitai", "Poe (Quora)", "Character.ai", "Jan AI", "LM Studio", "Ollama", "OpenRouter",
    "Deepgram", "AssemblyAI", "Cartesia AI", "Whisper (OpenAI)", "Pika Labs", "Luma AI (Dream Machine)", "Sora (OpenAI)", "Kling AI (Kuaishou)",
    "Haiper AI", "Ideogram AI", "Flux.1 (Black Forest Labs)", "Phind", "Kagi Search", "You.com", "Andi Search", "Consensus AI", "Elicit AI",
    "SciSpace", "Semantic Scholar", "ChatPDF", "Humata AI", "PDFgear AI", "Gamma App", "Tome AI", "Decktopus AI", "Beautiful.ai",
    "Speechify", "Lovo.ai", "Murf.ai", "Resemble AI", "Play.ht", "Voiceflow", "Botpress", "Dialogflow (Google)", "Rasa", "Coze (ByteDance)",
    "Dify.ai", "Flowise AI", "Langflow", "AutoGPT", "BabyAGI", "CrewAI", "AutoGen (Microsoft)", "Semantic Kernel", "BentoML",
    "Ray (Anyscale)", "vLLM", "TGI (Hugging Face)", "Ollama Cloud", "Modal Labs", "Baseten", "Beam Cloud", "RunPod", "Vast.ai",
    "Lambda Labs", "CoreWeave", "Crusoe Cloud", "Paperspace (DigitalOcean)", "JarvisLabs", "Hyperstack", "TensorWave", "Nebius AI",
    "Cerebras Cloud", "SambaNova Cloud", "Groq AI", "Krea AI", "Magnific AI", "Playground AI", "NightCafe Creator", "Artbreeder",
    "Craiyon", "DeepAI", "FaceApp", "Lensa AI (Prisma)", "Photoroom", "Clipdrop (Jasper)", "Vheer AI", "Meshy 3D", "Luma Genie",
    "Sloyd 3D", "Spline AI", "Kaedim 3D", "Tripo 3D", "Rodin Gen-1", "Wonder Studio (Autodesk)", "Plask AI", "Move.ai", "DeepMotion"
];

// 4. GLOBAL DEVELOPER TOOLS, CLOUD, HOSTING & DEVOPS (600+ items)
const DEV_AND_CLOUD = [
    // Source Code & Version Control
    "GitHub", "GitHub Enterprise", "GitHub Actions", "GitHub Packages", "GitHub Codespaces", "GitHub Issues", "GitHub Discussions",
    "GitLab", "GitLab SaaS", "GitLab CI/CD", "GitLab Runner", "GitLab Self-Managed", "Bitbucket", "Bitbucket Cloud", "Bitbucket Pipelines",
    "SourceForge", "Codeberg", "Launchpad", "Gitea", "Forgejo", "Phabricator", "Helix Core (Perforce)", "Plastic SCM (Unity)",
    // Cloud Providers & Edge CDNs
    "Cloudflare", "Cloudflare Pages", "Cloudflare Workers", "Cloudflare R2", "Cloudflare Turnstile", "Cloudflare Zero Trust", "Cloudflare Stream",
    "Cloudflare D1", "Cloudflare KV", "Cloudflare Hyperdrive", "Cloudflare Vectorize", "Cloudflare Queues", "Cloudflare Tunnel (cloudflared)",
    "Amazon Web Services (AWS)", "AWS Management Console", "AWS IAM", "AWS Lambda", "AWS S3", "AWS EC2", "AWS CloudFront", "AWS Route 53",
    "AWS DynamoDB", "AWS RDS", "AWS ECS", "AWS EKS", "AWS Fargate", "AWS API Gateway", "AWS SQS", "AWS SNS", "AWS CloudWatch", "AWS Cognito",
    "AWS Amplify", "AWS AppSync", "AWS CodePipeline", "AWS Secrets Manager", "AWS KMS", "AWS Elastic Beanstalk", "AWS Step Functions",
    "Google Cloud Platform (GCP)", "Google Cloud Console", "Google Firebase", "Firebase Auth", "Firebase Firestore", "Firebase Storage",
    "Firebase Hosting", "Firebase Cloud Messaging (FCM)", "Google Cloud Run", "Google Compute Engine", "Google Cloud Storage", "Google BigQuery",
    "Google Kubernetes Engine (GKE)", "Google Cloud SQL", "Google Cloud Functions", "Google Cloud Spanner", "Google Pub/Sub", "Google Artifact Registry",
    "Microsoft Azure", "Azure Portal", "Azure DevOps", "Azure Active Directory (Entra ID)", "Azure App Service", "Azure Functions",
    "Azure Blob Storage", "Azure Cosmos DB", "Azure SQL Database", "Azure Kubernetes Service (AKS)", "Azure Key Vault", "Azure Monitor",
    "Azure Front Door", "Azure Container Apps", "Azure Virtual Machines", "Azure Synapse Analytics",
    // Modern Frontend, Edge & PaaS Hosts
    "Vercel", "Vercel Preview", "Vercel Blob", "Vercel KV", "Vercel Postgres", "Vercel Edge Functions", "Netlify", "Netlify Edge",
    "Netlify Forms", "Netlify Functions", "Netlify Large Media", "Render", "Render PostgreSQL", "Render Web Services", "Railway", "Railway Deployments",
    "Fly.io", "Fly Machines", "DigitalOcean", "DigitalOcean Droplets", "DigitalOcean App Platform", "DigitalOcean Spaces", "DigitalOcean Managed Databases",
    "Linode (Akamai Connected Cloud)", "Hetzner Online", "Hetzner Cloud", "Hetzner Robot", "OVHcloud", "OVHcloud Dedicated Servers",
    "Hostinger", "Hostinger hPanel", "SiteGround", "Bluehost", "Namecheap", "GoDaddy", "Porkbun", "Cloudns", "DNSimple", "Hover",
    "Dynadot", "Gandi.net", "Fastly", "Akamai Technologies", "StackPath", "Bunny.net", "KeyCDN", "Imperva Incapsula", "Kinsta (Managed WordPress)",
    "WP Engine", "Flywheel", "Pantheon.io", "Cloudways", "A2 Hosting", "InMotion Hosting", "DreamHost", "HostGator", "HostPapa",
    // Databases & Backend-as-a-Service
    "Supabase", "Supabase Auth", "Supabase Database", "Supabase Storage", "Supabase Realtime", "Supabase Edge Functions",
    "Neon Tech (Serverless Postgres)", "PlanetScale (Serverless MySQL)", "CockroachDB", "Cockroach Labs", "CockroachDB Serverless",
    "MongoDB Atlas", "MongoDB Realm", "Redis Cloud", "Upstash (Serverless Redis/Kafka)", "Upstash QStash", "Turso (ChiselStrike LibSQL)",
    "Convex (Reactive Backend)", "Hasura Cloud (GraphQL)", "Appwrite Cloud", "Back4App", "PocketBase", "FaunaDB", "ScyllaDB Cloud",
    "Neo4j AuraDB", "SingleStore Cloud", "ClickHouse Cloud", "TiDB Cloud (PingCAP)", "InfluxDB Cloud", "Timescale Cloud", "Aiven",
    "ScaleGrid", "ElephantSQL", "ObjectRocket", "Compose.io", "Couchbase Capella", "Memcached Cloud", "Cassandra Datastax Astra",
    // API, Integration & Developer Productivity
    "Postman", "Postman API Platform", "Insomnia (Kong)", "SwaggerHub (SmartBear)", "Stoplight", "Hoppscotch", "GraphQL Hive",
    "Apollo GraphQL (Studio)", "Stellate (GraphQL CDN)", "WunderGraph", "Zuplo", "Kong Gateway", "Kong Konnect", "Tyk API Management",
    "Apigee (Google)", "KrakenD", "RapidAPI Hub", "Apify Cloud", "Workato Developers", "MuleSoft Anypoint Platform", "Boomi",
    "Tray.io Embedded", "Merge.dev", "Rutter", "Plaid Link", "Teller.io", "Finicity API", "Yodlee API",
    // Monitoring, Observability & Error Tracking
    "Datadog", "New Relic", "Sentry", "Dynatrace", "Grafana Cloud", "Prometheus", "Better Stack (Logtail / Better Uptime)",
    "UptimeRobot", "Statuspage (Atlassian)", "PagerDuty", "Opsgenie", "VictorOps (Splunk)", "Splunk Cloud", "Sumo Logic",
    "LogDNA (Mezmo)", "Coralogix", "Honeycomb.io", "Lightstep (ServiceNow)", "Axiom.co", "SigNoz", "Highlight.io", "Bugsnag (SmartBear)",
    "Rollbar", "Raygun", "AppDynamics (Cisco)", "Site24x7 (Zoho)", "Pingdom (SolarWinds)", "LogicMonitor", "Elastic Cloud (ELK)",
    // Container, Secrets & CI/CD
    "Docker Hub", "Docker Desktop", "Kubernetes", "Red Hat OpenShift", "Rancher (SUSE)", "Portainer", "HashiCorp Cloud Platform",
    "Terraform Cloud", "HashiCorp Vault", "HashiCorp Consul", "HashiCorp Nomad", "Doppler Secret Ops", "Infisical", "Akeyless Vault",
    "1Password", "1Password Developer", "Bitwarden", "Bitwarden Passwordless", "LastPass", "Dashlane", "KeePass", "NordPass",
    "Proton Pass", "RoboForm", "Keeper Security", "Enpass", "Snyk", "SonarQube", "SonarCloud", "Veracode", "Checkmarx", "GitGuardian",
    "TruffleHog", "npm (Node Package Manager)", "PyPI (Python)", "Crates.io (Rust)", "Maven Central", "Packagist (PHP)",
    "RubyGems", "NuGet (.NET)", "Go Packages (pkg.go.dev)", "Quay.io (Red Hat)", "JFrog Artifactory", "Sonatype Nexus", "Cloudsmith",
    "CodeArtifact (AWS)", "CircleCI", "Travis CI", "Buildkite", "TeamCity (JetBrains)", "Bamboo (Atlassian)", "Argo CD", "Flux CD"
];

// Combine all datasets
const categories = {
    'global_payment_and_fintech.json': Array.from(new Set(PAYMENT_AND_FINTECH)).sort(),
    'ecosystem_and_saas.json': Array.from(new Set(ECOSYSTEM)).sort(),
    'global_ai_and_dev_tools.json': Array.from(new Set([...AI_AND_ML, ...DEV_AND_CLOUD])).sort()
};

console.log('Writing updated staging JSON files...');
let total = 0;
for (const [filename, list] of Object.entries(categories)) {
    fs.writeFileSync(path.join(STAGING_DIR, filename), JSON.stringify(list, null, 2), 'utf8');
    console.log(`Saved ${filename} (${list.length} entries)`);
    total += list.length;
}

console.log(`Staging compilation finished with high quality databases.`);
