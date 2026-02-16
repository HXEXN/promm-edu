
import { SelfEvolvingPromptSystem } from '../../src/services/advanced2026.js';

async function runTests() {
    console.log("=== Testing 7D Optimization vs Token Compression Trade-offs ===\n");

    const system = new SelfEvolvingPromptSystem();
    const basePrompt = "Write a blog post about AI in agriculture.";

    // Feedback that suggests adding structure (which adds tokens)
    const feedback = {
        clarityScore: 50, // Triggers 'add_structure'
        specificityScore: 50, // Triggers 'add_examples'
        tokenEfficiency: 80,
        outputQuality: 60 // Triggers 'add_constraints'
    };

    console.log(`Original Prompt: "${basePrompt}"`);
    console.log(`Initial Tokens: ${system.estimateTokens(basePrompt)}\n`);

    // Test 1: Quality Mode (Should add everything)
    console.log("--- Test 1: Quality Mode ---");
    const qualityResult = system.evolvePrompt(basePrompt, feedback, { mode: 'quality' });
    console.log(`Evolved Prompt (Quality): \n"${qualityResult.evolvedPrompt.substring(0, 100)}..."`);
    console.log(`Tokens: ${qualityResult.tokenCount}`);
    console.log(`Mutations: ${qualityResult.improvements.map(i => i.type).join(', ')}`);
    console.log("Expected: Tokens > Initial, Mutations include add_structure/add_examples\n");

    // Test 2: Efficiency Mode (Should NOT add structure, might compress)
    console.log("--- Test 2: Efficiency Mode ---");
    const efficiencyResult = system.evolvePrompt(basePrompt, feedback, { mode: 'efficiency' });
    console.log(`Evolved Prompt (Efficiency): \n"${efficiencyResult.evolvedPrompt.substring(0, 100)}..."`);
    console.log(`Tokens: ${efficiencyResult.tokenCount}`);
    console.log(`Mutations: ${efficiencyResult.improvements.map(i => i.type).join(', ')}`);
    console.log("Expected: Tokens <= Initial, Mutations should NOT include add_structure (unless it was forced compressed)\n");

    // Test 3: Balanced Mode with Strict Limit
    console.log("--- Test 3: Balanced Mode (MaxTokens: 20) ---");
    // Initial is ~10 tokens. Adding structure makes it ~50. Limit 20 should block structure or force compression.
    const balancedResult = system.evolvePrompt(basePrompt, feedback, { mode: 'balanced', maxTokens: 20 });
    console.log(`Evolved Prompt (Balanced): \n"${balancedResult.evolvedPrompt.substring(0, 100)}..."`);
    console.log(`Tokens: ${balancedResult.tokenCount}`);
    console.log(`Mutations: ${balancedResult.improvements.map(i => i.type).join(', ')}`);
    console.log("Expected: Tokens <= 20\n");

}

runTests().catch(console.error);
