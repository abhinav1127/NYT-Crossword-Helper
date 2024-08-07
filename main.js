const autocheckButton = Array.from(document.querySelectorAll('button.xwd__menu--btnlink'))
  .find(button => button.textContent.trim() === 'Autocheck');

if (!autocheckButton.parentElement.classList.contains('xwd__menu--item-checked')) {
    autocheckButton.click();
}

const tabEvent =  new KeyboardEvent('keydown', {
    key: 'Tab',
    code: 'Tab',
    keyCode: 9,
    which: 9,
    bubbles: true,
    cancelable: true,
    composed: true,
    isTrusted: true
  });

const vowelCharCodes = [97,101,105,111,117,121];

keypress2 = new KeyboardEvent('keypress', {
    charCode: 101,
    bubbles: true,
  });

highlightedKey = document.querySelector('.xwd__cell--highlighted')

// highlightedKey.dispatchEvent(keypress2);

// loop for each hint
for (let x = 0; x < 50; x++) {
    // loop for each cell
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 14; j++) {
        document.querySelector('.xwd__cell--highlighted').dispatchEvent(new KeyboardEvent('keypress', {
            charCode: vowelCharCodes[i],
            bubbles: true,
        }))
    }
    }

    document.activeElement.dispatchEvent(tabEvent);
}

const deleteEvent = new KeyboardEvent('keydown', {
    key: 'Backspace',
    code: 'Backspace',
    keyCode: 8,
    which: 8,
    bubbles: true,
    cancelable: true,
    composed: true,
    isTrusted: true
});

const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });

setTimeout(() => {
    const popupButton = document.querySelector('.pz-moment__button')
    if (popupButton) {
        popupButton.click()
    }

    setTimeout(() => {
        document.getElementById('cell-id-0').dispatchEvent(clickEvent);
        for (let x = 0; x < 100; x++) {
            setTimeout (() => {
                const currSelectedLetters = document.querySelectorAll('.xwd__cell--highlighted')
                const lastElement = currSelectedLetters[currSelectedLetters.length - 1];
                if (lastElement.id !== document.querySelector('.xwd__cell--selected').id){
                    lastElement.dispatchEvent(clickEvent);
                }
                
                for (let i = 0; i < 15; i++) {
                        lastElement.dispatchEvent(deleteEvent);
                }
                document.activeElement.dispatchEvent(tabEvent);
            }, 1)
        }
    }, 1000);
}, 1000);
