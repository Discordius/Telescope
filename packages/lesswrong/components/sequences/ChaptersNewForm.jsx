import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Chapters from '../../lib/collections/chapters/collection.js';
import defineComponent from '../../lib/defineComponent';

//TODO: Manage chapter removal to remove the reference from all parent-sequences

const ChaptersNewForm = (props) => {
  return (
    <div className="chapters-new-form">
      <h3>Add Chapter</h3>
      <Components.SmartForm
        collection={Chapters}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        prefilledProps={props.prefilledProps}
        fragment={getFragment('ChaptersFragment')}
        queryFragment={getFragment('ChaptersFragment')}
        mutationFragment={getFragment('ChaptersFragment')}
      />
    </div>
  )
}

export default defineComponent({
  name: 'ChaptersNewForm',
  component: ChaptersNewForm,
  register: false,
  hocs: [ withMessages ]
});
