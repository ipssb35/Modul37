import React, { Component,Fragment } from 'react';
import '../component_styles/preloader.css'
export default class Preloader extends Component{
    render(){
        return (
        <Fragment>
            <div className="box">
                <div className="cat">
                    <div className="cat__body"></div>
                    <div className="cat__body"></div>
                    <div className="cat__tail"></div>
                    <div className="cat__head"></div>
                </div>
            </div>
        </Fragment>
        )
    }
}