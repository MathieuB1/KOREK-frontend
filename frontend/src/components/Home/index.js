import Banner from './Banner';
import MainView from './MainView';
import HomeCards from './HomeCards';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import ListErrors from '../ListErrors';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  DISPLAY_MODE
} from '../../constants/actionTypes';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  display_mode: state.common.display_mode,
  criteria: state.common.criteria,
  websocket: state.websocket
});

const mapDispatchToProps = dispatch => ({
  onLoad: (tab, pager, payload) => dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () => dispatch({  type: HOME_PAGE_UNLOADED }),
  onChangeDisplay: mode => dispatch({ type: DISPLAY_MODE, mode })
});


class Home extends React.Component {

  componentDidMount() {
    const tab = this.props.token ? 'all' : 'feed';
    const articlesPromise = this.props.token ?
      agent.Articles.all :
      agent.Articles.feed;

    if(!this.props.criteria){
      this.props.onLoad(tab, articlesPromise, articlesPromise());
    }

  }

  componentDidUpdate(prevProps, prevState) {
    // if we have an update from websocket then we refresh the page
    var message = String(this.props.websocket.message);
    if(message !== '') {

      // consume all messages
      this.props.websocket.last_consumed_message = '';
      this.props.websocket.message = '';
      this.props.websocket.product_id = '';
        
      const tab = this.props.token ? 'all' : 'feed';

      const articlesPromise = this.props.token ?
      agent.Articles.all :
      agent.Articles.feed;


      this.props.onLoad(tab, articlesPromise, articlesPromise());

    }
  }

  onClickDisplay(type){
    this.props.onChangeDisplay(type);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    return (
      <div className="home-page">

        <Banner token={this.props.token} appName={this.props.appName} />
        <div className={"container " + this.props.display_mode}>
        
          <div className="row">
          { this.props.errors ? <ListErrors errors={this.props.errors} /> : null }
          </div>

          {this.props.errors ? null :
          <div className="article-display" style={{'float':'right','position':'absolute','right':'0.5rem'}}>
            <ButtonGroup style={{'zIndex':'5'}}>
              <Button className="article-display-list" onClick={() => this.onClickDisplay('list')} variant="secondary"><i className="ion-android-list"></i></Button>
              <Button className="article-display-grid" onClick={() => this.onClickDisplay('grid')} variant="secondary"><i className="ion-grid"></i></Button>
            </ButtonGroup>
          </div>}
          
          <div className="row">
            {this.props.errors ? <HomeCards /> : <MainView /> }
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
