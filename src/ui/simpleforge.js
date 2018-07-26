import {Complex} from "src/math/Complex.js"
import {Config} from "src/Config.js"
import {Format} from "src/base/Format.js"
import {Gate, GateBuilder} from "src/circuit/Gate.js"
import {Matrix} from "src/math/Matrix.js"
import {Observable, ObservableValue} from "src/base/Obs.js"
import {fromJsonText_CircuitDefinition, Serializer} from "src/circuit/Serializer.js"

const simpleForgeIsVisible = new ObservableValue(false);
const obsSimpleForgeIsShowing = simpleForgeIsVisible.observable().whenDifferent();

function initSimpleForge(revision, obsIsAnyOverlayShowing) {
    const obsOnShown = obsSimpleForgeIsShowing.filter(e => e === true);
    /** @type {!String} */
    let latestInspectorText;
    revision.latestActiveCommit().subscribe(e => { latestInspectorText = e; });

    // Show/hide forge overlay.
    (() => {
        const forgeButton = /** @type {!HTMLButtonElement} */ document.getElementById('simple-gate-forge-button');
        const forgeOverlay = /** @type {!HTMLDivElement} */ document.getElementById('simple-gate-forge-overlay');
        const forgeDiv = /** @type {HTMLDivElement} */ document.getElementById('simple-gate-forge-div');
        forgeButton.addEventListener('click', () => simpleForgeIsVisible.set(true));
        forgeOverlay.addEventListener('click', () => simpleForgeIsVisible.set(false));
        obsIsAnyOverlayShowing.subscribe(e => { forgeButton.disabled = e; });
        document.addEventListener('keydown', e => {
            const ESC_KEY = 27;
            if (e.keyCode === ESC_KEY) {
                simpleForgeIsVisible.set(false)
            }
        });
        obsSimpleForgeIsShowing.subscribe(showing => {
            forgeDiv.style.display = showing ? 'block' : 'none';
            if (showing) {
                document.getElementById('simple-gate-forge-rotation-angle').focus();
            }
        });
    })();

    /**
     * @param {!Gate} gate
     * @param {undefined|!CircuitDefinition=undefined} circuitDef
     */
    function createCustomGateAndClose(gate, circuitDef=undefined) {
        let c = circuitDef || fromJsonText_CircuitDefinition(latestInspectorText);
        revision.commit(JSON.stringify(Serializer.toJson(c.withCustomGate(gate)), null, 0));
        simpleForgeIsVisible.set(false);
    }

    (() => {
        const rotationButton = /** @type {!HTMLInputElement} */ document.getElementById('simple-gate-forge-rotation-button');
        const txtAngle = /** @type {!HTMLInputElement} */ document.getElementById('simple-gate-forge-rotation-angle');

        rotationButton.addEventListener('click', () => {
            let txtAngleValue, mat;
            try {
                txtAngleValue = valueElsePlaceholder(txtAngle);
                mat = parseUserRotation(txtAngleValue);
            } catch (ex) {
                console.warn(ex);
                return; // Button is about to be disabled, so no handling required.
            }

            let gate = new GateBuilder().
                setSerializedId('~' + Math.floor(Math.random()*(1 << 20)).toString(32)).
                setSymbol('U(' + txtAngleValue + ')').
                setBlurb('Rotation by an angle of ' + txtAngleValue).
                setKnownEffectToMatrix(mat).
                gate;
            createCustomGateAndClose(gate);
        });
    })();
}

/**
 * @param {!HTMLInputElement} textBox
 * @returns {!string}
 */
function valueElsePlaceholder(textBox) {
    //noinspection JSUnresolvedVariable
    return textBox.value === '' ? textBox.placeholder : textBox.value;
}

/**
 * @param {!string} text
 * @returns {!number}
 */
function parseUserAngle(text) {
    let c = Complex.parse(text);
    if (c.imag !== 0 || isNaN(c.imag)) {
        throw new Error("You just had to make it complicated, didn't you?");
    }
    return c.real; // * Math.PI;
}

/**
 * @param {!string} angleText
 * @returns {!Matrix}
 */
function parseUserRotation(angleText) {
    let theta = parseUserAngle(angleText);
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    let result = Matrix.square(c, -s, s, c);
    return decreasePrecisionAndSerializedSize(result);
}

/**
 * @param {!Matrix} matrix
 * @returns {!Matrix}
 */
function decreasePrecisionAndSerializedSize(matrix) {
    return Matrix.parse(matrix.toString(new Format(true, 0.0000001, 7, ",")))
}

export {initSimpleForge, obsSimpleForgeIsShowing}
