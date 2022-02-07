import React, { Component } from "react";
import { checkValidation, IValidationRules } from "../FileUploaderZone/FileUploaderZone"
import "./DragAndDropZone.scss"

interface IProps {
    handleDrop(event: DragEvent): void
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
        event.preventDefault()
        event.stopPropagation()
        this.props.handleDrop(event)
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
