import React from 'react';
import ArticlePreview from './Article/ArticlePreview';
import ListPagination from './ListPagination';


const ArticleList = props => {


  if (!props.articles) {
    return (
      <div className="article-preview">Loading...</div>
    );
  }

  if (props.articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }


  return (
    <div>

      {
        props.articles.map(article => {
          return (
            <ArticlePreview display_mode={props.display_mode} article={article} key={article.id} token={props.token} />
          );
        })
      }

      <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        args={props.args}
        page_type={props.page_type ? props.page_type : null}
        currentPage={props.currentPage} />
    </div>
  );
};

export default ArticleList;
