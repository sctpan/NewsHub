import React from 'react';
import AsyncSelect from 'react-select';
import Select from "react-select";
import _ from "lodash";

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.autoSuggest = _.debounce(this.autoSuggest.bind(this), 500);
    }


    state = {
       inputValue: 'tru',
        options: []
    };

    autoSuggest = async (value) => {
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
            const results = resultsRaw.map(result => ({'value': result.displayText, 'label': result.displayText}));
            // console.log(results);
            // return results;
            this.setState({
                options: results
            })
        } catch (error) {
            console.log("error!");
        }
    };

    handleSearchChange = (value) => {
        this.setState({
            inputValue: value
        });
        this.autoSuggest(value);
        return value;
    }


    render() {

        // const options = [
        //     {value: "truffaut", label: "truffaut"},
        //     {value: "truffaut jardinerie", label: "truffaut jardinerie"},
        //     {value: "trump patron renseignement russie", label: "trump patron renseignement russie"},
        //     {value: "truckersmp", label: "truckersmp"},
        //     {value: "trucksbook", label: "trucksbook"},
        //     {value: "trump critique parasite", label: "trump critique parasite"},
        //     {value: "trustedinstaller autorisation", label: "trustedinstaller autorisation"},
        //     {value: "trustpilot", label: "trustpilot"}
        // ];


        return (
            <div>
                <Select
                    placeholder={"Enter Keyword .."}
                    options={this.state.options}
                    onInputChange={this.handleSearchChange}
                />

                {/*<AsyncSelect*/}
                {/*    cacheOptions*/}
                {/*    defaultOptions*/}
                {/*    loadOptions={this.autoSuggest(this.state.inputValue)}*/}
                {/*    onInputChange={this.handleSearchChange}*/}
                {/*    placeholder={"Enter Keyword .."}*/}
                {/*/>*/}
            </div>

        );
    }
}

export default SearchBox;
