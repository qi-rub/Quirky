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
    // setActualEffectToShaderProvider(ctx => zShader.withArgs(...ketArgs(ctx))).
    setKnownEffectToMatrix(new Matrix(2, 2, new Float32Array([-1,0, 0,0, 0,0, 1,0]))).
    promiseEffectIsUnitary().
    gate;


MysteryGates.DeutschJoszaOracle = new GateBuilder().
    setSerializedId("OracleDJ").
    setSymbol("Oracle").
    setTitle("An Oracle for the Deutsch-Josza Algorithm").
    setBlurb("Can you determine if the function is constant or balanced?").
    setDrawer(GatePainting.MAKE_HIGHLIGHTED_DRAWER('yellow', 'yellow')).
    // setActualEffectToShaderProvider(ctx => zShader.withArgs(...ketArgs(ctx))).
    setHeight(3).
    setKnownEffectToMatrix(new Matrix(8, 8, new Float32Array(
        [-1,0,  0,0,  0,0,  0,0,  0,0,  0,0,  0,0,  0,0,
          0,0,  1,0,  0,0,  0,0,  0,0,  0,0,  0,0,  0,0,
          0,0,  0,0, -1,0,  0,0,  0,0,  0,0,  0,0,  0,0,
          0,0,  0,0,  0,0,  1,0,  0,0,  0,0,  0,0,  0,0,
          0,0,  0,0,  0,0,  0,0,  1,0,  0,0,  0,0,  0,0,
          0,0,  0,0,  0,0,  0,0,  0,0,  1,0,  0,0,  0,0,
          0,0,  0,0,  0,0,  0,0,  0,0,  0,0, -1,0,  0,0,
          0,0,  0,0,  0,0,  0,0,  0,0,  0,0,  0,0, -1,0,
        ]))).
    promiseEffectIsUnitary().
    gate;


MysteryGates.all = [
  MysteryGates.DatabaseChip,
  MysteryGates.DeutschJoszaOracle,
];

export {MysteryGates}
