"""
PixMind AI Service — Privacy Scanner
Detects sensitive documents (Aadhaar, PAN, Passport, Credit Card, etc.) in uploaded photos using OCR.
"""

import re

# Context Keywords to increase confidence or filter false positives
CONTEXT_KEYWORDS = {
    'credit_card': ['visa', 'mastercard', 'rupay', 'valid thru', 'valid from', 'bank', 'cvv', 'card', 'debit'],
    'aadhaar': ['aadhaar', 'government of india', 'uidai', 'dob', 'year of birth', 'mera aadhaar'],
    'pan': ['income tax', 'permanent account number', 'pan'],
    'educational_document': ['statement of marks', 'board of', 'university', 'roll no', 'examination', 'passing certificate', 'degree']
}

# Regex patterns for Indian sensitive documents
# Negative lookbehinds (?<!\d) and lookaheads (?!\d) prevent matching substrings of longer numbers
SENSITIVE_PATTERNS = {
    'aadhaar': {
        'pattern': r'(?<!\d)\d{4}\s?\d{4}\s?\d{4}(?!\d)',
        'label': 'Aadhaar Card',
        'icon': '🪪',
        'redact': lambda m: f"XXXX XXXX {m.group()[-4:]}"
    },
    'aadhaar_vid': {
        'pattern': r'(?<!\d)\d{4}\s?\d{4}\s?\d{4}\s?\d{4}(?!\d)',
        'label': 'Aadhaar Virtual ID',
        'icon': '🪪',
        'redact': lambda m: f"XXXX XXXX XXXX {m.group()[-4:]}"
    },
    'pan': {
        'pattern': r'(?<![A-Z0-9])[A-Z]{5}\d{4}[A-Z](?![A-Z0-9])',
        'label': 'PAN Card',
        'icon': '💳',
        'redact': lambda m: f"XXXXX{m.group()[5:]}"
    },
    'credit_card': {
        'pattern': r'(?<!\d)\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}(?!\d)',
        'label': 'Credit/Debit Card',
        'icon': '💳',
        'redact': lambda m: f"XXXX XXXX XXXX {m.group()[-4:]}"
    },
    'passport': {
        'pattern': r'(?<![A-Z0-9])[A-Z]\d{7}(?![A-Z0-9])',
        'label': 'Passport',
        'icon': '📘',
        'redact': lambda m: f"X{m.group()[1:4]}XXXX"
    },
    'driving_license': {
        'pattern': r'(?<![A-Z0-9])[A-Z]{2}\d{2}\s?\d{11}(?![A-Z0-9])',
        'label': 'Driving License',
        'icon': '🚗',
        'redact': lambda m: f"{m.group()[:4]}XXXXXXXXXXX"
    },
    'voter_id': {
        'pattern': r'(?<![A-Z0-9])[A-Z]{3}\d{7}(?![A-Z0-9])',
        'label': 'Voter ID',
        'icon': '🗳️',
        'redact': lambda m: f"XXX{m.group()[3:]}"
    }
}

def check_context(text_lower: str, context_type: str) -> bool:
    """Check if any context keywords for the given type exist in the text."""
    if context_type not in CONTEXT_KEYWORDS:
        return False
    return any(keyword in text_lower for keyword in CONTEXT_KEYWORDS[context_type])


def scan_text_for_privacy(text: str) -> dict:
    """
    Scan OCR-extracted text for sensitive document patterns.
    Uses regex boundaries and context keywords to eliminate false positives.
    """
    if not text or not text.strip():
        return {'is_sensitive': False, 'findings': [], 'keyword_matches': []}

    text_upper = text.upper()
    text_lower = text.lower()
    findings = []
    
    # 1. Check Educational Documents by Context
    if check_context(text_lower, 'educational_document'):
        findings.append({
            'type': 'educational_document',
            'label': 'Marksheet/Certificate',
            'icon': '🎓',
            'confidence': 0.90,
            'matched_text': None,
            'redacted_text': 'Confidential Academic Record'
        })

    # 2. Check strict Regex Patterns
    for doc_type, config in SENSITIVE_PATTERNS.items():
        matches = list(re.finditer(config['pattern'], text_upper))
        
        for match in matches:
            matched_text = match.group()
            
            # --- CONTEXT-BASED FILTERING ---
            
            # Prevent 16-digit VID from being classified as Credit Card
            # A 16-digit number is only a Credit Card if bank-related context is present
            if doc_type == 'credit_card':
                if not check_context(text_lower, 'credit_card'):
                    # If no credit card context, maybe it's a VID instead
                    if check_context(text_lower, 'aadhaar'):
                        # Handled by aadhaar_vid pattern anyway, so skip
                        pass
                    continue # Skip this false positive credit card
            
            # If a 16-digit number matched aadhaar_vid, require Aadhaar context
            if doc_type == 'aadhaar_vid':
                if not check_context(text_lower, 'aadhaar'):
                    continue # Skip if it doesn't look like an aadhaar card
                    
            findings.append({
                'type': doc_type,
                'label': config['label'],
                'icon': config['icon'],
                'confidence': 0.95, # High confidence due to strict regex + context
                'matched_text': matched_text,
                'redacted_text': config['redact'](match)
            })

    # 3. Consolidate results (remove exact duplicate matched strings for same doc type)
    unique_findings = []
    seen = set()
    for f in findings:
        key = (f['type'], f['matched_text'])
        if key not in seen:
            seen.add(key)
            unique_findings.append(f)

    return {
        'is_sensitive': len(unique_findings) > 0,
        'findings': unique_findings,
        'keyword_matches': []
    }
