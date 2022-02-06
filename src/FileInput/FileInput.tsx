import React, { Component } from "react";
import "./FileInput.scss"

type IRuntime = 'onEvent' | 'onChange' | 'onBlur'
type IValidationNames = 'REQUIRED' | 'FORMAT' | 'SIZE' | 'CUSTOM'
type IValidationMassage = { type: IValidationNames, id: string, index: number, message: string }

interface IInputValidationRules {
    runtime?: IRuntime
    name: IValidationNames
    handler?: (val: File) => IValidationMassage | undefined
    formatAccept?: string
}

interface IProps {
    id: string
    setFormData(files: FormData): void
    disabled?: boolean
    onFocus?(): void
    onBlur?(): void
}

interface IState {
    files: FormData
}

class FileInput extends Component<IProps, IState>{

    reference = React.createRef<HTMLInputElement>()

    onFocus = () => {
        this.props.onFocus && this.props.onFocus()
    }

    onBlur = () => {
        this.props.onBlur && this.props.onBlur()
    }

    onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData()

        if (!!e.target.files?.length) {

            for (let index = 0; index < e.target.files.length; index++) {
                formData.append('file', e.target.files[index], e.target.files[index].name)
            }
        }

        // const validationResult = checkInputValidate(value, this.props.validation, 'onChange', this.props.type)
        // this.setState({
        //     validationMessages: validationResult
        // })
        this.props.setFormData(formData)
    }

    get input() {
        return this.reference.current
    }

    fileIsValid = (fileName: string, formatAccept: string) => {
        let fileExtention = fileName.split(".").pop();
        fileExtention = fileExtention!.toLowerCase();
        for (const extention of formatAccept.split(",")) {
            if (extention === `.${fileExtention}`) {
                return true
            }
        }
        return false
    }

    checkInputValidate = (
        file: File,
        index: number,
        validationRules?: IInputValidationRules[],
        runtime?: IRuntime
    ) => {
        // let validationMessages: string[] = []
        let validationMassage: IValidationMassage[] = []

        if (validationRules && validationRules.length) {

            for (const validation of validationRules) {

                switch (validation.name) {

                    case 'REQUIRED':
                        if (file != null) {
                            validationMassage.push({ type: 'FORMAT', id: this.props.id, index, message: 'This Field is Required' })
                        }
                        break

                    case 'FORMAT':
                        if (file != null) {
                            var fileName = file.name;
                            if (validation.formatAccept) {
                                if (this.fileIsValid(fileName, validation.formatAccept) == false) {
                                    validationMassage.push({ type: 'FORMAT', id: this.props.id, index, message: `Enter in the format: ${validation.formatAccept}` })
                                }
                            }
                        }
                        break

                    case 'SIZE':
                        if (file != null) {
                            var size = file.size;
                            // should to change this 
                            if ((size != null) && ((size / (1024 * 1024)) > 3)) {
                                validationMassage.push({ type: 'SIZE', id: this.props.id, index, message: "This file is too large to upload." })
                            }
                        }
                        break

                    case 'CUSTOM':
                        if (validation.runtime) {
                            if (runtime === validation.runtime) {
                                const customValidationMessage = validation.handler!(file)
                                customValidationMessage && validationMassage.push(customValidationMessage)
                            }
                        } else {
                            const customValidationMessage = validation.handler!(file)
                            customValidationMessage && validationMassage.push(customValidationMessage)
                        }
                        break
                }

            }

        }

        return validationMassage

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
                onFocus={() => this.onFocus()}
                onBlur={() => this.onBlur()}
                multiple
            />
        )
    }

}

export default FileInput