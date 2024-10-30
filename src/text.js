import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import LoadingBar from 'react-top-loading-bar';

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
      pageSize: 6,
      isFetchingMore: false, // Track if more articles are being fetched
    };

    this.apiKey = process.env.REACT_APP_NEWS_API;
    this.loadingBarRef = React.createRef();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async fetchNews() {
    this.setState({ loading: !this.state.isFetchingMore }); // Show loading spinner if not fetching more articles
    this.loadingBarRef.current.continuousStart(); // Start the loading bar

    const url = `https://newsapi.org/v2/everything?q=${this.props.category}&from=2024-9-14&sortBy=publishedAt&apiKey=${this.apiKey}&page=${this.state.page}&pageSize=${this.state.pageSize}`;

    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let parsedData = await response.json();
      this.setState((prevState) => ({
        articles: [...prevState.articles, ...(parsedData.articles || [])],
        totalResults: parsedData.totalResults || 0,
      }));
    } catch (error) {
      console.error("Error fetching news: ", error);
    } finally {
      this.setState({ loading: false, isFetchingMore: false }); // Hide loading spinner after fetch
      this.loadingBarRef.current.complete(); // Complete the loading bar
    }
  }

  handleScroll = () => {
    // Check if the user scrolled to the bottom
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || this.state.loading) {
      return;
    }

    // Load next page
    this.setState((prevState) => ({
      page: prevState.page + 1,
      isFetchingMore: true, // Set fetching state to true
    }), () => {
      this.fetchNews(); // Fetch more news when page state updates
    });
  };

  componentDidMount() {
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - The Daily Bulletin`;
    this.fetchNews(); // Fetch news when the component mounts
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // Cleanup the event listener on component unmount
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.category !== this.props.category || prevState.page !== this.state.page) {
      this.fetchNews(); // Re-fetch news whenever category or page changes
    }
  }

  render() {
    return (
      <div className='container my-3'>
        <LoadingBar color="#f11946" ref={this.loadingBarRef} />
        
        {/* Top spinner for loading more articles */}
        {this.state.isFetchingMore && (
          <div className="text-center">
            <Spinner />
            <h2>Loading more articles...</h2>
          </div>
        )}

        <h1 className='text-center my-5'>The Daily Bulletin - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>

        {/* Main article content */}
        <div className="row">
          {this.state.loading && <Spinner />} {/* Top spinner for initial page load */}
          {!this.state.loading && Array.isArray(this.state.articles) && this.state.articles.length > 0 ? (
            this.state.articles.map((article) => (
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
            !this.state.loading && <h2>No news available</h2> // Fallback when no articles
          )}
        </div>

        {/* Bottom spinner for loading more articles */}
        {this.state.isFetchingMore && (
          <div className="text-center my-5">
            <Spinner />
            <h2>Loading more articles...</h2>
          </div>
        )}
      </div>
    );
  }
}

News.defaultProps = {
  country: 'in',
  pageSize: 5,
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
