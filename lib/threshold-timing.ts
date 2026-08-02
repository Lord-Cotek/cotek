/**
 * The threshold's clock.
 *
 * Shared by the CSS choreography and the canvas that draws the web between
 * the names — the component publishes these as custom properties on the
 * section, so the stylesheet and the frame loop cannot drift out of step.
 *
 * All values are milliseconds from the first paint of the section. The whole
 * sequence resolves in about 5.3 seconds, which is roughly the longest a
 * stranger will wait before deciding a site is broken.
 */
export const T = {
  /** First name appears; each subsequent one follows a step later. */
  name: 250,
  nameStep: 190,

  /** Links begin to draw between the names. */
  edge: 900,
  edgeStep: 110,
  /** How long one link takes to draw itself end to end. */
  edgeDraw: 560,

  /** The web contracts and the names travel down it into the middle. */
  converge: 2600,
  convergeDur: 1150,

  /** The five letters precipitate out of the collapse. */
  letter: 3060,
  letterStep: 130,

  /** The shield resolves behind the word. */
  ghost: 3450,

  /** What each letter stands for. */
  rows: 3900,
  rowStep: 100,

  meaning: 4560,
  subline: 4980,
  actions: 5320,
} as const;

/** Past this the sequence is finished and the frame loop can stop. */
export const T_END = T.actions + 1400;

/** The subset the stylesheet reads, as a style object. */
export function timingVars(): Record<string, string> {
  return {
    "--t-name": `${T.name}ms`,
    "--t-name-step": `${T.nameStep}ms`,
    "--t-converge": `${T.converge}ms`,
    "--t-letter": `${T.letter}ms`,
    "--t-letter-step": `${T.letterStep}ms`,
    "--t-ghost": `${T.ghost}ms`,
    "--t-rows": `${T.rows}ms`,
    "--t-row-step": `${T.rowStep}ms`,
    "--t-meaning": `${T.meaning}ms`,
    "--t-subline": `${T.subline}ms`,
    "--t-actions": `${T.actions}ms`,
  };
}
