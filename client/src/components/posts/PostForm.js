import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addPost } from "../../actions/postActions";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      errors: {}
    };
  }
  render() {
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            What's on your mind?
          </div>

          <div className="card-body">
            <form>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create Post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  errors={this.errors}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { addPost }
)(PostForm);
