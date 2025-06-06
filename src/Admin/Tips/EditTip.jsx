import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import AppHelmet from '../../pages/AppHelmet';
import '../AdminAdd.scss';
import { updateTip } from '../../firebase';
import ScrollToTop from '../../pages/ScrollToTop';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';

export default function EditTip() {
    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const [odd, setOdd] = useState('');
    const [pick, setPick] = useState('');
    const [status, setStatus] = useState('');
    const [time, setTime] = useState('');
    const [won, setWon] = useState('');
    const [premium, setPremium] = useState(false);
    const [gamesType, setGamesType] = useState("1X2");
    const [results, setResults] = useState('');
    const [loading, setLoading] = useState(false);
    const setNotification = useSetRecoilState(notificationState);
    const [data, setData] = useState(null);

    const handleChange = (event) => {
        setGamesType(event.target.value);
    };


    const location = useLocation();

    useEffect(() => {
        setData(location.state);
    }, [location]);


    const handleSubmit = (e) => {
        e.preventDefault()
        const d = new Date(time);
        // Format the date as "M/D/YYYY"
        const date = new Intl.DateTimeFormat('en-US').format(d);

        // Format the time as "HH:MM"
        const timeOnly = d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        updateTip(data.id, { home, away, odd, pick, status, won, premium, type: gamesType, results, date, time: timeOnly }, setNotification, setLoading, setData);
    }

    // Assuming `date` is "12/5/2024" and `time` is "22:00"
    const formatDateTimeForInput = (date, time) => {
        // Parse the date string into a Date object
        const [month, day, year] = date.split('/').map((part) => parseInt(part, 10));
        const formattedDate = new Date(year, month - 1, day); // Note: Month is 0-indexed in JS

        // Format the date as YYYY-MM-DD
        const yearStr = formattedDate.getFullYear();
        const monthStr = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(formattedDate.getDate()).padStart(2, '0');

        // Combine with the time in HH:mm format
        return `${yearStr}-${monthStr}-${dayStr}T${time}`;
    };

    useEffect(() => {
        if (data) {
            setHome(data.home);
            setAway(data.away);
            setOdd(data.odd);
            setPick(data.pick);
            setStatus(data.status);
            setResults(data.results)
            setWon(data.won);
            setPremium(data.premium);
            setGamesType(data.type);

            // Format and set time for datetime-local
            const datetimeLocal = formatDateTimeForInput(data.date, data.time);
            setTime(datetimeLocal);
        } //else window.history.back()
    }, [data]);

    return (
        <div className='admin-tips'>
            <AppHelmet title={"Edit Tip"} />
            <ScrollToTop />
            <h1>Update Tip</h1>
            {!loading && <form onSubmit={handleSubmit}>
                <div className="input-container vertical">
                    <label htmlFor="home">Home Team</label>
                    <input type="text" placeholder='home' id='home' value={home} onChange={(e) => setHome(e.target.value)} required />
                </div>
                <div className="input-container vertical">
                    <label htmlFor="away">Away Team</label>
                    <input type="text" placeholder='away' id='away' value={away} onChange={(e) => setAway(e.target.value)} required />
                </div>
                <div className="input-container">
                    <label htmlFor="odds">Odds</label>
                    <input type="text" placeholder='odds' id='odds' value={odd} onChange={(e) => setOdd(e.target.value)} required />
                </div>
                <div className="input-container">
                    <label htmlFor="pick">Pick</label>
                    <input type="text" placeholder='pick' id='pick' value={pick} onChange={(e) => setPick(e.target.value)} required />
                </div>
                <div className="input-container">
                    <label htmlFor="status">Status: </label>
                    <input type="text" placeholder='Finish/Pending/Live' id='status' value={status} onChange={(e) => setStatus(e.target.value)} required />
                </div>
                <div className="input-container">
                    <label htmlFor="time">Date/Time: </label>
                    <input type="datetime-local" id='time' value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div className="input-container">
                    <label htmlFor="results">Results</label>
                    <input type="text" placeholder='results' id='results' value={results} onChange={(e) => setResults(e.target.value)} />
                </div>
                <div className="input-container">
                    <label htmlFor="won">Is won</label>
                    <input type="text" placeholder='won/pending/lost' id='won' value={won} onChange={(e) => setWon(e.target.value)} required />
                </div>
                <div className="input-container">
                    <label htmlFor="premium">Is premium</label>
                    <input type="checkbox" placeholder='premium' id='premium' onChange={(e) => setPremium(e.target.checked)} checked={premium} />
                </div>
                <div className="input-container">
                    <label>Select Type:</label>
                    <label><input type="radio" name="games-type" value={"1X2"} id="1X2" checked={gamesType === "1X2"} onChange={handleChange} />WDW (1X2)</label>
                    <label><input type="radio" name="games-type" value={"CS"} id="CS" checked={gamesType === "CS"} onChange={handleChange} />Goals (CS)</label>
                    <label><input type="radio" name="games-type" value={"GG"} id="GG" checked={gamesType === "GG"} onChange={handleChange} />BTTS (GG/NG)</label>
                    <label><input type="radio" name="games-type" value={"OV_UN"} id="OV_UN" checked={gamesType === "OV_UN"} onChange={handleChange} />TOTAL (OV/UN)</label>
                    <label><input type="radio" name="games-type" value={"DC"} id="DC" checked={gamesType === "DC"} onChange={handleChange} />DC 1X2</label>
                </div>

                <span style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "items",
                    justifyContent: "space-evenly"
                }}>
                    <button type="submit" className='btn' title='Submit' aria-label="add">Update</button>
                    <span className="btn" onClick={() => window.history.back()}>DONE</span>
                </span>
            </form>}
            {
                loading && <Loader />
            }
        </div>
    )
}
