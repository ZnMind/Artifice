import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector, useDispatch } from 'react-redux';
import {
  increment,
  reset
} from './progressSlice';

export const Progress = props => {
  const dispatch = useDispatch();
  const bar = useSelector(state => state.progress);
  const pro = useSelector(state => state.progress.now)
  
  const progressTimer = useRef();
  
  const handleTime = () => {
    dispatch(increment(props.timing));
  }

  useEffect(() => {
    dispatch(reset());
    if (props.action !== 'none') {
      progressTimer.current = setInterval(handleTime, 100);
      return () => clearInterval(progressTimer.current)
    }
  }, [props.timing]);

  useEffect(() => {
    if (bar.now >= 100) {
      dispatch(reset());
    }
  }, [bar.now]);

    return (
        <div>
          <ProgressBar now={bar.now} label={`Action: ${(100 - bar.now) / (props.timing * 10)}s`} />
          
        </div>
    )
}