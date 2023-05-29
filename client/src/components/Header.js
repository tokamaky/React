import React, {Component} from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import Payments from "./Payments";

class Header extends Component{
    readerContent(){
        switch(this.props.auth){
            case null:
                return;
            case false:
                return(
                    <li><a href='/auth/google'>Login with Google</a></li>
                )
            default: 
            return[
                <li key='1'><Payments /></li>,
                <li key='3' style={{margin : '0 10px'}}>
                    Credits:{this.props.auth.credits}
                </li>,
                <li key='2'><a href="/api/logout">logout</a></li>
            ]; 

        }
    }

    render(){
        return(
            <nav>
              <div className="nav-wrapper">
                <Link 
                    to={this.props.auth ? '/surveys' : '/'} //if user sgined in go /surverys, if user's not loged in go home page
                    className="left brand-logo"
                >
                   Emaily
                </Link>
                <ul className="right">
                    {this.readerContent()};
                </ul>
              </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);