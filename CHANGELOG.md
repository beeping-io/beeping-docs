# Changelog

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]
### Added
- Added mandatory validation scripts for docs structure, content, and i18n coverage.
- Added mandatory language switch links between English and Spanish documentation.
- Added multilingual support (English default with Spanish) and a language dropdown in the navbar.
- Added browser-locale-based redirect on first visit to send Spanish users to `/es/`.
- Updated OSS docs: refreshed README, CONTRIBUTING guidance, and MIT license notes.
- Added Spanish documentation mirror for all docs pages.
- Added Spanish home page translation.
- Added Spanish translations for the homepage strings.

### Changed
- Test suite now enforces bilingual documentation, including language link verification, before the production build.
- `npm run test` now enforces docs and i18n checks before the production build.
- Documented navigation and workflow expectations for the Beeping docs site.
- Language switching is now handled exclusively by the global UI; in-content language links were removed.
- Removed remaining in-content language switch links; navbar dropdown is the only language selector.
- Localized site title per locale (EN/ES) and standardized page titles with delimiter ` | `.
- Set site title to \"Beeping Documentation\", navbar brand to \"Beeping\", and enforce \"Beeping Documentation | Page\" ordering.
- Standardized base titles (EN/ES) and ensured the homepage uses a standalone title without suffix.
- Navbar brand fixed to \"Beeping\" across locales.
- Homepage titles are locale-specific and standalone; non-home titles are standardized per locale.
- Navbar menu labels are localized for Spanish (brand remains \"Beeping\").
- Spanish homepage title is standalone and localized.

### Fixed
- Removed temporary broken `/es/docs` links from English docs until the Spanish mirror is fully available.
- Clarified changelog policy for ongoing documentation updates.

## [0.1.0] - Initial setup
- Docusaurus TypeScript project created
- Docs structure initialized
