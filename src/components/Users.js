import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import { Link } from "react-router-dom";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

const API_STRING = `https://jsonplaceholder.typicode.com/users`;

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount = () => {
    axios
      .get(API_STRING)
      .then(res => {
        this.setState({ data: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    console.log(this.state.data)
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          background: ""
        }}
      >
        {this.state.data.length > 0 &&
          this.state.data.map((item, key) => {
            return (
              <Card style={{ maxWidth: "400px", margin: "20px" }} key={key}>
                <CardContent>
                  <Typography color="textSecondary">{item.email}</Typography>
                  <Typography variant="body1" component="p">
                    Hello my name is {item.name}
                  </Typography>
                  <br />
                  <Typography variant="subtitle2" component="p">
                    Phone: {item.phone}
                  </Typography>
                  <Typography variant="subtitle2" component="p">
                    Website: {item.website}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">
                    <Link to={`/users/${item.id}`}>Learn More</Link>
                  </Button>
                </CardActions>
              </Card>
            );
          })}
      </div>
    );
  }
}
