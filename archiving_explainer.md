# Summary: Archiving Non-MVP Features

## What Was Done

Commented out non-MVP features to focus on the MVP. Code is preserved for future use.

## Why

- **MVP scope**: Single user per business, single menu
- **Reduce complexity** before refactoring
- **Clear separation** between MVP and future features

## What Was Archived

### Admin/User Management

- User Maintenance page
- Admin Table (promote/demote users, remove access)
- User Maintenance menu item in the profile dropdown
- All admin backend routes

**Reason:** MVP is single user per business, so multi-user admin features are out of scope.

### Menu Item Swapping

- MenuItemSwap component (moving items between menus)
- "Integrate Menus" button on the menu items page
- Backend routes for menu swapping

**Reason:** MVP is a single menu, so moving items between menus is out of scope.

## What Remains Active (MVP Features)

- Sign in/out
- Single menu management (view, create, delete menus)
- Menu import (never actually implemented prior to this semester)
- Account CRUD (edit email/password)
- Business CRUD (edit business info)
- Menu items CRUD (add, edit, delete menu items)
- Setup wizard (onboarding flow)

## Result

- ✅ Non-MVP features are archived and clearly marked
- ✅ MVP features remain functional
- ✅ Codebase is ready for refactoring
- ✅ Archived code can be restored later if needed

All archived code is marked with `// ARCHIVED:` comments explaining why it was archived, making it easy to find and restore if needed.
