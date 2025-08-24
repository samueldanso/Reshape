"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMcpServerStatus } from "@/hooks/use-mcp";

export function MCPTest() {
	const { data: serverStatus, isLoading, error } = useMcpServerStatus();
	const [status, setStatus] = useState<string>("");
	const [availableTools, setAvailableTools] = useState<string[]>([]);

	const testConnection = async () => {
		try {
			setStatus("Testing MCP connection...");
			const response = await fetch("/api/call-mcp-tool");
			const data = await response.json();

			if (data.success) {
				setStatus("✅ MCP connection successful!");
				setAvailableTools(
					data.availableTools?.map((tool: any) => tool.name) || [],
				);
			} else {
				setStatus(`❌ MCP connection failed: ${data.error}`);
			}
		} catch (err) {
			setStatus(
				`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`,
			);
		}
	};

	const testChainStatus = async () => {
		try {
			setStatus("Testing getChainStatus tool...");
			const response = await fetch("/api/call-mcp-tool", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					toolName: "getChainStatus",
					parameters: { random_string: "test" },
				}),
			});
			const result = await response.json();
			setStatus(`✅ Chain status: ${JSON.stringify(result, null, 2)}`);
		} catch (err) {
			setStatus(
				`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`,
			);
		}
	};

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>MCP Integration Test</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex gap-2">
					<Button onClick={testConnection} disabled={isLoading}>
						Test MCP Connection
					</Button>
					<Button onClick={testChainStatus} disabled={isLoading}>
						Test Chain Status
					</Button>
				</div>

				{status && (
					<div className="p-3 bg-muted rounded-md">
						<pre className="text-sm whitespace-pre-wrap">{status}</pre>
					</div>
				)}

				{error && (
					<div className="p-3 bg-destructive/10 text-destructive rounded-md">
						Error: {error.message || String(error)}
					</div>
				)}

				{availableTools.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Available MCP Tools:</h4>
						<div className="grid grid-cols-2 gap-2">
							{availableTools.map((tool) => (
								<div key={tool} className="p-2 bg-muted rounded text-sm">
									{tool}
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
