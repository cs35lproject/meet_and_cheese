// simple search bar in react
// sends queries to backend and returns result
//import style
import './Search.css';
import React, { useState, useEffect } from 'react';
import { Form } from 'react-router-dom';

// url to backend from env
const url = process.env.REACT_APP_URL;

const SearchBar = (props) => {
    const userID = props.userID;
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (searchResults && searchResults.length > 0) {
            props.setValue("three");
            props.setSearchMeetings(searchResults[0]);
        }
    }, [searchResults])

    useEffect(() => {
        let url = `${process.env.REACT_APP_BACKEND}/user/searchUsers?query=${searchTerm}&userID=${String(userID)}`
        let metadata = { method: "GET" }
        const results = fetch(url, metadata)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setSearchResults(json.users.meetings);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [searchTerm]);

    return (
        <React.Fragment>
        <div className="search">
            <Form>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </Form>
        </div>
        </React.Fragment>
    );
}

export default SearchBar;