import React from "react";
import Switch from "react-switch";


class MySwitch extends React.Component {
    constructor() {
        super();
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({ checked });
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

export default MySwitch;