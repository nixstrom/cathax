import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts"

// Test the cron scheduler
console.log("🧪 Testing cron scheduler...")

// Add a test job that runs every minute
const testJob = cron("* * * * *", () => {
	console.log(`[${new Date().toISOString()}] Test job executed!`)
})

// Add a job that runs every 30 seconds (for demonstration)
let counter = 0
const quickJob = setInterval(() => {
	counter++
	console.log(
		`[${
			new Date().toISOString()
		}] Quick job #${counter} (every 30 seconds)`,
	)

	if (counter >= 10) {
		console.log("✅ Test completed after 10 quick jobs")
		clearInterval(quickJob)
		console.log("🔄 Test completed. You can stop the process with Ctrl+C")
	}
}, 30000)

console.log("⏳ Running test for 5 minutes (10 quick jobs)...")
console.log("📅 Test cron job scheduled for every minute")
console.log("⏰ Current time:", new Date().toLocaleString())
