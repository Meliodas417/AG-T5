// RealTimeData.js
import React, { useState, useEffect } from 'react';

const RealTimeData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8001/realtime");

        socket.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData(prevData => [...prevData, newData]);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h2>Real-Time Data</h2>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    );
};

export default RealTimeData;
