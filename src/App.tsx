import './App.scss';
import FileUploaderZone from './FileUploaderZone/FileUploaderZone';

function App() {
  return (
    <div className="App">
      <FileUploaderZone
        URL="http://localhost:8080/upload"
        method='POST'
        formatAccept='.png,.jpeg,.jpg'
        id="My-FileInput"
        mode='DARK'
        label="Upload"
        size={3}
        DragAndDropZoneValidationRules={
          [
            {
              type: 'FORMAT',
              // validationMassage: "personal FORMAT message"
            },
            {
              type: 'SIZE',
              validationMassage: "personal SIZE message"
            }
          ]
        }
        FileInputValidationRules={
          [
            {
              type: 'FORMAT',
              validationMassage: "personal FORMAT message"
            },
            {
              type: 'SIZE',
              validationMassage: "personal SIZE message"
            },
            {
              type: 'REQUIRED',
              validationMassage: "personal REQUIRED message"
            },
            {
              type: 'CUSTOM',
              validationMassage: "personal CUSTOM message",
              //runtime?: IRuntime
              handler: (file: File) => { return false }
            }
          ]
        }
      />
    </div>
  );
}

export default App;
