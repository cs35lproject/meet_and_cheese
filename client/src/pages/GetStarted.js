import React from 'react';
import './style.css'

class GetStarted extends React.Component {
  render() {
    return (
      <React.Fragment>
        <getstarted>
            <h1>Let's Start Meeting!</h1>

            <div class="box_container">
                <div class="box">
                    <div className="circle"><h2>1</h2></div>
                    <div className="rectangle">
                      <h3>Make an Account</h3>
                      <p>Click “Log in” on the top right corner to create an account or log in.</p>
                    </div>
                </div>
                <div class="box">
                    <div className="circle"><h2>2</h2></div>
                    <div className="rectangle">
                      <h3>Schedule a Meeting</h3>
                      <p>Select the dates you would like to meet, synced to your Google Calendar!</p>
                    </div>
                </div>
                <div class="box">
                    <div className="circle"><h2>3</h2></div>
                    <div className="rectangle">
                      <h3>Share with Others!</h3>
                      <p>Connect your calendar with others to find overlapping availability and start scheduling meetings!</p>
                    </div>
                </div>
                
            </div>
        </getstarted>
      </React.Fragment>
    )
  }
}

export default GetStarted

/* class GetStarted extends React.Component {
  render() {
    return (
      <React.Fragment>
        <getstarted>
            <h1>Let's Get Cheesin'</h1>
            <div class="row">
                <div class="column">
                  <div class="container">
                    <div class="circle">1</div>
                    <h2>Make an Account</h2>
                    <div className="rectangle"></div>
                  </div>
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
*/