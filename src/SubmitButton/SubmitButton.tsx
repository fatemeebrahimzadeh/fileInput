import React, { Component } from "react";
import "./SubmitButton.scss"

interface IProps {
    disabled?: boolean
    onSubmitHandler(event: React.MouseEvent): void
}

interface IState {

}

class SubmitButton extends Component<IProps, IState> {


    onSubmitHandler = (event: React.MouseEvent) => {
        event.preventDefault()
        this.props.onSubmitHandler(event)
    }

    render(): React.ReactNode {
        return (
            <button
                className="SubmitButton"
                disabled={this.props.disabled}
                onClick={this.onSubmitHandler}
            >
                Submit
            </button>
        )
    }
}

export default SubmitButton