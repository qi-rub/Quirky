import { Config } from "src/Config.js"
import { Complex } from "src/math/Complex.js"
import { GateBuilder } from "src/circuit/Gate.js"
import { GatePainting } from "src/draw/GatePainting.js"
import { Matrix } from "src/math/Matrix.js"

let ClassicalGates = {};

/** @type {!Gate} */
ClassicalGates.CoinToss = new GateBuilder().
    setSymbol("🪙").
    setSerializedId("CoinToss").
    setTitle("Coin Toss").
    setBlurb("Toss a fair coin.").
    setKnownEffectToMatrix(Matrix.square(1, 1, 1, 1).times(0.5)).
    gate;

ClassicalGates.all = [
    ClassicalGates.CoinToss
];


export { ClassicalGates }
