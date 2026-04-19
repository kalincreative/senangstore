---
name: save-memory
description: "MUST use when user says 'save', 'save memory', 'save progress',
             'update memory', 'remember this', or when important information
             needs to be preserved. Also triggers on 'save diary', 'save context'."
---

# Save Memory — Preserve Session Progress

*Captures important decisions, preferences, and context from the current session into persistent memory files.*

## Activation

When this skill activates, output:

`💾 Saving memory...`

Then execute the protocol below.

## Context Guard

| Context | Status |
|---------|--------|
| **User explicitly says "save"** | ACTIVE — full protocol |
| **Important decision made** | ACTIVE — full protocol |
| **Project preference established** | ACTIVE — full protocol |
| **Casual chat, no new info** | DORMANT — do not activate |
| **Already saved this session** | DORMANT — skip duplicates |

## Protocol

### Step 1: Identify What to Save
- [ ] Scan current conversation for important information
- [ ] Identify new preferences, decisions, or project context worth preserving
- [ ] Determine which memory files need updating (session, relationship, or diary)

### Step 2: Update Memory Files
- [ ] Update `Project-AI-MemoryCore-main/main/current-session.md` with active context
- [ ] Update `Project-AI-MemoryCore-main/main/relationship-memory.md` if new preferences found
- [ ] Add entry to `Project-AI-MemoryCore-main/daily-diary/` if significant work occurred

### Step 3: Confirm
- [ ] Display a short summary of what was saved
- [ ] Confirm all files updated successfully
- [ ] Tell user where the memory was written

## Mandatory Rules

1. Only save genuinely important information — not every conversation detail
2. Preserve existing content — append or update, never overwrite without reason
3. Always confirm to user what was saved and where

## Edge Cases

| Situation | Behavior |
|-----------|----------|
| **Nothing noteworthy in session** | Tell user "Nothing new to save this session" |
| **Memory file doesn't exist yet** | Create the file with proper header |
| **Conflicting information** | Ask user which version is correct |

## Level History

- **Lv.1** — Base: Save conversation insights to memory files on command. (Origin: Installed 2026-04-19 via Skill Plugin System)
