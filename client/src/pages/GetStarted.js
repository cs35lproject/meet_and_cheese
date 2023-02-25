import React from 'react';
import './style.css'

class GetStarted extends React.Component {
  render() {
    return (
      <React.Fragment>
        <getstarted>
            <h1>Let's Get Cheesin'</h1>
            <div class="row">
                <div class="column">
                    <div class="circle">1</div>
                    <h2>Make an Account</h2>
                </div>
                <div class="column">
                    <div class="circle">2</div>
                    <h2>Schedule a Meeting</h2>
                </div>
                <div class="column">
                    <div class="circle">3</div>
                    <h2>Share with others!</h2>
                </div>
            </div>
        </getstarted>
      </React.Fragment>
    )
  }
}

export default GetStarted