import React from 'react';
import './style.css';

class AddPeople extends React.Component {
  render() {
    return (
      <React.Fragment>
        <a href="/">Home</a>
        <p>Add emails to search for friends' availability</p>
        <p>These should be *centered* buttons and  also look better</p>
        <style>
        </style>
        <addpeople>
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
        </addpeople>
        </React.Fragment>
    )
  }
}

export default AddPeople