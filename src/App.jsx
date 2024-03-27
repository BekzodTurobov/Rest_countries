import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Form from "./component/Form";
import MainPage from "./component/MainPage";
import { format } from "date-fns";
import { apiUrl } from "./util/api";

function App() {
  const enteredValue = useRef();
  const [countryName, setCountryName] = useState("");
  const [countryDetails, setCountryDetails] = useState({});
  const [neighbourCountries, setNeighbourCountries] = useState([]);
  const [timezone, setTimezone] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const currentCountryName = async function (lat, lon) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aa47bc4dd6faa742921b4d33fa26596d&lang=en`
          );
          if (response.ok) {
            const data = await response.json();
            setCountryName(data.sys.country);
          }
        } catch (err) {
          setIsLoading(false);
          console.log("Couldn't get the position. Please tyr again. " + err);
        }
      };
      currentCountryName(latitude, longitude);
    });
  }, []);

  useEffect(() => {
    const getCountryData = async function (countryName) {
      try {
        const response = await fetch(`${apiUrl}/name/${countryName}`);
        const data = await response.json();

        const obj = {
          country: data[0].name,
          region: data[0].region,
          flag: data[0].flag,
          population: (data[0].population / 1000000).toFixed(1),
          language: data[0].languages[0].name,
          currency: data[0].currencies[0].name,
          symbol: data[0].currencies[0].symbol,
          borders: data[0].borders,
          timezone: data[0].timezones,
        };
        setCountryDetails(obj);
        getTime(obj.timezone);
        fetchBorders(obj.borders);
      } catch (err) {
        setErrorMsg(
          "Couldn't get the country. " + err.message + ". Please try again."
        );
      }
      setIsLoading(false);
    };
    countryName && getCountryData(countryName);

    function fetchBorders(data) {
      data.forEach(async function (border) {
        try {
          const response = await fetch(`${apiUrl}/alpha/${border}`);
          if (!response.ok) {
            throw new Error("Border contries not found!. Please try again.");
          }
          const data = await response.json();
          const obj = {
            country: data.name,
            region: data.region,
            flag: data.flag,
            population: (data.population / 1000000).toFixed(1),
            language: data.languages[0].name,
            currency: data.currencies[0].name,
            symbol: data.currencies[0].symbol,
            id: nanoid(),
          };

          setNeighbourCountries((prevState) => [...prevState, obj]);
        } catch (err) {
          setErrorMsg(err.message);
        }
      });
    }
  }, [countryName]);

  const submitHandler = function (e) {
    e.preventDefault();
    setIsLoading(true);

    const enteredCountry = enteredValue.current.value.trim();
    if (enteredCountry.length) {
      setCountryName(enteredCountry);
      setNeighbourCountries([]);
      setErrorMsg("");
    } else {
      setIsLoading(false);
      setErrorMsg("Country not found. Please enter a valid country!");
    }
    enteredValue.current.value = "";
  };

  const selectCountry = function (id) {
    const newCountry = neighbourCountries.find((country) => country.id === id);
    setCountryName(newCountry.country);
    setNeighbourCountries([]);
    setErrorMsg("");
  };

  function getTime(timezone) {
    const now = new Date();
    const time = timezone[0].length > 3 ? timezone[0] : timezone[1];

    const str = time.toString().replace(":", ".");
    const arr = [...str].slice(-4).join("");

    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const curDate = new Date(utc + 3600000 * arr);
    const formattedDate = format(curDate, "HH:mm - EE MMM d");
    setTimezone(formattedDate);
  }

  if (isLoading) {
    return (
      <div className="loader-box">
        <p className="loader"></p>
      </div>
    );
  }

  return (
    <main className="container">
      {errorMsg && <p className="errText">{errorMsg}</p>}
      <Form onSubmit={submitHandler} onRef={enteredValue} />
      <div className="countries">
        <MainPage data={countryDetails} time={timezone} />
        <ul className="neighbour-container">
          {neighbourCountries.map((neighbour, i) => (
            <MainPage
              nth={i + 1}
              key={neighbour.id}
              data={neighbour}
              className="neighbour"
              onSelectCountry={selectCountry}
            />
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
