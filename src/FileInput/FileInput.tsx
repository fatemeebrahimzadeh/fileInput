import React, { Component } from "react";
import { checkValidation, IValidationRules } from "../FileUploaderZone/FileUploaderZone"
import "./FileInput.scss"

interface IProps {
    id: string
    setFormData(files: FormData): void
    setError(hasError: boolean): void
    disabled?: boolean
    onFocus?(): void
    onBlur?(): void
    validationRules?: IValidationRules[]
    formatAccept?: string
    size?: number
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
        this.props.setError(false)
        const formData = new FormData()

        if (!!event.target.files?.length) {
            for (let index = 0; index < event.target.files.length; index++) {
                if (!!checkValidation(this.props.id,
                    event.target.files[index],
                    index,
                    this.props.validationRules,
                    this.props.formatAccept,
                    this.props.size
                ).length) {
                    console.log("onChangeHandler", checkValidation(this.props.id,
                        event.target.files[index],
                        index,
                        this.props.validationRules,
                        this.props.formatAccept,
                        this.props.size
                    ))
                    this.props.setError(true)
                } else {
                    formData.append('file', event.target.files[index], event.target.files[index].name)
                }
            }
        }

        this.props.setFormData(formData)
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