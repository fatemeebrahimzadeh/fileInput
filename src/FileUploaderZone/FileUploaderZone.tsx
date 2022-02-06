import React, { Component } from "react";
import "./FileUploaderZone.scss"

import DragAndDropZone from "../DragAndDropZone/DragAndDropZone"
import SubmitButton from "../SubmitButton/SubmitButton"
import FileInput from "../FileInput/FileInput"

interface IProps {
    className?: string
    URL: string
    method: "POST" | "PUT" | "PATCH"
    mode: "DARK" | "LIGHT"
    formatAccept?: string
    id: string
    label?: string
}

interface IState {
    files: FormData
}

class FileUploaderZone extends Component<IProps, IState> {

    reference: React.RefObject<DragAndDropZone> = React.createRef()

    state = {
        files: new FormData()
    }

    setFormData = (files: FormData) => {
        this.setState({ files })
    }

    render() {
        return (
            <div className={this.reference.current?.hasError ? this.props.className + " " + this.props.mode + " invalid" : this.props.className + " " + this.props.mode}>
                {this.props.label && <label htmlFor={this.props.id}>{this.props.label}</label>}
                <DragAndDropZone
                    ref={this.reference}
                    setFormData={this.setFormData}
                    validationRules={{
                        id: this.props.id, types: ['SIZE', "FORMAT"],
                        formatAccept: this.props.formatAccept
                    }} />
                <FileInput
                    id={this.props.id}
                    setFormData={this.setFormData} />
                <SubmitButton
                    files={this.state.files}
                    URL={this.props.URL}
                    method={this.props.method}
                    disabled={(!this.state.files.getAll("file").length || this.reference.current?.hasError === true) ? true : false}
                    setFormData={this.setFormData} />
            </div>
        )
    }
}

export default FileUploaderZone