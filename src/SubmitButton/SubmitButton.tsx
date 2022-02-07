import React, { Component } from "react";
import "./SubmitButton.scss"

interface IProps {
    URL: string
    method: "POST" | "PUT" | "PATCH"
    disabled?: boolean
    files?: FormData
    setFormData(files: FormData): void
}

interface IState {

}

class SubmitButton extends Component<IProps, IState> {


    submitHandler = (event: React.MouseEvent) => {
        event.preventDefault()
        try {
            fetch('http://localhost:8080/upload ', { method: this.props.method, body: this.props.files })
                .then(response => response.json())
                .then(result => {
                    const formData = new FormData()
                    this.props.setFormData(formData)
                    console.log('Success:', result);
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log("catch")
        }
    }

    render(): React.ReactNode {
        return (
            <button
                className="SubmitButton"
                disabled={this.props.disabled}
                onClick={this.submitHandler}
            >
                Submit
            </button>
        )
    }
}

export default SubmitButton