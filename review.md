# MemoraAI — Code & Architecture Review Checklist

## 1. Purpose

This document is used for:
- weekly reviews
- pull-request reviews
- milestone reviews
- final project evaluation

The goal is not only to check whether features work, but whether the system is secure, maintainable, testable, and defensible in a viva.

---

## 2. Architecture Review

### Questions

- Is the separation between React, Node.js, Python AI, MongoDB, and S3 clear?
- Is large media stored outside MongoDB?
- Are AI jobs asynchronous?
- Are APIs versioned?
- Are service boundaries clear?
- Is there unnecessary technology?

### Red flags

- AI processing inside normal upload HTTP requests
- public S3 bucket
- direct MongoDB access from frontend
- hardcoded credentials
- random database duplication
- every feature depending on every other feature

---

## 3. Frontend Review

Check:
- [ ] Responsive design
- [ ] Reusable components
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Accessible forms
- [ ] API errors handled
- [ ] No secrets in frontend bundle
- [ ] Large images optimized for display

---

## 4. Backend Review

Check:
- [ ] Authentication
- [ ] Authorization
- [ ] Input validation
- [ ] Consistent errors
- [ ] Proper HTTP status codes
- [ ] Rate limiting
- [ ] Logging
- [ ] No sensitive logging
- [ ] Ownership checks on every private resource
- [ ] Pagination on large lists

---

## 5. Database Review

Check:
- [ ] Indexes
- [ ] Ownership references
- [ ] Reasonable document sizes
- [ ] No duplicate uncontrolled data
- [ ] Query filters use indexes
- [ ] Vector search fields have documented dimensions/model versions
- [ ] Deletion relationships are understood

---

## 6. Storage Review

Check:
- [ ] S3 bucket private
- [ ] Signed URLs
- [ ] No AWS credentials in frontend
- [ ] File size limits
- [ ] Thumbnail strategy
- [ ] Storage cleanup on deletion

---

## 7. AI Review

Check:
- [ ] AI output is treated as probabilistic
- [ ] Confidence stored where useful
- [ ] Model versions recorded
- [ ] Failed jobs are retryable
- [ ] AI does not make destructive decisions automatically
- [ ] LLM output is validated
- [ ] Prompt injection considered

---

## 8. Search Review

Check:
- [ ] Semantic search works
- [ ] User ownership filter is mandatory
- [ ] Date/location filters work
- [ ] Search has fallback behavior
- [ ] Empty results are understandable
- [ ] Search latency is measured

Critical:

```text
Search must never return another user's photo
```

---

## 9. Face Recognition Review

Check:
- [ ] False matches can be corrected
- [ ] Unknown groups are supported
- [ ] Confidence is considered
- [ ] Face embeddings are protected
- [ ] User can delete a person profile
- [ ] Model limitations are documented

---

## 10. Privacy Guardian Review

Check:
- [ ] Sensitive document types documented
- [ ] False positive behavior documented
- [ ] Confidence shown or available
- [ ] User confirmation required
- [ ] Sensitive values are masked
- [ ] Findings cannot leak through logs

---

## 11. Cleanup Review

Check:
- [ ] Duplicate vs near-duplicate definitions documented
- [ ] Blurry detection threshold documented
- [ ] No automatic destructive action
- [ ] Review screen available
- [ ] Storage savings estimate is calculated correctly

---

## 12. Memory Review

Check:
- [ ] Event clustering produces confidence
- [ ] User can rename/merge/split events
- [ ] GPS absence does not break event detection
- [ ] LLM receives structured event data
- [ ] Generated text is editable
- [ ] Memory generation does not block normal photo upload

---

## 13. Testing Review

Minimum categories:

### Unit
- validation
- utilities
- search helpers
- permission checks

### Integration
- auth + database
- upload + S3
- search + vector store
- AI job + database

### End-to-end
- register → upload → process → search
- upload → privacy finding → review
- upload → event → memory

---

## 14. Performance Review

Measure:
- upload latency
- thumbnail generation time
- AI processing time
- search latency
- gallery load time
- memory generation time

Check for:
- unbounded queries
- unnecessary full-collection scans
- duplicate AI processing
- repeated downloads of originals
- missing pagination

---

## 15. Security Review

Before release, verify:

```text
Authentication
Authorization
IDOR protection
S3 privacy
Input validation
Rate limiting
Secrets management
LLM safety
Sensitive-data logging
Secure deletion
```

---

## 16. Team Contribution Review

Each member should be able to demonstrate:

### Member 1
Platform + cloud + media lifecycle

### Member 2
Semantic search + embeddings + object intelligence

### Member 3
Face recognition + privacy + cleanup

### Member 4
Events + memories + AI assistant

Each member should show:
- frontend work
- backend work
- database work
- AI/integration work where applicable
- tests
- documentation

---

## 17. Weekly Review Template

### Week:
`YYYY-MM-DD`

### Completed
- 

### In progress
- 

### Blockers
- 

### Bugs
- 

### Security concerns
- 

### Performance concerns
- 

### Next week
- 

### Architectural changes
- 

---

## 18. Milestone Review Gates

### Gate 1 — Foundation
- Auth works
- DB connected
- S3 connected
- API conventions established

### Gate 2 — MVP
- Upload works
- Gallery works
- Albums work
- AI indexing works
- Search works

### Gate 3 — Intelligence
- Face grouping
- Privacy detection
- Cleanup

### Gate 4 — Memories
- Event detection
- Timeline
- Memory generation
- Assistant

### Gate 5 — Release
- Security review
- Performance review
- E2E tests
- Deployment
- Documentation
- Final demo

---

## 19. Final Viva Review

Every team member must be ready to answer:

1. Why MongoDB instead of PostgreSQL?
2. Why S3 for photos?
3. Why separate Python AI service?
4. How does semantic search work?
5. How are embeddings generated?
6. How does face grouping work?
7. What happens when AI is wrong?
8. How do you prevent cross-user photo access?
9. Why is AI processing asynchronous?
10. What happens when an AI job fails?
11. How do you control storage cost?
12. How can this system scale?
13. What is your actual innovation compared with Google Photos/Immich?
14. Which module did each member own?
15. What are the current limitations?

---

## 20. Release Sign-Off

Before version 1.0:

- [ ] Architecture approved
- [ ] PRD scope complete
- [ ] Design reviewed
- [ ] Security checklist complete
- [ ] Tests passing
- [ ] Critical bugs resolved
- [ ] Deployment verified
- [ ] Documentation updated
- [ ] Team members can explain their modules
