import React from 'react';
import './style.css'
import Navbar from "../components/Navbar"

class GetStarted extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <Navbar /> {/* TODO: add api call to login from this page */}
        </div>
        <getstarted>
            <h1>Find the best times to meet with everyone!</h1>

            <div className="box-container">
                <div class="box">
                    <div className="circle"><h2>1</h2></div>
                    <div className="rectangle">
                      <h3>Sign into Google</h3>
                      <p>Click “Sign In” on the top right corner to sign into your Google account.</p>
                    </div>
                </div>
                <div className="box">
                    <div className="circle"><h2>2</h2></div>
                    <div className="rectangle">
                      <h3>Create a Meeting</h3>
                      <p>Select the dates/times you would like to meet based on your availability from your Google Calendar!</p>
                    </div>
                </div>
                <div className="box">
                    <div className="circle"><h2>3</h2></div>
                    <div className="rectangle">
                      <h3>Share with Others</h3>
                      <p>Share your meeting link with others to find overlapping availability and confirm the meeting!</p>
                    </div>
                </div>
                
            </div>
        </getstarted>
      </React.Fragment>
    )
  }
}

export default GetStarted
