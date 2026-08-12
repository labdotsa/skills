# Release quality evidence

`field-vitals.json` records available 28-day mobile and desktop p75 Core Web Vitals, or an explicit no-data reason. Never substitute Lighthouse TBT for field INP.

`manual-accessibility.json` is the blocking human release record for issue #24. A tester must replace `testedRevision` with the full implementation commit SHA and mark each check `pass` only after covering every scope exported by `scripts/lib/quality-evidence.mjs`. Each coverage entry records `scope`, `status`, `journey`, `expected`, `actual`, and a null or linked `issue`. VoiceOver must use Safari on macOS; NVDA must use Firefox or Chrome on Windows.

The validator deliberately rejects pending, missing, duplicated, failed, or unknown coverage. Automated tests do not replace this evidence.
