function MainPage({ data, className, nth, onSelectCountry, time }) {
  return (
    <article
      onClick={() => className && onSelectCountry(data.id)}
      className={`country ${className}`}
      data-content={nth}
    >
      <img className="country__img" src={data.flag} />
      <div className="country__data">
        <h3 className="country__name">{data.country}</h3>
        <h4 className="country__region">{data.region}</h4>

        <p className="country__row">
          <span>👫</span>
          {data.population} mln
        </p>
        <p className="country__row">
          <span>🗣️</span>
          {data.language}
        </p>
        {time && (
          <p className="country__row">
            <span>🕰</span>
            {time}
          </p>
        )}
        <p className="country__row">
          <span>💰</span>
          {data.currency} ({data.symbol})
        </p>
      </div>
    </article>
  );
}

export default MainPage;
