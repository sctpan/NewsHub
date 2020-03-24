import React, { Component } from "react";

import AsyncSelect from "react-select/async";
import debounce from 'debounce-promise'

class AsyncSearchBox extends React.Component {

    constructor(props) {
        super(props);
        this.autoSuggest = debounce(this.autoSuggest.bind(this), 1000);
    }

    state = {
        inputValue: "",
    };

    autoSuggest = async () => {
        let value = this.state.inputValue;
        try {
            const response = await fetch(
                `https://yifan-pan.cognitiveservices.azure.com/bing/v7.0/suggestions?mkt=en-US&q=${value}`,
                {
                    headers: {
                        "Ocp-Apim-Subscription-Key": "6f6bc904f5c6444796afa0d83b783202"
                    }
                }
            );
            const data = await response.json();
            const resultsRaw = data.suggestionGroups[0].searchSuggestions;
            const results = resultsRaw.map(result => ({
                value: result.displayText,
                label: result.displayText
            }));
            console.log(results);
            return results;
        } catch (error) {
            console.log("error!");
        }
    };

    handleSearchChange = value => {
        this.setState({
            inputValue: value
        });
        return value;
    };

    handleChange = (selectedOption) => {
        window.location.href = '#/search?q=' + selectedOption.value;
    };


    render() {
        return (
            <AsyncSelect
                loadOptions={this.autoSuggest}
                onInputChange={this.handleSearchChange}
                onChange={this.handleChange}
                placeholder={"Enter Keyword .."}
            />
        );
    }
}

export default AsyncSearchBox;
