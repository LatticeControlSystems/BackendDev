import React, { Component } from "react";
import { graphql } from "react-apollo";
import { FormGroup, FormControl, Button } from "reactstrap";
import { Container, Row, Col, Alert } from "reactstrap";
import moment from 'moment';

import QueryGetEvent from "../GraphQL/QueryGetEvent";
import SubsriptionEventComments from "../GraphQL/SubsriptionEventComments";
import NewComment from "./NewComment";
import RTChart from 'react-rt-chart';
// import * as d3 from "d3";
// import ReactD3 from 'react-d3-components'
import { Chart } from "react-charts";
import {Doughnut} from 'react-chartjs-2';
class EventComments extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    graphData: [],
    data3: [[,]],
    data2: [[,]],
  };
}
    subscription;
    componentDidMount() {
        this.subscription = this.props.subscribeToComments();
        // this.timer = setInterval(
        //   () => this.increment(),
        //   1000
        // )


    }
onentWillUnmount() {
        this.subscription();

    }
    renderComment = (comment) => {
        return (
            <div className="comment" key={comment.commentId}>
                <div className="avatar"><i className="icon user circular"></i></div>
                <div className="content">
                    <div className="text">
                        {comment.content}
                    </div>
                    <div className="metadata">{moment(comment.createdAt).format('LL, LT')}</div>
                </div>
            </div>
        );
    }

    getVal(lastVal){
// this.set.state
// const odata = this.state.data3
// var date = new Date()
//     this.setState({ data3: odata.concat([[date,lastVal]]) });
//     // console.log(this.state.sensorVal);
    return [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4],[5, 4]];
  }

    renderChart(comment) {
      var data = {
        date: new Date(),
        test: comment[comment.length-1].content,
      };

        return (
            <div className="content" >
            <RTChart
            fields={['test']}
            data={data} />
            </div>
        );
    }
    renderComment = (comment) => {
        return (
            <div className="comment" key={comment.commentId}>
                <div className="avatar"><i className="icon user circular"></i></div>
                <div className="content">
                    <div className="text">
                        {comment.content}
                    </div>
                    <div className="metadata">{moment(comment.createdAt).format('LL, LT')}</div>
                </div>
            </div>
        );
    }

    render() {
        const { comments: { items }, eventId } = this.props;
        var commentData = [].concat(items).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        var map1 = commentData.map((currElement, index) =>  {

        	return [index,currElement.content];
        });
        // const map2 = commentData.map(x => x);
        // var lastVal=Number((map1)[map1.length-1].content);
        // console.log((commentData)[commentData.length-1].content);

        // var data4 = this.state.data3.concat([[this.getVal(),lastVal]])
        const lineChart = (
          // A react-chart hyper-responsively and continuusly fills the available
          // space of its parent element automatically
          <div
            style={{
              width: "400px",
              height: "300px"
            }}
          >
            <Chart
              data={[
                {
                  label: "Series 1",
                  data: map1,
                },
                // {
                //   label: "Series 2",
                //   data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4],[5, 4]]
                // }
              ]}
              series={{
                showPoints: true,
              }}
              axes={[
                { primary: true, type: "linear", position: "bottom" },
                { type: "linear", position: "left" }
              ]}
              tooltip
            />
          </div>
        );

        return (
          <div>
          <Container>

            <Row>
            <Col xs={4} md={4} sm={4} lg={4} xl={4}>
            {lineChart}
            </Col>
            <Col xs={4} md={4} sm={4} lg={4} xl={4}>
            {lineChart}
            </Col>
            <Col xs={4} md={4} sm={4} lg={4} xl={4}>
            {lineChart}
            </Col>

            </Row>

            <Row>
            <Col>
            <h4 className="ui dividing header">Past Water Data</h4>
            {[].concat(items).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(this.renderComment)}
            <NewComment eventId={eventId} />
            </Col>
            </Row>

          </Container>
          </div>


        );
    }

}

const EventCommentsWithData = graphql(
    QueryGetEvent,
    {
        options: ({ eventId: id, elimit: limit}) => ({
            fetchPolicy: 'cache-first',
            variables: { id, limit }
        }),
        props: props => ({
            comments: props.data.getEvent ? props.data.getEvent.comments : { items: [] },
            subscribeToComments: () => props.data.subscribeToMore({
                document: SubsriptionEventComments,
                variables: {
                    eventId: props.ownProps.eventId,
                    elimit: 50
                },
                updateQuery: (prev, { subscriptionData: { data: { subscribeToEventComments } } }) => {
                    const res = {
                        ...prev,
                        getEvent: {
                            ...prev.getEvent,
                            comments: {
                                variables: {
                                    limit: 50
                                },
                                __typename: 'CommentConnections',
                                ...prev.getEvent.comments,
                                items: [
                                    ...prev.getEvent.comments.items.filter(c => c.commentId !== subscribeToEventComments.commentId),
                                    subscribeToEventComments,
                                ]
                            }
                        }
                    };

                    return res;
                }
            })
        }),
    },
)(EventComments);


export default EventCommentsWithData;
