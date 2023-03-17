import React, { Component } from 'react';
import analytics from './Analytics';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: false, errorMessage: '', devInfo: '' };
    }

    static getDerivedStateFromError(error) {
        let errorArea;
        // errorArea returns the first component the error is in

        try {
            if (typeof error.stack === 'string') {
                if (error.stack.split(">)").length > 1) {
                    errorArea = error.stack.split(">)")[1].split("(")[0];
                } else {
                    errorArea = error.stack.split(")")[1].split("(")[0];
                }
            }
        } catch (err) {
            errorArea = '';
            console.log("Something went wrong in ErrorBoundary :(");
        }

        // Sending error info to Google Analytics for me
        try {
            analytics.track('errorBoundary', {
                error: error.toString(),
                area: errorArea
            });
        } catch (err) {
            console.log("Something went wrong with ga :(");
        }

        return { error: true, errorMessage: error.toString(), devInfo: errorArea };
    }

    componentDidCatch(error, errorInfo) {
        console.log({ error, errorInfo });
    }

    render() {
        const { error, errorMessage, devInfo } = this.state;

        if (error) {
            return (
                <div>
                    <h1>Something went wrong.</h1>
                    <p>{errorMessage}</p>
                    <p>{devInfo}</p>
                    <p style={{ marginTop: '2em' }}>You may need to refresh.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;