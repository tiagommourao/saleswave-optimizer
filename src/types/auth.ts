
export interface ConfigCheckResult {
  clientId: boolean;
  tenant: boolean;
  clientSecret: boolean;
  source: "database" | "local" | null;
}
