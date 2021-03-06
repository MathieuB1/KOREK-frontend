import ArticleList from '../ArticleList';
import React from 'react';
import  agent from '../../agent';
import { connect } from 'react-redux';
import { TAG_PAGE_LOADED, TAG_PAGE_UNLOADED } from '../../constants/actionTypes';


const mapStateToProps = state => ({
  ...state.tag,
  currentUser: state.common.currentUser,
  display_mode: state.common.display_mode
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) => dispatch({ type: TAG_PAGE_LOADED, tab, pager, payload }),
  onUnload: () => dispatch({ type: TAG_PAGE_UNLOADED })
});

class Tag extends React.Component {
  componentDidMount() {
    if (this.props.match.params.tag && !this.props.match.params.owner) {
      this.props.onLoad('tag', agent.Articles.tag, agent.Articles.tag(0, this.props.match.params.tag));
    }

    if (this.props.match.params.tag && this.props.match.params.owner) {
      this.props.onLoad('tag', agent.Articles.tag, agent.Articles.tag_owner(0, this.props.match.params.tag, this.props.match.params.owner));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.tag && this.props.match.params.tag !== prevProps.match.params.tag) {
        this.props.onLoad('tag', agent.Articles.tag, agent.Articles.tag(0, this.props.match.params.tag));
    }
  }

  

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.articles) { return null }

    return (
        <div>
        <h1 className="tag-title"><i className="ion-bookmark"></i>&nbsp;{this.props.match.params.tag}</h1>

              <div className={"container " + this.props.display_mode}>
                <div className="row">
                  <div className="col-md-12">
                        <ArticleList
                          pager={this.props.pager}
                          articles={this.props.articles}
                          display_mode={this.props.display_mode}
                          loading={this.props.loading}
                          articlesCount={this.props.articlesCount}
                          page_type='tag'
                          args={{tag: this.props.match.params.tag}}
                          currentPage={this.props.currentPage} />
                  </div>
                </div>
              </div>
        </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag);