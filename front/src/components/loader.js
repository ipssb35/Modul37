import React, { Component } from 'react';
import '../component_styles/loader.css'
export default class Loader extends Component{
    render(){
        return (
            <div className="LoaderContainer">
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }
}