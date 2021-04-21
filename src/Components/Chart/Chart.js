import { reduce } from 'd3-array';
import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Chart.module.css';

const Chart = (props) => {

    useEffect(() => {
        console.log(props.data)
    }, [props.data])

    return (
        <div className={styles.chart}>
            <LineChart
                width={800}
                height={100}
                data={props.data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <YAxis style={{
                    fontSize: '1rem',
                    fontFamily: 'Times New Roman',
                }} />
                <Line type="monotone" dataKey="numberOfAlive" stroke="#CBB6A6" strokeWidth={1} dot={false} />
            </LineChart>
        </div>
    );
}

export default Chart;