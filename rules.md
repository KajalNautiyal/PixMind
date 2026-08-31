# PixMind — Development Rules

## 1. General Rule

Build the smallest reliable version first.

Do not add new technology or feature just because it sounds impressive.

---

## 2. Technology Rules

Use the agreed stack unless the team jointly approves a change:

```text
Frontend: React + Vite + Tailwind
Backend: Node.js + Express
AI: Python + Flask
Database: MongoDB Atlas
Storage: AWS S3
Vector Search: MongoDB Atlas Vector Search
```

Do not introduce PostgreSQL, Redis, Kafka, Kubernetes, Pinecone, Qdrant, or another major service without documented justification.

---

## 3. Repository Rules

Suggested structure:

```text
memora-ai/
├── frontend/
├── backend/
├── ai-service/
├── docs/
└── README.md
```

Do not commit:
- `.env`
- credentials
- API keys
- AWS secret keys
- private certificates
- large datasets
- model binaries unless explicitly approved

---

## 4. Branch Rules

Protected branches:
- main
- develop

Feature branches:

```text
feature/member1-storage
feature/member2-search
feature/member3-vision
feature/member4-memory
```

No direct pushes to `main`.

---

## 5. Pull Request Rules

Every PR must contain:
- What changed
- Why
- Screenshots for UI changes
- API changes
- Test evidence
- Known limitations

At least one team member reviews the PR before merge.

Critical security changes should receive two reviewers where practical.

---

## 6. Commit Rules

Use clear commits.

Good:

```text
feat: add S3 signed upload flow
fix: prevent cross-user photo access
feat: add semantic photo search
refactor: separate AI job processing
docs: update API contract
```

Avoid:

```text
final
done
changes
new
test123
```

---

## 7. Coding Rules

- Prefer small functions.
- Avoid duplicated logic.
- Validate input at the API boundary.
- Handle errors explicitly.
- Do not trust client-provided userId.
- Do not expose secrets in logs.
- Use environment variables for configuration.
- Keep business logic outside route files.
- Use consistent naming conventions.

---

## 8. API Rules

All APIs must be versioned.

Example:

```text
/api/v1/photos
/api/v1/search
```

Every protected API must:
1. Authenticate the user.
2. Authorize access.
3. Validate input.
4. Execute business logic.
5. Return a standard response.

Never assume a resource belongs to the current user simply because its ID was supplied by the client.

---

## 9. Database Rules

Every user-owned record should contain a user ownership reference where appropriate.

Example:

```text
userId
```

Queries must enforce ownership.

Bad:

```js
Photo.findById(photoId)
```

Better:

```js
Photo.findOne({
  _id: photoId,
  userId: req.user.id
})
```

Use indexes for:
- userId
- createdAt
- takenAt
- albumId where applicable
- eventId where applicable

---

## 10. Storage Rules

- S3 bucket must remain private.
- No hardcoded bucket credentials.
- Use signed URLs.
- Validate file type and size before processing.
- Store generated thumbnails separately from originals.
- Preserve original file metadata.

---

## 11. AI Rules

AI output must be treated as probabilistic.

Always store confidence/model metadata where practical.

Never make dangerous automatic decisions from a single AI prediction.

Examples:
- Do not auto-delete photos.
- Do not permanently rename people based only on face recognition.
- Do not move sensitive documents without user control.

---

## 12. AI Prompt Rules

For LLM calls:
- Send the minimum required data.
- Do not expose unnecessary personal information.
- Use structured output whenever possible.
- Validate output before storing.
- Do not let model output directly execute privileged operations.

---

## 13. UI Rules

Every user-facing feature needs:
- Loading state
- Empty state
- Error state
- Success feedback
- Mobile layout

Destructive actions need confirmation.

---

## 14. Testing Rules

Minimum tests:
- Authentication
- Access control
- Photo ownership
- Upload validation
- Search
- AI job failure
- Album ownership
- Privacy findings
- Delete behavior

Every bug fix should add a regression test where practical.

---

## 15. Team Rules

Each member owns one domain, but all members must understand:
- overall architecture
- API conventions
- database relationships
- security basics

No one should become the only person who can deploy or merge the project.

---

## 16. Documentation Rules

Update documentation when:
- API changes
- database schema changes
- new external service added
- deployment changes
- security behavior changes

Keep these current:
- README
- architecture.md
- design.md
- prd.md
- security.md
- review.md

---

## 17. Definition of Done

A feature is complete only when:
- Code works
- API behavior is documented
- UI states are handled
- Validation exists
- Tests exist
- No secrets are committed
- PR reviewed
- Integrated on `develop`
- Demoed to the team

---

## 18. Scope Control

New features must be classified:

### Must
Required for MVP or academic evaluation.

### Should
Useful but can wait.

### Could
Stretch goal.

### Won't
Out of scope for the current release.

If a new feature threatens the deadline, move it to a later phase.

---

## 19. Review Before Release

Before every major milestone:
- Run test suite
- Check security checklist
- Check API contract
- Test cross-user access
- Check cloud costs
- Check failed AI jobs
- Review UI responsiveness
- Update documentation
