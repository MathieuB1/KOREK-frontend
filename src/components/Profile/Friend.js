import ArticleList from '../ArticleList';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  FRIEND_PAGE_LOADED,
  FRIEND_PAGE_UNLOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.friend,
  appName: state.common.appName,
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) => dispatch({ type: FRIEND_PAGE_LOADED, tab, pager, payload }),
  onUnload: () => dispatch({  type: FRIEND_PAGE_UNLOADED })
});

class Friend extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null
    }
  }

  componentWillMount() {
      this.setState({ username: this.props.match.params.owner });
      this.props.onLoad('userfeed', agent.Articles.feed, agent.Articles.feed(0, this.props.match.params.owner));
  }


  componentWillReceiveProps(nextProps) {

      if (nextProps.match.params.owner !== this.props.match.params.owner)
      {
        if (nextProps.match.params.owner)
        {
          this.setState({ username: nextProps.match.params.owner });
          this.props.onLoad('userfeed', agent.Articles.feed, agent.Articles.feed(0, nextProps.match.params.owner));
        }
      }

  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="friend-page">
        <div className="container page">

          <h3 className="text-xs-center">{this.state.username}</h3>

          <div className="row">
            <div className="col-md-12">

              <ArticleList
                pager={this.props.pager}
                articles={this.props.articles}
                loading={this.props.loading}
                args={{owner: this.state.username}}
                articlesCount={this.props.articlesCount}
                currentPage={this.props.currentPage} />

            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friend);
