import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/feed">
            Post Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a
            href=""
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            <img
              className="rounded-circle"
              style={{ width: "25px", marginRight: "10px" }}
              src="data:image/png;base64,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"
            />
            Logout
          </a>
        </li>
      </ul>
    );
    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Register
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            CodeBook
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profiles">
                  {" "}
                  Developers
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(Navbar);
