import ArticlePreview from './Article/ArticlePreview';
import ListPagination from './ListPagination';
import React from 'react';

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
            <ArticlePreview article={article} key={article.id} />
          );
        })
      }

      <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        args={props.args}
        currentPage={props.currentPage} />
    </div>
  );
};

export default ArticleList;
