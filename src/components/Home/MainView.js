import ArticleList from '../ArticleList';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { CHANGE_TAB } from '../../constants/actionTypes';
import SearchFilter from './SearchFilter';


const FilterFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      props.onTabClick('filter', agent.Articles.filter, agent.Articles.filter(props.criteria));

    }

    return (
      <li className="nav-item">
        <button style={{'outline': 'none'}}
            className={ props.tab === 'filter' ? 'nav-link active' : 'nav-link' }
            onClick={clickHandler}>
         Search
        </button>
      </li>
    );
  }
  return null;
};


const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      props.onTabClick('feed', agent.Articles.feed, agent.Articles.feed());

    }

    return (
      <li className="nav-item">
        <button style={{'outline': 'none'}}
            className={ props.tab === 'feed' ? 'nav-link active' : 'nav-link' }
            onClick={clickHandler}>
         My Post
        </button>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick('all', agent.Articles.all, agent.Articles.all());
  };
  return (
    <li className="nav-item">
      <button style={{'outline': 'none'}}
        className={ props.tab === 'all' ? 'nav-link active' : 'nav-link' }
        onClick={clickHandler}>
        Global Post
      </button>
    </li>
  );
};

const mapStateToProps = state => ({
  ...state.articleList,
  token: state.common.token,
  display_mode: state.common.display_mode,
  criteria: state.common.criteria
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

const MainView = props => {
  return (
    <div className="col-md-12">
      <SearchFilter/>
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          
          <FilterFeedTab
            token={props.token}
            tab={props.tab}
            criteria={props.criteria}
            onTabClick={props.onTabClick} />
            
          <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} />
          
          <YourFeedTab
            token={props.token}
            tab={props.tab}
            onTabClick={props.onTabClick} />

        </ul>
      </div>

      <ArticleList
        pager={props.pager}
        display_mode={props.display_mode}
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
