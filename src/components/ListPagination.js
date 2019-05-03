import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import { SET_PAGE } from '../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) =>
    dispatch({ type: SET_PAGE, page, payload })
});

const ListPagination = props => {
  if (props.articlesCount <= 10) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(props.articlesCount / 10); ++i) {
    range.push(i);
  }



  const setPage = page => {
    if(props.pager) {
      if (props.args)
      {
        if (props.args.owner) {
          props.onSetPage(page, props.pager(page, props.args.owner));
        } 
        
        if (props.args.tag){
          props.onSetPage(page, props.pager(page, props.args.tag));
        }   

      }else
      {
        props.onSetPage(page, props.pager(page));
      }
      
    }else {
      
      if (props.page_type === 'profile') 
        { agent.Profile.profiles(page) }
      else if (props.page_type === 'tag') 
        { agent.Articles.tag(page) }
      else 
        { agent.Articles.all(page) }

    }
  };

  return (
    <nav>
      <ul className="pagination">

        {
          range.map(v => {
            const isCurrent = v === props.currentPage;
            const onClick = ev => {
              ev.preventDefault();
              setPage(v);
            };
            return (
              <li
                className={ isCurrent ? 'page-item active' : 'page-item' }
                onClick={onClick}
                key={v.toString()}>

                <button className="page-link">{v + 1}</button>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

export default connect(() => ({}), mapDispatchToProps)(ListPagination);
