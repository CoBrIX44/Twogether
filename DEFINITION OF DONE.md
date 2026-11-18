# DEFINITION_OF_DONE
 
## Per task / PR
- [ ] Matches the task in TASKS.md and stays within SCOPE.md
- [ ] TypeScript strict passes, lint and format clean
- [ ] Unit/component tests added or updated and passing
- [ ] Works at 375px width and on desktop
- [ ] Uses design tokens and existing components
- [ ] Keyboard accessible, labelled, visible focus, reduced motion respected
- [ ] Error and empty states handled
- [ ] No console errors or warnings
- [ ] No image data leaves the browser (local mode)
- [ ] Docs updated if behaviour, layout spec or architecture changed
- [ ] PR reviewed (or self-reviewed against this list) and merged to main
## Per feature
- [ ] Acceptance criteria in FEATURES.md / PRD.md met
- [ ] E2E coverage for its main path
- [ ] Verified on at least iOS Safari and Android Chrome
- [ ] Performance not regressed (bundle size, render time)
## MVP release (v1.0)
- [ ] All P0 requirements in PRD.md complete
- [ ] A new user goes from landing to downloaded strip in under 3 minutes without help
- [ ] Capture, filters, stickers, and JPG/PNG/PDF export work on the full device matrix
- [ ] Exports verified: correct dimensions, colours match preview, PDF prints correctly
- [ ] Lighthouse mobile 90+ on performance and accessibility
- [ ] axe reports no critical issues
- [ ] Mascot and font licenses recorded
- [ ] Camera-denied, no-camera and camera-busy states tested
- [ ] Privacy note published and verified (no uploads in Network tab)
- [ ] Deployed on HTTPS with custom domain or stable URL
- [ ] Beta feedback from at least 5 real pairs reviewed and critical issues fixed
## Together mode release (v1.5)
- [ ] Two people on different networks complete a strip
- [ ] Countdown sync within 300 ms in testing
- [ ] Disconnect, reconnect and TURN fallback handled
- [ ] Room expiry works and no photos are stored server-side
 