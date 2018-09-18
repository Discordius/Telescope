import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Sequences from '../../lib/collections/sequences/collection.js';
import defineComponent from '../../lib/defineComponent';

const SequencesEditForm = (props, context) => {
  return (
    <div className="sequences-edit-form">
      <Components.SmartForm
        collection={Sequences}
        documentId={props.params._id}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        removeSuccessCallback={props.removeSuccessCallback}
        showRemove={true}
        fragment={getFragment('SequencesPageFragment')}
        queryFragment={getFragment('SequencesPageFragment')}
        mutationFragment={getFragment('SequencesPageFragment')}
      />
    </div>
  )
}

export default defineComponent({
  name: 'SequencesEditForm',
  component: SequencesEditForm,
  register: false,
  hocs: [ withMessages, withRouter ]
});
