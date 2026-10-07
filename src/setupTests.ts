/**
 * ===========================================
 * Test Setup
 * ===========================================
 *
 * Loaded once before the suite. Registers the
 * jest-dom matchers (toBeInTheDocument and friends)
 * and unmounts anything a test rendered, so one test
 * cannot see another's DOM.
 */

import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
