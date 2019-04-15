import ProfilePreview from './ProfilePreview';
import ListPagination from '../ListPagination';
import React from 'react';

const ProfileList = props => {
  if (!props.articles) {
    return (
      <div className="profile-preview">Loading...</div>
    );
  }

  if (props.articles.length === 0) { return null }

  return (
    <div>
      {
        props.articles.map(article => {
          return (
            <ProfilePreview article={article} key={article.id} 
            currentUser={props.currentUser}/>
          );
        })
      }

      <ListPagination
        pager={props.pager}
        page_type='profile'
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default ProfileList;
