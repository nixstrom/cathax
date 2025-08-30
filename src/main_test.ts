// Test the cron scheduler
console.log("🧪 Testing Deno.cron functionality...")

// Add a test job that runs every 30 seconds
Deno.cron("test-job", "*/30 * * * * *", () => {
	console.log(`[${new Date().toISOString()}] Test job executed!`)
})

// Add a job that runs every 10 seconds for demonstration
let counter = 0
const quickJob = setInterval(() => {
	counter++
	console.log(
		`[${
			new Date().toISOString()
		}] Quick job #${counter} (every 10 seconds)`,
	)

	if (counter >= 6) {
		console.log("✅ Test completed after 6 quick jobs")
		clearInterval(quickJob)
		console.log("🔄 Test completed. You can stop the process with Ctrl+C")
	}
}, 10000)

console.log("⏳ Running test for 1 minute (6 quick jobs)...")
console.log("📅 Test cron job scheduled for every 30 seconds")
console.log("⏰ Current time:", new Date().toLocaleString())
