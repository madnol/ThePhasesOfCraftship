import { Config } from "./index";

describe("Config", () => {
  const mockConfig = {
    api: { url: "http://localhost:3000" },
    database: {
      adminPassword: "admin",
      connectionString: "postgresql://localhost:5432/test"
    },
    webserver: { port: 3000 },
    auth: {
      firebase: {
        apiKey: "key",
        domain: "domain",
        projectId: "project",
        storageBucket: "bucket",
        messagingSender: "sender",
        appId: "app"
      }
    },
    environment: "development",
    script: "test:unit"
  };

  beforeEach(() => {
    process.env.ENV_FILE = undefined;
  });

  it("should parse config from env.json", () => {
    const config = Config();
    expect(config.api.url).toBeDefined();
    expect(config.getEnvironment()).toBe("development");
    expect(config.getScript()).toBe("test:unit");
  });

  it("should override script when provided", () => {
    const config = Config("test:e2e");
    expect(config.getScript()).toBe("test:e2e");
  });

  it("should parse config from ENV_FILE", () => {
    process.env.ENV_FILE = JSON.stringify(mockConfig);
    const config = Config();
    expect(config.api.url).toBe(mockConfig.api.url);
    expect(config.getEnvironment()).toBe(mockConfig.environment);
    expect(config.getScript()).toBe(mockConfig.script);
  });

  it("should override script even when ENV_FILE is provided", () => {
    process.env.ENV_FILE = JSON.stringify(mockConfig);
    const config = Config("test:e2e");
    expect(config.getScript()).toBe("test:e2e");
  });

  it("should throw error on invalid config", () => {
    process.env.ENV_FILE = JSON.stringify({ invalid: "config" });
    expect(() => Config()).toThrow();
  });
});
