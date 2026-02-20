# AgentSend - Testing Checklist

Pre-deployment and pre-submission testing checklist.

---

## ✅ Build & Compilation

- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Production bundle size is reasonable (<5MB)

## ✅ Wallet Connection

- [ ] ArgentX connection works
- [ ] Braavos connection works
- [ ] Wallet disconnection works
- [ ] Reconnect after page refresh works
- [ ] Wrong network shows error message
- [ ] Multiple wallet switches work correctly

## ✅ Encryption Keys

- [ ] Initialize keys button appears when no keys exist
- [ ] Signature request pops up correctly
- [ ] Keys are generated after signature
- [ ] Keys persist after page refresh
- [ ] Same keys regenerated from same signature
- [ ] Public key is stored in registry
- [ ] Different wallets get different keys

## ✅ Message Sending

- [ ] Can enter recipient address
- [ ] Input validation for invalid addresses
- [ ] Cannot send empty message
- [ ] Cannot send without recipient
- [ ] Cannot send without initialized keys
- [ ] Loading state shows during send
- [ ] Message appears in chat after send
- [ ] IPFS CID is generated
- [ ] Tongo transfer completes
- [ ] Transaction hash is shown
- [ ] Error messages display clearly

## ✅ Message Display

- [ ] Sent messages appear on right (blue)
- [ ] Received messages appear on left (white)
- [ ] Timestamps are formatted correctly
- [ ] Long messages wrap properly
- [ ] Special characters render correctly
- [ ] Emoji work correctly
- [ ] Messages are sorted by time
- [ ] Auto-scroll to bottom works

## ✅ Conversation Management

- [ ] Conversations appear in sidebar
- [ ] Can click conversation to select
- [ ] Selected conversation is highlighted
- [ ] Last message preview shows
- [ ] Conversations sorted by latest
- [ ] Can switch between conversations
- [ ] Messages persist per conversation

## ✅ Balance Display

- [ ] Tongo balance shows correctly
- [ ] Balance updates after fund operation
- [ ] Balance decreases after send
- [ ] Pending balance shown separately
- [ ] Mock mode indicator visible
- [ ] Balance format is readable

## ✅ Error Handling

- [ ] Network errors show user-friendly message
- [ ] Wallet rejection shows appropriate error
- [ ] Insufficient balance shows error
- [ ] Invalid recipient shows error
- [ ] IPFS failures handled gracefully
- [ ] Tongo errors don't crash app
- [ ] Encryption errors are caught

## ✅ Loading States

- [ ] Wallet connecting shows spinner
- [ ] Key initialization shows loading
- [ ] Message sending shows loading
- [ ] Send button disables during send
- [ ] IPFS upload shows loading indicator
- [ ] All async operations have loading states

## ✅ UI/UX

### Desktop
- [ ] Layout looks good on 1920x1080
- [ ] Layout looks good on 1366x768
- [ ] No horizontal scrolling
- [ ] Buttons are properly sized
- [ ] Text is readable
- [ ] Colors have good contrast

### Mobile
- [ ] Responsive on iPhone (375px)
- [ ] Responsive on Android (360px)
- [ ] Responsive on tablet (768px)
- [ ] Sidebar toggles on mobile
- [ ] Buttons are tap-friendly (>44px)
- [ ] Input fields are accessible
- [ ] No text overflow

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Screen reader friendly (basic)
- [ ] Color contrast meets WCAG AA

## ✅ Performance

- [ ] Initial page load < 3 seconds
- [ ] Message send < 5 seconds
- [ ] No memory leaks (check DevTools)
- [ ] Smooth scrolling
- [ ] No jank on interactions
- [ ] localStorage doesn't overflow

## ✅ Browser Compatibility

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## ✅ IPFS Integration

- [ ] Mock mode works without Pinata JWT
- [ ] Real Pinata upload works with JWT
- [ ] Falls back to mock on error
- [ ] Download from IPFS works
- [ ] CID format is correct
- [ ] Error messages are clear

## ✅ Tongo Mock

- [ ] Mock mode is clearly indicated
- [ ] Balance operations work
- [ ] Transfer operations work
- [ ] Rollover operations work
- [ ] Transaction delays are realistic
- [ ] Mock data persists in localStorage

## ✅ Security

- [ ] Private keys never leave device
- [ ] No sensitive data in console logs
- [ ] No sensitive data in URLs
- [ ] localStorage is wallet-specific
- [ ] Signature requests are clear
- [ ] No XSS vulnerabilities (basic check)

## ✅ Documentation

- [ ] README is complete
- [ ] Quick start works for new user
- [ ] Environment variables documented
- [ ] Architecture is explained
- [ ] Code has inline comments
- [ ] API/hooks have JSDoc

## ✅ Deployment

- [ ] Vercel deployment succeeds
- [ ] Environment variables set correctly
- [ ] Demo URL works in incognito
- [ ] Demo URL works on mobile
- [ ] No console errors on production
- [ ] Analytics/tracking disabled

## ✅ Demo Video

- [ ] Under 3 minutes
- [ ] Audio is clear
- [ ] Shows key features
- [ ] Explains privacy architecture
- [ ] Shows successful message send
- [ ] Includes demo URL at end
- [ ] No dead air or errors

## ✅ Hackathon Submission

- [ ] GitHub repo is public
- [ ] README has demo link
- [ ] README has video link
- [ ] DoraHacks form filled completely
- [ ] Project description is 100 words max
- [ ] All links work
- [ ] Screenshots uploaded
- [ ] Team info correct

---

## Testing Script

Run through this end-to-end test before submission:

### Test 1: First Time User

1. Open app in incognito mode
2. Click "Connect Wallet"
3. Connect ArgentX
4. Navigate to chat
5. Click "Initialize Keys"
6. Sign the message
7. Enter test recipient address
8. Type "Hello AgentSend!"
9. Click Send
10. Verify message appears
11. Check console for errors ✅

### Test 2: Returning User

1. Open app (wallet still connected)
2. Navigate to chat
3. Keys should auto-load
4. Send another message
5. Verify conversation appears in sidebar
6. Click conversation
7. Verify messages load ✅

### Test 3: Multiple Conversations

1. Send message to Address A
2. Send message to Address B
3. Verify both in conversation list
4. Click Address A conversation
5. Verify correct messages show
6. Click Address B conversation
7. Verify correct messages show ✅

### Test 4: Error Handling

1. Try sending without recipient → Error ✅
2. Try sending empty message → Disabled ✅
3. Disconnect wallet mid-send → Graceful fail ✅
4. Invalid recipient address → Validation error ✅

### Test 5: Mobile

1. Open on mobile device
2. Connect wallet
3. Initialize keys
4. Send message
5. Verify UI is usable
6. Check all buttons are tappable ✅

---

## Bug Tracking

| Bug | Severity | Status | Fix |
|-----|----------|--------|-----|
| - | - | - | - |

---

## Performance Benchmarks

| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| Initial Load | <3s | | |
| Wallet Connect | <2s | | |
| Key Init | <3s | | |
| Message Send | <5s | | |
| IPFS Upload | <3s | | |
| Page Size | <2MB | | |

---

**Testing Completed:** ________ (date)  
**Tested By:** ________  
**Ready for Submission:** ☐ Yes ☐ No
