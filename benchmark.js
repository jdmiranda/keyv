import Keyv from './packages/keyv/dist/index.js';

const ITERATIONS = 100000;

// Benchmark utility
function benchmark(name, fn) {
	const start = process.hrtime.bigint();
	fn();
	const end = process.hrtime.bigint();
	const duration = Number(end - start) / 1e6; // Convert to milliseconds
	return { name, duration, opsPerSec: Math.round((ITERATIONS / duration) * 1000) };
}

async function runBenchmarks() {
	console.log('🔥 Running Keyv Performance Benchmarks\n');
	console.log(`Iterations: ${ITERATIONS.toLocaleString()}\n`);

	const results = [];

	// Benchmark 1: Set primitive values
	const keyv1 = new Keyv();
	const result1 = benchmark('Set primitive values', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			keyv1.set(`key${i}`, i);
		}
	});
	results.push(result1);

	// Benchmark 2: Get primitive values
	const keyv2 = new Keyv();
	for (let i = 0; i < ITERATIONS; i++) {
		await keyv2.set(`key${i}`, i);
	}
	const result2 = benchmark('Get primitive values', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			keyv2.get(`key${i}`);
		}
	});
	results.push(result2);

	// Benchmark 3: Set string values
	const keyv3 = new Keyv();
	const result3 = benchmark('Set string values', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			keyv3.set(`key${i}`, `value${i}`);
		}
	});
	results.push(result3);

	// Benchmark 4: Get string values
	const keyv4 = new Keyv();
	for (let i = 0; i < ITERATIONS; i++) {
		await keyv4.set(`key${i}`, `value${i}`);
	}
	const result4 = benchmark('Get string values', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			keyv4.get(`key${i}`);
		}
	});
	results.push(result4);

	// Benchmark 5: Set objects
	const keyv5 = new Keyv();
	const result5 = benchmark('Set object values', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			keyv5.set(`key${i}`, { id: i, name: `user${i}` });
		}
	});
	results.push(result5);

	// Benchmark 6: Get objects
	const keyv6 = new Keyv();
	for (let i = 0; i < ITERATIONS; i++) {
		await keyv6.set(`key${i}`, { id: i, name: `user${i}` });
	}
	const result6 = benchmark('Get object values', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			keyv6.get(`key${i}`);
		}
	});
	results.push(result6);

	// Benchmark 7: Has checks
	const keyv7 = new Keyv();
	for (let i = 0; i < ITERATIONS; i++) {
		await keyv7.set(`key${i}`, i);
	}
	const result7 = benchmark('Has operations', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			keyv7.has(`key${i}`);
		}
	});
	results.push(result7);

	// Print results
	console.log('📊 Benchmark Results:\n');
	console.log('┌─────────────────────────┬──────────────┬────────────────┐');
	console.log('│ Operation               │ Duration (ms)│ Ops/sec        │');
	console.log('├─────────────────────────┼──────────────┼────────────────┤');

	for (const result of results) {
		const name = result.name.padEnd(23);
		const duration = result.duration.toFixed(2).padStart(12);
		const opsPerSec = result.opsPerSec.toLocaleString().padStart(14);
		console.log(`│ ${name} │ ${duration} │ ${opsPerSec} │`);
	}

	console.log('└─────────────────────────┴──────────────┴────────────────┘');

	// Calculate aggregate metrics
	const totalOps = ITERATIONS * results.length;
	const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
	const avgOpsPerSec = Math.round((totalOps / totalDuration) * 1000);

	console.log('\n📈 Summary:');
	console.log(`   Total operations: ${totalOps.toLocaleString()}`);
	console.log(`   Total duration: ${totalDuration.toFixed(2)} ms`);
	console.log(`   Average throughput: ${avgOpsPerSec.toLocaleString()} ops/sec`);

	return results;
}

runBenchmarks().catch(console.error);
