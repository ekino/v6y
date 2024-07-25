import { parentPort } from "worker_threads";
import { AppLogger } from "@v6y/commons";

AppLogger.info(
  "******************** Starting background app audits **************************",
);

try {
  // ... (Your audit logic would go here) ...

  AppLogger.info(
    "******************** App audits completed successfully ********************",
  );
  parentPort.postMessage("App audits have completed.");
} catch (error) {
  AppLogger.error(
    // Use AppLogger.error for exceptions
    "[AppsAuditorWorker - appAudits] An exception occurred during the app audits:",
    error,
  );
  parentPort.postMessage("App audits encountered an error."); // Notify the parent of the error
}
