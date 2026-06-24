import { FullConfig } from "@playwright/test";

async function globalSetup(_config: FullConfig): Promise<void> {
  await fetch("http://localhost:3001/api/testing/reset", { method: "POST" });
}

export default globalSetup;
