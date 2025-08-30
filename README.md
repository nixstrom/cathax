# CatHax! 🙀

A small application that allows us to automate our cat feeders. This extends the
features of the devices, so we can create feeding schedules and the cat doesn't
have to wake us up at 3am for food.

## Features

- 🕐 Standard cron syntax for scheduling tasks
- 🚀 Uses Deno's official cron library
- 📅 Support for daily, hourly, and custom schedules
- 🧪 Built-in testing capabilities
- 🔄 Automatic job execution and rescheduling
- 🔐 Secure secret management with environment variables

## Quick Start

### 1. Set up environment variables

Copy the example environment file and configure your secrets:

```bash
cp env.example .env
# Edit .env with your actual values
```

**Required environment variables:**

- `SUREHUB_TOKEN` - Your SureHub API authentication token

### 2. Run the main scheduler

```bash
deno task start
```

This will start the cron scheduler with API calls every 5 seconds for each
configured cat.

### 3. Test the system

```bash
deno task test
```

This runs a test version that executes jobs every minute and every 30 seconds
for demonstration.

## Environment Variables

The application uses environment variables for sensitive configuration:

```bash
# Set the token for your current session
export SUREHUB_TOKEN="your-actual-token-here"

# Or run with the token inline (not recommended for production)
SUREHUB_TOKEN="your-token" deno task start
```

## Cron Pattern Syntax

The scheduler uses the standard cron patterns supported by the `deno_cron`
library:

```
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └── Second (0-59)
│ │ │ │ └──── Minute (0-59)
│ │ │ └────── Hour (0-23)
│ │ └──────── Day of month (1-31)
│ └────────── Month (1-12)
└──────────── Day of week (0-7, Sunday is 0 or 7)
```

### Current Schedule

- `*/5 * * * * *` - Every 5 seconds (for testing)

### Common Patterns

- `0 3 * * *` - Every day at 3:00 AM
- `0 * * * *` - Every hour at minute 0
- `0 9 * * 1` - Every Monday at 9:00 AM
- `*/5 * * * *` - Every 5 minutes
- `0 0 * * 0` - Every Sunday at midnight

## Configuration

### Customizing API Calls

Edit the `callDailyAPI()` function in `main.ts` to:

1. Change the API endpoint
2. Modify the request payload
3. Handle different response types
4. Add more cats to the `CATS` array

### Adding More Cron Jobs

```typescript
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts"

// Add hourly job
const hourlyJob = cron("0 * * * *", () => {
	console.log("Hourly task executed")
})

// Add weekly job
const weeklyJob = cron("0 9 * * 1", () => {
	console.log("Weekly Monday task executed")
})
```

## Available Tasks

- `deno task start` - Start the main cron scheduler
- `deno task test` - Run the test scheduler
- `deno task dev` - Run with watch mode for development

## Dependencies

The project uses the official Deno cron library:

```typescript
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts"
```

## API Configuration

The application is configured to work with the SureHub API:

1. **Endpoint**:
   `https://app-api.production.surehub.io/api/v2/device/{feederId}/tag/async`
2. **Method**: PUT
3. **Authentication**: Bearer token via `SUREHUB_TOKEN` environment variable
4. **Payload**: Tag assignment/unassignment requests

## Troubleshooting

- **Jobs not running**: Check if the process is running and the cron pattern is
  correct
- **API calls failing**: Verify the endpoint URL and authentication token
- **Process stopping**: Ensure the process stays alive with proper signal
  handling
- **Import errors**: Ensure you have network access for the cron library import
- **Missing token**: Set the `SUREHUB_TOKEN` environment variable

## License

MIT License - feel free to use and modify as needed.
