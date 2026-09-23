# Code Audit & Bug Fixes

## Issues Found and Fixed

### 1. ❌ Memory Leak: Leaflet Map Not Cleaned Up
**Location**: `index.astro` and `settings.astro`
**Issue**: Leaflet map instances are created but never destroyed when page unmounts
**Impact**: Memory leak in SPA navigation scenarios
**Fix**: Add cleanup on page navigation

### 2. ❌ Event Listener Memory Leaks  
**Location**: `index.astro`, `settings.astro`
**Issue**: Event listeners added but never removed
**Impact**: Memory accumulation, potential performance degradation
**Affected listeners**:
- Map click/drag events
- Input change events  
- Button click events
- Marker drag events

### 3. ❌ Settings Button Icon Inconsistency
**Location**: `settings.astro` line 221
**Issue**: Save button uses emoji (💾) instead of Material Icon
**Impact**: Design inconsistency

### 4. ❌ Missing Error Boundaries
**Location**: All pages with async operations
**Issue**: Uncaught promise rejections in OSRM API calls
**Impact**: Silent failures, poor UX

### 5. ❌ Race Condition in Auto-Compute
**Location**: `index.astro` GPS button handler
**Issue**: 500ms setTimeout may fire before distance calculation completes
**Impact**: May compute with stale/zero distance

### 6. ❌ Missing Input Validation
**Location**: `index.astro` syncFromInputs
**Issue**: No bounds checking for lat/lng values
**Impact**: Invalid coordinates can be submitted

### 7. ❌ Database Connection Not Closed
**Location**: `lib/db.ts`
**Issue**: SQLite connection opened but never properly closed
**Impact**: Resource leak on server restart/shutdown

### 8. ⚠️ Security: Session Token Never Expires
**Location**: `lib/auth.ts`
**Issue**: Token payload includes timestamp but never validated
**Impact**: Tokens valid forever (beyond cookie expiry)

### 9. ⚠️ XSS Vulnerability  
**Location**: Multiple locations using `innerHTML`
**Issue**: Dynamic content inserted without sanitization
**Impact**: Potential XSS if error messages contain user input

### 10. ❌ Unused AlertTitle Import
**Location**: `index.astro` line 3
**Issue**: Imported but never used
**Impact**: Unnecessary bundle size

## Severity Classification

🔴 **Critical**: #8 (Security issue)
🟠 **High**: #1, #2, #4 (Memory leaks, error handling)
🟡 **Medium**: #5, #6 (Race conditions, validation)
🟢 **Low**: #3, #7, #9, #10 (Cosmetic, minor issues)

## Recommendations

1. Implement proper cleanup lifecycle
2. Add AbortController for fetch requests  
3. Validate all user inputs
4. Add error boundaries
5. Implement token expiry validation
6. Sanitize all innerHTML content
7. Add graceful shutdown for DB connection
8. Remove unused imports
