import { useState, useEffect } from 'react'
import axios from 'axios'
import { DiaryEntry, Weather, Visibility } from './types'

const weatherOptions: Weather[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy']
const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor']

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [error, setError] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [weather, setWeather] = useState<Weather | ''>('')
  const [visibility, setVisibility] = useState<Visibility | ''>('')
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    axios.get<DiaryEntry[]>('/api/diaries').then(res => {
      setEntries(res.data)
    })
  }, [])

  const addEntry = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const res = await axios.post<DiaryEntry>('/api/diaries', {
        date,
        weather,
        visibility,
        comment
      })
      setEntries(entries.concat(res.data))
      setDate('')
      setWeather('')
      setVisibility('')
      setComment('')
      setError('')
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const data = e.response.data as { error?: Array<{ message: string }> }
        if (Array.isArray(data.error)) {
          setError(data.error.map(i => i.message).join('. '))
        } else {
          setError(String(e.response.data))
        }
      }
    }
  }

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addEntry}>
        <div>
          date{' '}
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          visibility{' '}
          {visibilityOptions.map(v => (
            <label key={v}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          weather{' '}
          {weatherOptions.map(w => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          comment{' '}
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diary entries</h2>
      {entries.map(entry => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>
            visibility: {entry.visibility}
            <br />
            weather: {entry.weather}
          </p>
        </div>
      ))}
    </div>
  )
}

export default App
