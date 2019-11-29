import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Swal from "sweetalert2";

const API_STRING = process.env.REACT_APP_API_PLACEHOLDER;

export class UserPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: ""
    };
  }

  componentDidMount = () => {
    const {
      match: {
        params: { userId }
      }
    } = this.props;

    this.setState({ id: userId });

    axios
      .get(API_STRING + "/users/" + { userId } + "/posts")
      .then(res => {
        let userPosted = res.data.filter(item => {
          return item.userId.toString() === userId.toString();
        });
        this.setState({ data: userPosted });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onEdit = async (ID, index) => {
    Swal.mixin({
      input: "text",
      confirmButtonText: "Next &rarr;",
      showCancelButton: true,
      progressSteps: ["1", "2"],
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }
      }
    })
      .queue(["Edit Title", "Edit Body"])
      .then(result => {
        if (result.value) {
          axios
            .put(`${API_STRING}/posts/${ID}`, {
              title: result.value[0],
              body: result.value[1]
            })
            .then(response => {
              if (response.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "Your post with id " + ID + "updated",
                  text:
                    "title: " +
                    response.data.title +
                    "body: " +
                    response.data.body
                });
              }

              let rest = this.state.data;

              rest.splice(index, 1, {
                title: result.value[0],
                body: result.value[1]
              });

              this.setState({ data: rest });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
  };

  onDelete = (ID, index) => {
    axios
      .delete(`${API_STRING}/posts/${ID}`)
      .then(res => {
        if (res.status === 200) {
          Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(result => {
            if (result.value) {
              Swal.fire(
                "Deleted!",
                `Your post with id: ${ID} is deleted.`,
                "success"
              );
              let refresh = this.state.data;
              refresh.splice(index, 1);
              this.setState({
                data: refresh
              });
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  addPost = () => {
    Swal.mixin({
      input: "text",
      confirmButtonText: "Next &rarr;",
      showCancelButton: true,
      progressSteps: ["1", "2"],
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }
      }
    })
      .queue(["Add Title", "Add Body"])
      .then(result => {
        if (result.value) {
          axios
            .post(`${API_STRING}/posts`, {
              title: result.value[0],
              body: result.value[1]
            })
            .then(response => {
              if (response.status === 201) {
                Swal.fire({
                  icon: "success",
                  title: "Your new post is successfully added",
                  text:
                    "Title: " +
                    response.data.title +
                    " Body: " +
                    response.data.body
                });
                let rest = this.state.data;

                rest.push({
                  id: rest.lenth + 1,
                  title: result.value[0],
                  body: result.value[1]
                });

                this.setState({ data: rest });
              }
            });
        }
      });
  };

  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.addPost();
          }}
        >
          Add New Post
        </Button>
        {this.state.data.length > 0 &&
          this.state.data.map((item, key) => {
            return (
              <List>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={item.userId}
                    secondary={
                      <React.Fragment>
                        <Typography variant="h4" color="textPrimary">
                          {item.title}
                          <br />
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                          {item.body}
                          <br />
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    margin="props"
                    style={{ margin: "50px" }}
                    onClick={() => {
                      this.onEdit(item.id, key);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ margin: "50px" }}
                    onClick={() => {
                      this.onDelete(item.id, key);
                    }}
                  >
                    Delete
                  </Button>
                </ListItem>
              </List>
            );
          })}
      </div>
    );
  }
}
export default withRouter(UserPost);
