---
name: Cloudflare Pages deployment
description: User-confirmed production deployment path for this project.
---

Use the existing Cloudflare Pages CI/CD pipeline for production releases; the Replit preview workflow is for development only.

**Why:** The user confirmed on 2026-11-09 that CI/CD works and asked to focus on the Replit preview and configuration.

**How to apply:** Keep production deployment separate from the Replit preview. When a production release is requested, use the configured Cloudflare Pages pipeline rather than Replit publishing.
