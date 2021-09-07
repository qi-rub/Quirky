import { Complex } from "src/math/Complex.js"
import { Config } from "src/Config.js"
import { Format } from "src/base/Format.js"
import { Gate, GateBuilder } from "src/circuit/Gate.js"
import { Matrix } from "src/math/Matrix.js"
import { Observable, ObservableValue } from "src/base/Obs.js"
import { fromJsonText_CircuitDefinition, Serializer } from "src/circuit/Serializer.js"

const classicalForgeIsVisible = new ObservableValue(false);
const obsClassicalForgeIsShowing = classicalForgeIsVisible.observable().whenDifferent();

function initClassicalForge(revision, obsIsAnyOverlayShowing) {
    const obsOnShown = obsClassicalForgeIsShowing.filter(e => e === true);
    /** @type {!String} */
    let latestInspectorText;
    revision.latestActiveCommit().subscribe(e => { latestInspectorText = e; });

    // Show/hide forge overlay.
    (() => {
        const forgeButton = /** @type {!HTMLButtonElement} */ document.getElementById('classical-gate-forge-button');
        const forgeOverlay = /** @type {!HTMLDivElement} */ document.getElementById('classical-gate-forge-overlay');
        const forgeDiv = /** @type {HTMLDivElement} */ document.getElementById('classical-gate-forge-div');
        forgeButton.addEventListener('click', () => classicalForgeIsVisible.set(true));
        forgeOverlay.addEventListener('click', () => classicalForgeIsVisible.set(false));
        obsIsAnyOverlayShowing.subscribe(e => { forgeButton.disabled = e; });
        document.addEventListener('keydown', e => {
            const ESC_KEY = 27;
            if (e.keyCode === ESC_KEY) {
                classicalForgeIsVisible.set(false)
            }
        });
        obsClassicalForgeIsShowing.subscribe(showing => {
            forgeDiv.style.display = showing ? 'block' : 'none';
            if (showing) {
                document.getElementById('classical-gate-forge-probability').focus();
            }
        });
    })();

    /**
     * @param {!Gate} gate
     * @param {undefined|!CircuitDefinition=undefined} circuitDef
     */
    function createCustomGateAndClose(gate, circuitDef = undefined) {
        let c = circuitDef || fromJsonText_CircuitDefinition(latestInspectorText);
        revision.commit(JSON.stringify(Serializer.toJson(c.withCustomGate(gate)), null, 0));
        classicalForgeIsVisible.set(false);
    }

    (() => {
        const cancelButton = /** @type {!HTMLInputElement} */ document.getElementById('classical-gate-forge-cancel-button');
        const rotationButton = /** @type {!HTMLInputElement} */ document.getElementById('classical-gate-forge-ok-button');
        const txtProbability = /** @type {!HTMLInputElement} */ document.getElementById('classical-gate-forge-probability');

        cancelButton.addEventListener('click', () => {
            classicalForgeIsVisible.set(false);
        });

        rotationButton.addEventListener('click', () => {
            let txtProbabilityValue, mat;
            try {
                txtProbabilityValue = valueElsePlaceholder(txtProbability);
                mat = parseUserFlip(txtProbabilityValue);
            } catch (ex) {
                console.warn(ex);
                return; // Button is about to be disabled, so no handling required.
            }

            let gate = new GateBuilder().
                setSerializedId('~' + Math.floor(Math.random() * (1 << 20)).toString(32)).
                setSymbol('F(' + txtProbabilityValue + ')').
                //setBlurb('Rotation by an angle of ' + txtProbabilityValue).
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
function parseUserProbability(text) {
    let c = Complex.parse(text);
    if (c.imag !== 0 || isNaN(c.imag) || c.real < 0 || c.real > 1) {
        throw new Error("You just had to make it complicated, didn't you?");
    }
    return c.real; // * Math.PI;
}

/**
 * @param {!string} probText
 * @returns {!Matrix}
 */
function parseUserFlip(probText) {
    let f = parseUserProbability(probText);
    let result = Matrix.square(1 - f, f, f, 1 - f);
    return decreasePrecisionAndSerializedSize(result);
}

/**
 * @param {!Matrix} matrix
 * @returns {!Matrix}
 */
function decreasePrecisionAndSerializedSize(matrix) {
    return Matrix.parse(matrix.toString(new Format(true, 0.0000001, 7, ",")))
}

export { initClassicalForge, obsClassicalForgeIsShowing }
