import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Components, registerComponent, withList, getSetting} from 'meteor/vulcan:core';
import { LocalGroups } from '../../lib/index.js';
import mapStyle from './mapStyles.js';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"

class CommunityMap extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      openWindows: props.initialOpenWindows,
    }
  }

  handleMarkerClick = (groupId) => {
    this.setState({openWindows: [...this.state.openWindows, groupId]})
  }

  handleInfoWindowClose = (groupId) => {
    this.setState({openWindows: _.without(this.state.openWindows, groupId)})
  }

  renderLocalGroups = () => {
    const localGroups = this.props.results;
    if (localGroups) {
      return localGroups.map((group) => {
        return(
          <Components.LocalGroupMarker
            key={group._id}
            group={group}
            handleMarkerClick={this.handleMarkerClick}
            handleInfoWindowClose={this.handleInfoWindowClose}
            infoOpen={this.state.openWindows.includes(group._id)}
            location={group.googleLocation}
          />
        )
      })
    }
  }

  renderLocalEvents = () => {
    const localEvents = this.props.events;
    if (localEvents) {
      return localEvents.map((event) => {
        return <Components.LocalEventMarker
          key={event._id}
          event={event}
          handleMarkerClick={this.handleMarkerClick}
          handleInfoWindowClose={this.handleInfoWindowClose}
          infoOpen={this.state.openWindows.includes(event._id)}
          location={event.googleLocation}
        />
      })
    }
  }

  render() {
    console.log("CommunityMap: ", this.props.results, this.props.terms);
    return (
      <GoogleMap
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        options={{styles: mapStyle}}
      >
        {this.renderLocalGroups()}
        {this.renderLocalEvents()}
      </GoogleMap>
    );
  }
}

CommunityMap.defaultProps = {
  googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${getSetting('googleMaps.apiKey', null)}v=3.exp&libraries=geometry,drawing,places`,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `400px` }} />,
  mapElement: <div style={{ height: `100%` }} />,
  center: {lat: 37.871853, lng: -122.258423},
  zoom: 3,
  initialOpenWindows: [],
}

const listOptions = {
  collection: LocalGroups,
  queryName: "communityMapQuery",
  fragmentName: "localGroupsHomeFragment",
  limit: 500,
}

registerComponent("CommunityMap", CommunityMap, [withList, listOptions], withScriptjs, withGoogleMap)
