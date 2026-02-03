/**
 * Build wrapper: runs next build with increased Node heap and logs to debug.log
 * Tests H1: Default Node heap too small for Next build (Collecting page data).
 * Log path: workspace/.cursor/debug.log
 */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const LOG_DIR = path.join(process.cwd(), "..", ".cursor");
const LOG_PATH = path.join(LOG_DIR, "debug.log");
const RUN_ID = process.env.DEBUG_RUN_ID || "run1";

function log(entry) {
  const line = JSON.stringify({ ...entry, timestamp: Date.now(), sessionId: "debug-session" }) + "\n";
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(LOG_PATH, line);
  } catch (e) {
    console.warn("Debug log write failed:", e.message);
  }
}

// #region agent log
log({
  runId: RUN_ID,
  hypothesisId: "H1",
  location: "scripts/build-with-memory.js:start",
  message: "Build started with NODE_OPTIONS max-old-space-size=4096",
  data: { cwd: process.cwd(), logPath: LOG_PATH },
});
// #endregion agent log

const child = spawn(
  process.execPath,
  ["--max-old-space-size=4096", path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next"), "build"],
  { stdio: "inherit", cwd: process.cwd(), shell: false }
);

child.on("close", (code, signal) => {
  // #region agent log
  log({
    runId: RUN_ID,
    hypothesisId: "H1",
    location: "scripts/build-with-memory.js:close",
    message: "Build process exited",
    data: { code, signal, success: code === 0 },
  });
  // #endregion agent log
  process.exit(code != null ? code : signal ? 1 : 0);
});

child.on("error", (err) => {
  // #region agent log
  log({
    runId: RUN_ID,
    hypothesisId: "H1",
    location: "scripts/build-with-memory.js:error",
    message: "Build spawn error",
    data: { err: err.message },
  });
  // #endregion agent log
  process.exit(1);
});
