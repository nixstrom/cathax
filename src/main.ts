// Load environment variables from .env file
async function loadEnv() {
	try {
		const envFile = await Deno.readTextFile(".env")
		const lines = envFile.split("\n")

		for (const line of lines) {
			const trimmed = line.trim()
			if (trimmed && !trimmed.startsWith("#")) {
				const [key, ...valueParts] = trimmed.split("=")
				const value = valueParts.join("=")
				if (key && value) {
					Deno.env.set(key, value)
				}
			}
		}
		console.log("✅ Environment variables loaded from .env file")
	} catch (error) {
		console.log("ℹ️  No .env file found, using system environment variables")
	}
}

// Load environment variables before proceeding
await loadEnv()

const CATS = [
	{
		catName: "Perrin",
		catId: 1857897,
		feederId: 1057701,
	},
	{
		catName: "Sif",
		catId: 1857902,
		feederId: 1108504,
	},
]

const ACTIONS = {
	ASSIGN: 1,
	UNASSIGN: 2,
} as const

// Get token from environment variable
const TOKEN = Deno.env.get("SUREHUB_TOKEN")

if (!TOKEN) {
	console.error("❌ SUREHUB_TOKEN environment variable is required!")
	console.error("Please set it before running the application:")
	console.error("export SUREHUB_TOKEN='your-token-here'")
	console.error("Or run: SUREHUB_TOKEN='your-token-here' deno task start")
}

/**
 * Assigns all cats to their respective feeders
 */
async function assignAllPets() {
	try {
		console.log(
			`[${
				new Date().toISOString()
			}] Starting API calls for ${CATS.length} cats...`,
		)

		// Iterate through each cat and make the API request
		for (const cat of CATS) {
			console.log(
				`🐱 Processing cat ID: ${cat.catId}, feeder ID: ${cat.feederId}`,
			)

			const response = await fetch(
				`https://app-api.production.surehub.io/api/v2/device/${cat.feederId}/tag/async`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${TOKEN}`,
					},
					body: JSON.stringify([
						{ tag_id: cat.catId, request_action: ACTIONS.ASSIGN },
					]),
				},
			)

			if (response.ok) {
				const result = await response.json()
				console.log(
					`✅ Successfully assigned ${cat.catName} from feeder:`,
					result,
				)
			} else {
				console.error(
					`❌ Failed to unassign ${cat.catName}:`,
					response.status,
					response.statusText,
				)
			}
		}

		console.log(
			`[${new Date().toISOString()}] Completed API calls for all cats`,
		)
	} catch (error) {
		console.error(`[${new Date().toISOString()}] Error calling API:`, error)
	}
}

// Set up cron job to run every 10 seconds
Deno.cron("sample cron", "*/10 * * * *", () => {
	console.log("🚀 Cron job scheduler started!")
	console.log("📅 API call scheduled for every 10 seconds")
	console.log("⏰ Current time:", new Date().toLocaleString())
	assignAllPets()
})

// For testing: you can manually trigger the API call
if (import.meta.main) {
	console.log(
		"🧪 To test the API call immediately, uncomment the line below:",
	)
	// callDailyAPI(); // Uncomment this to test immediately

	// Keep the process alive
	console.log("⏳ Cron scheduler is running. Press Ctrl+C to stop.")

	// Simple way to keep the process running
	const keepAlive = setInterval(() => {
		// This keeps the process alive
	}, 60000) // Check every minute

	// Handle shutdown gracefully
	addEventListener("beforeunload", () => {
		console.log("🛑 Shutting down cron scheduler...")
		clearInterval(keepAlive)
	})
}
