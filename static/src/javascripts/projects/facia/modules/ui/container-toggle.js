// @flow
import bonzo from 'bonzo';
import fastdom from 'fastdom';
import $ from 'lib/$';
import mediator from 'lib/mediator';
import userPrefs from 'common/modules/user-prefs';

type ToggleState = 'hidden' | 'displayed';

const prefName = 'container-states';
const toggleText = {
    hidden: 'Show',
    displayed: 'Hide',
};

const btnTmpl = ({ text, dataLink, title }) => `
    <button class="fc-container__toggle" data-link-name="${dataLink}" aria-label="${text} ${title} section">
        ${text}
    </button>
`;

export class ContainerToggle {
    $container: bonzo;
    state: ToggleState;
    $button: bonzo;
    constructor(container: Element) {
        this.$container = bonzo(container);

        const $containerBody = $('.fc-container__body', this.$container[0]);

        this.title = $containerBody.attr('data-title');
        this.$button = bonzo(
            bonzo.create(
                btnTmpl({
                    title: this.title,
                    text: 'Hide',
                    dataLink: 'Show',
                })
            )
        );
        this.state = 'displayed';
    }

    updatePref(id: string): void {
        // update user prefs
        let prefs = userPrefs.get(prefName);
        const prefValue = id;

        if (this.state === 'displayed') {
            delete prefs[prefValue];
        } else {
            if (!prefs) {
                prefs = {};
            }
            prefs[prefValue] = 'closed';
        }
        userPrefs.set(prefName, prefs);
    }

    setState(newState: ToggleState): void {
        this.state = newState;

        fastdom.write(() => {
            // add/remove rolled class
            this.$container[
                this.state === 'displayed' ? 'removeClass' : 'addClass'
            ]('fc-container--rolled-up');
            // data-link-name is inverted, as happens before clickstream
            this.$button.attr(
                'data-link-name',
                toggleText[this.state === 'displayed' ? 'hidden' : 'displayed']
            );
            this.$button.text(toggleText[this.state]);
            this.$button.attr(
                'aria-label',
                `${
                    toggleText[
                        this.state === 'displayed' ? 'displayed' : 'hidden'
                    ]
                } ${this.title} section`
            );
        });
    }

    readPrefs(id: string): void {
        // update user prefs
        const prefs = userPrefs.get(prefName);
        if (prefs && prefs[id]) {
            this.setState('hidden');
        }
    }

    addToggle(): void {
        // append toggle button
        const id = this.$container.attr('data-id');
        const $containerHeader = $('.js-container__header', this.$container[0]);

        fastdom.write(() => {
            $containerHeader.append(this.$button);
            this.$container
                .removeClass('js-container--toggle')
                .removeClass('fc-container--will-have-toggle')
                .addClass('fc-container--has-toggle');

            this.readPrefs(id);
        });

        mediator.on('module:clickstream:click', clickSpec => {
            if (clickSpec.target === this.$button[0]) {
                this.setState(
                    this.state === 'displayed' ? 'hidden' : 'displayed'
                );
                this.updatePref(id);
            }
        });
    }
}
