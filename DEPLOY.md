# Deploying to Deno Deploy with Cron

This guide explains how to deploy your cron job to Deno Deploy so it
automatically wakes up and runs on schedule.

## 🚀 **Deployment Options**

### **Option 1: Deno Deploy Cron (Recommended)**

Deno Deploy has built-in cron support that will automatically wake up your
function on schedule.

#### **1. Install Deno Deploy CLI**

```bash
deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts
```

#### **2. Login to Deno Deploy**

```bash
deployctl auth login
```

#### **3. Deploy with Cron**

```bash
deployctl deploy --project=cathax-cron src/main.ts
```

The cron configuration in `deno.jsonc` will automatically set up the scheduled
job.

### **Option 2: Manual Cron Setup**

If you prefer to set up cron manually:

#### **1. Deploy the function**

```bash
deployctl deploy --project=cathax-cron src/main.ts
```

#### **2. Set up cron in Deno Deploy dashboard**

- Go to [Deno Deploy Dashboard](https://dash.deno.com)
- Select your project
- Go to "Cron" tab
- Add new cron job:
  - **Name**: `assign-pets`
  - **Schedule**: `*/10 * * * * *` (every 10 seconds)
  - **Entrypoint**: `src/main.ts`

## ⚙️ **Environment Variables**

Set your environment variables in Deno Deploy:

#### **Via Dashboard:**

1. Go to your project in Deno Deploy
2. Click "Settings" → "Environment Variables"
3. Add `SUREHUB_TOKEN` with your actual token

#### **Via CLI:**

```bash
deployctl env set SUREHUB_TOKEN "your-token-here" --project=cathax-cron
```

## 🔄 **How It Works**

### **Local Development:**

- Uses `Deno.cron` for local testing
- Process stays alive with keep-alive mechanism
- Manual control with Ctrl+C

### **Deno Deploy:**

- Function runs once per cron trigger
- Automatically wakes up on schedule
- Process terminates after completion
- No need for keep-alive mechanisms

## 📅 **Cron Schedule Examples**

```bash
# Every 10 seconds (current)
*/10 * * * * *

# Every minute
0 * * * * *

# Every hour at minute 0
0 0 * * * *

# Every day at 3:00 AM
0 0 3 * * *

# Every Monday at 9:00 AM
0 0 9 * * 1
```

## 🧪 **Testing Deployment**

### **1. Test locally first:**

```bash
deno task start
```

### **2. Deploy and test:**

```bash
deployctl deploy --project=cathax-cron src/main.ts
```

### **3. Check logs:**

```bash
deployctl logs --project=cathax-cron
```

## 🔍 **Monitoring**

- **Logs**: View in Deno Deploy dashboard or via CLI
- **Metrics**: Monitor function execution times and success rates
- **Alerts**: Set up notifications for failures

## 🚨 **Troubleshooting**

### **Function not running:**

- Check cron schedule in dashboard
- Verify environment variables
- Check function logs for errors

### **API calls failing:**

- Verify `SUREHUB_TOKEN` is set
- Check API endpoint accessibility
- Review response status codes

### **Deployment issues:**

- Ensure all permissions are correct
- Check function entrypoint path
- Verify project name matches

## 💡 **Best Practices**

1. **Test locally** before deploying
2. **Use environment variables** for secrets
3. **Monitor logs** regularly
4. **Set appropriate cron frequency** (don't overwhelm APIs)
5. **Handle errors gracefully** in your function
6. **Use meaningful cron job names**

## 🔗 **Useful Links**

- [Deno Deploy Documentation](https://deno.com/deploy)
- [Deno Deploy Cron Guide](https://deno.com/deploy/docs/cron)
- [Deno Deploy CLI](https://deno.com/deploy/docs/deployctl)
- [Cron Expression Generator](https://crontab.guru/)
