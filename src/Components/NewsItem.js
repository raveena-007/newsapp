import React from 'react';

const NewsItem = ({ title, description, imgUrl, newsUrl, author, date, source }) => {
  return (
    <>
      <div className='my-3'>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '0' }}>
            <span className="badge rounded-pill bg-danger" style={{ left: '88%', zIndex: 1 }}>{source}</span>
          </div>
          <img src={imgUrl} className="card-img-top" alt="News" />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-muted">By {author} on {new Date(date).toGMTString()}</small>
            </p>
            <a href={newsUrl} target='_blank' className="btn btn-sm btn-dark" rel='noreferrer'>Read more...</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewsItem;
