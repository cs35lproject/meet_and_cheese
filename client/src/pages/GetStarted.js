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
            <h1>It's cheesing time.</h1>

            <div className="box-container">
                <div class="box">
                    <div className="circle"><h2>1</h2></div>
                    <div className="rectangle">
                      <h3>Create & Join <br/>a Meeting</h3>
                      <p>Click "Create Meeting” to create your own meeting!</p>
                      <p>Or join an existing meeting with a URL!</p>
                    </div>
                </div>
                <div className="box">
                    <div className="circle"><h2>2</h2></div>
                    <div className="rectangle">
                      <h3>Confirm & Share<br/>Meeting</h3>
                      <p>Modify and confirm your availability!</p>
                      <p>You can then share the invite link to whoever you'd like.</p>
                    </div>
                </div>
                <div className="box">
                    <div className="circle"><h2>3</h2></div>
                    <div className="rectangle">
                      <h3>Send Calendar Invites</h3>
                      <p>Meeting organizer will confirm the meeting. </p>
                      <p> You will see the meeting invite in your Google Calendar!
                      </p>
                    </div>
                </div>
                
            </div>
        </getstarted>
      </React.Fragment>
    )
  }
}

export default GetStarted
