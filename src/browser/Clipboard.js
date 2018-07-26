// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @param {!HTMLElement} element
 * @throws
 */
function selectAndCopyToClipboard(element) {
    // https://github.com/zenorocha/clipboard.js/blob/master/src/clipboard-action.js
    const isRTL = document.documentElement.getAttribute('dir') == 'rtl';

    let fakeElem = document.createElement('textarea');
    fakeElem.style.fontSize = '12pt';
    fakeElem.style.border = '0';
    fakeElem.style.padding = '0';
    fakeElem.style.margin = '0';
    fakeElem.style.position = 'absolute';
    fakeElem.style[ isRTL ? 'right' : 'left' ] = '-9999px';
    let yPosition = window.pageYOffset || document.documentElement.scrollTop;
    fakeElem.style.top = `${yPosition}px`;
    fakeElem.setAttribute('readonly', '');
    fakeElem.value = element.innerText;
    document.body.appendChild(fakeElem);

    if (document.selection) {
        let range = document.body.createTextRange();
        range.moveToElementText(fakeElem);
        range.select();
    } else if (window.getSelection) {
        let range = document.createRange();
        range.selectNode(fakeElem);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }

    if (!document.execCommand('copy')) {
        document.body.removeChild(fakeElem);
        throw new Error("execCommand failed");
    }

    document.body.removeChild(fakeElem);
}

export {selectAndCopyToClipboard}
