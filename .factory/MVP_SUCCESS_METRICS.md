# MVP Success Metrics

To validate the success of the MVP (`analyze_file_performance` MCP tool), we will track the following measurable outcomes during the dogfooding phase.

## Primary Metrics

1. **Time to First Insight (TTFI)**
   - **Definition:** The time elapsed between a user running `fpl setup` and the AI successfully returning the first AST analyzer insight in the chat.
   - **Target:** < 5 minutes.

2. **Analysis Accuracy Rate**
   - **Definition:** The percentage of times the AI correctly applies the fix suggested by the AST analyzer without hallucinating or introducing regressions (measured via feedback thumbs up/down).
   - **Target:** > 85%.

3. **Tool Utilization Rate**
   - **Definition:** How often the AI autonomously decides to call `analyze_file_performance` when asked broad performance questions compared to relying on its baseline training data.
   - **Target:** > 60% of performance-related prompts should trigger the tool.

## Secondary Metrics

4. **Zero-Friction Executions**
   - **Definition:** Number of times the analyzer successfully parses the target file without throwing unsupported syntax or out-of-memory errors.
   - **Target:** > 95% success rate on files under 500kb.

5. **Developer Satisfaction (NPS)**
   - **Definition:** Qualitative feedback collected after the dogfooding session ("How likely are you to recommend FPL to another frontend developer?").
   - **Target:** NPS > 40.

6. **Demo Duration**
   - **Definition:** The time it takes for a champion to demonstrate the "wow moment" to a team member from scratch.
   - **Target:** < 60 seconds (Open file -> Ask AI -> Get precise diagnostic).
