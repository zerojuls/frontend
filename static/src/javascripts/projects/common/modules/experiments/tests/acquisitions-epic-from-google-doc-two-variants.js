// @flow
import {
    makeABTest,
    makeGoogleDocEpicVariants,
} from 'common/modules/commercial/contributions-utilities';

const abTestName = 'AcquisitionsEpicFromGoogleDocTwoVariants';

export const acquisitionsEpicFromGoogleDocTwoVariants: EpicABTest = makeABTest({
    id: abTestName,
    campaignId: abTestName,

    start: '2018-04-17',
    expiry: '2019-06-05',

    author: 'Joseph Smith',
    description: 'Test copy fetched from a Google Doc',
    successMeasure: 'Conversion rate',
    idealOutcome: 'Alternative copy makes more money than the control',

    audienceCriteria: 'All',
    audience: 1,
    audienceOffset: 0,

    variants: [
        {
            id: 'control',
            products: [],
        },
        ...makeGoogleDocEpicVariants(2),
    ],
});
