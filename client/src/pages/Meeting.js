import React from 'react';
import './style.css';

import Navbar from "../components/Navbar"

class Meeting extends React.Component {

  state = {
    meetingID : [],
    intersections : [],
    meetingMemberIDS : []
  }

  componentDidMount() {
    if (this.props.intersections) {
      this.props.intersections.forEach( (intersection) => {
        let start = new Date(intersection[0]), end = new Date(intersection[1])

      })
      this.setState({intersections : this.props.intersections, meetingID : this.props.meetingID, meetingMemberIDS : this.props.meetingMemberIDS})
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Navbar/>
        </div>

        <a href="/">Home</a>
        <p>Page containing full availability data from all meeting participants</p>
        <p>These should be *centered* buttons and  also look better</p>
        <meeting>
            <div class="row">
                <div class="column">
                    <div class="circle"></div>
                    <h2>Default View</h2>
                </div>
                <div class="column">
                    <div class="circle"></div>
                    <h2>Meeting View</h2>
                </div>
            </div>
        </meeting>
      </React.Fragment>
    )
  }
}

export default Meeting