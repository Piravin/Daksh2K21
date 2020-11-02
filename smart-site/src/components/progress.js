import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../css/progress.css'
import { ProgressBar } from 'react-bootstrap'

export function ProgressCircular (props) {
    const percentage = props.percent;
    return(
        <div className='progress-circular'>
        {/*<h5>Overall Completion</h5>*/}
        <CircularProgressbar styles={{root: {width: '200px'}}} className="progressClass" 
        value={percentage} text={`${percentage}%`} />
        </div>
         
    )
    
}

export function ProgressLinear (props) {
    const now = props.percent;
    return (
        <div className='progress-linear'>
            <h5>Excavation</h5>
            <ProgressBar animated 
            now={now} variant="danger" label={`${now}%`}/>
        </div>
    )
}