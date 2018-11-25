import {GateBuilder} from "src/circuit/Gate.js"
import {GatePainting} from "src/draw/GatePainting.js"
import {Matrix} from "src/math/Matrix.js"

let MysteryGates = {};

// FIXME: do not forget to exclude IDs in paintGateTooltipHelper() to avoid spoilers

MysteryGates.DatabaseChip = new GateBuilder().
    setSerializedIdAndSymbol("Chip").
    setTitle("Hila and Iman's Database Chip").
    setBlurb("Can you determine if they have the same blood type?").
    setDrawer(GatePainting.MAKE_HIGHLIGHTED_DRAWER('pink', 'pink')).
    setKnownEffectToMatrix(new Matrix(2, 2, new Float32Array([-1,0, 0,0, 0,0, 1,0]))).
    promiseEffectIsUnitary().
    gate;


MysteryGates.DeutschJoszaOracle = new GateBuilder().
    setSerializedId("OracleDJ").
    setSymbol("Oracle").
    setTitle("An Oracle for the Deutsch-Josza Algorithm").
    setBlurb("Can you determine if the function is constant or balanced?").
    setDrawer(GatePainting.MAKE_HIGHLIGHTED_DRAWER('yellow', 'yellow')).
    setHeight(3).
    setKnownEffectToPhaser(idx => (idx == 0 || idx == 2 || idx == 6 || idx == 7) ? 0.5 : 0).
    promiseEffectIsUnitary().
    gate;

MysteryGates.BernsteinVaziraniOracle = new GateBuilder().
    setSerializedId("OracleBV").
    setSymbol("Oracle").
    setTitle("An Oracle for the Bernstein-Vazirani Algorithm").
    setBlurb("Can you determine the hidden subset?").
    setDrawer(GatePainting.MAKE_HIGHLIGHTED_DRAWER('orange', 'orange')).
    setHeight(4).
    // the subset is {1,2,4} of {1,2,3,4}, corresponding to |1101> -- note that Quirky is using a different notation than we are
    setKnownEffectToPhaser(k =>
      ((k&1) == 0 ? 0 : 0.5) +
      ((k&4) == 0 ? 0 : 0.5) +
      ((k&8) == 0 ? 0 : 0.5)
      ).
    promiseEffectIsUnitary().
    gate;

MysteryGates.all = [
  MysteryGates.DatabaseChip,
  MysteryGates.DeutschJoszaOracle,
  MysteryGates.BernsteinVaziraniOracle,
];

export {MysteryGates}
