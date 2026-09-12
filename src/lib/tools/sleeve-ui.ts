// DOM wiring for SleeveSelector.astro. Queries the server-rendered markup by
// id and re-renders on change — no elements are created here.
import { CROPS, STEM_MAX, selectSleeve, scaledRadii, type CropKey } from './sleeve';

const MAX_RADIUS_PX = 64;

function isCropKey(value: string): value is CropKey {
  return CROPS.some((c) => c.key === value);
}

export function mountSleeveSelector(root: HTMLElement): void {
  const cropForm = root.querySelector<HTMLFormElement>('[data-role="crop-form"]');
  const stemInput = root.querySelector<HTMLInputElement>('#stem-diameter');
  const stemValueOut = root.querySelector<HTMLOutputElement>('#stem-diameter-value');
  const skuEl = root.querySelector<HTMLElement>('#sleeve-sku');
  const boreEl = root.querySelector<HTMLElement>('#sleeve-bore');
  const wallEl = root.querySelector<HTMLElement>('#sleeve-wall');
  const lengthEl = root.querySelector<HTMLElement>('#sleeve-length');
  const packEl = root.querySelector<HTMLElement>('#sleeve-pack');
  const fitNoteEl = root.querySelector<HTMLElement>('#sleeve-fit-note');
  const stemCircle = root.querySelector<SVGCircleElement>('#stem-circle');
  const boreCircle = root.querySelector<SVGCircleElement>('#bore-circle');

  if (
    !cropForm ||
    !stemInput ||
    !skuEl ||
    !boreEl ||
    !wallEl ||
    !lengthEl ||
    !packEl ||
    !fitNoteEl
  ) {
    return;
  }

  function currentCrop(): CropKey {
    const checked = cropForm!.querySelector<HTMLInputElement>('input[name="crop"]:checked');
    const value = checked?.value ?? 'rose';
    return isCropKey(value) ? value : 'rose';
  }

  function render(): void {
    const crop = currentCrop();
    const stem = Number(stemInput!.value);
    const result = selectSleeve(crop, stem);

    if (stemValueOut) stemValueOut.value = `${stem.toFixed(1)} mm`;
    skuEl!.textContent = result.sku;
    boreEl!.textContent = `${result.boreLabel} mm`;
    wallEl!.textContent = `${result.wall.toFixed(2)} mm`;
    lengthEl!.textContent = `${result.length} mm`;
    packEl!.textContent = result.pack.toLocaleString('en-GB');
    fitNoteEl!.textContent = result.fitNote;

    if (stemCircle && boreCircle) {
      const { stemRadiusPx, boreRadiusPx } = scaledRadii(
        stem,
        result.bore,
        STEM_MAX,
        MAX_RADIUS_PX,
      );
      stemCircle.setAttribute('r', stemRadiusPx.toFixed(2));
      boreCircle.setAttribute('r', boreRadiusPx.toFixed(2));
    }
  }

  cropForm.addEventListener('change', render);
  stemInput.addEventListener('input', render);
  render();
}
