import { Show, createMemo, createSignal } from "solid-js";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [cityName, setCityName] = createSignal('');
  const [submittedCityName, setSubittedCityName] = createSignal('');
  const [tempKelvin, setTempKelvin] = createSignal<number>();
  const [error, setError] = createSignal(false);
  const [tempUnit, setTempUnit] = createSignal('Celcius')

  const tempCelsius = createMemo(() => {
    const kelvinVal = tempKelvin();
    return kelvinVal ? Math.round(kelvinVal - 273.15) : undefined;
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!cityName()) return;

    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName()}&appid=${apiKey}`
    );

    const weather = await result.json();

    setError(!weather?.main?.temp);
    setTempKelvin(weather?.main?.temp);
    setSubittedCityName(weather?.name);
  };

  return (
    <>
      <h2>Weather</h2>
      <form onSubmit={handleSubmit}>
        <input value={cityName()} placeholder="City name" onInput={(e) => {
          setCityName(e.target.value);
        }} />
        <button type="submit">
          Check Weather
        </button>
      </form>
      <Show when={error()}>
        <p>
          <strong>An error occured</strong>
        </p>
      </Show>
      <Show when={submittedCityName()}>
        <p>
          The current weather in <strong>{submittedCityName()}</strong> is:{' '}

          <Show when={tempUnit() === 'Celcius'} fallback={tempKelvin()}>
            {tempCelsius()}
          </Show>
        </p>
        <p>

          <button onClick={() => {
            setTempUnit('Celcius');
          }}>Celcius</button>

          <button onClick={() => {
            setTempUnit('Kelvin');
          }}>Kelvin</button></p>
      </Show>
    </>
  )
}