/**
 * FrankPass Utilities
 * Centralized logic for platform normalization, SSO brand aliasing, and UI helpers.
 * Shared between Web and Extension.
 */

const FrankPassUtils = (function () {
    
    // Global Aliases: mapping input & sibling brands to canonical Single Sign-On (SSO) slug
    const GLOBAL_ALIASES = {
        // Google Ecosystem (100% Unified Google Account SSO)
        'google': 'google',
        'gmail': 'google',
        'googlemail': 'google',
        'gdrive': 'google',
        'googledrive': 'google',
        'gphotos': 'google',
        'gdocs': 'google',
        'gpay': 'google',
        'googlepay': 'google',
        'gemini': 'google',
        'googleaccount': 'google',
        'goog': 'google',
        'yt': 'google',
        'youtube': 'google',
        'youtubemusic': 'google',
        'youtubestudio': 'google',
        'ytstudio': 'google',

        // Microsoft Ecosystem (Unified Microsoft Account SSO)
        'ms': 'microsoft',
        'microsoft': 'microsoft',
        'outlook': 'microsoft',
        'live': 'microsoft',
        'hotmail': 'microsoft',
        'msn': 'microsoft',
        'office365': 'microsoft',
        'office': 'microsoft',
        'microsoft365': 'microsoft',
        'onedrive': 'microsoft',
        'xbox': 'microsoft',
        'skype': 'microsoft',
        'bing': 'microsoft',
        'copilot': 'microsoft',

        // Apple Ecosystem (Unified Apple ID / iCloud SSO)
        'apple': 'apple',
        'appleid': 'apple',
        'icloud': 'apple',
        'itunes': 'apple',
        'appstore': 'apple',
        'applemusic': 'apple',
        'appletv': 'apple',

        // Adobe Ecosystem (Unified Adobe ID SSO)
        'adobe': 'adobe',
        'creativecloud': 'adobe',
        'behance': 'adobe',
        'photoshop': 'adobe',
        'adobefonts': 'adobe',
        'adobestock': 'adobe',
        'lightroom': 'adobe',

        // Yahoo Ecosystem
        'yahoo': 'yahoo',
        'ymail': 'yahoo',
        'yahoomail': 'yahoo',
        'yahoofinance': 'yahoo',

        // Meta / Social Ecosystem
        'fb': 'facebook',
        'meta': 'facebook',
        'facebook': 'facebook',
        'messenger': 'facebook',
        'x': 'twitter',
        'tw': 'twitter',
        'twtr': 'twitter',
        'twitter': 'twitter',
        'ig': 'instagram',
        'insta': 'instagram',
        'instagram': 'instagram',
        'threads': 'instagram',
        'wa': 'whatsapp',
        'whatsapp': 'whatsapp',
        'amzn': 'amazon',
        'amazon': 'amazon',
        'primevideo': 'amazon',
        'audible': 'amazon',
        'snap': 'snapchat',
        'snapchat': 'snapchat',
        'pin': 'pinterest',
        'pinterest': 'pinterest',
        'gh': 'github',
        'github': 'github',
        'pp': 'paypal',
        'paypal': 'paypal',
        'tt': 'tiktok',
        'tiktok': 'tiktok',
        'nf': 'netflix',
        'netflix': 'netflix',
        'tv': 'twitch',
        'twitch': 'twitch',
        'st': 'steam',
        'steam': 'steam',
        'dc': 'discord',
        'discord': 'discord',
        'rd': 'reddit',
        'reddit': 'reddit',
        'tg': 'telegram',
        'telegram': 'telegram',
        'ln': 'linkedin',
        'linkedin': 'linkedin',
        'spotify': 'spotify',

        // Cloud, AI & DevOps Independent Slugs
        'aws': 'aws',
        'amazonwebservices': 'aws',
        'awsconsole': 'aws',
        'azure': 'azure',
        'microsoftazure': 'azure',
        'azureportal': 'azure',
        'gcp': 'googlecloud',
        'googlecloud': 'googlecloud',
        'oraclecloud': 'oraclecloud',
        'ibmcloud': 'ibmcloud',
        'alibabacloud': 'alibabacloud',
        'digitalocean': 'digitalocean',
        'hetzner': 'hetzner',
        'linode': 'linode',
        'cloudflare': 'cloudflare',
        'cf': 'cloudflare',
        'cloudflareworkers': 'cloudflare',
        'cloudflarepages': 'cloudflare',
        'vercel': 'vercel',
        'netlify': 'netlify',
        'supabase': 'supabase',
        'mongodbatlas': 'mongodbatlas',
        'render': 'render',
        'railway': 'railway',
        'flyio': 'flyio',
        'openai': 'openai',
        'chatgpt': 'chatgpt',
        'claude': 'anthropic',
        'anthropic': 'anthropic',
        'perplexity': 'perplexity',
        'huggingface': 'huggingface',
        'postman': 'postman',
        'sentry': 'sentry',
        'datadog': 'datadog',
        'grafana': 'grafana',
        'jira': 'jira',
        'confluence': 'confluence',
        'atlassian': 'atlassian',
        'bitbucket': 'bitbucket',
        'gitlab': 'gitlab',
        'hostinger': 'hostinger',

        // E-Commerce Merchant & Seller Specific Slugs
        'amazonseller': 'amazonseller',
        'amazonsellercentral': 'amazonseller',
        'amazonkdp': 'amazonkdp',
        'kdp': 'amazonkdp',
        'amazonauthor': 'amazonkdp',
        'amazonassociates': 'amazonassociates',
        'amazonaffiliate': 'amazonassociates',
        'amazonmerch': 'amazonmerch',
        'amazonads': 'amazonads',
        'flipkartseller': 'flipkartseller',
        'shopifyadmin': 'shopifyadmin',
        'swiggypartner': 'swiggypartner',
        'zomatomerchant': 'zomatomerchant',

        // Indian Financial, Tax, Investment & Govt Aliases
        'boi': 'bankofindia',
        'sbi': 'statebankofindia',
        'onlinesbi': 'statebankofindia',
        'yono': 'statebankofindia',
        'yonosbi': 'statebankofindia',
        'yonobusiness': 'sbicorporate',
        'sbiyonobusiness': 'sbicorporate',
        'yonobusinesssbi': 'sbicorporate',
        'sbicorporate': 'sbicorporate',
        'sbicorporatebanking': 'sbicorporate',
        'sbicorp': 'sbicorporate',
        'sbicard': 'sbicard',
        'sbismart': 'sbisecurities',
        'sbisecurities': 'sbisecurities',
        'pnb': 'punjabnationalbank',
        'pnbone': 'punjabnationalbank',
        'pnbcorp': 'pnbcorporate',
        'pnbcorporate': 'pnbcorporate',
        'hdfc': 'hdfcbank',
        'hdfcnetbanking': 'hdfcbank',
        'hdfccorporate': 'hdfccorporate',
        'hdfcsec': 'hdfcsecurities',
        'hdfcsecurities': 'hdfcsecurities',
        'icici': 'icicibank',
        'imobile': 'icicibank',
        'icicicorporate': 'icicicorporate',
        'icicidirect': 'icicidirect',
        'axis': 'axisbank',
        'axisnetbanking': 'axisbank',
        'axiscorporate': 'axiscorporate',
        'axisdirect': 'axisdirect',
        'kotak': 'kotakmahindrabank',
        'kotak811': 'kotakmahindrabank',
        'kotakcorporate': 'kotakcorporate',
        'kotaksecurities': 'kotaksecurities',
        'bob': 'bankofbaroda',
        'bobworld': 'bankofbaroda',
        'bobcorporate': 'bobcorporate',
        'canara': 'canarabank',
        'canaracorporate': 'canaracorporate',
        'unionbank': 'unionbankofindia',
        'unionbankcorporate': 'unionbankcorporate',
        'idfc': 'idfcfirstbank',
        'idfcfirst': 'idfcfirstbank',
        'rbl': 'rblbank',
        'federal': 'federalbank',
        'indusind': 'indusindbank',
        'zerodha': 'zerodha',
        'kite': 'zerodha',
        'coin': 'zerodha',
        'groww': 'groww',
        'upstox': 'upstox',
        'angelone': 'angelone',
        'dhan': 'dhan',
        'cams': 'camsonline',
        'camsonline': 'camsonline',
        'kfin': 'kfintech',
        'kfintech': 'kfintech',
        'cdsl': 'cdsl',
        'nsdl': 'nsdl',
        'mfcentral': 'mfcentral',
        'itr': 'incometax',
        'incometax': 'incometax',
        'incometaxefiling': 'incometax',
        'gst': 'gstportal',
        'gstportal': 'gstportal',
        'gstn': 'gstportal',
        'epfo': 'epfo',
        'uan': 'epfo',
        'epfouan': 'epfo',
        'parivahan': 'parivahansewa',
        'sarathi': 'parivahansewa',
        'vahan': 'parivahansewa',
        'passport': 'passportseva',
        'passportseva': 'passportseva',
        'digilocker': 'digilocker',
        'digiyatra': 'digiyatra',
        'fastag': 'fastag',
        'cowin': 'cowinportal',
        'abha': 'abhaportal',
        'nps': 'npstrust',
        'enps': 'npstrust',
        'umang': 'umang',
        'jio': 'jio',
        'myjio': 'jio',
        'jiocinema': 'jiocinema',
        'jiosaavn': 'jiosaavn',
        'jiopay': 'jiopaymentsbank',
        'jiopaymentsbank': 'jiopaymentsbank',
        'airtel': 'airtel',
        'airtelthanks': 'airtel',
        'airtelmoney': 'airtelpaymentsbank',
        'airtelpaymentsbank': 'airtelpaymentsbank',
        'paytm': 'paytm',
        'paytmmoney': 'paytmmoney',
        'paytmbank': 'paytmpaymentsbank',
        'paytmpaymentsbank': 'paytmpaymentsbank',
        'vi': 'vodafoneidea',
        'bsnl': 'bsnl',
        'irctc': 'irctc',
        'irctcair': 'irctcair',
        'irctctourism': 'irctctourism',
        'indane': 'indane',
        'indanegas': 'indane',
        'bharatgas': 'bharatgas',
        'hpgas': 'hpgas',
        'uppcl': 'uppcl',
        'mahavitaran': 'msedcl',
        'msedcl': 'msedcl',
        'tatapower': 'tatapower',
        'tataneu': 'tataneu',
        'tatacliq': 'tatacliq',
        'adanielectricity': 'adanielectricity',
        'bses': 'bses',
        'bescom': 'bescom',

        // Global Govt & Public Services Aliases
        'irs': 'internalrevenueservice',
        'ssa': 'socialsecurityadministration',
        'dmv': 'dmvportal',
        'uscis': 'uscis',
        'logingov': 'logingov',
        'idme': 'idme',
        'usps': 'usps',
        'govuk': 'govuk',
        'hmrc': 'hmrc',
        'dvla': 'dvla',
        'nhs': 'nhs',
        'cra': 'canadarevenueagency',
        'servicecanada': 'servicecanada',
        'mygov': 'mygovau',
        'ato': 'australiantaxoffice',
        'singpass': 'singpass',
        'uaepass': 'uaepass',
        'absher': 'absher',
        'nafath': 'nafath'
    };

    // Full Domain & Subdomain Specific Exceptions (100% Comprehensive Industry Registry)
    const VISUAL_ALIASES = {
        // --- 1. Cloud, AI, DevOps & Infrastructure Platforms ---
        'aws.amazon.com': 'aws',
        'console.aws.amazon.com': 'aws',
        'signin.aws.amazon.com': 'aws',
        'repost.aws': 'aws',
        'builder.aws': 'aws',
        'portal.azure.com': 'azure',
        'dev.azure.com': 'azure',
        'azure.microsoft.com': 'azure',
        'console.cloud.google.com': 'googlecloud',
        'cloud.google.com': 'googlecloud',
        'cloud.oracle.com': 'oraclecloud',
        'myservices.oracle.com': 'oraclecloud',
        'cloud.ibm.com': 'ibmcloud',
        'iam.cloud.ibm.com': 'ibmcloud',
        'intl.alibabacloud.com': 'alibabacloud',
        'account.alibabacloud.com': 'alibabacloud',
        'console.digitalocean.com': 'digitalocean',
        'cloud.digitalocean.com': 'digitalocean',
        'console.hetzner.cloud': 'hetzner',
        'robot.hetzner.com': 'hetzner',
        'cloud.linode.com': 'linode',
        'dash.cloudflare.com': 'cloudflare',
        'cloudflare.com': 'cloudflare',
        'one.dash.cloudflare.com': 'cloudflare',
        'workers.cloudflare.com': 'cloudflare',
        'pages.cloudflare.com': 'cloudflare',
        'dashboard.vercel.com': 'vercel',
        'app.netlify.com': 'netlify',
        'app.supabase.com': 'supabase',
        'cloud.mongodb.com': 'mongodbatlas',
        'dashboard.render.com': 'render',
        'railway.app': 'railway',
        'fly.io': 'flyio',
        'chatgpt.com': 'chatgpt',
        'chat.openai.com': 'chatgpt',
        'platform.openai.com': 'openai',
        'claude.ai': 'anthropic',
        'console.anthropic.com': 'anthropic',
        'app.slack.com': 'slack',
        'slack.com': 'slack',
        'app.postman.com': 'postman',
        'identity.getpostman.com': 'postman',
        'admin.atlassian.com': 'atlassian',
        'id.atlassian.com': 'atlassian',
        'jira.atlassian.com': 'jira',
        'confluence.atlassian.com': 'confluence',
        'bitbucket.org': 'bitbucket',
        'gitlab.com': 'gitlab',
        'github.com': 'github',
        'gist.github.com': 'github',
        'app.datadoghq.com': 'datadog',
        'app.sentry.io': 'sentry',
        'app.grafana.net': 'grafana',
        'grafana.net': 'grafana',

        // --- 2. Amazon & E-Commerce Sub-Services ---
        'sellercentral.amazon.com': 'amazonseller',
        'sellercentral.amazon.in': 'amazonseller',
        'sellercentral-europe.amazon.com': 'amazonseller',
        'kdp.amazon.com': 'amazonkdp',
        'author.amazon.com': 'amazonkdp',
        'affiliate-program.amazon.com': 'amazonassociates',
        'affiliate-program.amazon.in': 'amazonassociates',
        'merch.amazon.com': 'amazonmerch',
        'advertising.amazon.com': 'amazonads',
        'seller.flipkart.com': 'flipkartseller',
        'admin.shopify.com': 'shopifyadmin',
        'partners.shopify.com': 'shopifyadmin',
        'partner.swiggy.com': 'swiggypartner',
        'merchant.zomato.com': 'zomatomerchant',

        // --- 3. Telecom & Fintech Payments Banks ---
        'payments.airtel.in': 'airtelpaymentsbank',
        'pay.airtel.in': 'airtelpaymentsbank',
        'airtelbank.com': 'airtelpaymentsbank',
        'airtelpaymentsbank.in': 'airtelpaymentsbank',
        'jiopay.com': 'jiopaymentsbank',
        'jiopaymentsbank.com': 'jiopaymentsbank',
        'paytmbank.com': 'paytmpaymentsbank',
        'paytmmoney.com': 'paytmmoney',

        // --- 4. Retail & Corporate NetBanking & Institutional Finance ---
        'yonobusiness.sbi.bank.in': 'sbicorporate',
        'yonobusiness.sbi': 'sbicorporate',
        'corp.onlinesbi.sbi': 'sbicorporate',
        'corp.onlinesbi.bank.in': 'sbicorporate',
        'corp.onlinesbi.com': 'sbicorporate',
        'retail.onlinesbi.sbi': 'statebankofindia',
        'retail.onlinesbi.bank.in': 'statebankofindia',
        'onlinesbi.sbi': 'statebankofindia',
        'onlinesbi.bank.in': 'statebankofindia',
        'onlinesbi.com': 'statebankofindia',
        'sbi.bank.in': 'statebankofindia',
        'sbi.co.in': 'statebankofindia',
        'sbicard.com': 'sbicard',
        'sbicard.sbi': 'sbicard',
        'sbismart.com': 'sbisecurities',
        'sbisecurities.in': 'sbisecurities',
        'hdfc.bank.in': 'hdfcbank',
        'hdfcbank.bank.in': 'hdfcbank',
        'netbanking.hdfcbank.bank.in': 'hdfcbank',
        'corporatebanking.hdfcbank.bank.in': 'hdfccorporate',
        'netbanking.hdfcbank.com': 'hdfcbank',
        'corporatebanking.hdfcbank.com': 'hdfccorporate',
        'hdfcsec.com': 'hdfcsecurities',
        'mycards.hdfcbank.com': 'hdfcmycards',
        'icici.bank.in': 'icicibank',
        'icicibank.bank.in': 'icicibank',
        'corporate.icicibank.com': 'icicicorporate',
        'corporate.icicibank.bank.in': 'icicicorporate',
        'cibnext.icicibank.com': 'icicicorporate',
        'infinity.icicibank.com': 'icicibank',
        'icicidirect.com': 'icicidirect',
        'axis.bank.in': 'axisbank',
        'axisbank.bank.in': 'axisbank',
        'netbanking.axisbank.com': 'axisbank',
        'corporate.axisbank.com': 'axiscorporate',
        'corporate.axisbank.bank.in': 'axiscorporate',
        'corporatebanking.axisbank.com': 'axiscorporate',
        'axisdirect.in': 'axisdirect',
        'kotak.bank.in': 'kotakmahindrabank',
        'kotakbank.bank.in': 'kotakmahindrabank',
        'netbanking.kotak.com': 'kotakmahindrabank',
        'corporate.kotak.com': 'kotakcorporate',
        'corporate.kotak.bank.in': 'kotakcorporate',
        'kotaksecurities.com': 'kotaksecurities',
        'bobibanking.com': 'bobcorporate',
        'bob.bank.in': 'bankofbaroda',
        'bankofbaroda.bank.in': 'bankofbaroda',
        'pnb.bank.in': 'punjabnationalbank',
        'pnbindia.bank.in': 'punjabnationalbank',
        'pnbcorp.bank.in': 'pnbcorporate',
        'pnbcorp.com': 'pnbcorporate',
        'netpnb.com': 'punjabnationalbank',
        'canara.bank.in': 'canarabank',
        'canarabank.bank.in': 'canarabank',
        'canarabank.in': 'canarabank',
        'netbanking.canarabank.in': 'canarabank',
        'corporate.canarabank.in': 'canaracorporate',
        'corporate.canarabank.bank.in': 'canaracorporate',
        'unionbank.bank.in': 'unionbankofindia',
        'unionbankofindia.bank.in': 'unionbankofindia',
        'unionbankonline.co.in': 'unionbankofindia',
        'corp.unionbankonline.co.in': 'unionbankcorporate',
        'corp.unionbank.bank.in': 'unionbankcorporate',
        'idfcfirst.bank.in': 'idfcfirstbank',
        'idfcfirstbank.bank.in': 'idfcfirstbank',
        'indusind.bank.in': 'indusindbank',
        'federalbank.bank.in': 'federalbank',
        'rblbank.bank.in': 'rblbank',
        'boi.bank.in': 'bankofindia',
        'bankofindia.bank.in': 'bankofindia',
        'centralbank.bank.in': 'centralbankofindia',
        'iob.bank.in': 'indianoverseasbank',
        'uco.bank.in': 'ucobank',
        'rbi.org.in': 'rbi',

        // --- 5. Unified Global SSO Ecosystems (Google, MS, Apple, Adobe, Meta) ---
        // Google & YouTube 100% Unified Fleet
        'google.com': 'google',
        'google.co.in': 'google',
        'gmail.com': 'google',
        'googlemail.com': 'google',
        'mail.google.com': 'google',
        'accounts.google.com': 'google',
        'myaccount.google.com': 'google',
        'drive.google.com': 'google',
        'docs.google.com': 'google',
        'sheets.google.com': 'google',
        'slides.google.com': 'google',
        'forms.google.com': 'google',
        'keep.google.com': 'google',
        'photos.google.com': 'google',
        'play.google.com': 'google',
        'meet.google.com': 'google',
        'chat.google.com': 'google',
        'calendar.google.com': 'google',
        'contacts.google.com': 'google',
        'gemini.google.com': 'google',
        'colab.research.google.com': 'google',
        'firebase.google.com': 'google',
        'console.firebase.google.com': 'google',
        'pay.google.com': 'google',
        'one.google.com': 'google',
        'blog.google': 'google',
        'about.google': 'google',
        'safety.google': 'google',
        'store.google': 'google',
        'workspace.google': 'google',
        'g.co': 'google',
        'goo.gl': 'google',
        'youtube.com': 'google',
        'youtu.be': 'google',
        'm.youtube.com': 'google',
        'studio.youtube.com': 'google',
        'music.youtube.com': 'google',
        'tv.youtube.com': 'google',
        'kids.youtube.com': 'google',
        'artists.youtube.com': 'google',
        'creator.youtube.com': 'google',
        'artists.youtube': 'google',
        'music.youtube': 'google',

        // Microsoft Consumer Fleet
        'microsoft.com': 'microsoft',
        'outlook.com': 'microsoft',
        'outlook.live.com': 'microsoft',
        'hotmail.com': 'microsoft',
        'live.com': 'microsoft',
        'msn.com': 'microsoft',
        'login.live.com': 'microsoft',
        'login.microsoftonline.com': 'microsoft',
        'office.com': 'microsoft',
        'office365.com': 'microsoft',
        'microsoft365.com': 'microsoft',
        'onedrive.live.com': 'microsoft',
        'onedrive.com': 'microsoft',
        'xbox.com': 'microsoft',
        'skype.com': 'microsoft',
        'bing.com': 'microsoft',
        'copilot.microsoft.com': 'microsoft',

        // Apple Fleet
        'apple.com': 'apple',
        'icloud.com': 'apple',
        'appleid.apple.com': 'apple',
        'account.apple.com': 'apple',
        'itunes.apple.com': 'apple',
        'appstore.com': 'apple',
        'music.apple.com': 'apple',
        'tv.apple.com': 'apple',
        'developer.apple.com': 'apple',
        'appstoreconnect.apple.com': 'apple',
        'findmy.apple.com': 'apple',

        // Adobe Fleet
        'adobe.com': 'adobe',
        'account.adobe.com': 'adobe',
        'creativecloud.adobe.com': 'adobe',
        'behance.net': 'adobe',
        'fonts.adobe.com': 'adobe',
        'stock.adobe.com': 'adobe',
        'firefly.adobe.com': 'adobe',
        'lightroom.adobe.com': 'adobe',

        // Social Media & Messaging
        'fb.com': 'facebook',
        'facebook.com': 'facebook',
        'm.facebook.com': 'facebook',
        'messenger.com': 'facebook',
        'instagram.com': 'instagram',
        'ig.me': 'instagram',
        'threads.net': 'instagram',
        'web.whatsapp.com': 'whatsapp',
        'whatsapp.com': 'whatsapp',
        'wa.me': 'whatsapp',
        'web.telegram.org': 'telegram',
        'telegram.org': 'telegram',
        't.me': 'telegram',
        'discord.com': 'discord',
        'discord.gg': 'discord',
        'spotify.com': 'spotify',
        'open.spotify.com': 'spotify',
        'artists.spotify.com': 'spotify',
        'app.element.io': 'matrix',
        'bit.ly': 'bitly',
        'amzn.to': 'amazon',
        'amzn.in': 'amazon',
        'primevideo.com': 'amazon',
        'audible.com': 'amazon',
        'audible.in': 'amazon',

        // --- 6. Indian & Global Public / Regulatory Services ---
        'incometax.gov.in': 'incometax',
        'incometaxindiaefiling.gov.in': 'incometax',
        'gst.gov.in': 'gstportal',
        'services.gst.gov.in': 'gstportal',
        'epfindia.gov.in': 'epfo',
        'unifiedportal-mem.epfindia.gov.in': 'epfo',
        'parivahan.gov.in': 'parivahansewa',
        'sarathi.parivahan.gov.in': 'parivahansewa',
        'vahan.parivahan.gov.in': 'parivahansewa',
        'passportindia.gov.in': 'passportseva',
        'digilocker.gov.in': 'digilocker',
        'kite.zerodha.com': 'zerodha',
        'groww.in': 'groww',
        'upstox.com': 'upstox',
        'pro.upstox.com': 'upstox',
        'irctc.co.in': 'irctc',
        'air.irctc.co.in': 'irctcair',
        'irctctourism.com': 'irctctourism',
        'irs.gov': 'internalrevenueservice',
        'ssa.gov': 'socialsecurityadministration',
        'gov.uk': 'govuk',
        'canada.ca': 'canadarevenueagency'
    };

    // Human-friendly ecosystem labels & hints
    const ECOSYSTEM_LABELS = {
        'google': 'Google Account SSO (Unified Gmail, YouTube, Drive & Docs)',
        'microsoft': 'Microsoft Account SSO (Unified Outlook, Office 365 & Xbox)',
        'apple': 'Apple ID / iCloud Unified Account',
        'adobe': 'Adobe Creative Cloud ID',
        'facebook': 'Meta / Facebook Platform',
        'instagram': 'Instagram & Threads Media Account',
        'amazon': 'Amazon Retail Shopping & Prime Video',
        'aws': 'Amazon Web Services (AWS Cloud Infrastructure)',
        'azure': 'Microsoft Azure Cloud & Entra ID',
        'oraclecloud': 'Oracle Cloud Infrastructure',
        'ibmcloud': 'IBM Cloud Platform',
        'alibabacloud': 'Alibaba Cloud',
        'cloudflare': 'Cloudflare Global Edge Platform',
        'amazonseller': 'Amazon Seller Central Hub',
        'amazonkdp': 'Amazon Kindle Direct Publishing',
        'amazonassociates': 'Amazon Associates / Affiliate',
        'amazonmerch': 'Merch by Amazon',
        'amazonads': 'Amazon Advertising Platform',
        'flipkartseller': 'Flipkart Seller Hub',
        'shopifyadmin': 'Shopify Store Admin',
        'swiggypartner': 'Swiggy Partner Portal',
        'zomatomerchant': 'Zomato Merchant Portal',
        'airtelpaymentsbank': 'Airtel Payments Bank',
        'jiopaymentsbank': 'Jio Payments Bank',
        'paytmpaymentsbank': 'Paytm Payments Bank',
        'paytmmoney': 'Paytm Money (Stocks & MF)',
        'icicibank': 'ICICI Bank Retail NetBanking',
        'icicicorporate': 'ICICI Bank Corporate NetBanking',
        'icicidirect': 'ICICI Direct Investments',
        'hdfcbank': 'HDFC Bank Retail NetBanking',
        'hdfccorporate': 'HDFC Bank Corporate Banking',
        'hdfcsecurities': 'HDFC Securities',
        'hdfcmycards': 'HDFC MyCards Portal',
        'statebankofindia': 'State Bank of India Retail NetBanking',
        'sbicorporate': 'SBI YONO Business / Corporate Banking',
        'sbicard': 'SBI Credit Card Portal',
        'sbisecurities': 'SBI Securities / Demat',
        'axisbank': 'Axis Bank Retail NetBanking',
        'axiscorporate': 'Axis Bank Corporate NetBanking',
        'axisdirect': 'Axis Direct Investments',
        'kotakmahindrabank': 'Kotak Mahindra Retail NetBanking',
        'kotakcorporate': 'Kotak Corporate Banking',
        'kotaksecurities': 'Kotak Securities',
        'bobcorporate': 'Bank of Baroda Corporate',
        'pnbcorporate': 'PNB Corporate NetBanking',
        'canaracorporate': 'Canara Bank Corporate',
        'unionbankcorporate': 'Union Bank Corporate',
        'googlecloud': 'Google Cloud Platform (GCP Console)',
        'chatgpt': 'OpenAI ChatGPT',
        'openai': 'OpenAI Developer Platform',
        'anthropic': 'Anthropic Claude AI & Console',
        'slack': 'Slack Workspace',
        'postman': 'Postman API Platform',
        'jira': 'Atlassian Jira Software',
        'confluence': 'Atlassian Confluence',
        'atlassian': 'Atlassian Cloud Admin',
        'bitbucket': 'Atlassian Bitbucket',
        'gitlab': 'GitLab DevOps Platform',
        'github': 'GitHub Developer Platform',
        'datadog': 'Datadog Cloud Monitoring',
        'sentry': 'Sentry Application Performance',
        'grafana': 'Grafana Cloud Observability',
        'matrix': 'Matrix / Element Secure Chat',
        'incometax': 'Income Tax Department e-Filing Portal',
        'gstportal': 'GST Portal India',
        'epfo': 'EPFO Member Portal (UAN)',
        'parivahansewa': 'Parivahan Sewa (DL & RC)',
        'irctcair': 'IRCTC Air Flight Booking',
        'irctctourism': 'IRCTC Tourism Portal'
    };

    // Known multi-part Second Level Domains (SLDs / Public Suffixes)
    const MULTI_PART_SLDS = new Set([
        // India
        'bank.in', 'ernet.in', 'res.in', 'nic.in', 'gov.in', 'co.in', 'ac.in', 'edu.in', 'net.in', 'org.in', 'gen.in', 'firm.in', 'ind.in', 'mil.in',
        // UK
        'gov.uk', 'co.uk', 'org.uk', 'ac.uk', 'net.uk', 'police.uk', 'judiciary.uk', 'nhs.uk',
        // Australia
        'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au',
        // New Zealand
        'govt.nz', 'co.nz', 'ac.nz', 'org.nz', 'net.nz',
        // Canada
        'gc.ca',
        // Brazil
        'com.br', 'gov.br', 'edu.br', 'org.br',
        // Japan
        'co.jp', 'ne.jp', 'or.jp', 'go.jp', 'ac.jp',
        // South Africa
        'co.za', 'gov.za',
        // Middle East & Singapore
        'gov.ae', 'co.ae', 'gov.sg', 'edu.sg', 'com.sg', 'gov.sa'
    ]);

    /**
     * Normalizes a raw input string into a standard FrankPass platform slug.
     * Guaranteed to be identical across Web and Extension.
     */
    function getNormalizedPlatform(raw) {
        if (!raw) return '';
        let platform = raw.toLowerCase().trim();
        
        // 1. Strip protocol, query parameters and hash anchors
        platform = platform.replace(/^(https?:\/\/)?/, '').split('?')[0].split('#')[0];
        
        // If it looks like a URL domain with a path (e.g. "github.com/login" or "incometax.gov.in/iec"), strip the path
        if (platform.includes('/') && (raw.startsWith('http') || /^[a-z0-9.-]+\.[a-z]{2,}\//i.test(platform))) {
            platform = platform.split('/')[0];
        }

        // 2. Handle email signatures (treat everything after @ as the platform domain)
        if (platform.includes('@')) {
            platform = platform.split('@')[1];
        }

        // 3. Check Brand TLDs (e.g. .sbi, .google, .youtube, .apple, .aws, .amazon)
        if (platform.endsWith('.sbi')) {
            if (platform.includes('yonobusiness') || platform.includes('corp')) return 'sbicorporate';
            if (platform.includes('card')) return 'sbicard';
            if (platform.includes('securities') || platform.includes('smart')) return 'sbisecurities';
            return 'statebankofindia';
        }
        if (platform.endsWith('.google') || platform.endsWith('.youtube')) {
            return 'google';
        }
        if (platform.endsWith('.apple')) {
            return 'apple';
        }
        if (platform.endsWith('.aws')) {
            return 'aws';
        }
        if (platform.endsWith('.amazon')) {
            return 'amazon';
        }

        // 4. Priority Check: Direct match in Visual / Subdomain Exception Registry
        if (VISUAL_ALIASES[platform]) {
            return VISUAL_ALIASES[platform];
        }

        // 5. Strip common generic subdomain noise
        const strippedPlatform = platform.replace(/^(www\.|m\.|app\.|login\.|secure\.|auth\.|account\.)/, '');
        if (VISUAL_ALIASES[strippedPlatform]) {
            return VISUAL_ALIASES[strippedPlatform];
        }
        platform = strippedPlatform;
        
        // 6. Strip parenthetical and trailing hyphen acronym suffixes
        platform = platform.replace(/\s+[-–-]\s+[a-z0-9\s]+$/, '');
        platform = platform.replace(/\s*\([^)]*\)/g, '');

        // 7. Check again if cleaned string matches an alias
        if (VISUAL_ALIASES[platform]) {
            return VISUAL_ALIASES[platform];
        }

        // 8. Robust Domain & Subdomain Extraction (handles .bank.in, .co.uk, .com.au, .co.in, .gov.in etc)
        let domainParts = platform.split('.');
        if (domainParts.length >= 3) {
            const lastTwo = domainParts.slice(-2).join('.');
            if (MULTI_PART_SLDS.has(lastTwo) || (domainParts[domainParts.length - 2].length <= 3 && domainParts[domainParts.length - 1].length <= 3)) {
                // Suffix is 2-level (e.g. bank.in, co.in, gov.in)
                const baseDomain = domainParts[domainParts.length - 3];
                const subdomains = domainParts.slice(0, domainParts.length - 3).join('.');
                
                // Segment Intelligence for Banking / Corporate Subdomains
                if (subdomains.includes('yonobusiness') || subdomains.includes('corporate') || subdomains.includes('corp') || subdomains.includes('cib')) {
                    if (baseDomain === 'sbi') platform = 'sbicorporate';
                    else if (baseDomain === 'hdfc' || baseDomain === 'hdfcbank') platform = 'hdfccorporate';
                    else if (baseDomain === 'icici' || baseDomain === 'icicibank') platform = 'icicicorporate';
                    else if (baseDomain === 'axis' || baseDomain === 'axisbank') platform = 'axiscorporate';
                    else if (baseDomain === 'kotak') platform = 'kotakcorporate';
                    else if (baseDomain === 'bob' || baseDomain === 'bankofbaroda') platform = 'bobcorporate';
                    else if (baseDomain === 'pnb') platform = 'pnbcorporate';
                    else if (baseDomain === 'canara' || baseDomain === 'canarabank') platform = 'canaracorporate';
                    else if (baseDomain === 'unionbank') platform = 'unionbankcorporate';
                    else platform = baseDomain + 'corporate';
                } else {
                    platform = baseDomain;
                }
            } else {
                // Standard 1-level TLD (e.g. .com, .net, .org, .sbi)
                const baseDomain = domainParts[domainParts.length - 2];
                const subdomains = domainParts.slice(0, domainParts.length - 2).join('.');
                if (subdomains.includes('yonobusiness') || subdomains.includes('corporate') || subdomains.includes('corp') || subdomains.includes('cib')) {
                    if (baseDomain === 'sbi') platform = 'sbicorporate';
                    else if (baseDomain === 'hdfc' || baseDomain === 'hdfcbank') platform = 'hdfccorporate';
                    else if (baseDomain === 'icici' || baseDomain === 'icicibank') platform = 'icicicorporate';
                    else if (baseDomain === 'axis' || baseDomain === 'axisbank') platform = 'axiscorporate';
                    else if (baseDomain === 'kotak') platform = 'kotakcorporate';
                    else if (baseDomain === 'bob' || baseDomain === 'bankofbaroda') platform = 'bobcorporate';
                    else if (baseDomain === 'pnb') platform = 'pnbcorporate';
                    else if (baseDomain === 'canara' || baseDomain === 'canarabank') platform = 'canaracorporate';
                    else if (baseDomain === 'unionbank') platform = 'unionbankcorporate';
                    else platform = baseDomain + 'corporate';
                } else {
                    platform = baseDomain;
                }
            }
        } else if (domainParts.length === 2) {
            platform = domainParts[0];
        } else {
            platform = domainParts[0];
        }
        
        // 9. Sanitize (only letters and numbers)
        platform = platform.replace(/[^a-z0-9]/g, '');

        // 10. Apply Global Aliases (e.g., yt -> google, sbi -> statebankofindia, aws -> aws)
        return GLOBAL_ALIASES[platform] || platform;
    }

    /**
     * Returns the Pretty Name from the platforms list if it exists.
     * @param {string} slug - The normalized slug (e.g., 'facebook')
     * @param {Object} platformDB - The global regionalPlatforms object
     */
    function getPrettyNameFromDB(slug, platformDB) {
        if (!platformDB) return null;
        for (let region in platformDB) {
            const match = platformDB[region].find(p => getNormalizedPlatform(p) === slug);
            if (match) return match;
        }
        return null;
    }

    /**
     * Returns a user-friendly hint indicating how the platform name is interpreted.
     * @param {string} raw - The raw input string.
     */
    function getSeedHint(raw) {
        const normalized = getNormalizedPlatform(raw);
        if (!normalized) return '';
        
        const label = ECOSYSTEM_LABELS[normalized];
        if (label) {
            return 'Using as: "' + normalized + '" (' + label + ')';
        }
        
        return 'Using as: "' + normalized + '"';
    }

    return {
        getNormalizedPlatform: getNormalizedPlatform,
        getPrettyNameFromDB: getPrettyNameFromDB,
        getSeedHint: getSeedHint,
        GLOBAL_ALIASES: GLOBAL_ALIASES,
        VISUAL_ALIASES: VISUAL_ALIASES,
        ECOSYSTEM_LABELS: ECOSYSTEM_LABELS
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrankPassUtils;
}
