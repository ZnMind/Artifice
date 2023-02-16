import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector, useDispatch } from 'react-redux';
import { increment, reset } from '../slices/progressSlice';

export const Progress = props => {
  const dispatch = useDispatch();
  const bar = useSelector(state => state.progress);
  
  const progressTimer = useRef();
  
  const handleTime = () => {
    var perMs = props.bonus * (10 / ( 2.5 + props.timing * 2.5));
    dispatch(increment(perMs));
  }

  useEffect(() => {
    dispatch(reset());
    if (props.action !== '') {
      progressTimer.current = setInterval(handleTime, 100);
      return () => clearInterval(progressTimer.current)
    }
  }, [props.action]);

  useEffect(() => {
    if (bar.now >= 100) {
      console.log("Stop")
      dispatch(reset());
    }
  }, [bar.now]);

    return (
        <div>
          <ProgressBar now={bar.now} label={`${Math.round((100 - bar.now) / (props.bonus * (100 / ( 2.5 + props.timing * 2.5))) * 10 ) / 10}s`} />
        </div>
    )
}