import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { FILTERS_LOADED, SEARCHING } from '../../constants/actionTypes';

import TreeMenu from 'react-simple-tree-menu'
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

import Select from 'react-select';
import './SearchFilter.css';

const mapStateToProps = state => ({
  ...state.common,
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload => dispatch({ type: FILTERS_LOADED, payload }),
    onSearch: (tab, pager, payload, criteria) =>  dispatch({ type: SEARCHING, tab, pager, payload, criteria })
});

class SearchFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      categories: [],
      tags: this.props.tags,
      selected_tags: [],
      selected_category: [],
      url_tags_suffix: '',
      url_category_suffix: '',
      url_search_suffix: '',
    }
  }

  componentWillMount() {
    if (this.props.currentUser)
    {
      this.props.onLoad(Promise.all([
        agent.Articles.get_categories(),
        agent.Articles.get_tags()
      ]));

      this.setState({ categories: this.props.categories });
    }
  }


  setFilter = (type, value) => {

    var search = '';
    var tags_list = '';
    var category = ''; 

    if (type === 'selected_tags'){
      if(value)
      {
        tags_list = '&tags__name=' + value.value;
        //tags_list = value.map(el => '&tags__name=' + el.value).toString().replace(',','');
        this.setState({ selected_tags: value, url_tags_suffix: tags_list });
      } else {
        tags_list = 'null';
        this.setState({ selected_tags: '', url_tags_suffix: '' });
      }
    }

    if (type === 'selected_category'){ 
      if (value === 'Category') { 
        category = 'null';
        this.setState({ selected_category: [], url_category_suffix: '' });
      } else {
        category = '&category__name=' + (value.split("/").length > 1 ? value.split("/").pop() : value);
        this.setState({ selected_category: value, url_category_suffix: category });
      }
    }

    if (type === 'search'){ 
      search = '&search=' + value;
      this.setState({ search: value , url_search_suffix: search });
    }
    
    var criteria = search ? search : this.state.url_search_suffix;
    criteria += category ? ((category === 'null') ? '' : category) : this.state.url_category_suffix;
    criteria += tags_list ? ((tags_list === 'null') ? '' : tags_list) : this.state.url_tags_suffix;
    criteria = criteria.replace(',','')

    this.props.onSearch('filter', agent.Articles.filter, agent.Articles.filter(criteria), criteria);

  }


  render() {

    var tree = []
    function nodesSet(node) {
      if(node && node.length){
        var _tree = [];
        node.map(el => _tree.push({ key: el.id.toString(), label: el.data.name, nodes: el.children ? nodesSet(el.children) : [] }));
        return _tree;
      }
    }

    if (this.props.categories) { 
      tree.push({ key: '0', label: 'Category', nodes: nodesSet(this.props.categories)});
    }

    if (this.props.tags){
        var tags = this.props.tags.map(el => ({ value: el.name, label: el.slug }));
    }

    return (
        <div>
            <fieldset className="form-group" style={{ marginTop: '1rem'}}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search" aria-describedby="search"
                        value={this.state.search}
                        onChange={el => this.setFilter('search', el.target.value )}
                        />
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="search"><i className="ion-search"></i></span>
                    </div>
                </div>

                <div>

                     {this.props.categories ? 
                     <TreeMenu 
                     data={tree}
                     onClickItem={({ key, label }) => { this.setFilter('selected_category', label) }}
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