// DOM wiring for ConsumablesPlanner.astro. Queries the server-rendered
// markup by id and re-renders on change — no elements are created here.
import {
  TRAY_OPTIONS,
  DEFAULT_TRAY,
  ROW_SLUGS,
  LITRES_ROW_SLUGS,
  planConsumables,
  plannerRows,
  formatCount,
  formatLitres,
  buildQuotationQuery,
  type PlannerInputs,
} from './planner';

export function mountConsumablesPlanner(root: HTMLElement): void {
  const graftsInput = root.querySelector<HTMLInputElement>('#grafts-per-cycle');
  const cyclesInput = root.querySelector<HTMLInputElement>('#cycles-per-year');
  const trayForm = root.querySelector<HTMLFormElement>('[data-role="tray-form"]');
  const quotationLink = root.querySelector<HTMLAnchorElement>('#quotation-link');

  if (!graftsInput || !cyclesInput || !trayForm) return;

  function currentTray() {
    const checked = trayForm!.querySelector<HTMLInputElement>('input[name="tray"]:checked');
    const cells = Number(checked?.value ?? DEFAULT_TRAY.cells);
    return TRAY_OPTIONS.find((t) => t.cells === cells) ?? DEFAULT_TRAY;
  }

  function render(): void {
    const tray = currentTray();
    const inputs: PlannerInputs = {
      graftsPerCycle: Number(graftsInput!.value) || 0,
      cyclesPerYear: Number(cyclesInput!.value) || 0,
      cells: tray.cells,
      mlPerCell: tray.mlPerCell,
    };
    const result = planConsumables(inputs);
    const rows = plannerRows(inputs, result);

    rows.forEach((row, i) => {
      const slug = ROW_SLUGS[i]!;
      const valueEl = root.querySelector<HTMLElement>(`#row-value-${slug}`);
      const workingEl = root.querySelector<HTMLElement>(`#row-working-${slug}`);
      if (valueEl) {
        valueEl.textContent = LITRES_ROW_SLUGS.has(slug)
          ? formatLitres(row.value)
          : formatCount(row.value);
      }
      if (workingEl) workingEl.textContent = row.working;
    });

    if (quotationLink) quotationLink.setAttribute('href', buildQuotationQuery(inputs, result));
  }

  graftsInput.addEventListener('input', render);
  cyclesInput.addEventListener('input', render);
  trayForm.addEventListener('change', render);
  render();
}
