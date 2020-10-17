import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { FILTERS_LOADED, SEARCHING } from '../../constants/actionTypes';

import TreeMenu from 'react-simple-tree-menu';
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

import Select from 'react-select';
import './SearchFilter.css';
import Instersect from './Instersect';

const mapStateToProps = state => ({
  ...state.common,
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload => dispatch({ type: FILTERS_LOADED, payload }),
    onSearch: (tab, pager, payload, criteria, search, selected_category, selected_tags) =>  dispatch({ type: SEARCHING, tab, pager, payload, criteria, search, selected_category, selected_tags })
});

class SearchFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      tags: this.props.tags,
      search: '',
      selected_tags: '',
      selected_category: '',
      selected_location: false,
    }
  }

  componentDidMount() {
    if (this.props.currentUser)
    {
      if ((this.props.search && this.props.search.length > 0) || 
      (this.props.selected_tags && this.props.selected_tags.length > 0) ||
      (this.props.selected_category && this.props.selected_category.length > 0)) 
      {
        this.setState({selected_tags: this.props.selected_tags,
        search: this.props.search, 
        selected_category: this.props.selected_category});
      }
      else{
        this.props.onLoad(Promise.all([
          agent.Articles.get_categories(),
          agent.Articles.get_tags()
        ]));
        this.setState({categories: this.props.categories });
      }
    }
  }


  componentDidUpdate(prevProps, prevState) {
 
    if (this.state !== prevState) {
      var criteria = "";
      if (this.state.search) {
        criteria = '&search=' + this.state.search;
      }
      if (this.state.selected_category) {
        criteria += '&category__name=' + (this.state.selected_category !== '' && this.state.selected_category.split("/").length > 1 ? this.state.selected_category.split("/").pop() : this.state.selected_category);
      }
      if (this.state.selected_tags) {
        criteria += '&tags__name=' + this.state.selected_tags.value;
      }
      if (this.props.bbox) {
        criteria += this.props.bbox;
      }

      this.props.onSearch('filter', agent.Articles.filter, agent.Articles.filter(criteria), criteria, this.state.search, 
      this.state.selected_category ? this.state.selected_category : '', 
      this.state.selected_tags ? this.state.selected_tags : '');
    }
  }


  setFilter = (type, value) => {

    if (type === 'selected_tags'){
        this.setState({ selected_tags: value });
    }

    if (type === 'selected_category'){ 
      if (value !== 'Category') { 
        this.setState({ selected_category: value});
      } else {
        this.setState({ selected_category: ''});
      }
    }

    if (type === 'search'){ 
      this.setState({ search: value });
    }

  }

  setLocationFilter = (type, value) => {
    if (type === 'select-intersection')
    {
      this.setState({ selected_location: !this.state.selected_location});
    }   
  }

  render() {

    var tree = []
    function nodesSet(node) {
      if(node && node.length){
        var _tree = [];
        node.map(el => _tree.push({ key: el.data.name, label: el.data.name, nodes: el.children ? nodesSet(el.children) : [] }));
        return _tree;
      }
    }


    if (this.props.categories) { 
      tree.push({ key: 'Category', label: 'Category', nodes: nodesSet(this.props.categories)});
    }

    if (this.props.tags){
        var tags = this.props.tags.map(el => ({ value: el.name, label: el.slug }));
    }

    return (
        <div>
            <fieldset className="form-group" style={{ marginTop: '1rem'}}>
                <div className="input-group mb-3">
                    <div className="input-group-append">
                        <span className="input-group-text" id="search"><i className="ion-search"></i></span>
                    </div>
                    <input type="text" className="form-control" placeholder="Search" aria-describedby="search"
                        value={this.state.search}
                        onChange={el => this.setFilter('search', el.target.value )}
                        />

                    <div className="input-group-prepend">
                      <button style={{'display': 'contents'}} className="" onClick={value => this.setLocationFilter('select-intersection', value)} >
                        <span className={"btn btn-outline-success" + (this.props.bbox && this.props.bbox.length > 0 ? " active" : "") } id="location"><i className="ion-ios-location" ></i></span>
                      </button>
                    </div>

                </div>

                <div>

                     {this.state.selected_location ? 
                     <Instersect  />: null }


                     {this.props.categories ? 
                     <TreeMenu 
                     data={tree}
                     onClickItem={({ key, label }) => { this.setFilter('selected_category', key) }}
                     initialActiveKey={this.props.selected_category}
                     hasSearch={false}>
                     </TreeMenu>: null }

                    <Select
                      placeholder={"Select tag"}
                      isClearable={true}
                      value={this.state.selected_tags}
                      options={tags}
                      onChange={value => this.setFilter('selected_tags', value)}
                    />
                    
                </div>

            </fieldset>
        </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilter);