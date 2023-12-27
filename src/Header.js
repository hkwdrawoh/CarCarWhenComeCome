import { useState, useEffect } from 'react';

function Header(props) {

    const [timenow, setTimenow] = useState(new Date());
    const [timeref, setTimeref] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimenow(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const getTimeString = (time) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        return time.toLocaleTimeString(undefined, options);
    };

    return (
        <div className="component menu">
            <div className="menu">
                <div className="nav">
                    <h2>{props.text}</h2>
                    <button className="button_base back_index">主頁</button>
                </div>
                <div className="clock">
                    <div style={{verticalAlign: 'center'}}>
                        <h3>{getTimeString(timenow)}</h3>
                        <p>現在時間</p>
                    </div>
                    <div>
                        <h3>{getTimeString(timeref)}</h3>
                        <p>更新時間</p>
                    </div>
                    <button className="RefreshButton"
                            onClick = {() => setTimeref(new Date())}
                    >更新</button>
                </div>
                <hr/>
            </div>
        </div>
    );
}

export default Header;
