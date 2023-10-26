import React, { useMemo, useState } from 'react';
import ProgressBar from 'app/components/ProgressBar';
import Button from '../../../../components/Button';
import RadioField from '../../../../components/RadioField';

const progressBarSections = [
  {
    title: '1. Add Related Correspondence',
    current: false
  },
  {
    title: '2. Review Tasks & Appeals',
    current: true
  },
  {
    title: '3. Confirm',
    current: false
  },
];

const priorMailanswer = [
  { displayText: 'Yes',
    value: 'yes' },
  { displayText: 'No',
    value: 'no' }
];

export const CorrespondenceIntake = () => {
  const sections = useMemo(
    () =>
      progressBarSections.map(({ title, current }) => ({
        title,
        current
      })),
  );
  const [selectedValue, setSelectedValue] = useState('no');

  const handleRadioChange = (event) => {
    setSelectedValue(event);
  };

  return <div>
    <ProgressBar sections={sections} />
    <section className="cf-app-segment cf-app-segment--alt">
      <h1>Add Related Correspondence</h1>
      <p>Add any related correspondence to the mail package that is in progress.</p>

      <h3>Associate with prior Mail</h3>

      <p>Is this correspondence related to prior mail?</p>
      <RadioField
        name=""
        options={priorMailanswer}
        value={selectedValue}
        onChange={handleRadioChange} />

      {selectedValue === 'yes' && (
        <div className="cf-app-segment cf-app-segment--alt">
          <p>Please select the prior mail to link to this correspondence</p>
          <p>Viewing 1-15 out of 200 total</p>
        </div>
      )}

    </section>
    <Button
      name="Cancel"
      classNames={['cf-btn-link']} />
    <Button
      type="button"
      name="Continue"
      classNames={['cf-push-right']}>
        Continue
    </Button>
  </div>;
};
export default CorrespondenceIntake;
