// @flow
import fastdom from 'lib/fastdom-promise';
import template from 'lodash/template';
import campaignForm from 'raw-loader!journalism/views/campaignForm.html';
import { getCampaigns } from 'journalism/modules/get-campaign';
import { submitForm } from 'journalism/modules/submit-form';

const renderCampaign = (calloutNode: HTMLElement, calloutData): void => {
    const campaign = template(campaignForm)({ data: calloutData });
    const campaignDiv = `<figure class="element element-campaign">${campaign}</figure>`;

    fastdom
        .write(() => {
            calloutNode.innerHTML = campaignDiv;
        })
        .then(() => {
            const cForm = document.querySelector(
                '.element-campaign .campaign .campaign--snippet__body'
            );
            if (cForm) {
                cForm.addEventListener('submit', submitForm);
            }
        });
};

const getCalloutContainers = () => {
    // callout container is a figure with data-alt property in the format: 'Callout callout-tag-name' eg. 'Callout new-campaign-with-a-callout'
    const allEmbeds = document.querySelectorAll('figure[data-alt]');
    return Array.from(allEmbeds).filter(el => {
        const dataAlt = el.getAttribute('data-alt');

        if (!dataAlt) return false;

        return dataAlt.toLowerCase().includes('callout');
    });
};

export const initCampaign = () => {
    const calloutDatasets = getCampaigns();
    const calloutContainers = getCalloutContainers();

    // put the data into the correct container by matching up tagName with the dataAlt
    calloutContainers.forEach(container => {
        const dataAlt = container.getAttribute('data-alt');

        if (!dataAlt) return;

        calloutDatasets.forEach(callout => {
            if (dataAlt.toLowerCase().includes(callout.tagName)) {
                renderCampaign(container, callout);
            }
        });
    });
};
