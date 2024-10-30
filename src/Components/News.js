import React, { useState, useEffect, useRef } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import LoadingBar from 'react-top-loading-bar';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const apiKey = process.env.REACT_APP_NEWS_API;
  const loadingBarRef = useRef(null);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchNews = async () => {
    if (!apiKey) {
      console.error("API key is missing.");
      return;
    }

    setLoading(!isFetchingMore);
    loadingBarRef.current.continuousStart();

    const url = `https://newsapi.org/v2/everything?q=${props.category}&from=2024-09-30&sortBy=publishedAt&apiKey=${apiKey}&page=${page}&pageSize=${props.pageSize}`;

    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let parsedData = await response.json();
      setArticles((prevArticles) => [...prevArticles, ...(parsedData.articles || [])]);
      setTotalResults(parsedData.totalResults || 0);
    } catch (error) {
      console.error("Error fetching news: ", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      loadingBarRef.current.complete();
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight && !loading && articles.length < totalResults) {
      setPage((prevPage) => prevPage + 1);
      setIsFetchingMore(true);
    }
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - The Daily Bulletin`;
    fetchNews(); // Fetch news when the component mounts
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [props.category]); // Add props.category to the dependency array

  useEffect(() => {
    fetchNews(); // Fetch news whenever the page changes
  }, [page, props.category]); // Add page and props.category to the dependency array

  return (
    <div className='container my-3'>
      <LoadingBar color="#f11946" ref={loadingBarRef} />
      
      {isFetchingMore && (
        <div className="text-center">
          <Spinner />
          <h2>Loading more articles...</h2>
        </div>
      )}

      <h1 className='text-center my-5'>The Daily Bulletin - Top {capitalizeFirstLetter(props.category)} Headlines</h1>

      <div className="row">
        {loading && <Spinner />}
        {!loading && Array.isArray(articles) && articles.length > 0 ? (
          articles.map((article) => (
            <div className="col-md-4" key={article.url}>
              <NewsItem
                title={article.title ? article.title + "..." : "No Title"}
                description={article.description ? article.description + "..." : "No Description"}
                imgUrl={article.urlToImage ? article.urlToImage : "https://png.pngtree.com/png-vector/20210601/ourmid/pngtree-latest-breaking-news-png-image_3369122.jpg"}
                newsUrl={article.url}
                author={article.author ? article.author : "unknown author"}
                date={article.publishedAt}
                source={article.source.name}
              />
            </div>
          ))
        ) : (
          !loading && <h2>No articles found for this category.</h2>
        )}
      </div>

      {isFetchingMore && (
        <div className="text-center my-5">
          <Spinner />
          <h2>Loading more articles...</h2>
        </div>
      )}
    </div>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
