import { ErrorBoundary, Show, Suspense, createEffect, createMemo, createResource, createSignal, resetErrorBoundaries } from "solid-js";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [cityName, setCityName] = createSignal<string>();
  const [tempUnit, setTempUnit] = createSignal('Celcius');

  const [temperature] = createResource(cityName, async (city) => {

    resetErrorBoundaries();

    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );

    const weather = await result.json();

    if (weather.cod !== 200) {
      throw new Error(weather.message);
    }

    return {
      kelvin: weather.main.temp,
      celcius: Math.round(weather.main.temp - 273.15)
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      cityName: HTMLInputElement;
    };
    const cityName = formElements.cityName.value;

    if (!cityName) return;
    setCityName(cityName);

    form.reset();
    formElements.cityName.focus();
  };

  return (
    <>
      <h2>Weather</h2>
      <form onSubmit={handleSubmit}>
        <input name="cityName" placeholder="City name" />
        <button type="submit">
          Check Weather
        </button>
      </form>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <Show when={temperature()}>
            <p>
              The current weather in <strong>{cityName()}</strong> is:{' '}

              <Show when={tempUnit() === 'Celcius'} fallback={temperature()?.kelvin}>
                {temperature()?.celcius}
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
        </Suspense>
      </ErrorBoundary >
    </>
  )
}