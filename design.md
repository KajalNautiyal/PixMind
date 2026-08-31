# PixMind — Product & UI/UX Design

## 1. Design Vision

PixMind should feel like a modern personal memory space, not a generic cloud-drive application.

Design principles:
1. Photo-first
2. AI should be visible but not distracting
3. Privacy should feel trustworthy
4. Search should feel conversational
5. Complex AI results should be understandable
6. Destructive actions require confirmation

---

## 2. Primary Navigation

Desktop:

```text
Logo / PixMind

Home
Photos
Albums
People
Memories
Search
Privacy Vault
Cleanup
AI Assistant

Bottom:
Profile
Settings
```

Mobile:
- Bottom navigation for Home / Photos / Search / Memories
- More menu for People / Privacy / Cleanup / Settings

---

## 3. Home Dashboard

### Header
- Greeting
- Search field
- Notifications
- Profile

### Content
- Recent photos
- Recent memories
- Suggested albums
- AI cleanup suggestions
- Privacy alerts

Example:

```text
Good morning 👋

[ Ask anything about your photos... ]

Recent memories
[ Goa Trip ] [ College Fest ] [ Birthday ]

AI suggestions
24 duplicate photos
3 privacy alerts

Recent photos
[grid...]
```

---

## 4. Photo Grid

Each card can show:
- Thumbnail
- Favorite indicator
- Date
- AI status
- Selected state

Actions:
- Open
- Favorite
- Add to album
- Download
- Archive
- Delete

Bulk actions:
- Select all visible
- Add to album
- Archive
- Download
- Delete

---

## 5. Photo Detail Page

Show:
- Full image
- Date/time
- Location
- People
- Detected objects
- AI caption
- OCR status
- Privacy warning
- Albums

Actions:
- Favorite
- Edit metadata
- Move
- Share
- Download
- Delete

AI information should be collapsible so that the photo remains the primary focus.

---

## 6. Natural Language Search

The search screen is a core feature.

Placeholder:

```text
Ask anything about your photos...
```

Example chips:

```text
Sunset photos
Photos with my dog
Goa trip
Photos from college
Red shirt photos
```

Search result area:

```text
48 results

Relevant photos
[grid]

Filters:
People | Date | Location | Album
```

The UI should show why a result matched when useful:

```text
Matched:
• sunset
• Goa
• beach
```

---

## 7. People Page

Show person clusters:

```text
Mom
542 photos

Dad
380 photos

Friend A
290 photos
```

Unconfirmed groups:

```text
Person #7
32 photos
[Name this person]
```

Confidence should be visible for uncertain matches, but avoid overwhelming the user.

---

## 8. Privacy Vault

Dashboard:

```text
Privacy Guardian

3 new findings

Aadhaar Card
Confidence: 94%

[Review] [Move to Secure Vault]

PAN Card
Confidence: 88%

[Review]
```

Important:
- Never expose full sensitive document numbers in list views.
- Mask previews where practical.
- Require confirmation before moving or deleting.
- Use strong access controls.

---

## 9. Cleanup Page

Sections:

```text
Duplicates
Near duplicates
Blurry
Very dark
Screenshots
```

Each section shows:

```text
24 files
Estimated recovery: 420 MB

[Review]
```

Never auto-delete by default.

---

## 10. Memories Page

Display cards:

```text
Goa Trip
12–15 June 2026
64 photos

College Fest
18 September 2025
112 photos
```

Opening a memory:

```text
Cover
Title
Date/location

Story

Timeline
Photos

[Edit]
[Share]
[Make Video]  (optional phase)
```

---

## 11. AI Assistant

Chat-style interface.

Supported commands should initially include:
- Find photos
- Create album
- Explain a memory
- Generate memory story
- Show cleanup suggestions
- Open a person/event

The assistant should confirm risky actions:

```text
User: Delete duplicate photos

AI:
I found 24 candidates.
Do you want to review them before deletion?
```

---

## 12. Design System

### Typography
Use a clean sans-serif font.

Suggested hierarchy:
- Display: 32–40 px
- Page title: 24–30 px
- Section title: 18–22 px
- Body: 14–16 px
- Helper text: 12–14 px

### Spacing
Use a consistent 4/8 px spacing system.

### Components
Create reusable:
- Button
- Input
- SearchBox
- Modal
- Drawer
- Toast
- Badge
- PhotoCard
- AlbumCard
- PersonCard
- MemoryCard
- EmptyState
- LoadingSkeleton
- ConfirmDialog

---

## 13. UX States

Every major screen must have:
- Loading state
- Empty state
- Error state
- Success state
- Permission denied state

Example empty search:

```text
No matching photos found.

Try:
"sunset"
"my dog"
"Goa trip"
```

---

## 14. Accessibility

Minimum targets:
- Keyboard navigable controls
- Visible focus state
- Sufficient color contrast
- Alt text where appropriate
- Form labels
- Error messages near inputs
- No information conveyed by color alone

---

## 15. Responsive Behavior

Desktop:
- Sidebar navigation
- Large photo grids
- Multi-column layouts

Tablet:
- Collapsible sidebar
- Medium grids

Mobile:
- Bottom navigation
- Single/dual-column photos
- Bottom sheets for actions
- Full-screen photo viewer

---

## 16. Visual Personality

The interface should be:
- clean
- calm
- premium
- trustworthy
- photo-focused

Avoid making every component look “AI-themed”. AI is a capability, not the visual identity.

---

## 17. User Journey

### First-time user

```text
Landing
 ↓
Register/Login
 ↓
Permission explanation
 ↓
Upload photos
 ↓
Processing screen
 ↓
AI analysis complete
 ↓
Home dashboard
 ↓
Try natural-language search
```

### Returning user

```text
Login
 ↓
Home
 ↓
Recent memory
 ↓
Search
 ↓
Photo
 ↓
AI actions
```
