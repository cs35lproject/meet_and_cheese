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
            <h1>Let's get cheesin'</h1>

            <div className="box-container">
                <div class="box">
                    <div className="circle"><h2>1</h2></div>
                    <div className="rectangle">
                      <h3>Create a <br/>Meeting</h3>
                      <p>Click "Create Meeting” in the top right corner to get started. </p>
                    </div>
                </div>
                <div className="box">
                    <div className="circle"><h2>2</h2></div>
                    <div className="rectangle">
                      <h3>Join a<br/>Meeting</h3>
                      <p>Join a meeting link shared with you.</p>
                    </div>
                </div>
                <div className="box">
                    <div className="circle"><h2>3</h2></div>
                    <div className="rectangle">
                      <h3>Share with Others</h3>
                      <p>Share your meeting link with others to find overlapping availability.</p>
                    </div>
                </div>
                
            </div>
        </getstarted>
      </React.Fragment>
    )
  }
}

export default GetStarted
