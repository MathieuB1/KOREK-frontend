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
  display_mode: state.common.display_mode
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


  componentDidMount() {
      this.setState({ username: this.props.match.params.owner });
      this.props.onLoad('userfeed', agent.Articles.feed, agent.Articles.feed(0, this.props.match.params.owner));
  }


  componentDidUpdate(prevProps, prevState) {

      if (this.props.match.params.owner && this.props.match.params.owner !== prevProps.match.params.owner)
      {
        if (this.props.match.params.owner)
        {
          this.setState({ username: this.props.match.params.owner });
          this.props.onLoad('userfeed', agent.Articles.feed, agent.Articles.feed(0, this.props.match.params.owner));
        }
      }

  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="friend-page">
        <div className={"container " + this.props.display_mode}>

          <h3 className="text-xs-center">{this.state.username}</h3>

          <div className="row">
            <div className="col-md-12">

              <ArticleList
                pager={this.props.pager}
                articles={this.props.articles}
                loading={this.props.loading}
                display_mode={this.props.display_mode}
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
