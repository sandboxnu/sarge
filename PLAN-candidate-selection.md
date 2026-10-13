# Plan: Candidate selection, editing & deletion

**Page:** `src/app/(web)/crm/positions/[id]/page.tsx` (Candidates tab)
**Branch:** `bugfix/amizrahi/candidate-component-changes` (decided: stay on the current branch)
**Figma:**
- [Developer Handoff → Components](https://www.figma.com/design/2I4b5u3wY0uBeddhYYOAd0/Developer-Handoff?node-id=4257-4651&m=dev) (node `4257:4651`)
- [Developer Handoff → Position | Delete Candidates (Jolin)](https://www.figma.com/design/2I4b5u3wY0uBeddhYYOAd0/Developer-Handoff?node-id=4257-4650&m=dev) (node `4257:4650`): page states, modals, toasts

## Goal

Recruiters can select candidates on a position's candidate table and edit or delete them. Checking a row
brings up a floating action menu. Deletion asks for confirmation in a modal and removes the
application from the database.

## Working agreement

- Work one step at a time (§6). Each step ends at a **checkpoint**: show what changed, then wait
  for approval before starting the next one.
- **Figma first:** pull the frame with the Figma MCP (`get_design_context`) before writing any UI.
  Match spacing, colors, icons and copy. Raise any mismatches with our design tokens; don't silently
  pick one.
- **Reuse first:** before creating any component, hook or util, search for an existing one and list
  what was found. Build new code only when nothing fits, and only after asking.
- Ask instead of guessing when the plan, Figma, or code doesn't answer a question.

---

## Decisions

| Question | Decision |
|---|---|
| What does "Edit property" edit? | **Stub it** in this ticket. Show the menu per Figma, but it doesn't update anything yet (no endpoint exists). |
| Bulk delete: batch endpoint or client loop? | **Batch endpoint** (§3 Option A). |
| Select-all scope while search is active | **Displayed rows only.** Rows hidden by search are dropped from the selection. |
| Branch | **Current branch.** |
| Per-row action: dropdown or trash icon? | **Dropdown** (⋯ → Delete), already built. Figma "Candidate Menu" confirms this. |
| Header checkbox | **Follow Figma.** Empty when none or some displayed rows are selected; clicking it then selects all. Purple with a **dash** when all are selected; clicking it then deselects all. The dash means "click to clear", not "partial". |
| Delete modal | **Candidate-specific modal** (`DeleteCandidatesModal`) built from the `Dialog` primitives to the Figma layout. Don't touch `DeleteOrganizationModal`. |
| Edit property stub | **Items clickable, no-op.** Dropdown opens with Assessment / Grader / Decision as in Figma; selecting one does nothing. Add a `TODO` in code and a note in the PR description. |
| Single-delete toast copy | **"1 candidate deleted successfully."** (Same pattern as "1 candidate selected".) |
| Dash SVG | **Inline in `Checkbox.tsx`**, the same way as the existing check mark: Figma path `M7 9.99967H13`, `stroke="currentColor"`, same `viewBox`. The box color comes from the existing `--sarge-primary-500` token classes, not hardcoded hex. How `Checkbox` switches between check and dash is still decided in Step 4. |
| Batch ID validation | **`z.array(z.string())`**, matching the codebase convention (`UpdateAssessmentTemplateTasksSchema`; ~35 ID fields use `z.string()`). The `z.cuid()` schemas in `application.schema.ts` / `assessment.schema.ts` are unused, and seeded IDs like `cand_carter_herman_001` aren't cuids. |
| Partial failure | **Delete what it can, report the rest.** Batch returns 200 with `BatchRemoveResult { totalDeleted, totalFailed, failedCandidateIds }`, mirroring `AssessmentInvitationResult`. Client shows the success toast if `totalDeleted > 0` and the error toast if `totalFailed > 0`; both can appear together (Figma "Toast" frame). Validation, auth, and DB errors still fail the whole request. |
| After a partial failure | **Close the modal; failed rows stay in the table and stay selected**, so the floating menu remains and Delete retries just those. |
| Single-row delete | **Uses the batch endpoint too** (a one-item list): one code path, identical toasts. The existing single endpoint is left unchanged; no `deleteCandidate` client wrapper is needed. |
| Row/page design differences | **Out of scope:** Grader column (header + avatar), decision chip ×, "Assigned Assessment" tab label, title-case headers. |

---

## Figma reference (node `4257:4651`, "Components")

Initial read via `get_metadata` and a screenshot. Pull exact specs with `get_design_context` per node
when we reach each step.

| Node | Name | What it shows |
|---|---|---|
| `4257:7066` / `4257:11800` | `.Row` (component + instance) | Candidate row: checkbox, name/major, grad year, assessment chip, resume link, reviewer with avatar initial, decision chip with ×, ⋯ button |
| `4257:6886` | Candidate Menu (`Property 1=Open` / `Closed`) | ⋯ trigger; open state shows a single red, italic **Delete** item with a trash icon |
| `4257:8558` | Floating Menu | White bar. Left: "**N candidates selected**". Right: **Delete** (trash icon), **Edit property** (pencil icon), **Deselect all** (×). All three are icon+text buttons, not a red destructive button. |
| `4257:8402` | Edit Property (2 variants) | "Edit property" button, plus an open state with a dropdown of **Assessment**, **Grader**, **Decision**. The open/hover state has a light purple background. |

### Node `4257:4650`, "Position | Delete Candidates (Jolin)"

| Node | Name | What it shows |
|---|---|---|
| `4257:5193` | No Candidate Selected | All checkboxes empty, including the header. No floating menu. |
| `4257:10953` | Some Candidates Selected (1 row) | Checked row: filled purple box with a check. **Header checkbox stays empty** (no partial state). Floating menu: "1 candidate selected" (singular). |
| `4257:9377` | All Candidates Selected | Every row checked. **Header checkbox is a filled purple box with a dash (−), not a check.** Floating menu: "9 candidates selected". |
| `4266:13894` | Toast | Bottom-right. Success: solid green, check-circle icon, "**9 candidates deleted successfully.**" Error: solid red, x-circle icon, "**Failed to delete candidate(s). Please try again.**" |
| `4257:7031` | Delete candidate modal (single) | Title "**Delete Candidate**". Body: "Are you sure you want to permanently delete candidate **Laith Taher**? This action cannot be undone." (name in bold). Footer right-aligned: **Cancel** (gray text) and **Delete** (solid red). **No X close button.** |
| `4257:7038` | Delete candidate modal (multiple) | Title "**Delete Candidates**". Body: "Are you sure you want to permanently delete **9** candidates? This action cannot be undone." Same footer. |

- **Header "deselect all" checkbox** (`I4257:9377;2607:58394;4257:9354`): designer annotation says
  "this deselect all state appears when all candidates on the table have been selected." SVG is
  20×20: a rounded box filled and stroked `#5D5BF7` (= `--sarge-primary-500`) plus a white dash
  `M7 9.99967H13` (stroke 1.5, round caps). It uses the same coordinate space as the check path already
  in `Checkbox.tsx` (`viewBox="2.5 2.5 15 15"`), so only the path `d` differs.
- **Selected rows:** no highlight. Checked rows look the same as unchecked rows apart from the checkbox.
- **Floating menu position:** centered horizontally over the **main content area** (not the viewport,
  because of the side nav), pinned near the bottom, overlapping the table.
- **Floating menu buttons:** gray icon+text, Delete included (not red).

**Differences from the current app (confirm scope):** in the `.Row` design, the reviewer has an avatar
initial and the decision chip has a ×. The page also shows "Grader" instead of "Reviewer(s)",
"Assigned Assessment" instead of "Assessment" for the tab, and title-case headers. None of these are in
this ticket's acceptance criteria.

---

## 1. Inventory: reuse vs. build

### Reuse as-is

| Need | Existing piece | Notes |
|---|---|---|
| Row checkbox | `src/lib/components/ui/Checkbox.tsx` | Radix checkbox, already wired into `CandidateTable` (cosmetic for now). ⚠️ Radix accepts `checked="indeterminate"`, but our component has **no indeterminate styling**: it renders a light check on a white box, which is nearly invisible. Needs a design (§5) and touches the templates page too. |
| Delete / edit-property menus | `src/lib/components/ui/Dropdown.tsx` | `DropdownMenuItem variant="destructive"` already exists. |
| "Remove" row action pattern | `src/lib/components/settings/MemberRoleCell.tsx` | Settings page's Remove item. The ⋯ menu in `CandidateTable` is already built. |
| Confirmation modal primitives | `src/lib/components/ui/Modal.tsx` (`Dialog`, `DialogContent`, `DialogTitle`) | |
| Confirmation modal layout | `src/lib/components/modal/DeleteOrganizationModal.tsx` + `useDeleteOrganizationModal.ts` | Same header/X/Cancel/destructive-button layout, minus the "type name to confirm" field. Generalize or copy? See §5. |
| Buttons | `src/lib/components/ui/Button.tsx` | Has `primary`, `secondary`, `destructive`, `link`, `icon` variants. |
| Toasts | `sonner` (`toast.success` / `toast.error`) + `src/lib/components/ui/Sonner.tsx` | The shared `Toaster` already renders solid green success / solid red error toasts with icons, matching Figma. Only the copy is new. (Error icon: ours is `OctagonXIcon`, Figma shows an x-circle. That's an app-wide component, so out of scope unless you say otherwise.) |
| Single delete endpoint | `DELETE /api/positions/[id]/applications/[candidateId]` → `ApplicationService.removeApplicationFromPosition` | Already exists, recruiter+ only, cascades to the assessment. **Has no client wrapper yet.** |
| Batch route file | `src/app/api/positions/[id]/applications/batch/route.ts` | Has `POST` (batch add). Add `DELETE` next to it, following the same structure. |
| Client API pattern | `deletePosition` in `src/lib/api/positions.ts` | Same fetch / `json.message` error shape for the new wrappers. |
| Animation | `animate-section-enter` in `src/app/globals.css` | Fade + 4px rise. Only relevant if Figma specifies an entrance animation (see findings). |

### Searched, nothing reusable

- **Floating action bar:** no existing component. The only `fixed` element is
  `AdminOnboardingButton`, which isn't a toolbar.
- **Shared selection hook:** none. `AddTaskModal` keeps selection inline as a `Set<string>`; not
  reusable for a TanStack table.

### Edit

| File | Change |
|---|---|
| `src/lib/services/application.service.ts` | Add `id: true` to the `candidate` select in **all three** places that return `ApplicationDisplayInfo`: `addApplicationToPosition`, `batchAddApplicationsToPosition`, `getPositionApplications`. Add `removeApplicationsFromPosition` (§3). |
| `src/lib/types/position.types.ts` → `ApplicationDisplayInfo` | Add `id: string` to `candidate`. |
| `src/lib/schemas/application.schema.ts` | Add `batchRemoveApplicationsSchema` (`candidateIds: cuid[]`, min 1, max 1000) next to `batchAddApplicationsSchema`. |
| `src/app/api/positions/[id]/applications/batch/route.ts` | Add `DELETE`. |
| `src/lib/api/positions.ts` | Add `batchDeleteCandidates(positionId, candidateIds): Promise<BatchRemoveResult>`, following `deletePosition`. |
| `src/lib/components/ui/DataTable.tsx` | Add **optional** `rowSelection`, `onRowSelectionChange`, `getRowId` props and pass them to `useReactTable` (`enableRowSelection`, `state.rowSelection`). Must stay optional because `MembersTab` and `UploadCSVModal` also use it. Selected-row style per Figma (if one exists). |
| `src/lib/components/core/CandidateTable.tsx` | Wire the existing checkbox and ⋯ columns to real state. Add the header select-all. New props for selection state and `onDeleteRequest`. |
| `src/lib/hooks/useCandidates.ts` | Add `deleteCandidates(candidateIds: string[])`: always the batch endpoint; removes only the deleted rows from local state (failed rows stay, and stay selected); success and/or error toast as in `handleSendAssessments`. |
| `src/app/(web)/crm/positions/[id]/page.tsx` | Wire up the selection hook, floating menu, and delete modal. Memoize `displayedCandidates` (it's recomputed every render today, which would re-run the selection-pruning effect). |

### Build new (only after confirming nothing fits, per step)

| File | Purpose |
|---|---|
| `src/lib/hooks/useCandidateSelection.ts` | Selection state and helpers (§2). |
| `src/lib/components/core/CandidateSelectionMenu.tsx` | Floating menu per Figma `4257:8558` + `4257:8402`. |
| `src/lib/components/modal/DeleteCandidatesModal.tsx` (+ hook) | Delete confirmation per Figma `4257:7031` / `4257:7038`, built from the `Dialog` primitives (decided). Hook follows the `useDeleteOrganizationModal` pattern. |

---

## 2. State design (proposal; confirm in Step 3)

The ticket asks for React state plus a new hook.

```ts
// useCandidateSelection.ts
export default function useCandidateSelection(candidates: ApplicationDisplayInfo[]) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // { [candidateId]: true }

    const selectedCandidates = candidates.filter((c) => rowSelection[c.candidate.id]);
    const clearSelection = () => setRowSelection({});

    // Prune selections that are no longer displayed (after a delete or search filtering).
    // Return `prev` unchanged when nothing was pruned, to avoid a re-render loop.
    useEffect(() => { ... }, [candidates]);

    return { rowSelection, setRowSelection, selectedCandidates, selectedCount, clearSelection };
}
```

- Store it as TanStack's `RowSelectionState` so `DataTable` can use it directly. TanStack then handles
  `getIsAllRowsSelected` / `getIsSomeRowsSelected` for the header checkbox.
- `getRowId: (row) => row.candidate.id` keys the selection by the ID the delete API needs, not by array
  index. Index keys would break when rows are filtered or deleted.
- No separate `deselect(ids)` is needed: once deleted rows leave `candidates`, the prune effect drops
  them from the selection.
- Delete modal state lives on the page: `isDeleteModalOpen` plus a `pendingDelete` list (a snapshot of
  the rows being deleted). Keep the snapshot after close so the modal text doesn't change during the
  close animation. A row-level Delete sets one row; the floating menu's Delete sets the selected rows.

### Flow

```
check row ─► rowSelection updates ─► selectedCount > 0 ─► CandidateSelectionMenu appears
                                                               │
row ⋯ → Delete ───────────────┐                               Delete
                               ▼                                 ▼
                     pendingDelete = [row]          pendingDelete = selectedCandidates
                               └──────────► delete modal opens
                                                 │ Confirm
                                                 ▼
                                   useCandidates.deleteCandidates(ids)
                                   → API → remove from state → toast
                                   → prune effect clears selection → modal closes
```

---

## 3. Backend: bulk delete (decided: Option A)

- `DELETE /api/positions/[id]/applications/batch` with body `{ candidateIds: string[] }`. Same auth as
  the other routes: `getSession` and `assertRecruiterOrAbove`.
- `removeApplicationsFromPosition`: org check → dedupe IDs → `findMany` which candidates have an
  application on this position → `deleteMany` those → return
  `BatchRemoveResult { totalDeleted, totalFailed, failedCandidateIds }` (type in `position.types.ts`
  next to `BatchAddResult`).
- Used for both bulk and single-row deletes. The single `DELETE /applications/[candidateId]` endpoint
  is left as-is but unused by this feature.
- Deleting removes the **application** (and its assessment via cascade), **not** the `Candidate`
  record. This matches the existing single-delete behavior.

---

## 4. UI details (follow Figma; see the reference table above)

**Candidate row (`CandidateTable`):** checkbox column (left) and ⋯ Delete menu (right) already exist
visually. Header checkbox: empty unless all rows are selected, then purple with a dash (see §5 Q2).
No selected-row highlight.

**Floating menu (`CandidateSelectionMenu`):** per Figma `4257:8558`. "N candidate(s) selected" on the
left (singular for 1); Delete, Edit property, and Deselect all on the right, all gray icon+text.
Edit property opens a dropdown with Assessment / Grader / Decision (stubbed: no updates yet). Centered
over the main content area near the bottom. Exact specs come from `get_design_context`.

**Delete modal:** per Figma `4257:7031` / `4257:7038`. "Delete Candidate" / "Delete Candidates";
body copy as in the reference table; right-aligned Cancel + red Delete; no X. Behavior: Cancel (and
Esc / overlay click) close it without deleting. Confirm shows a submitting state. On failure, show the
error toast and keep the modal open; on success, close it and show the success toast.

**Toasts:** existing `Toaster`. Copy: "N candidates deleted successfully." (singular wording for one
row: see §5 Q9) and "Failed to delete candidate(s). Please try again."

---

## 5. Open questions

1. ~~**Delete modal design**~~: resolved, Figma `4257:7031` / `4257:7038`.
2. ~~**Header checkbox**~~: resolved, follow Figma (see Decisions). Implementation detail for Step 4:
   the shared `Checkbox` needs a way to render a dash. Decide then how to add it without changing how
   `/crm/templates` and the Add Task modal look.
3. ~~**Selected row highlight**~~: resolved, none.
4. ~~**Modal reuse**~~: resolved, candidate-specific modal.
5. ~~**Edit property stub**~~: resolved, clickable no-ops + TODO + PR note.
6. ~~**Floating menu position**~~: resolved, centered over the main content area, near the bottom.
7. ~~**Row design differences**~~: resolved, all out of scope (see Decisions).
8. ~~**Test data**~~: resolved. The local DB is reseedable and only affects us, so testing writes are
   fine and leftover test data (e.g. the "ZZ Test" `Candidate` records) doesn't need cleanup.
9. ~~**Toast copy for one row**~~: resolved, "1 candidate deleted successfully."

---

## 6. Step-by-step plan

Each step ends at a **checkpoint**: show the result, then wait for approval.

**Step 0: Figma specs**
- [ ] Pull `get_design_context` for the Floating Menu, Edit Property, Candidate Menu, and `.Row` nodes
- [x] Get the missing frames (delete modal, header checkbox, selected row): node `4257:4650`
- [x] Resolve §5 Q2, Q4, Q5, Q9
- [x] Resolve §5 Q8 (test data: reseedable, no cleanup needed)
- [x] Resolve the rest of §5 Q7 (all out of scope)
- [x] Header dash SVG pulled from Figma (see reference above)
- [ ] Compare the existing checkbox and ⋯ menu in `CandidateTable` against Figma and list differences
- ✋ Checkpoint: review the spec summary together

**Step 1: Backend**
- [x] Part 1: add `candidate.id` to all three service selects and to `ApplicationDisplayInfo`
- [x] Part 2: `batchRemoveApplicationsSchema`, `removeApplicationsFromPosition` (partial success →
  `BatchRemoveResult`), `DELETE` on `applications/batch`. Tested: full delete, partial (3 deleted /
  2 failed), duplicates, empty list / wrong shape / non-string → 400, unknown position → 404.
  403 not yet tested (needs a below-recruiter account).
- [x] Part 3: `batchDeleteCandidates` client wrapper (no single-delete wrapper; see Decisions).
  Exercised end to end in Step 7, once the hook calls it.
- ✋ Checkpoint after each part

**Step 2: `DataTable` selection props**
- [x] Optional `rowSelection` / `onRowSelectionChange` / `getRowId` (no selected-row styling, per Figma)
- [x] ✋ Checkpoint: `MembersTab` and `UploadCSVModal` look and behave the same (checked by you)

**Step 3: Selection hook**
- [x] Confirm the §2 shape, then write `useCandidateSelection`
- [x] ✋ Checkpoint: shape approved; behavior gets tested in the browser at Step 4

**Step 4: Wire `CandidateTable`**
- [ ] Row checkboxes and header select-all hooked to state; ⋯ Delete calls `onDeleteRequest`
- [ ] Indeterminate `Checkbox` style (if Q2 says so)
- ✋ Checkpoint: select, select-all, and search pruning work in the browser

**Step 5: Floating menu**
- [ ] Build to Figma using `Button` and `Dropdown`; Edit property stubbed per Q5
- ✋ Checkpoint: compare against Figma side by side

**Step 6: Delete modal**
- [ ] Per Q1 and Q4 (generalize vs. new)
- ✋ Checkpoint: compare against Figma

**Step 7: Hook + page wiring**
- [ ] `useCandidates.deleteCandidates`
- [ ] Page: memoized `displayedCandidates`, selection hook, menu, modal
- ✋ Checkpoint: end-to-end in the browser

**Step 8: Verify** (together)
- [ ] Single delete through the row dropdown → modal → row gone, and still gone after a refresh (DB)
- [ ] Bulk delete through the floating menu → modal → rows gone, selection cleared, menu hidden
- [ ] Select-all and indeterminate header states, including with search active
- [ ] Cancel or close the modal → nothing deleted, selection kept
- [ ] API error → toast, modal stays open
- [ ] Non-recruiter role → 403 is handled gracefully
- [ ] `npm run lint` / typecheck / `prettier:check` pass

## Acceptance criteria mapping

| Criterion | Covered by |
|---|---|
| Edited the candidate row component | `CandidateTable` select and actions columns |
| Created floating menu component | `CandidateSelectionMenu` |
| Modal pops up when confirming deletion | Delete confirmation modal (Step 6) |
| React state for selected rows / new hook | `useCandidateSelection` |
| Deleting removes from DB | Single `DELETE` endpoint + new batch `DELETE` via `useCandidates.deleteCandidates` |

---

## Findings from the first (reverted) attempt

- **`candidate.id` is needed in three selects, not one:** create and CSV import also return
  `ApplicationDisplayInfo`, so TypeScript fails unless all three include it.
- **`tw-animate-css` is not installed:** every `animate-in` / `fade-in` / `zoom-in` class in the app
  (dropdowns, dialogs) is a no-op. Use the project's own keyframes (`animate-section-enter`) if Figma
  calls for an animation, or decide separately whether to install it.
- **CRLF line endings:** `application.service.ts`, `application.schema.ts`, and
  `applications/batch/route.ts` use CRLF. Keep them CRLF when editing, or the whole file shows up as
  changed.
- **Dropdown → Dialog:** opening the modal from a ⋯ `DropdownMenuItem`'s `onSelect` worked fine. No
  stuck `pointer-events` issue.
- **Pre-existing:** the page makes `GET /api/applications/search?name=…` (from `useSearch`), which
  returns 404. Not this ticket's concern, but worth noting.

---

## Notes for the PR description

- **Typography doesn't match Figma:** The text across the Figma designs for this ticket (candidate
  rows, the three-dots menu's "Delete", etc.) looks heavier than what renders in the app, and it may be
  a different typeface entirely. The app uses **Satoshi** (`--font-sans`, variable font in
  `src/lib/fonts/`), with Inter also defined (`--font-inter`) in `src/app/globals.css`. The ticket
  doesn't mention typography, so we kept the existing styles. Ask the designer which font and weights
  the Figma uses, and whether that's an intentional change to follow up on separately.
- **Checkbox check mark updated app-wide:** Replaced the lucide `Check` icon in the shared `Checkbox`
  (`src/lib/components/ui/Checkbox.tsx`) with the exact check path from the Figma SVG. This also
  affects the task template list (`/crm/templates`) and the Add Task modal, which share the component
  via `TaskTemplateCard`.
- **Edit property is a stub:** the floating menu's Edit property dropdown (Assessment / Grader /
  Decision) opens per Figma, but selecting an item does nothing yet. No endpoint exists to update these
  fields. A `TODO` in `CandidateSelectionMenu` marks the spot.
- **Deletes are application-only:** removing a candidate from a position deletes the application and
  assessment, not the org-level `Candidate` record.
