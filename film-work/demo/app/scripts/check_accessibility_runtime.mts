import { runAccessibilityAudit } from "./check_accessibility_runtime";

runAccessibilityAudit().catch(() => {
  console.error("Accessibility setup failed; requires a production RUNTIME_BUILD_DIR and existing /tmp RUNTIME_SOURCE_DATABASE.");
  process.exitCode = 1;
});
