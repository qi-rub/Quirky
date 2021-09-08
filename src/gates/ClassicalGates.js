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

ClassicalGates.MysteryBitOperation = new GateBuilder().
    setSerializedId("MysteryBop").
    setSymbol("Mystery").
    setTitle("A mysterious operation").
    setBlurb("Can you find out what it does?").
    setDrawer(GatePainting.MAKE_HIGHLIGHTED_DRAWER('orange', 'orange')).
    setKnownEffectToMatrix(Matrix.square(0.2, 0.7, 0.8, 0.3)).
    gate;

ClassicalGates.all = [
    ClassicalGates.CoinToss,
    ClassicalGates.MysteryBitOperation
];


export { ClassicalGates }
