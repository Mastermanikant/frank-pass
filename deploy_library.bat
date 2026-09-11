@echo off
echo ========================================================
echo Deploying FrankPass Library & 301 Redirect Updates
echo ========================================================
git push origin main
echo Git push to origin main completed.
echo Deploying to Cloudflare Pages edge network...
call npx wrangler pages deploy . --project-name=frankpass --branch=main
echo ========================================================
echo Deployment Complete!
echo ========================================================
pause
