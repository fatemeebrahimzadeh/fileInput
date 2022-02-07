import React, { Component } from "react";
import { checkValidation, IValidationRules } from "../FileUploaderZone/FileUploaderZone"
import "./FileInput.scss"

interface IProps {
    id: string
    onChangeHandler(event: React.ChangeEvent<HTMLInputElement>): void
    onFocus?(): void
    onBlur?(): void
    disabled?: boolean
}

interface IState {
    files: FormData
}

class FileInput extends Component<IProps, IState>{

    reference = React.createRef<HTMLInputElement>()

    onFocus = () => {
        this.props.onFocus && this.props.onFocus()
    }

    onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur()
    }

    onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChangeHandler(event)
    }

    get input() {
        return this.reference.current
    }

    render() {
        return (
            <input
                autoComplete="off"
                type="file"
                id={this.props.id}
                className="FileInput"
                ref={this.reference}
                disabled={this.props.disabled}
                onChange={this.onChangeHandler}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                multiple
            />
        )
    }

}

export default FileInput