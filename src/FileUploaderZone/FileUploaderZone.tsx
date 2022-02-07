import React, { Component } from "react";
import "./FileUploaderZone.scss"

import DragAndDropZone from "../DragAndDropZone/DragAndDropZone"
import SubmitButton from "../SubmitButton/SubmitButton"
import FileInput from "../FileInput/FileInput"

// use this.reference.current?.hasError to toast error

type IRuntime = 'onEvent' | 'onChange' | 'onBlur'
type IValidationNames = 'REQUIRED' | 'FORMAT' | 'SIZE' | 'CUSTOM'
type IValidationMassage = { type: IValidationNames, id: string, index: number, message: string }

export interface IValidationRules {
    type: IValidationNames
    validationMassage?: string
    runtime?: IRuntime
    handler?: (val: File) => boolean
}

interface IProps {
    className?: string
    URL: string
    method: "POST" | "PUT" | "PATCH"
    mode: "DARK" | "LIGHT"
    formatAccept?: string
    id: string
    label?: string
    size?: number
    DragAndDropZoneValidationRules?: IValidationRules[]
    FileInputValidationRules?: IValidationRules[]
}

interface IState {
    files: FormData
    hasError: boolean
}

class FileUploaderZone extends Component<IProps, IState> {

    state = {
        files: new FormData(),
        hasError: false
    }

    setFormData = (files: FormData) => {
        this.setState({ files })
    }

    setError = (hasError: boolean) => {
        this.setState({ hasError })
    }

    render() {
        return (
            // remove this style after fix toast
            <div className={this.state.hasError ? this.props.className + " FileUploaderZone " + this.props.mode + " invalid" : this.props.className + " FileUploaderZone " + this.props.mode}>
                {this.props.label && <label htmlFor={this.props.id}>{this.props.label}</label>}
                <DragAndDropZone
                    id={this.props.id}
                    setFormData={this.setFormData}
                    setError={this.setError}
                    formatAccept={this.props.formatAccept}
                    size={this.props.size}
                    validationRules={this.props.DragAndDropZoneValidationRules}
                />
                <FileInput
                    id={this.props.id}
                    setFormData={this.setFormData}
                    setError={this.setError}
                    validationRules={this.props.FileInputValidationRules}
                    formatAccept={this.props.formatAccept}
                    size={this.props.size}
                />
                <SubmitButton
                    files={this.state.files}
                    URL={this.props.URL}
                    method={this.props.method}
                    disabled={(!this.state.files.getAll("file").length || this.state.hasError === true) ? true : false}
                    setFormData={this.setFormData}
                />
            </div>
        )
    }
}

export default FileUploaderZone

const fileIsValid = (fileName: string, formatAccept: string) => {
    let fileExtention = fileName.split(".").pop();
    fileExtention = fileExtention!.toLowerCase();
    for (const extention of formatAccept.split(",")) {
        if (extention === `.${fileExtention}`) {
            return true
        }
    }
    return false
}

export const checkValidation = (
    id: string,
    file: File,
    index: number,
    validationRules?: IValidationRules[],
    formatAccept?: string,
    size?: number,
    runtime?: IRuntime
) => {
    let validationMassage: IValidationMassage[] = []

    if (validationRules && validationRules.length) {

        for (const validation of validationRules) {

            switch (validation.type) {

                case 'REQUIRED':
                    console.log("REQUIRED")
                    if (file === null) {
                        validationMassage.push({
                            type: 'REQUIRED',
                            id,
                            index,
                            message: 'This Field is Required'
                        })
                    }
                    break

                case 'FORMAT':
                    console.log("FORMAT")
                    if (file != null) {
                        var fileName = file.name;
                        if (formatAccept) {
                            if (fileIsValid(fileName, formatAccept) == false) {
                                validationMassage.push({
                                    type: 'FORMAT',
                                    id,
                                    index,
                                    message: `${validation.validationMassage ? validation.validationMassage : 'Enter in the format:' + formatAccept}`
                                })
                            }
                        }
                    }
                    break

                case 'SIZE':
                    console.log("SIZE")
                    if (file != null) {
                        let fileSize = file.size;
                        let limit = size ? size : 3
                        // should to change this 
                        if ((fileSize != null) && ((fileSize / (1024 * 1024)) > limit)) {
                            validationMassage.push({
                                type: 'SIZE',
                                id,
                                index,
                                message: `${validation.validationMassage ? validation.validationMassage : "This file is too large to upload."}`
                            })
                        }
                    }
                    break

                case 'CUSTOM':
                    console.log("CUSTOM")
                    if (validation.runtime) {
                        console.log("with-runtime")
                        if (runtime && runtime === validation.runtime) {
                            if (validation.handler!(file)) validationMassage.push({
                                type: 'CUSTOM',
                                id,
                                index,
                                message: `${validation.validationMassage ? validation.validationMassage : "CUSTOM"}`
                            })
                        }
                    } else {
                        console.log("without-runtime")
                        if (validation.handler!(file)) validationMassage.push({
                            type: 'CUSTOM',
                            id,
                            index,
                            message: `${validation.validationMassage ? validation.validationMassage : "CUSTOM"}`
                        })
                    }
                    break
            }

        }

    }
    return validationMassage

}