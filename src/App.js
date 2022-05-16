import './App.css';
import React, {useEffect, useState} from 'react';
import Dinero from 'dinero.js';
import RatesPromise from './data/rates';

Dinero.globalExchangeRatesApi = {
  currency: "EUR",
  endpoint: RatesPromise,
};

let CurrencySelector = ({ rates, onChange }) => (
  <select onChange={onChange}>
    {rates.map((rate) => (
      <option>{rate}</option>
    ))}
  </select>
);

function App() {
  let [rates, setRates] = useState([]);

  let [originCurrency, setOriginCurrency] = useState([]);
  let [targetCurrency, setTargetCurrency] = useState([]);
  let [finalAmount, setFinalAmount] = useState([]);
  let [originalAmount, setOriginalAmount] = useState([]);

  useEffect(() => {
    let ratesData;
    RatesPromise.then((value) => {
      ratesData = value;
      let ratesArray = Object.keys(ratesData.rates);
      setRates(ratesArray);
    });
  }, []);
  let convert = async () => {
    let amount = Dinero({
      amount: parseInt(originalAmount) * 100,
      currency: originCurrency,
    });
    let result = await amount.convert(targetCurrency);
    setFinalAmount(result.toFormat());
  };
  return (
    <div className="container">
      <div className="card">
        <h1>Conversión entre monedas</h1>
        <div className="flex-container">
          <div>
            <p>Origen: {originCurrency}</p>
            <CurrencySelector
              onChange={(ev) => setOriginCurrency(ev.target.value)}
              rates={rates}
            />
          </div>
          <div>
            <p>Destino: {targetCurrency}</p>
            <CurrencySelector
              onChange={(ev) => setTargetCurrency(ev.target.value)}
              rates={rates}
            />
          </div>
        </div>
        <input
          onChange={(ev) => setOriginalAmount(ev.target.value)}
          type="number"
          className="form-control"
          placeholder="Monto en centavos"
        />
        <p>El resultado es: {finalAmount}</p>
        <button onClick={convert} className="app-button">
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;