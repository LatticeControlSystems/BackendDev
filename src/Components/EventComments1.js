import React, { Component } from "react";
import { graphql } from "react-apollo";

import moment from 'moment';

import QueryGetEvent from "../GraphQL/QueryGetEvent";
import SubsriptionEventComments from "../GraphQL/SubsriptionEventComments";
import NewComment from "./NewComment";
import RTChart from 'react-rt-chart';
// import * as d3 from "d3";
// import ReactD3 from 'react-d3-components'
import { Chart } from "react-charts";
import {Doughnut} from 'react-chartjs-2';
class EventComments extends Component {

    subscription;
    state = {
      data: {
          labels: [
              'Red',
              'Green',
              'Yellow'
          ],
          datasets: [{
              data: [300, 50, 100],
              backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56'
              ],
              hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56'
              ]
          }]
      }
    }

    increment() {
        const datasetsCopy = this.state.data.datasets.slice(0);
        const dataCopy = datasetsCopy[0].data.slice(0);
        dataCopy[0] = dataCopy[0] + 10;
        datasetsCopy[0].data = dataCopy;

        this.setState({
            data: Object.assign({}, this.state.data, {
                datasets: datasetsCopy
            })
        });
    }
    componentDidMount() {
        this.subscription = this.props.subscribeToComments();
        this.timer = setInterval(
          () => this.increment(),
          1000
        )
        // setInterval(() => this.forceUpdate(), 1000);

    }

    componentWillUnmount() {
        this.subscription();
        clearInterval(this.timer)
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

    getVal(){

    // this.setState({ sensorVal: parsedVal });
    // console.log(this.state.sensorVal);
    return Math.random();
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
        const map1 = commentData.map(x => x);
        var lastVal=Number((map1)[map1.length-1].content);
        var data = {
          date: new Date(),
          test: 1,
          test2: this.getVal()
        };
        console.log((commentData)[commentData.length-1].content);

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
                  data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
                },
                {
                  label: "Series 2",
                  data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
                }
              ]}
              axes={[
                { primary: true, type: "linear", position: "bottom" },
                { type: "linear", position: "left" }
              ]}
            />
          </div>
        );

        return (
            <div className="ui items">
            <Doughnut data = {this.state.data}/>
            {this.lineChart}
            <div className="chart">

            </div>
                <div className="item">
                    <div className="ui comments">
                        <h4 className="ui dividing header">Live Data</h4>
                        {[].concat(items).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(this.renderComment)}
                        <NewComment eventId={eventId} />
                    </div>
                </div>
            </div>
        );
    }

}

const EventCommentsWithData = graphql(
    QueryGetEvent,
    {
        options: ({ eventId: id }) => ({
            fetchPolicy: 'cache-first',
            variables: { id }
        }),
        props: props => ({
            comments: props.data.getEvent ? props.data.getEvent.comments : { items: [] },
            subscribeToComments: () => props.data.subscribeToMore({
                document: SubsriptionEventComments,
                variables: {
                    eventId: props.ownProps.eventId,
                },
                updateQuery: (prev, { subscriptionData: { data: { subscribeToEventComments } } }) => {
                    const res = {
                        ...prev,
                        getEvent: {
                            ...prev.getEvent,
                            comments: {
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
