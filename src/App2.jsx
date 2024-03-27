import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Form from "./component/Form";
import MainPage from "./component/MainPage";
import { format } from "date-fns";

function App2() {
  const enteredValue = useRef();
  const [country, setCountry] = useState({ curCountry: "", timezone: "" });
  const [countryDetails, setCountryDetails] = useState({});
  const [neighbourCountries, setNeighbourCountries] = useState([]);
  const [position, setPosition] = useState({ lat: "", lon: "" });
  const [timezone, setTimezone] = useState(new Date());

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const currentCountry = function (lat, lon) {
        fetch(`https://geocode.xyz/${lat},${lon}?json=1`)
          .then((res) => res.json())
          .then((data) => {
            setCountry(data.country);
            return fetch(
              `https://countries-api-836d.onrender.com/countries/name/${data.country}`
            );
          })
          .then((res2) => res2.json())
          .then((data2) => {
            console.log(data2);
            const obj = {
              country: data2[0].name,
              region: data2[0].region,
              flag: data2[0].flag,
              population: (data2[0].population / 1000000).toFixed(1),
              language: data2[0].languages[0].name,
              currency: data2[0].currencies[0].name,
              symbol: data2[0].currencies[0].symbol,
              borders: data2[0].borders,
              timezone: data2[0].timezones,
            };

            return setCountryDetails(obj);
          });
      };
      currentCountry(latitude, longitude);
    });
  }, []);

  useEffect(() => {
    const fetchBorders = function (data) {
      data.forEach((border, index) => {
        fetch(
          `https://countries-api-836d.onrender.com/countries/alpha/${border}`
        )
          .then((response) => response.json())
          .then((data) => {
            const obj = {
              country: data.name,
              region: data.region,
              flag: data.flag,
              population: (data.population / 1000000).toFixed(1),
              language: data.languages[0].name,
              currency: data.currencies[0].name,
              symbol: data.currencies[0].symbol,
              borders: data.borders,
              id: nanoid(),
            };

            setNeighbourCountries((prevState) => [...prevState, obj]);
          });
      });
    };
    countryDetails.borders && fetchBorders(countryDetails.borders);
  }, [countryDetails]);

  const submitHandler = function (e) {
    e.preventDefault();
    setCountry(enteredValue.current.value);
    setNeighbourCountries([]);
    enteredValue.current.value = "";
  };

  const selectCountry = function (id) {
    const newCountry = neighbourCountries.find((country) => country.id === id);
    setCountry(newCountry.country);
    setNeighbourCountries([]);
  };

  // const date = new Date();
  // const time = date.toLocaleString("en-US", {
  //   timeZone: `${data.timezone}`,
  // });
  // const formattedDate = format(time, "HH:mm - EEEE MMM d");
  // console.log(formattedDate);
  // setTimezone(formattedDate);

  return (
    <main className="container">
      <Form onSubmit={submitHandler} onRef={enteredValue} />
      <div className="countries">
        <MainPage data={countryDetails} />
        <ul className="neighbour-container">
          {neighbourCountries &&
            neighbourCountries.map((neighbour, i) => (
              <MainPage
                nth={i + 1}
                key={nanoid()}
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

export default App2;

// import { useState, useRef, useEffect } from "react";
// import { nanoid } from "nanoid";
// import Form from "./component/Form";
// import MainPage from "./component/MainPage";
// import { format } from "date-fns";

// function App() {
//   const enteredValue = useRef();
//   const [country, setCountry] = useState("");
//   const [countryDetails, setCountryDetails] = useState({});
//   const [neighbourCountries, setNeighbourCountries] = useState([]);
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [timezone, setTimezone] = useState(new Date());
//   const [coords, setCoords] = useState({ lat: "", lon: "" });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;
//       setLatitude(latitude);
//       setLongitude(longitude);
//       // setCoords({ lat: latitude, lon: longitude });
//     });
//   }, []);
//   // console.log(latitude);

//   useEffect(() => {
//     const currentCountryName = async function (lat, lon) {
//       try {
//         const response = await fetch(
//           `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aa47bc4dd6faa742921b4d33fa26596d&lang=en`
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setCountry(data.sys.country);
//         }
//       } catch (err) {
//         console.log("Couldn't get the position. Please tyr again. " + err);
//       }
//     };
//     latitude && currentCountryName(latitude, longitude);
//   }, [latitude]);

//   useEffect(() => {
//     const getCountryData = async function (countryName) {
//       try {
//         const response = await fetch(
//           `https://countries-api-836d.onrender.com/countries/name/${countryName}`
//         );
//         if (response.ok) {
//           const data = await response.json();
//           const obj = {
//             country: data[0].name,
//             region: data[0].region,
//             flag: data[0].flag,
//             population: (data[0].population / 1000000).toFixed(1),
//             language: data[0].languages[0].name,
//             currency: data[0].currencies[0].name,
//             symbol: data[0].currencies[0].symbol,
//             borders: data[0].borders,
//             timezone: data[0].timezones,
//           };

//           setCountryDetails(obj);
//         }
//       } catch (err) {
//         console.log(
//           "Couldn't get the country. Please try again " + err.message
//         );
//       }
//     };
//     country && getCountryData(country);
//   }, [country]);

//   useEffect(() => {
//     const fetchBorders = function (data) {
//       data.forEach((border) => {
//         fetch(
//           `https://countries-api-836d.onrender.com/countries/alpha/${border}`
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             const obj = {
//               country: data.name,
//               region: data.region,
//               flag: data.flag,
//               population: (data.population / 1000000).toFixed(1),
//               language: data.languages[0].name,
//               currency: data.currencies[0].name,
//               symbol: data.currencies[0].symbol,
//               borders: data.borders,
//               id: nanoid(),
//             };

//             setNeighbourCountries((prevState) => [...prevState, obj]);
//           });
//       });
//     };
//     countryDetails.borders && fetchBorders(countryDetails.borders);
//   }, [countryDetails]);

//   const submitHandler = function (e) {
//     e.preventDefault();
//     setCountry(enteredValue.current.value);
//     setNeighbourCountries([]);
//     enteredValue.current.value = "";
//   };

//   const selectCountry = function (id) {
//     const newCountry = neighbourCountries.find((country) => country.id === id);
//     setCountry(newCountry.country);
//     setNeighbourCountries([]);
//   };

//   // const date = new Date();
//   // const time = date.toLocaleString("en-US", {
//   //   timeZone: `${data.timezone}`,
//   // });
//   // const formattedDate = format(time, "HH:mm - EEEE MMM d");
//   // console.log(formattedDate);
//   // setTimezone(formattedDate);

//   return (
//     <main className="container">
//       <Form onSubmit={submitHandler} onRef={enteredValue} />
//       <div className="countries">
//         <MainPage data={countryDetails} />
//         <ul className="neighbour-container">
//           {neighbourCountries &&
//             neighbourCountries.map((neighbour, i) => (
//               <MainPage
//                 nth={i + 1}
//                 key={nanoid()}
//                 data={neighbour}
//                 className="neighbour"
//                 onSelectCountry={selectCountry}
//               />
//             ))}
//         </ul>
//       </div>
//     </main>
//   );
// }

// export default App;
