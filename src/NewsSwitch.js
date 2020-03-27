import React from "react";
import Switch from "react-switch";


class NewsSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: !this.props.nyTimesFlag };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        console.log("switch condition: " + checked);
        this.setState({ checked });
        this.props.getSource(!checked);
    }

    render() {
        return (
                <div>
                    <Switch
                        onChange={this.handleChange}
                        onColor="#4191e7"
                        checked={this.state.checked}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        className="react-switch"
                        height={28}
                    />
                </div>
        );
    }
}

export default NewsSwitch;