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

// explanation of props
// URL: string => your FormData will fetch to this URL
// method: "POST" | "PUT" | "PATCH" => this method is that used in fetch function
// mode: "DARK" | "LIGHT" => this mode is used for default style of this module
// formatAccept?: string => you can get files with this formats that you want (e.g. '.png,.jpeg,.jpg')
// id: string => this id assigned to the FileInput but it is using in the whole FileUploaderZone when you have error message this id is used to show which one is 
// label?: string => is showint on top of FileUploaderZone
// size?: number => is used to check validation with size that you want if you dont set that it is 3 as default
// DragAndDropZoneValidationRules?: IValidationRules[] => validation rules that is used in DragAndDropZone
// FileInputValidationRules?: IValidationRules[] => validation rules that is used in FileInput

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

    //#region DragAndDropZone

    handleDrop = (event: DragEvent) => {
        this.setError(false)
        if (event?.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            const formData = new FormData()
            for (let index = 0; index < event.dataTransfer.files.length; index++) {
                if (!!checkValidation(this.props.id,
                    event.dataTransfer.files[index],
                    index,
                    this.props.DragAndDropZoneValidationRules,
                    this.props.formatAccept,
                    this.props.size
                ).length) {
                    // you can use this array to toast message of them or anything you want 
                    console.log("handleDrop", checkValidation(this.props.id,
                        event.dataTransfer.files[index],
                        index,
                        this.props.DragAndDropZoneValidationRules,
                        this.props.formatAccept,
                        this.props.size
                    ))
                    this.setError(true)
                } else {

                    formData.append('file', event.dataTransfer.files[index], event.dataTransfer.files[index].name)
                }
            }
            
            this.state.hasError && alert("some error occurred")
            this.setFormData(formData)
            event.dataTransfer.clearData()
        }
    }

    //#endregion

    //#region FileInput

    onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setError(false)
        const formData = new FormData()

        if (!!event.target.files?.length) {
            for (let index = 0; index < event.target.files.length; index++) {
                if (!!checkValidation(this.props.id,
                    event.target.files[index],
                    index,
                    this.props.FileInputValidationRules,
                    this.props.formatAccept,
                    this.props.size
                ).length) {
                    // you can use this array to toast message of them or anything you want 
                    console.log("onChangeHandler", checkValidation(this.props.id,
                        event.target.files[index],
                        index,
                        this.props.FileInputValidationRules,
                        this.props.formatAccept,
                        this.props.size
                    ))
                    this.setError(true)
                } else {
                    formData.append('file', event.target.files[index], event.target.files[index].name)
                }
            }
        }

        this.state.hasError && alert("some error occurred")
        this.setFormData(formData)
    }

    //#endregion

    //#region SubmitButton
    onSubmitHandler = () => {
        try {
            fetch(this.props.URL, { method: this.props.method, body: this.state.files })
                .then(response => response.json())
                .then(result => {
                    const formData = new FormData()
                    this.setFormData(formData)
                    alert("congratulations!, Success")
                    console.log('Success:', result);

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.log("catch")
        }
    }
    //#endregion

    render() {
        return (
            // remove this style after fix toast
            <div className={this.state.hasError ? this.props.className + " FileUploaderZone " + this.props.mode + " invalid" : this.props.className + " FileUploaderZone " + this.props.mode}>
                {this.props.label && <label htmlFor={this.props.id}>{this.props.label}</label>}
                <DragAndDropZone
                    handleDrop={this.handleDrop}
                />
                <FileInput
                    onChangeHandler={this.onChangeHandler}
                    id={this.props.id}
                />
                <SubmitButton
                    onSubmitHandler={this.onSubmitHandler}
                    disabled={(!this.state.files.getAll("file").length || this.state.hasError === true) ? true : false}
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
                    if (validation.runtime) {
                        if (runtime && runtime === validation.runtime) {
                            if (validation.handler!(file)) validationMassage.push({
                                type: 'CUSTOM',
                                id,
                                index,
                                message: `${validation.validationMassage ? validation.validationMassage : "CUSTOM"}`
                            })
                        }
                    } else {
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