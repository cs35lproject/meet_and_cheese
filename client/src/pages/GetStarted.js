import React from 'react';
import './style.css'
import Navbar from "../components/Navbar"

class GetStarted extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <Navbar />
        </div>
        <getstarted>
            <h1>Find the best times to meet with everyone</h1>

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