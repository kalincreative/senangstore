# SenangStore Skills Plugin

> AI companion skill plugin for the **SenangStore Digital Storefront** project.

## Overview

This plugin extends your AI companion (Antigravity / Claude) with auto-triggered skills for the SenangStore project. Skills activate automatically based on phrases or context — no manual loading required.

- **Installed**: 2026-04-19
- **Plugin ID**: `senangstore-skills`
- **Skills**: 1 active (save-memory)

---

## Active Skills

| Skill | Trigger Phrases | What It Does |
|-------|----------------|--------------|
| `save-memory` | "save", "save memory", "save progress", "update memory" | Persists session insights, decisions, and context to memory files |

---

## Adding New Skills

1. Create a new folder: `plugins/senangstore-skills/skills/[skill-name]/`
2. Create `SKILL.md` inside using the format in `skill-format.md`
3. Done — skill auto-activates based on its `description` field

### Skill Ideas for SenangStore

| Skill Name | Trigger | What It Does |
|------------|---------|--------------|
| `save-memory` | "save", "save progress" | Persists conversation insights ✅ Installed |
| `storefront-review` | "review storefront", "check store" | Reviews current storefront page status |
| `build-summary` | "summarize build", "what did we build" | Recaps what was built this session |
| `next-steps` | "what's next", "next steps" | Lists pending tasks from last session |

---

## Plugin Structure

```
plugins/senangstore-skills/
├── .claude-plugin/
│   └── plugin.json          # Plugin identity & metadata
├── skills/
│   └── save-memory/
│       └── SKILL.md         # Memory saving skill
├── skill-format.md          # Reference template for new skills
└── README.md                # This file
```

---

## Format Reference

See `skill-format.md` for the full SKILL.md structure with all sections documented.

---

*SenangStore Skills Plugin v1.0 — Installed 2026-04-19*
