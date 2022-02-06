import React, { Component } from "react";
import "./DragAndDropZone.scss"

type validationNames = 'FORMAT' | 'SIZE'

interface IInputValidationRules {
    id: string,
    types: validationNames[],
    formatAccept?: string
    size?: number
}

interface IProps {
    setFormData(files: FormData): void
    validationRules?: IInputValidationRules
}

interface IState {

}

class DragAndDropZone extends Component<IProps, IState> {

    dropRef: React.RefObject<HTMLInputElement> = React.createRef()
    hasError: boolean = false
    // fi?: File

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
        this.hasError = false
        event.preventDefault()
        event.stopPropagation()
        if (event?.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            const formData = new FormData()
            for (let index = 0; index < event.dataTransfer.files.length; index++) {
                if (!!this.checkValidation(event.dataTransfer.files[index], index, this.props.validationRules).length) {
                    console.log("[handleDrop]", this.checkValidation(event.dataTransfer.files[index], index, this.props.validationRules))
                    this.hasError = true
                } else {
                    // this.fi = event.dataTransfer.files[index]
                    // console.log("fi",this.fi)
                    formData.append('file', event.dataTransfer.files[index], event.dataTransfer.files[index].name)
                }
            }
            this.props.setFormData(formData)
            event.dataTransfer.clearData()
        }
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

    checkValidation = (
        file: File,
        index: number,
        validationRules?: IInputValidationRules
    ) => {

        let validationMassage: { type: validationNames, id: string, index: number, message: string }[] = []
        if (validationRules) {
            for (const type of validationRules.types) {
                switch (type) {
                    case 'FORMAT':
                        if (file != null) {
                            var fileName = file.name;
                            if (validationRules.formatAccept) {
                                if (this.fileIsValid(fileName, validationRules.formatAccept) == false) {
                                    validationMassage.push({ type: 'FORMAT', id: validationRules.id, index, message: `Enter in the format: ${validationRules.formatAccept}` })
                                }
                            }
                        }
                        break;
                    case 'SIZE':
                        if (file != null) {
                            var size = file.size;
                            if ((size != null) && ((size / (1024 * 1024)) > (validationRules.size ? validationRules.size : 3))) {
                                validationMassage.push({ type: 'SIZE', id: validationRules.id, index, message: "This file is too large to upload." })
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return validationMassage;
    }

    //#endregion

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


    // submitHandler = () => {
    //     let formData = new FormData()
    //     // formData.append('file', this.fi!)
    //     formData.append('name', 'John');
    //     console.log("submitHandler",this.fi,formData.getAll("file"))
    //     try {
    //         fetch('http://localhost:6000/upload ', { method: "POST", body:  formData})
    //             .then(response => response.json())
    //             .then(result => {
    //                 console.log('Success:', result);
    //             })
    //             .catch(error => {
    //                 console.error('Error:', error);
    //             });
    //     } catch (error) {
    //         console.log("catch")
    //     }
    // }

    render() {
        return (
            <>

                <div
                    className='DragAndDropZone'
                    ref={this.dropRef}
                >
                    Drag & Drop your files
                </div>

                {/* <button
                    // disabled={this.props.disabled}
                    onClick={this.submitHandler}
                >
                    Submit
                </button> */}
            </>
        )
    }
}

export default DragAndDropZone
