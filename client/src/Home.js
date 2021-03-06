import React from 'react';
import { load } from 'react-cookies';
import { Redirect } from 'react-router';

import Account from './Account';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: undefined,

            isLoading: true,
            isAuthenticated: false
        };
    };

    authenticate = async () => {
        let user = {username: load('username'), password: load('password')};
        this.setState({user: user});

        if (user.username === undefined || user.password === undefined) {
            // immediately ask for login
        }

        const rOptions = {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(user)
        };

        let status = await fetch('http://localhost:3001/login', rOptions);
        return status.json();
    };

    componentDidMount() {
        let status = this.authenticate();
        status.then(data => {
            this.setState({
                isLoading: false,
                isAuthenticated: !data.err
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return 'loading...';
        } else {
            if (!this.state.isAuthenticated) {
                return <Redirect to="/login"/>
            }
            
            return <Account username={this.state.user.username} password={this.state.user.password}/>
        }
    };
}   