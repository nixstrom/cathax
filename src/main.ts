// Load environment variables from .env file
async function loadEnv() {
	try {
		const envFile = await Deno.readTextFile(".env");
		const lines = envFile.split("\n");

		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith("#")) {
				const [key, ...valueParts] = trimmed.split("=");
				const value = valueParts.join("=");
				if (key && value) {
					Deno.env.set(key, value);
				}
			}
		}
		console.log("✅ Environment variables loaded from .env file");
	} catch (_error) {
		console.log("ℹ️  No .env file found, using system environment variables");
	}
}

const CATS = [
	{
		catName: "Perrin",
		catId: 1857897,
		feederId: 1057701,
	},
	{
		catName: "Sumi",
		catId: 2735946,
		feederId: 1108504,
	},
];

const ACTIONS = {
	ASSIGN: 1,
	UNASSIGN: 2,
} as const;

async function fetchWithRetry(
	input: RequestInfo | URL,
	init: RequestInit,
	options?: {
		maxAttempts?: number;
		baseDelayMs?: number;
	}
) {
	const maxAttempts = options?.maxAttempts ?? 3;
	const baseDelayMs = options?.baseDelayMs ?? 500;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const response = await fetch(input, init);

			// Retry on transient responses
			if (
				response.ok ||
				!(
					response.status === 429 ||
					(response.status >= 500 && response.status <= 599) ||
					response.status === 408
				)
			) {
				return response;
			}

			if (attempt === maxAttempts) return response;
		} catch (_error) {
			if (attempt === maxAttempts) throw _error;
		}

		// Exponential backoff with jitter
		const expDelay = baseDelayMs * 2 ** (attempt - 1);
		const jitter = Math.floor(Math.random() * (expDelay / 2));
		const delayMs = expDelay + jitter;
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}

	// Should be unreachable
	throw new Error("fetchWithRetry: exhausted retries");
}

type Cat = (typeof CATS)[number];

async function assignCat(cat: Cat, token: string) {
	console.log(`🐱 Processing cat ID: ${cat.catId}, feeder ID: ${cat.feederId}`);

	let response: Response;
	try {
		response = await fetchWithRetry(
			`https://app-api.production.surehub.io/api/v2/device/${cat.feederId}/tag/async`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify([
					{ tag_id: cat.catId, request_action: ACTIONS.ASSIGN },
				]),
			},
			{ maxAttempts: 3, baseDelayMs: 500 },
		);
	} catch (_error) {
		console.error(`❌ Failed to assign ${cat.catName} after retries:`, _error);
		return;
	}

	if (response.ok) {
		const result = await response.json();
		console.log(`✅ Successfully assigned ${cat.catName} to feeder:`, result);
		return;
	}

	console.error(
		`❌ Failed to assign ${cat.catName}:`,
		response.status,
		response.statusText,
	);
}

/**
 * Assigns all cats to their respective feeders
 */
async function assignAllPets() {
	try {
		console.log(
			`[${new Date().toISOString()}] Starting API calls for ${
				CATS.length
			} cats...`
		);

		// Process cats sequentially via a promise-based reduce.
		await CATS.reduce(async (prev, cat) => {
			await prev;
			await assignCat(cat, TOKEN);
		}, Promise.resolve());

		console.log(
			`[${new Date().toISOString()}] Completed API calls for all cats`
		);
	} catch (error) {
		console.error(`[${new Date().toISOString()}] Error calling API:`, error);
	}
}

// Load environment variables before proceeding
await loadEnv();

const TOKEN = Deno.env.get("SUREHUB_TOKEN")!;

if (!TOKEN) {
	console.error("❌ SUREHUB_TOKEN environment variable is required!");
	console.error("Please set it before running the application:");
	console.error("export SUREHUB_TOKEN='your-token-here'");
	console.error("Or run: SUREHUB_TOKEN='your-token-here' deno task start");
	throw new Error("Missing required environment variable: SUREHUB_TOKEN");
}

// Set up cron job to run at 2 AM CET daily (1 AM UTC)
Deno.cron("assign-pets", "0 1 * * *", async () => {
	await assignAllPets();
});
