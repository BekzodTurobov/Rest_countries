function MainPage({ data, className, nth, onSelectCountry }) {
  return (
    <article
      onClick={() => onSelectCountry(data.id)}
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
        <p className="country__row">
          <span>💰</span>
          {data.currency} ({data.symbol})
        </p>
      </div>
    </article>
  );
}

export default MainPage;
