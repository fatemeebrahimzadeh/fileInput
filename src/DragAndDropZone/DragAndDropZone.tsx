import React, { Component } from "react";
import { checkValidation, IValidationRules } from "../FileUploaderZone/FileUploaderZone"
import "./DragAndDropZone.scss"

interface IProps {
    id: string
    setFormData(files: FormData): void
    setError(hasError: boolean): void
    validationRules?: IValidationRules[]
    formatAccept?: string
    size?: number
}

interface IState { }

class DragAndDropZone extends Component<IProps, IState> {

    dropRef: React.RefObject<HTMLInputElement> = React.createRef()

    handleDrag = (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
    }

    handleDragIn = (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
    }

    handleDragOut = (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
    }

    handleDrop = (event: DragEvent) => {
        this.props.setError(false)
        event.preventDefault()
        event.stopPropagation()
        if (event?.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            const formData = new FormData()
            for (let index = 0; index < event.dataTransfer.files.length; index++) {
                if (!!checkValidation(this.props.id,
                    event.dataTransfer.files[index],
                    index,
                    this.props.validationRules,
                    this.props.formatAccept,
                    this.props.size
                ).length) {
                    console.log("handleDrop", checkValidation(this.props.id,
                        event.dataTransfer.files[index],
                        index,
                        this.props.validationRules,
                        this.props.formatAccept,
                        this.props.size
                    ))
                    this.props.setError(true)
                } else {
                    formData.append('file', event.dataTransfer.files[index], event.dataTransfer.files[index].name)
                }
            }
            this.props.setFormData(formData)
            event.dataTransfer.clearData()
        }
    }

    componentDidMount() {
        let drop_zone = this.dropRef.current
        drop_zone?.addEventListener('dragenter', this.handleDragIn)
        drop_zone?.addEventListener('dragleave', this.handleDragOut)
        drop_zone?.addEventListener('dragover', this.handleDrag)
        drop_zone?.addEventListener('drop', this.handleDrop)
    }

    componentWillUnmount() {
        let drop_zone = this.dropRef.current
        drop_zone?.removeEventListener('dragenter', this.handleDragIn)
        drop_zone?.removeEventListener('dragleave', this.handleDragOut)
        drop_zone?.removeEventListener('dragover', this.handleDrag)
        drop_zone?.removeEventListener('drop', this.handleDrop)
    }

    render() {
        return (
            <>
                <div
                    className='DragAndDropZone'
                    ref={this.dropRef}
                >
                    Drag & Drop your files
                </div>
            </>
        )
    }
}

export default DragAndDropZone
